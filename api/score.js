// Vercel Serverless Function - AI Scoring Endpoint (V3)
// Deploy to: /api/score
// Updated to match Master Simulation Planning Deck rubrics
// Includes retry logic for rate limit handling

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

// Retry helper with exponential backoff
async function callWithRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isRateLimit = error.status === 429 || error.message?.includes('rate');
      const isOverloaded = error.status === 529 || error.message?.includes('overloaded');

      if ((isRateLimit || isOverloaded) && attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.log(`Rate limited, retrying in ${delay/1000}s (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

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

    const systemPrompt = `You are an elite sales coach at Genesys with 25+ years of experience in enterprise software sales, specifically in customer experience (CX) and contact center solutions. You've led teams that have closed hundreds of millions in revenue and trained thousands of sales professionals.

Your role is to evaluate and coach account teams on their strategic selling approach. You are:
- Direct but supportive - you tell it like it is while building confidence
- Focused on business outcomes over product features
- Expert at value-based selling and executive-level positioning
- Deeply knowledgeable about competitive dynamics (Avaya, Five9, NICE, AWS Connect, Salesforce Service Cloud, AI pure-plays like Sierra, Parloa)
- Passionate about the Genesys AI-powered CX platform and experience orchestration
- Familiar with the four "field motions": Legacy Displacement, CCaaS Replacement, Expansion, and Pure-Play AI defense

SCORING GUIDANCE - Be fair but highly discerning. These scores determine prizes and must differentiate performance:

CRITICAL: Avoid defaulting to scores in the 80-85 range. That range should be EARNED through demonstrably strong responses.

- Championship Caliber (90-100): Exceptional. Executive-level framing with specific, quantified business outcomes. Deep competitive awareness. Proactive, sophisticated strategy. Achieves "Champion" level on ALL criteria. Reserve 95+ for truly outstanding responses.
- Strong Contender (75-89): Good to very good. Solid structure, relevant and specific points, addresses key issues well. Some champion-level insights but not consistently across all criteria.
- Building Momentum (60-74): Adequate but generic. Basic understanding shown, but responses lack specificity, depth, or executive relevance. Feature-focused rather than outcome-focused.
- Foundation Phase (45-59): Weak. Product-centric, misses customer context, surface-level thinking. Does not demonstrate strategic sales acumen.
- Needs Development (Below 45): Very weak or off-target. Fundamental misunderstanding of the challenge or customer situation.

IMPORTANT: Score each criterion INDEPENDENTLY based on the Poor/Champion benchmarks. A response that is generic or lacks specificity should score 60-70, not 80+. Only award 85+ when the response clearly demonstrates champion-level thinking for that criterion.`;

    // Build detailed criteria with poor/champion examples
    const buildCriteriaDetails = (criteria) => {
      return criteria.map(c => {
        let detail = `- **${c.name}** (${c.weight}% weight)\n`;
        detail += `  Description: ${c.description}\n`;
        if (c.poor) detail += `  Poor (40-55): ${c.poor}\n`;
        if (c.champion) detail += `  Champion (85-100): ${c.champion}`;
        return detail;
      }).join("\n\n");
    };

    // Build the scoring prompt based on phase
    let scoringPrompt;

    if (phase === "initial") {
      // Initial submission - score before wobble
      scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario:** ${round.subtitle} | **Motion:** ${round.motion || "N/A"}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Size:** ${round.customer.size || "N/A"} | **Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.map(c => `- ${c}`).join("\n")}

### SCORING RUBRIC (use these criteria strictly)

${buildCriteriaDetails(round.scoringCriteria)}

---

## TEAM'S SUBMISSION

${submission}

---

## YOUR TASK

Evaluate the team's submission against EACH scoring criterion. For each criterion:
1. Compare their response to the "Poor" and "Champion" benchmarks
2. Assign a score that reflects where they fall on that spectrum
3. Use the full range (40-100) - don't cluster scores

The team will next face a wobble: "${round.wobble.title}"

Provide your evaluation in this EXACT JSON format:
{
  "scores": {
    ${round.scoringCriteria.map((c) => `"${c.name}": [score 40-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentences: What did they do well? What's the primary gap?]",
  "strengths": ["[specific strength 1]", "[specific strength 2]"],
  "improvements": ["[actionable improvement 1]", "[actionable improvement 2]", "[actionable improvement 3]"],
  "coachChallenge": "[One thought-provoking question to push their thinking]"
}`;

    } else {
      // Final submission - includes wobble response, needs discussion summary
      scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario:** ${round.subtitle} | **Motion:** ${round.motion || "N/A"}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Size:** ${round.customer.size || "N/A"} | **Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.map(c => `- ${c}`).join("\n")}

### SCORING RUBRIC

${buildCriteriaDetails(round.scoringCriteria)}

---

## TEAM'S INITIAL STRATEGY

${submission}

---

## WOBBLE SCENARIO: ${round.wobble.title}

${round.wobble.description}

**Question posed:** ${round.wobble.question}

### Team's Wobble Response:
${wobbleResponse}

---

## YOUR TASK

Evaluate the team's COMPLETE approach including their wobble adaptation. Score against each criterion considering:
1. The strength of their initial strategy
2. How well their wobble response addresses the new information
3. The coherence between initial approach and adaptation
4. Likelihood of success in this customer scenario

Also prepare a DISCUSSION SUMMARY for the team to review together - this should be a concise, role-consistent coaching debrief they can use for team discussion.

Provide your evaluation in this EXACT JSON format:
{
  "scores": {
    ${round.scoringCriteria.map((c) => `"${c.name}": [score 40-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentences evaluating their complete approach]",
  "strengths": ["[specific strength 1]", "[specific strength 2]", "[specific strength 3]"],
  "improvements": ["[actionable improvement 1]", "[actionable improvement 2]"],
  "coachChallenge": "[Final coaching insight for the team]",
  "discussionSummary": {
    "keyInsight": "[One sentence: The most important takeaway from this round]",
    "whatWorked": "[2-3 sentences: Concise summary of what the team did well]",
    "growthArea": "[2-3 sentences: The primary area for improvement and why it matters]",
    "discussionQuestions": [
      "[Question 1 for team discussion - tied to their specific performance]",
      "[Question 2 for team discussion - about applying lessons learned]",
      "[Question 3 for team discussion - forward-looking for next customer conversation]"
    ]
  }
}`;
    }

    // Call Claude API with retry logic
    const response = await callWithRetry(async () => {
      return await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
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
      // Try to find JSON in the response
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

    // Calculate weighted overall score
    let totalScore = 0;
    let totalWeight = 0;
    round.scoringCriteria.forEach((criterion) => {
      const score = aiResult.scores[criterion.name] || 50;
      totalScore += score * criterion.weight;
      totalWeight += criterion.weight;
    });
    const overallScore = Math.round(totalScore / totalWeight);

    // Determine score interpretation
    let scoreInterpretation;
    if (overallScore >= 85) {
      scoreInterpretation = "Championship Caliber";
    } else if (overallScore >= 70) {
      scoreInterpretation = "Strong Contender";
    } else if (overallScore >= 55) {
      scoreInterpretation = "Building Momentum";
    } else {
      scoreInterpretation = "Foundation Phase";
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
          overallScore >= 85
            ? "excellent"
            : overallScore >= 70
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
      },
    };

    // Include discussion summary for wobble phase
    if (phase === "wobble" && aiResult.discussionSummary) {
      result.discussionSummary = aiResult.discussionSummary;
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Scoring error:", error);

    // Give user-friendly error for rate limits
    if (error.status === 429) {
      return res.status(429).json({
        error: "High demand - please try again in a few seconds",
        retryable: true
      });
    }

    return res.status(500).json({ error: "Failed to process submission" });
  }
}
