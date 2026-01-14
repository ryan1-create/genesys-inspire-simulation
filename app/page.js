"use client";

import React, { useState } from "react";
import {
  Trophy,
  Users,
  Target,
  Brain,
  ChevronRight,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Shield,
  Rocket,
  MessageSquare,
  BarChart3,
  RefreshCw,
  ArrowRight,
  Star,
  ThumbsUp,
  Lightbulb,
  Flag,
} from "lucide-react";

// Genesys Brand Colors
const colors = {
  primary: "#FF4F1F",
  primaryDark: "#E54318",
  dark: "#0D1630",
  light: "#F9F8F5",
  accent: "#FF6B3D",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
};

// Simulation Round Data
const simulationRounds = [
  {
    id: 1,
    title: "Catch the Whale",
    subtitle: "New Logo Opportunity",
    description: "Large account logo acquisition with embedded legacy player",
    customer: {
      name: "Aureon Financial Holdings",
      industry: "Financial Services: Banking and Payments",
      size: "42,000 employees | 11 regional contact centers | 3,800 agents",
      revenue: "$28.5B USD",
      currentSolution: "Legacy Avaya (on-prem)",
    },
    context: [
      "Current CX environment is expensive, slow to change, and operationally complex",
      "Customer experience varies significantly by geography",
      "CEO has initiated global modernization discussion",
      "AI-for-CX introduced at executive level, but leaders lack clarity on use cases",
      "Executive posture emphasizes risk mitigation and regulatory compliance",
      "Avaya is actively defending with hybrid-cloud strategies",
    ],
    objective:
      "Displace legacy Avaya platform and position Genesys as the strategic AI-powered CX platform",
    challenge:
      "Develop a POV to share with Global VP of CX to expand thinking around current gaps and AI-powered CX opportunities",
    prompts: [
      "What business objectives can we attach to?",
      "What are their current challenges – known and potentially not yet considered?",
      "What is an ideal future state in their terms – linking to Genesys capabilities?",
      "What would be the personal and business impact of a new approach?",
    ],
    wobble: {
      title: "New Intelligence",
      description:
        "Just before the meeting, you learn Salesforce/ServiceNow/AWS is already engaged: Supporting a broader digital transformation initiative, not formally leading CX yet but influencing enterprise platform standards, operating with direct C-suite access (CIO, COO), and actively shaping modernization principles.",
      question:
        "How does this new information get incorporated into your approach to the meeting?",
    },
    scoringCriteria: [
      {
        name: "Business Alignment",
        weight: 25,
        description: "Connects CX transformation to measurable business outcomes",
      },
      {
        name: "Customer Insight",
        weight: 20,
        description:
          "Demonstrates understanding of customer's known and hidden challenges",
      },
      {
        name: "Value Articulation",
        weight: 25,
        description:
          "Clearly articulates Genesys differentiation and AI-powered value",
      },
      {
        name: "Strategic Positioning",
        weight: 15,
        description: "Positions against competitive threats effectively",
      },
      {
        name: "Executive Relevance",
        weight: 15,
        description: "Frames messaging at appropriate executive level",
      },
    ],
    icon: Target,
    color: "#FF4F1F",
  },
  {
    id: 2,
    title: "Break Some Glass",
    subtitle: "New Logo Opportunity",
    description: "Mid-market account with immature CX perspective",
    customer: {
      name: "Everwell Health Services",
      industry: "Healthcare Services: Local Provider Network",
      size: "4,800 employees | 2 primary contact centers | 220 agents",
      revenue: "$1.6B USD",
      currentSolution: "Unknown cloud contact center platform",
    },
    context: [
      "Current CX environment is 'stable enough' but constrained",
      "Leadership does not view CX as a strategic investment area",
      "No active CX or CCaaS evaluation underway",
      "Technology initiatives scrutinized due to prior disruption",
      "Executives express skepticism toward CX vendors and AI claims",
      "Patient experience challenges treated as executive priorities",
    ],
    objective:
      "Help leadership shift from skepticism to belief that CX improvement impacts business outcomes",
    challenge:
      "Prepare for a discovery conversation with the VP of Patient Experience to expose reasons behind resistance to change and surface unrecognized value",
    prompts: [
      "Why might the customer prefer the status quo?",
      "What do we need to learn to understand the source of skepticism?",
      "How can we bring attention to things limiting their ability to achieve business outcomes?",
    ],
    wobble: {
      title: "Past Failure Revealed",
      description:
        "Just before the meeting, you learn the company previously migrated to a CCaaS provider, and leadership viewed the initiative as a failure: The transition was disruptive, promised outcomes not realized, adoption inconsistent across teams.",
      question:
        "How does this change your discovery approach, tone, and meeting objectives?",
    },
    scoringCriteria: [
      {
        name: "Discovery Quality",
        weight: 30,
        description: "Questions designed to uncover root causes of skepticism",
      },
      {
        name: "Trust Building",
        weight: 25,
        description: "Approach demonstrates empathy and avoids vendor tropes",
      },
      {
        name: "Status Quo Challenge",
        weight: 20,
        description: "Tactfully surfaces cost of inaction",
      },
      {
        name: "Healthcare Acumen",
        weight: 15,
        description: "Demonstrates understanding of healthcare-specific challenges",
      },
      {
        name: "Wobble Adaptation",
        weight: 10,
        description: "Effectively incorporates new information into strategy",
      },
    ],
    icon: Zap,
    color: "#10B981",
  },
  {
    id: 3,
    title: "Hold the High Ground",
    subtitle: "Account Defense",
    description: "Secure current account against AI pure-play intrusion",
    customer: {
      name: "Summit Ridge Retail Group",
      industry: "Retail: Omnichannel Consumer Goods",
      size: "36,000 employees | 10 regional contact centers | 2,600 agents",
      revenue: "$18.9B USD",
      currentSolution: "Genesys Cloud for voice and core routing",
    },
    context: [
      "Genesys is viewed as trusted and reliable CX platform",
      "Relationship strength sits primarily with Contact Center Director",
      "CX performance is solid; no active service crisis",
      "Renewal date is 18 months away",
      "New CIO joined with mandate for enterprise-wide digital transformation",
      "CIO engaged Accenture/Deloitte to shape transformation roadmap",
    ],
    objective:
      "Preserve our position by attaching to the broader transformation and defend against AI pure-play alternatives",
    challenge:
      "Prepare competitive strategy to ask Contact Center Director for a connection to the CIO",
    prompts: [
      "Where is Genesys currently trusted? Where not?",
      "How might Accenture and alternative platforms be redefining decision criteria?",
      "Which relationships must be strengthened beyond Contact Center Director?",
      "What must be true for Genesys to remain a strategic choice as decisions progress?",
    ],
    wobble: {
      title: "AI Pure-Play Threat",
      description:
        "The Contact Center Director informs us that the AI Committee is recommending a pilot of an AI pure-play: AI competitor is emphasizing cost takeout, Genesys is no longer being viewed as 'good enough', influence is being shifted away from the Contact Center org.",
      question:
        "What actions can you take to defend our position and secure the renewal?",
    },
    scoringCriteria: [
      {
        name: "Competitive Defense",
        weight: 25,
        description: "Articulates clear differentiation against AI pure-plays",
      },
      {
        name: "Relationship Strategy",
        weight: 25,
        description: "Identifies path to strengthen executive relationships",
      },
      {
        name: "Platform Positioning",
        weight: 20,
        description: "Elevates Genesys from tactical to strategic",
      },
      {
        name: "Transformation Alignment",
        weight: 20,
        description: "Connects to broader digital transformation narrative",
      },
      {
        name: "Urgency & Action",
        weight: 10,
        description: "Demonstrates appropriate urgency and clear next steps",
      },
    ],
    icon: Shield,
    color: "#3B82F6",
  },
  {
    id: 4,
    title: "Capture More Share",
    subtitle: "Account Expansion",
    description: "Expand current account footprint and business impact",
    customer: {
      name: "Orion Global Logistics",
      industry: "Logistics & Supply Chain Services",
      size: "52,000 employees | 14 regional contact centers | 3,400 agents",
      revenue: "$21.4B USD",
      currentSolution: "Genesys Cloud in EMEA; mix of legacy in other regions",
    },
    context: [
      "EMEA deployment viewed as successful and stable",
      "Outside EMEA, CX is fragmented and costly",
      "CX leadership advocating for global platform expansion",
      "Expansion requires executive committee approval",
      "CIO and CFO jointly evaluating investment and risk",
      "Company under margin pressure; cost discipline is high",
    ],
    objective:
      "Shore up executive confidence in our platform and proposed roadmap",
    challenge:
      "Identify and address executive decision risks in favor of our CX platform expansion initiative",
    prompts: [
      "Which executive concerns are most likely to stall or block global expansion?",
      "How can we use the EMEA success as proof?",
      "How can we leverage our champion(s)?",
      "How can the elements of the expansion be phased out?",
      "What trade-offs can we proactively propose?",
    ],
    wobble: {
      title: "Budget Cut Directive",
      description:
        "The CFO has directed the team to reduce the investment by 30% while still delivering the target outcomes. CFO is looking specifically for trade-offs and impact on bottom-line.",
      question:
        "How can we adapt our approach and continue to drive decision momentum?",
    },
    scoringCriteria: [
      {
        name: "Executive Risk Mitigation",
        weight: 25,
        description: "Proactively addresses CFO/CIO concerns",
      },
      {
        name: "Proof Point Leverage",
        weight: 20,
        description: "Effectively uses EMEA success as evidence",
      },
      {
        name: "Financial Acumen",
        weight: 25,
        description: "Presents compelling business case and trade-offs",
      },
      {
        name: "Champion Activation",
        weight: 15,
        description: "Strategy to leverage internal advocates",
      },
      {
        name: "Flexibility & Phasing",
        weight: 15,
        description: "Demonstrates creative approach to scope/timeline",
      },
    ],
    icon: Rocket,
    color: "#8B5CF6",
  },
];

