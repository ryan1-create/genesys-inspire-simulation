"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Trophy,
  Users,
  Target,
  Brain,
  ChevronRight,
  ChevronLeft,
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
  Building2,
  Clock,
  Play,
  CircleDot,
  Check,
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

// Background patterns for visual interest
const bgPatterns = {
  geometric: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF4F1F' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FF4F1F' fill-opacity='0.08' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072H21.1c-.357-.13-.72-.264-1.088-.402l-1.768-.661C9.64 15.347 3.647 14 0 14v2c5.744 0 9.951-.574 14.85-2H0v-2zm100 4V6c-10.271 0-15.362-1.222-24.629-4.928A115.248 115.248 0 0172.621 0h6.225c2.51.73 5.139 1.691 8.233 2.928C96.592 6.722 100 8 100 8v2c-6.842 0-11.386.542-16.396 2H100v2z' fill='%23FF4F1F' fill-opacity='0.04' fill-rule='evenodd'/%3E%3C/svg%3E")`,
};

// Genesys Logo Component
function GenesysLogo({ size = "default" }) {
  const width = size === "small" ? 120 : 150;
  return (
    <img
      src="/genesys-logo.png"
      alt="Genesys"
      style={{ width: `${width}px`, height: "auto" }}
      className="object-contain"
    />
  );
}

// Progress Steps Component
function ProgressSteps({ steps, currentStep, roundColor }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                idx < currentStep
                  ? "text-white"
                  : idx === currentStep
                  ? "text-white ring-4 ring-opacity-30"
                  : "bg-gray-200 text-gray-500"
              }`}
              style={{
                backgroundColor: idx <= currentStep ? roundColor : undefined,
                ringColor: idx === currentStep ? roundColor : undefined,
              }}
            >
              {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
            </div>
            <span className={`text-xs mt-1 ${idx === currentStep ? "font-medium" : "text-gray-400"}`}>
              {step}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-12 h-0.5 mb-5 ${idx < currentStep ? "" : "bg-gray-200"}`}
              style={{ backgroundColor: idx < currentStep ? roundColor : undefined }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Value Hypothesis Input Component (4 boxes for Round 1)
function ValueHypothesisInput({ values, onChange, disabled }) {
  const fields = [
    { key: "businessPriorities", label: "Business Priorities", placeholder: "What business objectives can we attach to? What are their strategic priorities?", icon: Target },
    { key: "valueGaps", label: "Value Gaps", placeholder: "What are their current challenges – known and potentially not yet considered?", icon: AlertTriangle },
    { key: "vision", label: "Vision", placeholder: "What is an ideal future state in their terms – linking to Genesys capabilities?", icon: Lightbulb },
    { key: "impact", label: "Impact", placeholder: "What would be the personal and business impact of a new approach?", icon: TrendingUp },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {fields.map(({ key, label, placeholder, icon: Icon }) => (
        <div key={key} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <label className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: colors.dark }}>
            <Icon className="w-4 h-4" style={{ color: colors.primary }} />
            {label}
          </label>
          <textarea
            value={values[key] || ""}
            onChange={(e) => onChange({ ...values, [key]: e.target.value })}
            className="w-full h-28 p-3 rounded-lg border border-gray-200 resize-none text-sm"
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
          />
        </div>
      ))}
    </div>
  );
}

