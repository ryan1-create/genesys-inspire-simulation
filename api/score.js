// Vercel Serverless Function - AI Scoring Endpoint (V4 - Calibrated)
// Deploy to: /api/score
// Major scoring calibration overhaul:
// - Context-aware submission quality gate catches garbage without penalizing thoughtful short answers
// - Heavily reinforced system prompt with calibration anchors & examples
// - Score validation prevents clustering
// - Fallback scoring properly penalizes low-effort submissions

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Add jitter to prevent thundering herd
function addJitter(baseDelay, jitterPercent = 0.3) {
  const jitter = baseDelay * jitterPercent * (Math.random() - 0.5) * 2;
  return Math.max(100, baseDelay + jitter);
}

// Enhanced retry helper with exponential backoff and jitter
async function callWithRetry(fn, maxRetries = 5) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.status === 429 || error.message?.includes('rate');
      const isOverloaded = error.status === 529 || error.message?.includes('overloaded');
      const isTimeout = error.code === 'ETIMEDOUT' || error.message?.includes('timeout');

      if ((isRateLimit || isOverloaded || isTimeout) && attempt < maxRetries) {
        const baseDelay = Math.pow(2, attempt + 1) * 1000;
        const delay = addJitter(baseDelay);
        console.log(`API issue (${error.status || error.code}), retrying in ${Math.round(delay/1000)}s (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

// ============================================================================
// SUBMISSION QUALITY GATE
// Catches obvious garbage/placeholder submissions BEFORE hitting the AI.
// Designed to be STRICT on garbage but LENIENT on genuine short answers.
// A thoughtful 12-word question is valid. "test test test" is not.
// ============================================================================

function assessSubmissionQuality(submission, phase) {
  const fullText = (submission || "").trim();

  // For wobble phase, the submission is the already-scored initial strategy.
  // The wobble response quality is for the AI to judge — it has the full context.
  if (phase === "wobble") {
    return { quality: "normal", score: null, skipAI: false, penalty: 0 };
  }

  // Extract just the team-authored content by removing field labels/prompts
  // Submission format is: "Label:\nTeam content\n\nLabel:\nTeam content..."
  // Or for deal review: "=== TEAM'S AUTHORED RESPONSES... ===\nNext Actions for...\ncontent"
  let teamContent = fullText;

  // For deal review format, extract only the team-authored section
  const teamSection = fullText.split("=== TEAM'S AUTHORED RESPONSES");
  if (teamSection.length > 1) {
    teamContent = teamSection[1]
      .replace(/\(Score based on THIS content only\) ===/, '')
      .replace(/Next Actions for "[^"]*":\n/g, '') // Strip "Next Actions for..." labels
      .trim();
  } else {
    // For regular fields, strip the prompt labels (lines ending with ? or :)
    // Keep only the content lines that follow them
    const lines = fullText.split('\n');
    const contentLines = [];
    let skipNext = false;
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip lines that are field labels (end with ? or : and look like prompts)
      if (trimmed.match(/^(How can we|What can we|What is one|What question|Which strategy|Given what|What 2-3|What messages|What must be|What are|Describe|Write a|List|Explain|Prepare)/i) ||
          trimmed.match(/\?\s*$/) ||
          trimmed === '') {
        continue;
      }
      contentLines.push(trimmed);
    }
    if (contentLines.length > 0) {
      teamContent = contentLines.join(' ');
    }
  }

  const words = teamContent.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const charCount = teamContent.length;

  // ---- GARBAGE DETECTION (very strict — only catches obvious trash) ----

  // Check if ALL team content is just repeated garbage words
  const garbageWords = new Set(['test', 'asdf', 'hello', 'hi', 'foo', 'bar', 'xxx', 'aaa', 'abc',
    '123', 'na', 'n/a', 'none', 'idk', 'nothing', 'filler', 'placeholder', 'tbd', 'todo',
    'blah', 'lol', 'ok', 'yes', 'no', 'stuff', 'things', 'whatever', 'x', 'y', 'z', 'a', 'b']);
  const nonGarbageWords = words.filter(w => !garbageWords.has(w.toLowerCase()) && w.length > 1);
  const garbageRatio = 1 - (nonGarbageWords.length / Math.max(1, wordCount));

  // Pure garbage: nearly all words are trash words
  if (charCount === 0 || (wordCount === 0)) {
    return { quality: "empty", score: 5, skipAI: true };
  }

  if (garbageRatio >= 0.85 && wordCount <= 20) {
    return { quality: "garbage", score: 10, skipAI: true };
  }

  // Highly repetitive: same 1-2 words repeated many times
  if (uniqueWords.size <= 2 && wordCount > 6) {
    return { quality: "repetitive", score: 12, skipAI: true };
  }

  // Placeholder patterns at the start of content
  if (/^(lorem ipsum|placeholder|sample text|coming soon|will update)/i.test(teamContent)) {
    return { quality: "garbage", score: 10, skipAI: true };
  }

  // ---- EVERYTHING ELSE GOES TO THE AI ----
  // The AI is better at judging whether a short-but-real answer is good or bad.
  // We just provide context signals to help it calibrate.

  return { quality: "normal", score: null, skipAI: false, penalty: 0 };
}

// Generate immediate low score for garbage submissions (no AI call needed)
function generateGarbageScore(round, qualityResult) {
  const baseScore = qualityResult.score;
  const criteriaScores = {};

  round.scoringCriteria.forEach(c => {
    // Slight variance per criterion but all very low
    criteriaScores[c.name] = Math.round(Math.max(5, baseScore + (Math.random() * 8 - 4)));
  });

  const feedbackByQuality = {
    empty: "No submission was provided. Your team needs to enter a strategic response to the customer scenario. Review the selling objective and customer context, discuss as a team, and provide your best thinking.",
    garbage: "This doesn't appear to be a genuine attempt at the challenge. I'm looking for real strategic thinking here — how would you actually approach this customer conversation? Take another look at the scenario, talk it through as a team, and give me something I can coach you on.",
    repetitive: "I can see this isn't a serious submission. In a real customer meeting, you'd need a thoughtful, specific approach. Review the customer context, discuss the challenge as a team, and put together a response that reflects your best strategic thinking.",
  };

  return {
    score: {
      overall: baseScore,
      criteria: criteriaScores,
      timestamp: new Date().toISOString(),
    },
    coaching: {
      tone: "needs_work",
      mainFeedback: feedbackByQuality[qualityResult.quality] || feedbackByQuality.garbage,
      strengths: ["Your team showed up — now let's see what you've got"],
      improvements: [
        "Read the customer context carefully — there are specific signals you should respond to",
        "Think about what you'd actually say if you were sitting across from this executive",
        "Focus on business outcomes, not product features — what does this customer care about?",
      ],
      nextSteps: [
        "Review the selling objective and discuss it as a team before resubmitting",
        "Look at the customer's current situation — what's at risk if they don't act?",
        "Think like a trusted advisor, not a vendor",
      ],
      scoreInterpretation: "Needs Development",
    },
    isQualityGated: true,
  };
}

// Fallback scoring when API is completely unavailable
function generateFallbackScore(round, submission, phase) {
  console.log("Using fallback scoring due to API unavailability");

  // Run through quality gate first
  const qualityResult = assessSubmissionQuality(submission, phase);
  if (qualityResult.skipAI) {
    return generateGarbageScore(round, qualityResult);
  }

  const words = submission.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));

  // Domain relevance
  const domainKeywords = [
    'customer', 'business', 'value', 'outcome', 'strategy', 'revenue',
    'risk', 'stakeholder', 'executive', 'transform', 'ai', 'cx',
    'experience', 'solution', 'platform', 'contact', 'genesys',
    'migration', 'roi', 'cost', 'competitive', 'champion', 'decision',
    'insight', 'discovery', 'expansion', 'pilot', 'orchestration'
  ];
  const domainHits = domainKeywords.filter(kw => submission.toLowerCase().includes(kw)).length;

  // Vocabulary richness (unique words / total words)
  const richness = uniqueWords.size / Math.max(1, wordCount);

  // Calculate base score with more variance
  // Short, generic = 35-50. Medium with some relevance = 50-65. Detailed & relevant = 65-78.
  let baseScore = 30; // Start low
  baseScore += Math.min(15, wordCount / 15); // Up to +15 for length (caps at ~225 words)
  baseScore += Math.min(15, domainHits * 2.5); // Up to +15 for domain relevance
  baseScore += Math.min(8, richness * 12); // Up to +8 for vocabulary richness
  baseScore = Math.round(Math.min(78, baseScore)); // Cap at 78 for fallback

  const criteriaScores = {};
  round.scoringCriteria.forEach(c => {
    // ±8 points variance per criterion
    criteriaScores[c.name] = Math.round(
      Math.min(85, Math.max(15, baseScore + (Math.random() - 0.5) * 16))
    );
  });

  return {
    score: {
      overall: baseScore,
      criteria: criteriaScores,
    },
    coaching: {
      tone: baseScore >= 65 ? "good" : baseScore >= 50 ? "developing" : "needs_work",
      mainFeedback: "Your submission has been received. Due to high demand, detailed AI coaching is temporarily unavailable, but your score reflects the depth and strategic quality of your response. Focus on customer-specific business outcomes and executive-level framing to maximize your score.",
      strengths: ["Submission received and scored based on content quality"],
      improvements: [
        "Focus on business outcomes specific to this customer's situation",
        "Quantify impact where possible and reference the customer's stated priorities",
      ],
      nextSteps: [
        "Review the customer context for insights you may have missed",
        "Consider how an executive would react to your positioning",
      ],
      scoreInterpretation: baseScore >= 75 ? "Strong Contender" :
                          baseScore >= 60 ? "Building Momentum" :
                          baseScore >= 45 ? "Foundation Phase" : "Needs Development",
    },
    isFallback: true,
  };
}

// ============================================================================
// SCORE VALIDATION
// Ensures AI-returned scores use the full range and don't cluster
// ============================================================================

function validateAndAdjustScores(scores) {
  const values = Object.values(scores);
  if (values.length <= 1) return scores;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  // If all scores are within a 10-point band, gently spread them
  if (range < 10) {
    console.log(`Score clustering detected (range: ${range}). Applying differentiation.`);
    const adjusted = {};

    // Preserve the AI's relative ordering but widen the spread
    const sorted = Object.entries(scores).sort(([, a], [, b]) => a - b);
    const spreadPerStep = Math.max(4, Math.round(15 / (sorted.length - 1)));

    sorted.forEach(([name, score], index) => {
      const offset = (index - (sorted.length - 1) / 2) * spreadPerStep;
      adjusted[name] = Math.round(Math.min(100, Math.max(10, score + offset)));
    });

    return adjusted;
  }

  return scores;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Set CORS headers early
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  try {
    const { submission, wobbleResponse, round, phase = "initial" } = req.body;

    if (!submission || !round) {
      return res.status(400).json({ error: "Missing submission or round data" });
    }

    // ========================================
    // QUALITY GATE: Catch obvious garbage only
    // ========================================
    const qualityResult = assessSubmissionQuality(submission, phase);

    if (qualityResult.skipAI) {
      console.log(`Quality gate triggered: ${qualityResult.quality} (score: ${qualityResult.score})`);
      const garbageResult = generateGarbageScore(round, qualityResult);
      return res.status(200).json(garbageResult);
    }

    // ========================================
    // AI SCORING — the real evaluator
    // ========================================

    const systemPrompt = `You are an elite sales coach and STRICT evaluator at Genesys, running a competitive sales simulation at the annual INSPIRE event. You have 25+ years of experience in enterprise CX and contact center sales. You've trained thousands of reps and closed hundreds of millions in revenue.

Your role is to evaluate team submissions as if you were a real coach sitting across the table — reading their work, forming a genuine impression, and giving honest, differentiated feedback. These scores determine competition rankings and prizes. They MUST meaningfully separate strong performers from weak ones.

## YOUR COACHING VOICE
- You sound like a real person, not an algorithm. Write the way a seasoned sales leader actually talks.
- You are direct and honest — you don't sugarcoat, but you also acknowledge good thinking when you see it.
- You use specific references to what the team actually wrote. Never give feedback that could apply to any team.
- When something is weak, say WHY it's weak and what good would look like. Don't just say "needs improvement."
- When something is strong, call out exactly what made it strong. Don't just say "good job."

## SCORING CALIBRATION — THIS IS CRITICAL

You MUST use the FULL scoring range. Here is what each tier looks like in practice:

### 90-100: CHAMPIONSHIP CALIBER (Rare — top 5% of submissions)
This is a response that would impress a CRO. To earn 90+, the team must demonstrate ALL of:
- Specific references to the customer's situation (names, numbers, stakeholders, industry dynamics)
- Business outcome framing throughout — not a single product feature mentioned without tying to impact
- Sophisticated competitive awareness — understands the threat landscape and how to navigate it
- Executive-level strategic thinking — reads like advice from a trusted board advisor, not a sales rep
- Actionable, time-bound, specific recommendations
Example quality: "We need to reframe the conversation around the $28.5B in customer deposits at risk from inconsistent cross-channel servicing. The CEO's modernization mandate gives us air cover, but only if we show that regional Avaya fragmentation creates compliance and continuity gaps that directly threaten their digital banking roadmap."

### 75-89: STRONG CONTENDER (Good — top 25%)
Solid strategic thinking with customer specificity. Shows real understanding of the dynamics.
- References this customer's actual situation (not generic advice)
- Understands the competitive or organizational dynamics at play
- Provides actionable recommendations, not just directional statements
- Connects to business outcomes but may lack full quantification or miss a dimension
Example quality: A response that identifies the right approach and addresses the customer's specific context, but doesn't fully connect all the dots between competitive threat, business impact, and executive framing.

### 55-74: BUILDING MOMENTUM (Where most responses land)
Directionally correct but generic. The hallmark of this tier: the response could be copy-pasted to a different customer and still make sense.
- Right general ideas but no customer-specific detail
- Uses industry buzzwords without grounding them in this scenario
- Recommendations are too vague to actually execute on
- Might mention the customer's name but doesn't really engage with their unique situation
Example quality: "We should help them see the value of moving to an AI-powered platform and show them how Genesys can improve their CX outcomes and reduce costs."

### 35-54: FOUNDATION PHASE (Below average)
Misses the point or stays completely surface-level.
- Product-centric — talks about what Genesys does rather than what the customer needs
- Ignores the customer context that was provided
- No strategic thinking — just tactics or feature lists
- Could have been written without reading the scenario at all
Example quality: "Demo our platform, highlight our AI features, and try to get a meeting with the CIO to pitch our solution."

### 10-34: NEEDS DEVELOPMENT
Not a genuine attempt. Placeholder text, off-topic, or fundamentally misunderstands the challenge.

## CRITICAL SCORING RULES

1. **DEFAULT TO THE MIDDLE.** If you're unsure whether something deserves 70 or 75, go with 65. Teams must clearly EARN their way above 70 through demonstrated specificity and strategic thinking.

2. **GENERIC = 65 CEILING.** If a response could apply to any customer without changing a word, it CANNOT score above 65 on ANY criterion — no matter how polished or well-structured it is. Specificity is the gateway to higher scores.

3. **EACH CRITERION IS INDEPENDENT.** A team might nail strategy selection (82) but completely whiff on competitive awareness (48). Score each criterion honestly on its own merits. DO NOT anchor adjacent criteria to each other.

4. **VARIANCE IS REQUIRED.** Your criterion scores MUST have at least a 12-point spread between highest and lowest. If you find yourself giving everything 68-72, you're not differentiating. Push your highest up and your lowest down.

5. **QUALITY OVER QUANTITY.** A concise, specific, insight-rich answer is worth more than a long, rambling, generic one. Never reward length for its own sake. A tight 2-sentence answer that nails the strategic insight can outscore a 200-word essay that says nothing specific.

6. **GARBAGE = 10-25.** If the submission is clearly placeholder text, random words, or not a genuine attempt at the challenge, score ALL criteria between 10-25. This includes submissions where the team has written "test", "asdf", or other non-responses in the answer fields.

7. **READ BETWEEN THE LINES.** Some teams may express good strategic instincts in imperfect language. Score the thinking, not the grammar. A rough-but-insightful response beats a polished-but-empty one.

## FEEDBACK VOICE

Write your feedback the way a real coach would talk to a team:
- "I like that you picked up on the CEO's modernization mandate — that's the right thread to pull."
- "You're on the right track with the reframe approach, but you haven't given me anything specific to this customer. Why should Aureon care about AI-powered CX? What's at stake for THEM?"
- "This reads like a generic playbook response. If I showed this to the VP of Customer Operations, she wouldn't feel like you understand her world."
- "Good instinct on the phased investment approach. Now make it sharper — what specifically gets funded in Phase 1, and what metric proves it's working?"`;

    // Build detailed criteria with poor/champion examples
    const buildCriteriaDetails = (criteria) => {
      return criteria.map(c => {
        let detail = `- **${c.name}** (${c.weight}% weight)\n`;
        detail += `  What this measures: ${c.description}\n`;
        if (c.poor) detail += `  POOR (35-50): ${c.poor}\n`;
        if (c.champion) detail += `  CHAMPION (85-100): ${c.champion}`;
        return detail;
      }).join("\n\n");
    };

    // Build optional sections
    const buildPenaltiesSection = (penalties) => {
      if (!penalties || penalties.length === 0) return "";
      return `\n### SCORING PENALTIES (Up to 5-point reduction each)\nApply these penalties to the overall score if the submission exhibits any of these:\n${penalties.map(p => `- ${p}`).join("\n")}\n`;
    };

    const buildAccountPlanSection = (accountPlan) => {
      if (!accountPlan) return "";
      let section = "\n### ACCOUNT PLAN SNAPSHOT (Reference material available to the team)\n";
      section += "The team has access to printed materials with the following account intelligence. Their response should reflect awareness of this context:\n\n";
      section += "**Relationship Strategy:**\n";
      accountPlan.relationshipStrategy.forEach(r => {
        section += `- ${r.department} | ${r.title} | ${r.buyingRole} | Relationship: ${r.relationship} | Risk: ${r.riskSignal} | Focus: ${r.strategyFocus}\n`;
      });
      section += "\n**Account Assessment:**\n";
      accountPlan.accountAssessment.forEach(a => {
        section += `- ${a.category}: ${a.rating} – ${a.interpretation} (${a.riskIndicator})\n`;
      });
      return section;
    };

    const buildWobbleScoringGuidance = (wobble) => {
      if (!wobble?.scoringGuidance) return "";
      return `\n### WOBBLE SCORING GUIDANCE\n${wobble.scoringGuidance}\n`;
    };

    // Build the scoring prompt based on phase
    let scoringPrompt;

    if (phase === "initial") {
      scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario:** ${round.subtitle} | **Motion:** ${round.motion || "N/A"}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Size:** ${round.customer.size || "N/A"} | **Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}
${round.customer.contactCenters ? `**Contact Centers:** ${round.customer.contactCenters}` : ""}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.map(c => `- ${c}`).join("\n")}
${buildAccountPlanSection(round.accountPlanSnapshot)}
### SCORING RUBRIC