export default function GenesysSimulation() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedRound, setSelectedRound] = useState(null);
  const [teamInfo, setTeamInfo] = useState({ name: "", table: "" });
  const [submissions, setSubmissions] = useState({});
  const [currentSubmission, setCurrentSubmission] = useState("");
  const [showWobble, setShowWobble] = useState(false);
  const [wobbleResponse, setWobbleResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [error, setError] = useState(null);

  const leaderboardData = [
    { rank: 1, team: "Revenue Rockets", table: 12, totalScore: 342, rounds: [88, 85, 87, 82] },
    { rank: 2, team: "Cloud Crushers", table: 7, totalScore: 335, rounds: [82, 86, 84, 83] },
    { rank: 3, team: "AI Avengers", table: 3, totalScore: 328, rounds: [80, 84, 82, 82] },
    { rank: 4, team: "Transform Tigers", table: 15, totalScore: 320, rounds: [78, 82, 80, 80] },
    { rank: 5, team: "CX Champions", table: 9, totalScore: 315, rounds: [76, 80, 79, 80] },
  ];

  const handleTeamSubmit = () => {
    if (teamInfo.name.trim() && teamInfo.table.trim()) {
      setCurrentView("rounds");
    }
  };

  const handleRoundSelect = (round) => {
    setSelectedRound(round);
    setCurrentSubmission(submissions[round.id]?.text || "");
    setWobbleResponse(submissions[round.id]?.wobble || "");
    setShowWobble(false);
    setCurrentView("round");
  };

  const handleSubmission = async () => {
    if (!currentSubmission.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Call the AI scoring API
      const response = await fetch("/api/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submission: currentSubmission,
          wobbleResponse: wobbleResponse,
          round: {
            id: selectedRound.id,
            title: selectedRound.title,
            subtitle: selectedRound.subtitle,
            customer: selectedRound.customer,
            context: selectedRound.context,
            objective: selectedRound.objective,
            challenge: selectedRound.challenge,
            wobble: selectedRound.wobble,
            scoringCriteria: selectedRound.scoringCriteria,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI scoring");
      }

      const result = await response.json();

      setSubmissions((prev) => ({
        ...prev,
        [selectedRound.id]: {
          text: currentSubmission,
          wobble: wobbleResponse,
          score: result.score,
          coaching: result.coaching,
          submittedAt: new Date().toISOString(),
        },
      }));

      setScores((prev) => ({
        ...prev,
        [selectedRound.id]: result.score,
      }));

      setCurrentView("results");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Home Screen
  const HomeScreen = () => (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${colors.dark} 0%, #1a2744 100%)`,
      }}
    >
      <header className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></div>
            <div
              className="w-3 h-3 rounded-full border-2"
              style={{ borderColor: colors.primary }}
            ></div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary }}
            ></div>
          </div>
          <span className="text-2xl font-bold text-white tracking-wider">
            GENESYS
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: "rgba(255, 79, 31, 0.15)" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
              <span
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                FY27 INSPIRE • THE GAME
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Sales Simulation
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Day 3: Team Challenge Experience
            </p>
            <p className="text-gray-400">Compete. Collaborate. Conquer.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: colors.primary }} />
              Register Your Team
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamInfo.name}
                  onChange={(e) =>
                    setTeamInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter your team name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Table Number
                </label>
                <input
                  type="text"
                  value={teamInfo.table}
                  onChange={(e) =>
                    setTeamInfo((prev) => ({ ...prev, table: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="Enter your table number"
                />
              </div>
              <button
                onClick={handleTeamSubmit}
                disabled={!teamInfo.name.trim() || !teamInfo.table.trim()}
                className="w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.primary }}
              >
                Enter The Game
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // Rounds Selection Screen
  const RoundsScreen = () => (
    <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
      <header
        className="sticky top-0 z-50 px-6 py-4"
        style={{ backgroundColor: colors.dark }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div
                className="w-2 h-2 rounded-full border"
                style={{ borderColor: colors.primary }}
              ></div>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
            <span className="text-lg font-bold text-white">GENESYS</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">{teamInfo.name}</div>
              <div className="text-gray-400 text-sm">Table {teamInfo.table}</div>
            </div>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Trophy className="w-5 h-5" style={{ color: colors.primary }} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.dark }}>
            Simulation Rounds
          </h1>
          <p className="text-gray-600">
            Select a round to begin your team challenge
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: colors.dark }}>
              Team Progress
            </h3>
            <span className="text-sm text-gray-500">
              {Object.keys(scores).length}/4 Rounds Complete
            </span>
          </div>
          <div className="flex gap-2">
            {simulationRounds.map((round) => (
              <div
                key={round.id}
                className="flex-1 h-3 rounded-full overflow-hidden bg-gray-100"
              >
                {scores[round.id] && (
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${scores[round.id].overall}%`,
                      backgroundColor: round.color,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {Object.keys(scores).length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">Current Total Score</span>
              <span
                className="font-bold text-xl"
                style={{ color: colors.primary }}
              >
                {Object.values(scores).reduce((sum, s) => sum + s.overall, 0)}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {simulationRounds.map((round) => {
            const RoundIcon = round.icon;
            const isComplete = !!scores[round.id];

            return (
              <div
                key={round.id}
                onClick={() => handleRoundSelect(round)}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-2" style={{ backgroundColor: round.color }} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${round.color}15` }}
                      >
                        <RoundIcon
                          className="w-6 h-6"
                          style={{ color: round.color }}
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">
                          Round {round.id}
                        </div>
                        <h3
                          className="text-xl font-bold"
                          style={{ color: colors.dark }}
                        >
                          {round.title}
                        </h3>
                      </div>
                    </div>
                    {isComplete ? (
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {scores[round.id].overall}
                        </span>
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>

                  <div className="mb-4">
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${round.color}15`,
                        color: round.color,
                      }}
                    >
                      {round.subtitle}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {round.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>{round.customer.industry.split(":")[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{round.customer.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div
              className="p-6 border-b border-gray-100"
              style={{ backgroundColor: colors.dark }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6" style={{ color: colors.primary }} />
                  <h2 className="text-xl font-bold text-white">
                    Live Leaderboard
                  </h2>
                </div>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="space-y-3">
                {leaderboardData.map((team, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-xl ${
                      team.team === teamInfo.name ? "ring-2" : ""
                    }`}
                    style={{
                      backgroundColor:
                        idx < 3 ? `${colors.primary}08` : "#f9fafb",
                      ringColor: colors.primary,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{
                        backgroundColor:
                          idx === 0
                            ? "#FFD700"
                            : idx === 1
                              ? "#C0C0C0"
                              : idx === 2
                                ? "#CD7F32"
                                : "#e5e7eb",
                        color: idx < 3 ? "#1a1a1a" : "#666",
                      }}
                    >
                      {team.rank}
                    </div>
                    <div className="flex-1">
                      <div
                        className="font-semibold"
                        style={{ color: colors.dark }}
                      >
                        {team.team}
                      </div>
                      <div className="text-sm text-gray-500">
                        Table {team.table}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: colors.primary }}
                      >
                        {team.totalScore}
                      </div>
                      <div className="text-xs text-gray-500">total points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Round Detail Screen
  const RoundScreen = () => {
    if (!selectedRound) return null;
    const RoundIcon = selectedRound.icon;

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <header
          className="sticky top-0 z-50 px-6 py-4"
          style={{ backgroundColor: colors.dark }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentView("rounds")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>Back to Rounds</span>
            </button>
            <div className="text-right">
              <div className="text-white font-medium">{teamInfo.name}</div>
              <div className="text-gray-400 text-sm">Table {teamInfo.table}</div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
            <div
              className="h-2"
              style={{ backgroundColor: selectedRound.color }}
            />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedRound.color}15` }}
                >
                  <RoundIcon
                    className="w-7 h-7"
                    style={{ color: selectedRound.color }}
                  />
                </div>
                <div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: selectedRound.color }}
                  >
                    Round {selectedRound.id}
                  </div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: colors.dark }}
                  >
                    {selectedRound.title}
                  </h1>
                </div>
              </div>
              <p className="text-gray-600">{selectedRound.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: colors.dark }}
            >
              <Target
                className="w-5 h-5"
                style={{ color: selectedRound.color }}
              />
              Customer Profile
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-500 mb-1">Company</div>
                <div className="font-semibold" style={{ color: colors.dark }}>
                  {selectedRound.customer.name}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-500 mb-1">Industry</div>
                <div className="font-semibold" style={{ color: colors.dark }}>
                  {selectedRound.customer.industry}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-500 mb-1">Revenue</div>
                <div className="font-semibold" style={{ color: colors.dark }}>
                  {selectedRound.customer.revenue}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-sm text-gray-500 mb-1">Current Solution</div>
                <div className="font-semibold" style={{ color: colors.dark }}>
                  {selectedRound.customer.currentSolution}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {selectedRound.customer.size}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: colors.dark }}
            >
              <Brain
                className="w-5 h-5"
                style={{ color: selectedRound.color }}
              />
              Situation Context
            </h2>
            <ul className="space-y-2">
              {selectedRound.context.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-600">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2"
                    style={{ backgroundColor: selectedRound.color }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-xl p-6 mb-6"
            style={{
              backgroundColor: `${selectedRound.color}10`,
              borderLeft: `4px solid ${selectedRound.color}`,
            }}
          >
            <h2
              className="text-lg font-semibold mb-2"
              style={{ color: colors.dark }}
            >
              Selling Objective
            </h2>
            <p className="text-gray-700">{selectedRound.objective}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: colors.dark }}
            >
              <Flag
                className="w-5 h-5"
                style={{ color: selectedRound.color }}
              />
              Team Challenge
            </h2>
            <p className="text-gray-700 mb-4 font-medium">
              {selectedRound.challenge}
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-500 mb-3">
                Consider These Questions:
              </div>
              <ul className="space-y-2">
                {selectedRound.prompts.map((prompt, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-gray-600 text-sm"
                  >
                    <Lightbulb
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: selectedRound.color }}
                    />
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: colors.dark }}
            >
              <MessageSquare
                className="w-5 h-5"
                style={{ color: selectedRound.color }}
              />
              Your Team&apos;s Response
            </h2>
            <textarea
              value={currentSubmission}
              onChange={(e) => setCurrentSubmission(e.target.value)}
              className="w-full h-48 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 transition-all resize-none"
              style={{ "--tw-ring-color": selectedRound.color }}
              placeholder="Collaborate with your team and enter your strategic approach here. Be specific about your value hypothesis, key messages, and how you'll position Genesys against the competition..."
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {currentSubmission.length} characters
              </span>
              {!showWobble && (
                <button
                  onClick={() => setShowWobble(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: `${colors.warning}15`,
                    color: colors.warning,
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Reveal Wobble
                </button>
              )}
            </div>
          </div>

          {showWobble && (
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">
                    {selectedRound.wobble.title}
                  </h3>
                  <p className="text-amber-700 text-sm">
                    {selectedRound.wobble.description}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-sm font-medium text-amber-800 mb-3">
                  {selectedRound.wobble.question}
                </p>
                <textarea
                  value={wobbleResponse}
                  onChange={(e) => setWobbleResponse(e.target.value)}
                  className="w-full h-32 p-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none text-sm"
                  placeholder="How does your team adapt to this new information?"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmission}
            disabled={!currentSubmission.trim() || isSubmitting}
            className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: colors.primary }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                AI Coach is Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit for AI Coaching & Scoring
              </>
            )}
          </button>

          <div className="mt-6 p-4 rounded-lg bg-gray-50">
            <div className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Scoring Criteria
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRound.scoringCriteria.map((criterion, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-gray-200"
                  style={{ color: colors.dark }}
                >
                  {criterion.name} ({criterion.weight}%)
                </span>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Results Screen
  const ResultsScreen = () => {
    if (!selectedRound || !submissions[selectedRound.id]) return null;

    const submission = submissions[selectedRound.id];
    const { score, coaching } = submission;
    const RoundIcon = selectedRound.icon;

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        <header
          className="sticky top-0 z-50 px-6 py-4"
          style={{ backgroundColor: colors.dark }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setCurrentView("rounds")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              <span>Back to Rounds</span>
            </button>
            <div className="text-right">
              <div className="text-white font-medium">{teamInfo.name}</div>
              <div className="text-gray-400 text-sm">Table {teamInfo.table}</div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          <div
            className="rounded-2xl p-8 mb-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.dark} 0%, #1a2744 100%)`,
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ backgroundColor: "rgba(255, 79, 31, 0.2)" }}
            >
              <RoundIcon className="w-4 h-4" style={{ color: colors.primary }} />
              <span
                className="text-sm font-medium"
                style={{ color: colors.primary }}
              >
                Round {selectedRound.id}: {selectedRound.title}
              </span>
            </div>

            <div className="mb-4">
              <div className="text-7xl font-bold text-white mb-2">
                {score.overall}
              </div>
              <div className="text-xl font-medium" style={{ color: colors.primary }}>
                {coaching.scoreInterpretation}
              </div>
            </div>

            <div className="flex justify-center gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-6 h-6"
                  fill={
                    star <= Math.round(score.overall / 20)
                      ? colors.primary
                      : "transparent"
                  }
                  style={{ color: colors.primary }}
                />
              ))}
            </div>

            <p className="text-gray-300 max-w-lg mx-auto">
              {coaching.mainFeedback}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h2
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: colors.dark }}
            >
              <BarChart3
                className="w-5 h-5"
                style={{ color: selectedRound.color }}
              />
              Performance Breakdown
            </h2>
            <div className="space-y-4">
              {selectedRound.scoringCriteria.map((criterion, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.dark }}
                    >
                      {criterion.name}
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: selectedRound.color }}
                    >
                      {score.criteria[criterion.name]}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${score.criteria[criterion.name]}%`,
                        backgroundColor: selectedRound.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {criterion.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
            <div
              className="p-4 flex items-center gap-3"
              style={{ backgroundColor: `${selectedRound.color}10` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: selectedRound.color }}
              >
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold" style={{ color: colors.dark }}>
                  AI Sales Coach
                </div>
                <div className="text-sm text-gray-500">
                  Senior VP of Sales, 25+ years experience
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3
                  className="font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.dark }}
                >
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  What You Did Well
                </h3>
                <ul className="space-y-2">
                  {coaching.strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-600 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3
                  className="font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.dark }}
                >
                  <TrendingUp
                    className="w-4 h-4"
                    style={{ color: colors.primary }}
                  />
                  Areas to Strengthen
                </h3>
                <ul className="space-y-2">
                  {coaching.improvements.map((improvement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-600 text-sm"
                    >
                      <ArrowRight
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: colors.primary }}
                      />
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: colors.light }}
              >
                <h3
                  className="font-semibold mb-3 flex items-center gap-2"
                  style={{ color: colors.dark }}
                >
                  <Lightbulb
                    className="w-4 h-4"
                    style={{ color: colors.warning }}
                  />
                  Coaching Suggestions
                </h3>
                <ul className="space-y-2">
                  {coaching.nextSteps.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-gray-600 text-sm"
                    >
                      <span
                        className="font-bold"
                        style={{ color: selectedRound.color }}
                      >
                        {idx + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setCurrentSubmission(submission.text);
                setWobbleResponse(submission.wobble);
                setShowWobble(!!submission.wobble);
                setCurrentView("round");
              }}
              className="flex-1 py-4 rounded-xl font-semibold border-2 flex items-center justify-center gap-2 transition-all hover:bg-gray-50"
              style={{
                borderColor: selectedRound.color,
                color: selectedRound.color,
              }}
            >
              <RefreshCw className="w-5 h-5" />
              Revise & Resubmit
            </button>
            <button
              onClick={() => setCurrentView("rounds")}
              className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              style={{ backgroundColor: colors.primary }}
            >
              Continue to Next Round
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>
      </div>
    );
  };

  switch (currentView) {
    case "home":
      return <HomeScreen />;
    case "rounds":
      return <RoundsScreen />;
    case "round":
      return <RoundScreen />;
    case "results":
      return <ResultsScreen />;
    default:
      return <HomeScreen />;
  }
}