// Multiple Choice Wobble Response Component
function WobbleMultipleChoice({ options, selected, onSelect, disabled }) {
  return (
    <div className="space-y-3">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => !disabled && onSelect(idx)}
          disabled={disabled}
          className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
            selected === idx
              ? "border-amber-500 bg-amber-50"
              : "border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50/50"
          } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                selected === idx ? "bg-amber-500 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {selected === idx ? <Check className="w-4 h-4" /> : String.fromCharCode(65 + idx)}
            </div>
            <span className="text-sm text-gray-700">{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// Simulation Round Data
const simulationRounds = [
  {
    id: 1,
    title: "Catch the Whale",
    subtitle: "New Logo Opportunity",
    motion: "Legacy Displacement",
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
    objective: "Displace legacy Avaya platform and position Genesys as the strategic AI-powered CX platform",
    challenge: "Develop a POV to share with Global VP of CX to expand thinking around current gaps and AI-powered CX opportunities",
    useValueHypothesis: true, // Special flag for 4-box input
    prompts: [
      "What business objectives can we attach to?",
      "What are their current challenges – known and potentially not yet considered?",
      "What is an ideal future state in their terms – linking to Genesys capabilities?",
      "What would be the personal and business impact of a new approach?",
    ],
    wobble: {
      title: "New Intelligence",
      description: "Just before the meeting, you learn Salesforce/ServiceNow/AWS is already engaged: Supporting a broader digital transformation initiative, not formally leading CX yet but influencing enterprise platform standards, operating with direct C-suite access (CIO, COO), and actively shaping modernization principles.",
      question: "How does this new information get incorporated into your approach to the meeting?",
    },
    scoringCriteria: [
      { name: "Business Alignment", weight: 25, description: "Connects CX transformation to measurable business outcomes" },
      { name: "Customer Insight", weight: 20, description: "Demonstrates understanding of customer's known and hidden challenges" },
      { name: "Value Articulation", weight: 25, description: "Clearly articulates Genesys differentiation and AI-powered value" },
      { name: "Strategic Positioning", weight: 15, description: "Positions against competitive threats effectively" },
      { name: "Executive Relevance", weight: 15, description: "Frames messaging at appropriate executive level" },
    ],
    icon: Target,
    color: "#FF4F1F",
    bgImage: "linear-gradient(135deg, #0D1630 0%, #1a2744 50%, #243454 100%)",
  },
  {
    id: 2,
    title: "Break Some Glass",
    subtitle: "New Logo Opportunity",
    motion: "CCaaS Replacement",
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
    objective: "Help leadership shift from skepticism to belief that CX improvement impacts business outcomes",
    challenge: "Prepare for a discovery conversation with the VP of Patient Experience to expose reasons behind resistance to change and surface unrecognized value",
    prompts: [
      "Why might the customer prefer the status quo?",
      "What do we need to learn to understand the source of skepticism?",
      "How can we bring attention to things limiting their ability to achieve business outcomes?",
    ],
    wobble: {
      title: "Past Failure Revealed",
      description: "Just before the meeting, you learn the company previously migrated to a CCaaS provider, and leadership viewed the initiative as a failure: The transition was disruptive, promised outcomes not realized, adoption inconsistent across teams.",
      question: "How does this change your discovery approach, tone, and meeting objectives?",
    },
    scoringCriteria: [
      { name: "Discovery Quality", weight: 30, description: "Questions designed to uncover root causes of skepticism" },
      { name: "Trust Building", weight: 25, description: "Approach demonstrates empathy and avoids vendor tropes" },
      { name: "Status Quo Challenge", weight: 20, description: "Tactfully surfaces cost of inaction" },
      { name: "Healthcare Acumen", weight: 15, description: "Demonstrates understanding of healthcare-specific challenges" },
      { name: "Wobble Adaptation", weight: 10, description: "Effectively incorporates new information into strategy" },
    ],
    icon: Zap,
    color: "#10B981",
    bgImage: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
  },
  {
    id: 3,
    title: "Hold the High Ground",
    subtitle: "Account Defense",
    motion: "Expansion",
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
    objective: "Preserve our position by attaching to the broader transformation and defend against AI pure-play alternatives",
    challenge: "Prepare competitive strategy to ask Contact Center Director for a connection to the CIO",
    prompts: [
      "Where is Genesys currently trusted? Where not?",
      "How might Accenture and alternative platforms be redefining decision criteria?",
      "Which relationships must be strengthened beyond Contact Center Director?",
      "What must be true for Genesys to remain a strategic choice as decisions progress?",
    ],
    wobble: {
      title: "AI Pure-Play Threat",
      description: "The Contact Center Director informs us that the AI Committee is recommending a pilot of an AI pure-play: AI competitor is emphasizing cost takeout, Genesys is no longer being viewed as 'good enough', influence is being shifted away from the Contact Center org.",
      question: "What actions can you take to defend our position and secure the renewal?",
    },
    scoringCriteria: [
      { name: "Competitive Defense", weight: 25, description: "Articulates clear differentiation against AI pure-plays" },
      { name: "Relationship Strategy", weight: 25, description: "Identifies path to strengthen executive relationships" },
      { name: "Platform Positioning", weight: 20, description: "Elevates Genesys from tactical to strategic" },
      { name: "Transformation Alignment", weight: 20, description: "Connects to broader digital transformation narrative" },
      { name: "Urgency & Action", weight: 10, description: "Demonstrates appropriate urgency and clear next steps" },
    ],
    icon: Shield,
    color: "#3B82F6",
    bgImage: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)",
  },
  {
    id: 4,
    title: "Capture More Share",
    subtitle: "Account Expansion",
    motion: "Pure-Play AI",
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
    objective: "Shore up executive confidence in our platform and proposed roadmap",
    challenge: "Identify and address executive decision risks in favor of our CX platform expansion initiative",
    prompts: [
      "Which executive concerns are most likely to stall or block global expansion?",
      "How can we use the EMEA success as proof?",
      "How can we leverage our champion(s)?",
      "How can the elements of the expansion be phased out?",
      "What trade-offs can we proactively propose?",
    ],
    wobble: {
      title: "Budget Cut Directive",
      description: "The CFO has directed the team to reduce the investment by 30% while still delivering the target outcomes. CFO is looking specifically for trade-offs and impact on bottom-line.",
      question: "How can we adapt our approach and continue to drive decision momentum?",
    },
    scoringCriteria: [
      { name: "Executive Risk Mitigation", weight: 25, description: "Proactively addresses CFO/CIO concerns" },
      { name: "Proof Point Leverage", weight: 20, description: "Effectively uses EMEA success as evidence" },
      { name: "Financial Acumen", weight: 25, description: "Presents compelling business case and trade-offs" },
      { name: "Champion Activation", weight: 15, description: "Strategy to leverage internal advocates" },
      { name: "Flexibility & Phasing", weight: 15, description: "Demonstrates creative approach to scope/timeline" },
    ],
    icon: Rocket,
    color: "#8B5CF6",
    bgImage: "linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #6D28D9 100%)",
  },
];