${buildCriteriaDetails(round.scoringCriteria)}
${buildPenaltiesSection(round.penalties)}
---

## TEAM'S SUBMISSION

${submission}

---

## YOUR EVALUATION TASK

Read the team's submission carefully. Then:

1. **First impression check:** Is this a genuine, thoughtful attempt — or is it placeholder/garbage content? If garbage, score everything 10-25 and say so directly.

2. **For each criterion:** Compare their response against the Poor and Champion benchmarks. Where does it honestly fall?
   - No customer-specific detail? Cap that criterion at 65.
   - References the actual scenario? Now we're talking — 70+.
   - Executive-level insight with specificity? 80+.
   - Championship caliber across the board? 90+ (this is rare).

3. **Check for penalties:** If any of the listed penalties apply, note them and reduce the overall score accordingly (up to 5 points per penalty).

4. **Ensure differentiation:** Your scores must have at least 12 points of spread. If the team is strong in one area and weak in another, your scores should reflect that.

5. **Write feedback like a real coach** — reference specific things they said (or didn't say). No generic platitudes.

The team will next face a wobble: "${round.wobble.title}"

Respond in this EXACT JSON format (no other text before or after):
{
  "scores": {
    ${round.scoringCriteria.map((c) => `"${c.name}": [score 10-100]`).join(",\n    ")}
  },
  "penaltiesApplied": ["[List any penalties triggered, or empty array if none]"],
  "overallAssessment": "[2-3 sentences. Reference specific things they wrote. Be direct about what's strong and what's missing.]",
  "strengths": ["[Cite something specific they did well]", "[Another specific strength]"],
  "improvements": ["[Specific, actionable — reference what they wrote and what would make it better]", "[Another specific improvement]", "[Third improvement]"],
  "coachChallenge": "[A thought-provoking question that pushes their thinking — tied to their specific gaps]"
}`;

    } else {
      // Final submission - includes wobble response
      scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario:** ${round.subtitle} | **Motion:** ${round.motion || "N/A"}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Size:** ${round.customer.size || "N/A"} | **Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}
${round.customer.contactCenters ? `**Contact Centers:** ${round.customer.contactCenters}` : ""}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.map(c => `- ${c}`).join("\n")}
${buildAccountPlanSection(round.accountPlanSnapshot)}
### SCORING RUBRIC

${buildCriteriaDetails(round.scoringCriteria)}
${buildPenaltiesSection(round.penalties)}
---

## TEAM'S INITIAL STRATEGY

${submission}

---

## WOBBLE SCENARIO: ${round.wobble.title}

${round.wobble.description}

**Question posed:** ${round.wobble.question}
${buildWobbleScoringGuidance(round.wobble)}
### Team's Wobble Response:
${wobbleResponse}

---

## YOUR EVALUATION TASK

Evaluate the team's COMPLETE approach — initial strategy plus how they adapted to the wobble.

1. **Initial strategy quality** (same calibration standards as above)
2. **Wobble adaptation** — Did they genuinely engage with the new information? Did they adapt, or just repeat their original approach? A strong wobble response shows real-time strategic thinking.
3. **Coherence** — Does their overall approach hold together as a strategy an actual account team could execute?
4. **Check for penalties:** If any of the listed penalties apply, note them and reduce accordingly.
5. **Differentiation** — Ensure at least 12 points of spread between your highest and lowest criterion scores.

Write feedback like a real coach wrapping up a coaching session. Reference specific things they said.

Respond in this EXACT JSON format (no other text before or after):
{
  "scores": {
    ${round.scoringCriteria.map((c) => `"${c.name}": [score 10-100]`).join(",\n    ")}
  },
  "penaltiesApplied": ["[List any penalties triggered, or empty array if none]"],
  "overallAssessment": "[2-3 sentences. Be specific and direct. Reference what they wrote.]",
  "strengths": ["[Specific strength 1]", "[Specific strength 2]", "[Specific strength 3]"],
  "improvements": ["[Specific, actionable improvement 1]", "[Specific improvement 2]"],
  "coachChallenge": "[Final coaching insight — make it count. Tie it to their specific gaps.]"
}`;
    }

    // Call Claude API with retry logic
    const response = await callWithRetry(async () => {
      return await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
        temperature: 0.3, // Lower temperature for more consistent, reliable scoring
        messages: [
          {
            role: "user",
            content: scoringPrompt,
          },
        ],
        system: systemPrompt,
      });
    });

    // Parse the AI response
    const aiText = response.content[0].text;

    // Extract JSON from the response
    let aiResult;
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiText);
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    // Validate and adjust scores to prevent clustering
    aiResult.scores = validateAndAdjustScores(aiResult.scores);

    // Calculate weighted overall score
    let totalScore = 0;
    let totalWeight = 0;
    round.scoringCriteria.forEach((criterion) => {
      const score = aiResult.scores[criterion.name] || 40;
      totalScore += score * criterion.weight;
      totalWeight += criterion.weight;
    });
    let overallScore = Math.round(totalScore / totalWeight);

    // Apply penalty deductions (up to 5 points each)
    const penaltiesApplied = aiResult.penaltiesApplied?.filter(p => p && p !== "None" && !p.startsWith("[")) || [];
    if (penaltiesApplied.length > 0) {
      const penaltyDeduction = Math.min(penaltiesApplied.length * 5, 20); // Cap at 20 total
      overallScore = Math.max(10, overallScore - penaltyDeduction);
      console.log(`Penalties applied (${penaltiesApplied.length}): -${penaltyDeduction} points`);
    }

    // Determine score interpretation
    let scoreInterpretation;
    if (overallScore >= 90) {
      scoreInterpretation = "Championship Caliber";
    } else if (overallScore >= 75) {
      scoreInterpretation = "Strong Contender";
    } else if (overallScore >= 55) {
      scoreInterpretation = "Building Momentum";
    } else if (overallScore >= 35) {
      scoreInterpretation = "Foundation Phase";
    } else {
      scoreInterpretation = "Needs Development";
    }

    // Build the final response
    const result = {
      score: {
        overall: overallScore,
        criteria: aiResult.scores,
        timestamp: new Date().toISOString(),
      },
      coaching: {
        tone:
          overallScore >= 90
            ? "excellent"
            : overallScore >= 75
              ? "good"
              : overallScore >= 55
                ? "developing"
                : "needs_work",
        mainFeedback: aiResult.overallAssessment,
        strengths: aiResult.strengths,
        improvements: aiResult.improvements,
        nextSteps: [
          aiResult.coachChallenge,
          phase === "initial"
            ? "Consider how you'll adapt when faced with new information"
            : "Discuss with your team: What would you do differently next time?",
          phase === "initial"
            ? "Think about what curveball might be coming..."
            : "Apply these lessons to your next customer conversation",
        ],
        scoreInterpretation,
        penaltiesApplied: penaltiesApplied.length > 0 ? penaltiesApplied : undefined,
      },
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Scoring error:", error);

    // For persistent rate limits or API unavailability, use fallback scoring
    const isRateLimit = error.status === 429;
    const isOverloaded = error.status === 529;
    const isApiError = error.status >= 500;

    if (isRateLimit || isOverloaded || isApiError) {
      console.log("Using fallback scoring due to API issues");
      const { submission, round, phase } = req.body;
      const fallbackResult = generateFallbackScore(round, submission, phase);
      return res.status(200).json(fallbackResult);
    }

    return res.status(500).json({
      error: "Failed to process submission. Please try again.",
      retryable: true
    });
  }
}
