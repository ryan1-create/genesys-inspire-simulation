// Vercel Serverless Function - AI Scoring Endpoint
// Deploy to: /api/score

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
    const { submission, wobbleResponse, round } = req.body;

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

IMPORTANT: You are scoring submissions from sales teams participating in a competitive simulation. Your scores will determine prizes, so be fair but discerning. Great work should score high (80-95), good work should score moderately (65-79), and work that misses the mark should score lower (45-64).`;

    const scoringPrompt = `## SIMULATION ROUND: ${round.title}
**Scenario Type:** ${round.subtitle}
**Customer:** ${round.customer.name} (${round.customer.industry})
**Revenue:** ${round.customer.revenue}
**Current Solution:** ${round.customer.currentSolution}

### Selling Objective
${round.objective}

### Team Challenge
${round.challenge}

### Customer Context
${round.context.join("\n- ")}

### Scoring Criteria
${round.scoringCriteria.map((c) => `- **${c.name}** (${c.weight}%): ${c.description}`).join("\n")}

---

## TEAM SUBMISSION

### Main Response:
${submission}

${wobbleResponse ? `### Wobble Adaptation (${round.wobble.title}):
The team was presented with this curveball: "${round.wobble.description}"

Their response:
${wobbleResponse}` : ""}

---

## YOUR TASK

Evaluate this submission and provide:

1. **Individual Criterion Scores** (0-100 for each):
${round.scoringCriteria.map((c) => `   - ${c.name}: [score]`).join("\n")}

2. **Overall Assessment** - A 2-3 sentence summary of the submission's strengths and primary gap

3. **Top Strengths** (2-3 bullet points) - What did this team do well?

4. **Key Improvements** (2-4 bullet points) - Specific, actionable coaching on what would make this stronger

5. **Coach's Challenge** - One thought-provoking question or challenge for the team to consider

Respond in this exact JSON format:
{
  "scores": {
    "${round.scoringCriteria.map((c) => c.name).join('": 0, "') + '": 0'}
  },
  "overallAssessment": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string", "string"],
  "coachChallenge": "string"
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
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
          `Review the "${round.title}" scoring criteria to identify specific areas for improvement`,
          "Discuss with your team: What would make THIS customer say yes?",
        ],
        scoreInterpretation,
      },
    };

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