// Local Storage Keys
const STORAGE_KEYS = {
  TEAM_INFO: "genesys_sim_team",
  LEADERBOARD: "genesys_sim_leaderboard",
  PROGRESS: "genesys_sim_progress",
};

export default function GenesysSimulation() {
  // Team & Session State
  const [currentView, setCurrentView] = useState("home");
  const [teamName, setTeamName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  // Round Navigation State
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundPhase, setRoundPhase] = useState("intro"); // intro, work, feedback1, wobble, feedback2, discussion

  // Submission State
  const [submissions, setSubmissions] = useState({});
  const [currentSubmission, setCurrentSubmission] = useState("");
  const [valueHypothesis, setValueHypothesis] = useState({});
  const [wobbleChoice, setWobbleChoice] = useState(null);
  const [wobbleOptions, setWobbleOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem(STORAGE_KEYS.TEAM_INFO);
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    const savedLeaderboard = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);

    if (savedTeam) {
      const team = JSON.parse(savedTeam);
      setTeamName(team.name);
      setTableNumber(team.table);
      setRoomNumber(team.room);
    }

    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSubmissions(progress.submissions || {});
      setCurrentRoundIndex(progress.currentRound || 0);
    }

    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Save progress
  const saveProgress = useCallback((newSubmissions, roundIdx) => {
    const progress = { submissions: newSubmissions, currentRound: roundIdx };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }, []);

  // Save team info
  const saveTeamInfo = useCallback((name, table, room) => {
    const team = { name, table, room };
    localStorage.setItem(STORAGE_KEYS.TEAM_INFO, JSON.stringify(team));
  }, []);

  // Update leaderboard
  const updateLeaderboard = useCallback((name, table, room, score, roundId) => {
    setLeaderboard(prev => {
      const teamKey = `${room}-${table}-${name}`;
      const existing = prev.find(t => `${t.room}-${t.table}-${t.team}` === teamKey);

      let updated;
      if (existing) {
        updated = prev.map(t => {
          if (`${t.room}-${t.table}-${t.team}` === teamKey) {
            const newRounds = { ...t.rounds, [roundId]: score };
            const total = Object.values(newRounds).reduce((sum, s) => sum + s, 0);
            return { ...t, rounds: newRounds, totalScore: total };
          }
          return t;
        });
      } else {
        updated = [...prev, {
          team: name,
          table,
          room,
          rounds: { [roundId]: score },
          totalScore: score,
        }];
      }

      updated.sort((a, b) => b.totalScore - a.totalScore);
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handle team registration
  const handleTeamSubmit = useCallback(() => {
    if (teamName.trim() && tableNumber.trim() && roomNumber.trim()) {
      saveTeamInfo(teamName, tableNumber, roomNumber);
      setCurrentView("simulation");
      setRoundPhase("intro");
    }
  }, [teamName, tableNumber, roomNumber, saveTeamInfo]);

  // Handle resume session
  const handleResumeSession = useCallback(() => {
    setCurrentView("simulation");
  }, []);

  // Get current round
  const currentRound = simulationRounds[currentRoundIndex];
  const RoundIcon = currentRound?.icon;

  // Phase steps for progress indicator
  const phaseSteps = ["Intro", "Submit", "Feedback", "Wobble", "Final", "Discuss"];
  const phaseToStep = { intro: 0, work: 1, feedback1: 2, wobble: 3, feedback2: 4, discussion: 5 };

  // Handle initial submission
  const handleInitialSubmission = useCallback(async () => {
    const submissionText = currentRound.useValueHypothesis
      ? `BUSINESS PRIORITIES:\n${valueHypothesis.businessPriorities || ""}\n\nVALUE GAPS:\n${valueHypothesis.valueGaps || ""}\n\nVISION:\n${valueHypothesis.vision || ""}\n\nIMPACT:\n${valueHypothesis.impact || ""}`
      : currentSubmission;

    if (!submissionText.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: submissionText,
          phase: "initial",
          round: {
            id: currentRound.id,
            title: currentRound.title,
            subtitle: currentRound.subtitle,
            customer: currentRound.customer,
            context: currentRound.context,
            objective: currentRound.objective,
            challenge: currentRound.challenge,
            wobble: currentRound.wobble,
            scoringCriteria: currentRound.scoringCriteria,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI scoring");

      const result = await response.json();

      setSubmissions(prev => {
        const updated = {
          ...prev,
          [currentRound.id]: {
            text: submissionText,
            valueHypothesis: currentRound.useValueHypothesis ? valueHypothesis : null,
            initialScore: result.score,
            initialCoaching: result.coaching,
            submittedAt: new Date().toISOString(),
          },
        };
        saveProgress(updated, currentRoundIndex);
        return updated;
      });

      // Generate wobble options
      setWobbleOptions(result.wobbleOptions || [
        "Reframe our approach to position as complementary to the existing platforms",
        "Request a joint meeting with both the CX team and the transformation committee",
        "Develop a competitive analysis showing integration advantages",
        "Propose a proof-of-concept that demonstrates unique AI capabilities",
      ]);

      setRoundPhase("feedback1");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRound, currentSubmission, valueHypothesis, currentRoundIndex, saveProgress]);

  // Handle wobble submission
  const handleWobbleSubmission = useCallback(async () => {
    if (wobbleChoice === null) return;

    setIsSubmitting(true);
    setError(null);

    const submission = submissions[currentRound.id];
    const wobbleResponseText = wobbleOptions[wobbleChoice];

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: submission.text,
          wobbleResponse: wobbleResponseText,
          phase: "final",
          round: {
            id: currentRound.id,
            title: currentRound.title,
            subtitle: currentRound.subtitle,
            customer: currentRound.customer,
            context: currentRound.context,
            objective: currentRound.objective,
            challenge: currentRound.challenge,
            wobble: currentRound.wobble,
            scoringCriteria: currentRound.scoringCriteria,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI scoring");

      const result = await response.json();

      setSubmissions(prev => {
        const updated = {
          ...prev,
          [currentRound.id]: {
            ...prev[currentRound.id],
            wobbleChoice,
            wobbleResponse: wobbleResponseText,
            finalScore: result.score,
            finalCoaching: result.coaching,
          },
        };
        saveProgress(updated, currentRoundIndex);
        return updated;
      });

      updateLeaderboard(teamName, tableNumber, roomNumber, result.score.overall, currentRound.id);
      setRoundPhase("feedback2");
    } catch (err) {
      console.error("Wobble submission error:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRound, wobbleChoice, wobbleOptions, submissions, teamName, tableNumber, roomNumber, currentRoundIndex, saveProgress, updateLeaderboard]);

  // Navigate to next round
  const handleNextRound = useCallback(() => {
    if (currentRoundIndex < simulationRounds.length - 1) {
      setCurrentRoundIndex(prev => prev + 1);
      setRoundPhase("intro");
      setCurrentSubmission("");
      setValueHypothesis({});
      setWobbleChoice(null);
      setWobbleOptions([]);
    }
  }, [currentRoundIndex]);

  // HOME SCREEN
  if (currentView === "home") {
    const hasSavedSession = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.TEAM_INFO);

    return (
      <div className="min-h-screen flex flex-col" style={{ background: colors.dark, backgroundImage: bgPatterns.geometric }}>
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-purple-500/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

          <header className="relative z-10 p-6">
            <GenesysLogo />
          </header>

          <main className="relative z-10 flex-1 flex items-center justify-center p-6 pb-12">
            <div className="max-w-2xl w-full">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: "rgba(255, 79, 31, 0.15)" }}>
                  <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                  <span className="text-sm font-medium" style={{ color: colors.primary }}>FY27 INSPIRE • DAY 3</span>
                </div>
                <h1 className="text-6xl font-bold text-white mb-4">
                  Sales<br />
                  <span style={{ color: colors.primary }}>Simulation</span>
                </h1>
                <p className="text-xl text-gray-300 mb-2">Team Challenge Experience</p>
                <p className="text-gray-400">Compete. Collaborate. Conquer.</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: colors.primary }} />
                  Register Your Team
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
                      <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                        placeholder="Room #"
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Table Number</label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                        placeholder="Table #"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      placeholder="Enter your team name"
                      autoComplete="off"
                    />
                  </div>
                  <button
                    onClick={handleTeamSubmit}
                    disabled={!teamName.trim() || !tableNumber.trim() || !roomNumber.trim()}
                    className="w-full py-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Play className="w-5 h-5" />
                    Start Simulation
                  </button>

                  {hasSavedSession && (
                    <button
                      onClick={handleResumeSession}
                      className="w-full py-3 rounded-lg font-medium text-gray-300 border border-white/20 hover:bg-white/5 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resume Previous Session
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-sm text-gray-400">Rounds</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>AI</div>
                  <div className="text-sm text-gray-400">Coached</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                  <div className="text-2xl font-bold text-white">
                    <Trophy className="w-6 h-6 mx-auto" style={{ color: colors.warning }} />
                  </div>
                  <div className="text-sm text-gray-400">Prizes</div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // SIMULATION VIEW
  if (currentView === "simulation" && currentRound) {
    const submission = submissions[currentRound.id];

    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.light }}>
        {/* Header */}
        <header className="sticky top-0 z-50 px-6 py-3" style={{ backgroundColor: colors.dark }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GenesysLogo size="small" />
              <div className="h-8 w-px bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${currentRound.color}30`, color: currentRound.color }}>
                  Round {currentRound.id}/4
                </span>
                <span className="text-white font-semibold">{currentRound.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className="text-white font-medium text-sm">{teamName}</div>
                <div className="text-gray-400 text-xs">Room {roomNumber} • Table {tableNumber}</div>
              </div>
              <button onClick={() => setShowLeaderboard(true)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                <Trophy className="w-5 h-5" style={{ color: colors.primary }} />
              </button>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-100 py-4">
          <div className="max-w-5xl mx-auto px-6">
            <ProgressSteps steps={phaseSteps} currentStep={phaseToStep[roundPhase]} roundColor={currentRound.color} />
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto p-6">

          {/* INTRO PHASE */}
          {roundPhase === "intro" && (
            <div className="space-y-6">
              {/* Hero Card */}
              <div className="rounded-2xl overflow-hidden" style={{ background: currentRound.bgImage }}>
                <div className="p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20">{currentRound.motion}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20">{currentRound.subtitle}</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{currentRound.title}</h1>
                    <p className="text-white/80 text-lg">{currentRound.description}</p>
                  </div>
                </div>
              </div>

              {/* Customer Profile */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                  <Building2 className="w-5 h-5" style={{ color: currentRound.color }} />
                  Customer Profile
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Company</div>
                    <div className="font-semibold text-sm" style={{ color: colors.dark }}>{currentRound.customer.name}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Industry</div>
                    <div className="font-semibold text-sm" style={{ color: colors.dark }}>{currentRound.customer.industry.split(":")[0]}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Revenue</div>
                    <div className="font-semibold text-sm" style={{ color: colors.dark }}>{currentRound.customer.revenue}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">Current Solution</div>
                    <div className="font-semibold text-sm" style={{ color: colors.dark }}>{currentRound.customer.currentSolution}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 px-4">{currentRound.customer.size}</div>
              </div>

              {/* Context & Challenge */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                    <Brain className="w-5 h-5" style={{ color: currentRound.color }} />
                    Situation Context
                  </h2>
                  <ul className="space-y-2">
                    {currentRound.context.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: currentRound.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <div className="rounded-xl p-6" style={{ backgroundColor: `${currentRound.color}10`, borderLeft: `4px solid ${currentRound.color}` }}>
                    <h2 className="text-lg font-semibold mb-2" style={{ color: colors.dark }}>Selling Objective</h2>
                    <p className="text-gray-700 text-sm">{currentRound.objective}</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: colors.dark }}>
                      <Flag className="w-5 h-5" style={{ color: currentRound.color }} />
                      Team Challenge
                    </h2>
                    <p className="text-gray-700 text-sm">{currentRound.challenge}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRoundPhase("work")}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: currentRound.color }}
              >
                Begin Team Work
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* WORK PHASE */}
          {roundPhase === "work" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                  <MessageSquare className="w-5 h-5" style={{ color: currentRound.color }} />
                  {currentRound.useValueHypothesis ? "Build Your Value Hypothesis" : "Your Team's Response"}
                </h2>

                {/* Prompts Reference */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm font-medium text-gray-500 mb-2">Consider These Questions:</div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {currentRound.prompts.map((prompt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: currentRound.color }} />
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input Area */}
                {currentRound.useValueHypothesis ? (
                  <ValueHypothesisInput
                    values={valueHypothesis}
                    onChange={setValueHypothesis}
                    disabled={isSubmitting}
                  />
                ) : (
                  <textarea
                    value={currentSubmission}
                    onChange={(e) => setCurrentSubmission(e.target.value)}
                    className="w-full h-56 p-4 rounded-lg border border-gray-200 resize-none"
                    placeholder="Collaborate with your team and enter your strategic approach here. Be specific about your value hypothesis, key messages, and how you'll position Genesys..."
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setRoundPhase("intro")}
                  className="px-6 py-4 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleInitialSubmission}
                  disabled={isSubmitting || (currentRound.useValueHypothesis ? !Object.values(valueHypothesis).some(v => v?.trim()) : !currentSubmission.trim())}
                  className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: currentRound.color }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      AI Coach is Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit for AI Coaching
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* FEEDBACK 1 PHASE */}
          {roundPhase === "feedback1" && submission?.initialScore && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="rounded-2xl p-8 text-center" style={{ background: currentRound.bgImage }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/20">
                  <span className="text-sm font-medium text-white">Initial Submission Score</span>
                </div>
                <div className="text-7xl font-bold text-white mb-2">{submission.initialScore.overall}</div>
                <div className="text-xl font-medium text-white/80">{submission.initialCoaching.scoreInterpretation}</div>
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6" fill={star <= Math.round(submission.initialScore.overall / 20) ? "#FFD700" : "transparent"} stroke="#FFD700" />
                  ))}
                </div>
              </div>

              {/* Coaching Feedback */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="p-4 flex items-center gap-3" style={{ backgroundColor: `${currentRound.color}10` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: currentRound.color }}>
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.dark }}>AI Sales Coach</div>
                    <div className="text-sm text-gray-500">Initial Feedback</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6">{submission.initialCoaching.mainFeedback}</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-700">
                        <ThumbsUp className="w-4 h-4" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {submission.initialCoaching.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.primary }}>
                        <TrendingUp className="w-4 h-4" />
                        Areas to Strengthen
                      </h3>
                      <ul className="space-y-2">
                        {submission.initialCoaching.improvements.map((i, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                            {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRoundPhase("wobble")}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.warning }}
              >
                <AlertTriangle className="w-5 h-5" />
                Continue to Wobble Challenge
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* WOBBLE PHASE */}
          {roundPhase === "wobble" && (
            <div className="space-y-6">
              {/* Wobble Alert */}
              <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-600 mb-1">NEW INTELLIGENCE</div>
                    <h2 className="text-xl font-bold text-amber-800 mb-2">{currentRound.wobble.title}</h2>
                    <p className="text-amber-700">{currentRound.wobble.description}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-4">{currentRound.wobble.question}</h3>
                  <p className="text-sm text-gray-500 mb-4">Select the best path forward for your team:</p>
                  <WobbleMultipleChoice
                    options={wobbleOptions}
                    selected={wobbleChoice}
                    onSelect={setWobbleChoice}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setRoundPhase("feedback1")}
                  className="px-6 py-4 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleWobbleSubmission}
                  disabled={wobbleChoice === null || isSubmitting}
                  className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.warning }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      AI Coach is Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Wobble Response
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* FEEDBACK 2 PHASE */}
          {roundPhase === "feedback2" && submission?.finalScore && (
            <div className="space-y-6">
              {/* Final Score Card */}
              <div className="rounded-2xl p-8 text-center" style={{ background: currentRound.bgImage }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-white/20">
                  <Trophy className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white">Final Round Score</span>
                </div>
                <div className="text-7xl font-bold text-white mb-2">{submission.finalScore.overall}</div>
                <div className="text-xl font-medium text-white/80">{submission.finalCoaching.scoreInterpretation}</div>
                <div className="flex justify-center gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6" fill={star <= Math.round(submission.finalScore.overall / 20) ? "#FFD700" : "transparent"} stroke="#FFD700" />
                  ))}
                </div>
              </div>

              {/* Score Comparison */}
              {submission.initialScore && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold mb-4" style={{ color: colors.dark }}>Score Progression</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 text-center p-4 rounded-lg bg-gray-50">
                      <div className="text-sm text-gray-500 mb-1">Initial</div>
                      <div className="text-2xl font-bold" style={{ color: colors.dark }}>{submission.initialScore.overall}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                    <div className="flex-1 text-center p-4 rounded-lg" style={{ backgroundColor: `${currentRound.color}10` }}>
                      <div className="text-sm text-gray-500 mb-1">Final</div>
                      <div className="text-2xl font-bold" style={{ color: currentRound.color }}>{submission.finalScore.overall}</div>
                    </div>
                    <div className="flex-1 text-center p-4 rounded-lg bg-green-50">
                      <div className="text-sm text-gray-500 mb-1">Change</div>
                      <div className="text-2xl font-bold text-green-600">
                        {submission.finalScore.overall - submission.initialScore.overall >= 0 ? "+" : ""}
                        {submission.finalScore.overall - submission.initialScore.overall}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                  <BarChart3 className="w-5 h-5" style={{ color: currentRound.color }} />
                  Performance Breakdown
                </h2>
                <div className="space-y-4">
                  {currentRound.scoringCriteria.map((criterion, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium" style={{ color: colors.dark }}>{criterion.name}</span>
                        <span className="text-sm font-bold" style={{ color: currentRound.color }}>
                          {submission.finalScore.criteria[criterion.name]}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${submission.finalScore.criteria[criterion.name]}%`, backgroundColor: currentRound.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Coaching */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="p-4 flex items-center gap-3" style={{ backgroundColor: `${currentRound.color}10` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: currentRound.color }}>
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: colors.dark }}>AI Sales Coach</div>
                    <div className="text-sm text-gray-500">Final Analysis</div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6">{submission.finalCoaching.mainFeedback}</p>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.light }}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: colors.dark }}>
                      <Lightbulb className="w-4 h-4" style={{ color: colors.warning }} />
                      Key Takeaways
                    </h3>
                    <ul className="space-y-2">
                      {submission.finalCoaching.nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                          <span className="font-bold" style={{ color: currentRound.color }}>{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setRoundPhase("discussion")}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: currentRound.color }}
              >
                Continue to Team Discussion
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* DISCUSSION PHASE */}
          {roundPhase === "discussion" && (
            <div className="space-y-6">
              <div className="rounded-2xl p-8 text-center" style={{ background: currentRound.bgImage }}>
                <Users className="w-12 h-12 text-white/80 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-white mb-2">Team Discussion</h1>
                <p className="text-white/80">Role Alignment & Teaming Prompts</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4" style={{ color: colors.dark }}>Discussion Questions</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: currentRound.color }}>
                    <p className="font-medium text-gray-800">As the AE "Quarterback," how would you coordinate with your CS, SE, and Partner resources on this opportunity?</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: currentRound.color }}>
                    <p className="font-medium text-gray-800">What unique value could each role bring to help navigate the wobble scenario?</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: currentRound.color }}>
                    <p className="font-medium text-gray-800">What lessons from this round will you apply to future customer conversations?</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                  <h3 className="font-semibold text-amber-800">Discussion Time</h3>
                </div>
                <p className="text-amber-700 text-sm">Take 5 minutes to discuss these questions with your team. Your facilitator will guide the room debrief.</p>
              </div>

              <div className="flex gap-4">
                {currentRoundIndex < simulationRounds.length - 1 ? (
                  <button
                    onClick={handleNextRound}
                    className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Continue to Round {currentRoundIndex + 2}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="flex-1 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Trophy className="w-5 h-5" />
                    View Final Leaderboard
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowLeaderboard(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100" style={{ backgroundColor: colors.dark }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6" style={{ color: colors.primary }} />
                    <div>
                      <h2 className="text-xl font-bold text-white">Live Leaderboard</h2>
                      <p className="text-sm text-gray-400">Room {roomNumber}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowLeaderboard(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh]">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No scores yet. Be the first to submit!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.filter(t => t.room === roomNumber).map((team, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: idx < 3 ? `${colors.primary}08` : "#f9fafb" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : "#e5e7eb", color: idx < 3 ? "#1a1a1a" : "#666" }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold" style={{ color: colors.dark }}>{team.team}</div>
                          <div className="text-sm text-gray-500">Table {team.table}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: colors.primary }}>{team.totalScore}</div>
                          <div className="text-xs text-gray-500">{Object.keys(team.rounds).length} round{Object.keys(team.rounds).length !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
