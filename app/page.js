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

// Score Display Component for Header
function ScoreDisplay({ submissions, rounds }) {
  const completedRounds = Object.keys(submissions).filter(id => submissions[id]?.finalScore);
  const totalScore = completedRounds.reduce((sum, id) => sum + (submissions[id]?.finalScore?.overall || 0), 0);

  if (completedRounds.length === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10">
      <Trophy className="w-4 h-4" style={{ color: colors.primary }} />
      <span className="text-white font-bold">{totalScore}</span>
      <span className="text-gray-400 text-xs">({completedRounds.length}/4)</span>
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

// Simulation Round Data with industry images
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
    useValueHypothesis: true,
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
    bgGradient: "linear-gradient(135deg, #0D1630 0%, #1a2744 50%, #243454 100%)",
    // Industry image - upload to public/industries/financial.jpg
    industryImage: "/industries/financial.jpg",
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
    bgGradient: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #047857 100%)",
    industryImage: "/industries/healthcare.jpg",
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
    bgGradient: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)",
    industryImage: "/industries/retail.jpg",
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
    bgGradient: "linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #6D28D9 100%)",
    industryImage: "/industries/logistics.jpg",
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
  const [roundPhase, setRoundPhase] = useState("intro");

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
      // Restore round and phase position
      if (progress.currentRound !== undefined) {
        setCurrentRoundIndex(progress.currentRound);
      }
      if (progress.currentPhase) {
        setRoundPhase(progress.currentPhase);
      }
    }

    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Save progress - now includes phase
  const saveProgress = useCallback((newSubmissions, roundIdx, phase) => {
    const progress = {
      submissions: newSubmissions,
      currentRound: roundIdx,
      currentPhase: phase
    };
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

  // Handle resume session - restore exact position
  const handleResumeSession = useCallback(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSubmissions(progress.submissions || {});
      setCurrentRoundIndex(progress.currentRound || 0);
      setRoundPhase(progress.currentPhase || "intro");

      // Restore wobble options if we're in wobble phase
      const currentRoundId = simulationRounds[progress.currentRound || 0]?.id;
      if (progress.currentPhase === "wobble" && progress.submissions[currentRoundId]?.wobbleOptions) {
        setWobbleOptions(progress.submissions[currentRoundId].wobbleOptions);
      }
    }
    setCurrentView("simulation");
  }, []);

  // Get current round
  const currentRound = simulationRounds[currentRoundIndex];

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

      const newWobbleOptions = result.wobbleOptions || [
        "Reframe our approach to position as complementary to the existing platforms",
        "Request a joint meeting with both the CX team and the transformation committee",
        "Develop a competitive analysis showing integration advantages",
        "Propose a proof-of-concept that demonstrates unique AI capabilities",
      ];

      setSubmissions(prev => {
        const updated = {
          ...prev,
          [currentRound.id]: {
            text: submissionText,
            valueHypothesis: currentRound.useValueHypothesis ? valueHypothesis : null,
            initialScore: result.score,
            initialCoaching: result.coaching,
            wobbleOptions: newWobbleOptions,
            submittedAt: new Date().toISOString(),
          },
        };
        saveProgress(updated, currentRoundIndex, "feedback1");
        return updated;
      });

      setWobbleOptions(newWobbleOptions);
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
        saveProgress(updated, currentRoundIndex, "feedback2");
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
      const nextRoundIndex = currentRoundIndex + 1;
      setCurrentRoundIndex(nextRoundIndex);
      setRoundPhase("intro");
      setCurrentSubmission("");
      setValueHypothesis({});
      setWobbleChoice(null);
      setWobbleOptions([]);
      saveProgress(submissions, nextRoundIndex, "intro");
    }
  }, [currentRoundIndex, submissions, saveProgress]);

  // Navigate phases with save
  const goToPhase = useCallback((phase) => {
    setRoundPhase(phase);
    saveProgress(submissions, currentRoundIndex, phase);
  }, [submissions, currentRoundIndex, saveProgress]);

  // HOME SCREEN - Simplified
  if (currentView === "home") {
    const hasSavedSession = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.TEAM_INFO);

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{
          background: `linear-gradient(135deg, ${colors.dark} 0%, #1a2744 50%, #243454 100%)`,
        }}
      >
        <div className="w-full max-w-md">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <GenesysLogo />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Sales Simulation</h1>
            <p className="text-gray-400">FY27 INSPIRE • Day 3</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Room #</label>
                  <input
                    type="text"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm"
                    placeholder="Room"
                    autoComplete="off"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Table #</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm"
                    placeholder="Table"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm"
                  placeholder="Enter team name"
                  autoComplete="off"
                />
              </div>
              <button
                onClick={handleTeamSubmit}
                disabled={!teamName.trim() || !tableNumber.trim() || !roomNumber.trim()}
                className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.primary }}
              >
                <Play className="w-5 h-5" />
                Start
              </button>

              {hasSavedSession && (
                <button
                  onClick={handleResumeSession}
                  className="w-full py-2.5 rounded-lg font-medium text-gray-300 border border-white/20 hover:bg-white/5 flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resume Session
                </button>
              )}
            </div>
          </div>
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
        <header className="sticky top-0 z-50 px-4 py-2" style={{ backgroundColor: colors.dark }}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GenesysLogo size="small" />
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded-full hidden sm:inline-block" style={{ backgroundColor: `${currentRound.color}30`, color: currentRound.color }}>
                  Round {currentRound.id}/4
                </span>
                <span className="text-white font-medium text-sm">{currentRound.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ScoreDisplay submissions={submissions} rounds={simulationRounds} />
              <div className="text-right hidden sm:block">
                <div className="text-white font-medium text-xs">{teamName}</div>
                <div className="text-gray-400 text-xs">R{roomNumber} • T{tableNumber}</div>
              </div>
              <button onClick={() => setShowLeaderboard(true)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                <Trophy className="w-4 h-4" style={{ color: colors.primary }} />
              </button>
            </div>
          </div>
        </header>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-100 py-3">
          <div className="max-w-5xl mx-auto px-4">
            <ProgressSteps steps={phaseSteps} currentStep={phaseToStep[roundPhase]} roundColor={currentRound.color} />
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto p-4 sm:p-6">

          {/* INTRO PHASE */}
          {roundPhase === "intro" && (
            <div className="space-y-6">
              {/* Hero Card with Industry Image */}
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{ minHeight: "200px" }}
              >
                {/* Background Image Layer */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentRound.industryImage})`,
                  }}
                />
                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `${currentRound.bgGradient.replace('100%)', '100%), rgba(0,0,0,0.4)')}`,
                  }}
                />
                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">{currentRound.motion}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm">{currentRound.subtitle}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2">{currentRound.title}</h1>
                  <p className="text-white/80 text-lg">{currentRound.description}</p>
                </div>
              </div>

              {/* Customer Profile */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                  <Building2 className="w-5 h-5" style={{ color: currentRound.color }} />
                  {currentRound.customer.name}
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Industry</div>
                    <div className="font-medium text-sm" style={{ color: colors.dark }}>{currentRound.customer.industry.split(":")[0]}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Revenue</div>
                    <div className="font-medium text-sm" style={{ color: colors.dark }}>{currentRound.customer.revenue}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Current Solution</div>
                    <div className="font-medium text-sm" style={{ color: colors.dark }}>{currentRound.customer.currentSolution}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <div className="text-xs text-gray-500">Size</div>
                    <div className="font-medium text-sm" style={{ color: colors.dark }}>{currentRound.customer.size.split("|")[0].trim()}</div>
                  </div>
                </div>
              </div>

              {/* Context & Challenge */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: colors.dark }}>
                    <Brain className="w-4 h-4" style={{ color: currentRound.color }} />
                    Situation Context
                  </h2>
                  <ul className="space-y-2">
                    {currentRound.context.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: currentRound.color }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl p-5" style={{ backgroundColor: `${currentRound.color}10`, borderLeft: `4px solid ${currentRound.color}` }}>
                    <h2 className="text-base font-semibold mb-2" style={{ color: colors.dark }}>Selling Objective</h2>
                    <p className="text-gray-700 text-sm">{currentRound.objective}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h2 className="text-base font-semibold mb-2 flex items-center gap-2" style={{ color: colors.dark }}>
                      <Flag className="w-4 h-4" style={{ color: currentRound.color }} />
                      Team Challenge
                    </h2>
                    <p className="text-gray-700 text-sm">{currentRound.challenge}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => goToPhase("work")}
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
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                  <MessageSquare className="w-5 h-5" style={{ color: currentRound.color }} />
                  {currentRound.useValueHypothesis ? "Build Your Value Hypothesis" : "Your Team's Response"}
                </h2>

                {/* Prompts Reference */}
                <div className="bg-gray-50 rounded-lg p-4 mb-5">
                  <div className="text-sm font-medium text-gray-500 mb-2">Consider:</div>
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
                    className="w-full h-48 p-4 rounded-lg border border-gray-200 resize-none"
                    placeholder="Collaborate with your team and enter your strategic approach here..."
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

              <div className="flex gap-3">
                <button
                  onClick={() => goToPhase("intro")}
                  className="px-5 py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleInitialSubmission}
                  disabled={isSubmitting || (currentRound.useValueHypothesis ? !Object.values(valueHypothesis).some(v => v?.trim()) : !currentSubmission.trim())}
                  className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: currentRound.color }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing...
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
              <div className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden" style={{ background: currentRound.bgGradient }}>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 bg-white/20 backdrop-blur-sm">
                    <span className="text-sm font-medium text-white">Initial Score</span>
                  </div>
                  <div className="text-6xl sm:text-7xl font-bold text-white mb-2">{submission.initialScore.overall}</div>
                  <div className="text-lg font-medium text-white/80">{submission.initialCoaching.scoreInterpretation}</div>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5" fill={star <= Math.round(submission.initialScore.overall / 20) ? "#FFD700" : "transparent"} stroke="#FFD700" />
                    ))}
                  </div>
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
                <div className="p-5">
                  <p className="text-gray-700 mb-5">{submission.initialCoaching.mainFeedback}</p>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-700 text-sm">
                        <ThumbsUp className="w-4 h-4" />
                        Strengths
                      </h3>
                      <ul className="space-y-1.5">
                        {submission.initialCoaching.strengths.map((s, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm" style={{ color: colors.primary }}>
                        <TrendingUp className="w-4 h-4" />
                        Areas to Strengthen
                      </h3>
                      <ul className="space-y-1.5">
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
                onClick={() => goToPhase("wobble")}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colors.warning }}
              >
                <AlertTriangle className="w-5 h-5" />
                Continue to Wobble
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* WOBBLE PHASE */}
          {roundPhase === "wobble" && (
            <div className="space-y-6">
              {/* Wobble Alert */}
              <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-600 mb-1">NEW INTELLIGENCE</div>
                    <h2 className="text-lg font-bold text-amber-800 mb-2">{currentRound.wobble.title}</h2>
                    <p className="text-amber-700 text-sm">{currentRound.wobble.description}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-3">{currentRound.wobble.question}</h3>
                  <p className="text-sm text-gray-500 mb-4">Select the best path forward:</p>
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

              <div className="flex gap-3">
                <button
                  onClick={() => goToPhase("feedback1")}
                  className="px-5 py-3 rounded-xl font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={handleWobbleSubmission}
                  disabled={wobbleChoice === null || isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: colors.warning }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Response
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
              <div className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden" style={{ background: currentRound.bgGradient }}>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 bg-white/20 backdrop-blur-sm">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium text-white">Final Score</span>
                  </div>
                  <div className="text-6xl sm:text-7xl font-bold text-white mb-2">{submission.finalScore.overall}</div>
                  <div className="text-lg font-medium text-white/80">{submission.finalCoaching.scoreInterpretation}</div>
                  <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5" fill={star <= Math.round(submission.finalScore.overall / 20) ? "#FFD700" : "transparent"} stroke="#FFD700" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Score Comparison */}
              {submission.initialScore && (
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="font-semibold mb-4 text-sm" style={{ color: colors.dark }}>Score Progression</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-center p-3 rounded-lg bg-gray-50">
                      <div className="text-xs text-gray-500 mb-1">Initial</div>
                      <div className="text-xl font-bold" style={{ color: colors.dark }}>{submission.initialScore.overall}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex-1 text-center p-3 rounded-lg" style={{ backgroundColor: `${currentRound.color}10` }}>
                      <div className="text-xs text-gray-500 mb-1">Final</div>
                      <div className="text-xl font-bold" style={{ color: currentRound.color }}>{submission.finalScore.overall}</div>
                    </div>
                    <div className="flex-1 text-center p-3 rounded-lg bg-green-50">
                      <div className="text-xs text-gray-500 mb-1">Change</div>
                      <div className={`text-xl font-bold ${submission.finalScore.overall >= submission.initialScore.overall ? 'text-green-600' : 'text-red-600'}`}>
                        {submission.finalScore.overall - submission.initialScore.overall >= 0 ? "+" : ""}
                        {submission.finalScore.overall - submission.initialScore.overall}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Breakdown */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2" style={{ color: colors.dark }}>
                  <BarChart3 className="w-4 h-4" style={{ color: currentRound.color }} />
                  Performance Breakdown
                </h2>
                <div className="space-y-3">
                  {currentRound.scoringCriteria.map((criterion, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium" style={{ color: colors.dark }}>{criterion.name}</span>
                        <span className="text-sm font-bold" style={{ color: currentRound.color }}>
                          {submission.finalScore.criteria[criterion.name]}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
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
                <div className="p-5">
                  <p className="text-gray-700 mb-5">{submission.finalCoaching.mainFeedback}</p>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.light }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm" style={{ color: colors.dark }}>
                      <Lightbulb className="w-4 h-4" style={{ color: colors.warning }} />
                      Key Takeaways
                    </h3>
                    <ul className="space-y-1.5">
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
                onClick={() => goToPhase("discussion")}
                className="w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: currentRound.color }}
              >
                Continue to Discussion
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* DISCUSSION PHASE */}
          {roundPhase === "discussion" && (
            <div className="space-y-6">
              <div className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden" style={{ background: currentRound.bgGradient }}>
                <Users className="w-10 h-10 text-white/80 mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-white mb-1">Team Discussion</h1>
                <p className="text-white/80 text-sm">Role Alignment & Teaming</p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-base font-semibold mb-4" style={{ color: colors.dark }}>Discussion Questions</h2>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: currentRound.color }}>
                    <p className="font-medium text-gray-800 text-sm">As the AE "Quarterback," how would you coordinate with your CS, SE, and Partner resources on this opportunity?</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: currentRound.color }}>
                    <p className="font-medium text-gray-800 text-sm">What unique value could each role bring to help navigate the wobble scenario?</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderLeftColor: currentRound.color }}>
                    <p className="font-medium text-gray-800 text-sm">What lessons from this round will you apply to future customer conversations?</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <h3 className="font-semibold text-amber-800 text-sm">Discussion Time</h3>
                    <p className="text-amber-700 text-xs">Take 5 minutes to discuss with your team.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
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
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-gray-100" style={{ backgroundColor: colors.dark }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5" style={{ color: colors.primary }} />
                    <div>
                      <h2 className="text-lg font-bold text-white">Leaderboard</h2>
                      <p className="text-xs text-gray-400">Room {roomNumber}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowLeaderboard(false)} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>
              </div>
              <div className="p-5 overflow-auto max-h-[60vh]">
                {leaderboard.filter(t => t.room === roomNumber).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No scores yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.filter(t => t.room === roomNumber).map((team, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: idx < 3 ? `${colors.primary}08` : "#f9fafb" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : "#e5e7eb", color: idx < 3 ? "#1a1a1a" : "#666" }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate" style={{ color: colors.dark }}>{team.team}</div>
                          <div className="text-xs text-gray-500">Table {team.table}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold" style={{ color: colors.primary }}>{team.totalScore}</div>
                          <div className="text-xs text-gray-500">{Object.keys(team.rounds).length} rnd</div>
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
