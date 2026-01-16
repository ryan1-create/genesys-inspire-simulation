// Vercel Serverless Function - AI Scoring Endpoint (V2)
// Deploy to: /api/score
// Supports two-phase scoring: initial submission and wobble response

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

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
- Deeply knowledgeable about competitive dynamics (Avaya, Five9, NICE, AWS Connect, Salesforce Service Cloud)
- Passionate about the Genesys AI-powered CX platform
- Familiar with the four "field motions": Legacy Displacement, CCaaS Replacement, Expansion, and Pure-Play AI defense

IMPORTANT: You are scoring submissions from sales teams participating in a competitive simulation at Genesys INSPIRE. Your scores will determine prizes, so be fair but discerning:
- Championship Caliber (85-95): Executive-level framing, specific business outcomes, competitive awareness, proactive strategy
- Strong Contender (70-84): Good structure, relevant points, some specificity, addresses key issues
- Building Momentum (55-69): Basic understanding, generic responses, feature-focused, missing strategic depth
- Foundation Phase (45-54): Product-centric, misses customer context, lacks executive relevance, surface-level thinking`;

    // Build the scoring prompt based on phase
    let scoringPrompt;

    if (phase === "initial") {
      // Initial submission - generate score AND wobble options
      scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario Type:** ${round.subtitle}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.map(c => `- ${c}`).join("\n")}

### Scoring Criteria
${round.scoringCriteria.map((c) => `- **${c.name}** (${c.weight}%): ${c.description}`).join("\n")}

---

## TEAM'S INITIAL SUBMISSION

${submission}

---

## YOUR TASK

This is the team's INITIAL submission before they receive the "wobble" (curveball scenario). Evaluate their foundational strategy and prepare them for the challenge ahead.

The upcoming wobble will be: "${round.wobble.title}" - ${round.wobble.description}

Provide your evaluation in this EXACT JSON format:
{
  "scores": {
    ${round.scoringCriteria.map((c) => `"${c.name}": [0-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentence summary of the submission's strengths and primary gap]",
  "strengths": ["[strength 1]", "[strength 2]"],
  "improvements": ["[improvement 1]", "[improvement 2]", "[improvement 3]"],
  "coachChallenge": "[One thought-provoking question for the team]",
  "wobbleOptions": [
    "[Strategic option A: A specific, actionable approach to handle the wobble - 1-2 sentences]",
    "[Strategic option B: A different approach - 1-2 sentences]",
    "[Strategic option C: Another viable approach - 1-2 sentences]",
    "[Strategic option D: A fourth approach - 1-2 sentences]"
  ]
}

IMPORTANT for wobbleOptions:
- Generate 4 distinct, strategic options for responding to the wobble
- Each should be a reasonable approach that a sales team might take
- Make them specific to the customer situation and wobble scenario
- Vary them in approach (e.g., defensive vs. offensive, relationship-focused vs. value-focused)
- One option should be clearly the best approach, but all should be plausible`;

    } else {
      // Final submission - includes wobble response
      scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario Type:** ${round.subtitle}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.map(c => `- ${c}`).join("\n")}

### Scoring Criteria
${round.scoringCriteria.map((c) => `- **${c.name}** (${c.weight}%): ${c.description}`).join("\n")}

---

## TEAM'S INITIAL STRATEGY

${submission}

---

## WOBBLE SCENARIO: ${round.wobble.title}

${round.wobble.description}

**Question posed:** ${round.wobble.question}

### Team's Chosen Response to Wobble:
${wobbleResponse}

---

## YOUR TASK

Evaluate the team's COMPLETE approach including their wobble adaptation. Consider:
1. The strength of their initial strategy
2. How well their wobble response addresses the new information
3. The coherence between their initial approach and their adaptation
4. Whether they would likely succeed in this customer scenario

Provide your evaluation in this EXACT JSON format:
{
  "scores": {
    ${round.scoringCriteria.map((c) => `"${c.name}": [0-100]`).join(",\n    ")}
  },
  "overallAssessment": "[2-3 sentence summary evaluating their complete approach including wobble adaptation]",
  "strengths": ["[strength 1]", "[strength 2]", "[strength 3]"],
  "improvements": ["[improvement 1]", "[improvement 2]"],
  "coachChallenge": "[Final coaching insight or challenge for the team]"
}`;
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: scoringPrompt,
        },
      ],
      system: systemPrompt,
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
            : `Apply these lessons to your next customer conversation`,
          phase === "initial"
            ? "Think about what curveball might be coming..."
            : "Discuss with your team: What would you do differently next time?",
        ],
        scoreInterpretation,
      },
    };

    // Include wobble options for initial phase
    if (phase === "initial" && aiResult.wobbleOptions) {
      result.wobbleOptions = aiResult.wobbleOptions;
    }

    // Set CORS headers and return
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Scoring error:", error);
    return res.status(500).json({ error: "Failed to process submission" });
  }
}
