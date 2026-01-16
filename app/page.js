"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Award,
  Flame,
  Crown,
} from "lucide-react";

// ============================================================================
// DESIGN SYSTEM - V3 "INSPIRE"
// ============================================================================

const theme = {
  // Core brand colors
  orange: "#FF4F1F",
  orangeGlow: "rgba(255, 79, 31, 0.4)",
  orangeSubtle: "rgba(255, 79, 31, 0.1)",

  // Dark palette
  black: "#0A0A0B",
  darkest: "#0D0D0F",
  darker: "#121215",
  dark: "#18181B",
  darkMuted: "#27272A",

  // Light palette
  white: "#FFFFFF",
  light: "#FAFAFA",
  muted: "#A1A1AA",
  subtle: "#71717A",

  // Accent colors for rounds
  rounds: {
    1: { color: "#FF4F1F", glow: "rgba(255, 79, 31, 0.3)", name: "Catch the Whale" },
    2: { color: "#10B981", glow: "rgba(16, 185, 129, 0.3)", name: "Break Some Glass" },
    3: { color: "#3B82F6", glow: "rgba(59, 130, 246, 0.3)", name: "Hold the High Ground" },
    4: { color: "#8B5CF6", glow: "rgba(139, 92, 246, 0.3)", name: "Capture More Share" },
  },

  // Transitions
  transition: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "400ms cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
};

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

// Animated gradient background with optional industry image
function AnimatedBackground({ children, industryImage = null }) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={{ backgroundColor: theme.black }}>
      {/* Industry background image */}
      {industryImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${industryImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
          }}
        />
      )}
      {/* Dark gradient overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${theme.black}F0 0%, ${theme.black}E0 30%, ${theme.black}E0 70%, ${theme.black}F0 100%)`,
        }}
      />
      {/* Gradient orbs */}
      <div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.orangeGlow} 0%, transparent 70%)`,
          transform: "translate(30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.rounds[2].glow} 0%, transparent 70%)`,
          transform: "translate(-30%, 30%)",
        }}
      />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${theme.white} 1px, transparent 1px), linear-gradient(90deg, ${theme.white} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Glowing button component
function GlowButton({ children, onClick, disabled, color = theme.orange, size = "lg", variant = "solid", className = "" }) {
  const baseClasses = "relative font-semibold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none";

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  if (variant === "ghost") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} text-white border border-white/20 hover:border-white/40 hover:bg-white/5 active:scale-[0.98] ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} text-white hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{
        background: color,
        boxShadow: disabled ? "none" : `0 0 30px ${color}40, 0 0 60px ${color}20`,
      }}
    >
      {children}
    </button>
  );
}

// Score display with animation
function AnimatedScore({ score, label, size = "lg", color = theme.orange }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (score === 0) {
      setDisplayScore(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const sizeStyles = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl",
    xl: "text-9xl",
  };

  return (
    <div className="text-center">
      <div
        className={`${sizeStyles[size]} font-black tracking-tight`}
        style={{
          color: theme.white,
          textShadow: `0 0 40px ${color}60, 0 0 80px ${color}30`,
        }}
      >
        {displayScore}
      </div>
      {label && <div className="text-sm font-medium mt-2" style={{ color: theme.muted }}>{label}</div>}
    </div>
  );
}

// Progress indicator - minimal and elegant
function PhaseIndicator({ phases, currentPhase, color }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {phases.map((phase, idx) => (
        <div
          key={idx}
          className="relative flex items-center"
        >
          <div
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              idx <= currentPhase ? "" : "opacity-30"
            }`}
            style={{
              backgroundColor: idx <= currentPhase ? color : theme.muted,
              boxShadow: idx === currentPhase ? `0 0 10px ${color}` : "none",
              transform: idx === currentPhase ? "scale(1.5)" : "scale(1)",
            }}
          />
          {idx < phases.length - 1 && (
            <div
              className="w-8 h-px mx-1"
              style={{
                backgroundColor: idx < currentPhase ? color : theme.darkMuted,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Card component with hover effects
function Card({ children, className = "", hover = true, glow = false, glowColor = theme.orange }) {
  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        hover ? "hover:border-white/20 hover:translate-y-[-2px]" : ""
      } ${className}`}
      style={{
        backgroundColor: theme.darker,
        borderColor: theme.darkMuted,
        boxShadow: glow ? `0 0 40px ${glowColor}15` : "none",
      }}
    >
      {children}
    </div>
  );
}

// Input field with glow focus
function GlowInput({ value, onChange, placeholder, disabled, multiline = false, rows = 4, color = theme.orange }) {
  const [focused, setFocused] = useState(false);

  const baseClasses = "w-full bg-transparent border rounded-xl px-4 py-3 text-white placeholder-zinc-500 transition-all duration-300 outline-none resize-none";

  const Component = multiline ? "textarea" : "input";

  return (
    <Component
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={multiline ? rows : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={baseClasses}
      style={{
        borderColor: focused ? color : theme.darkMuted,
        boxShadow: focused ? `0 0 20px ${color}20` : "none",
      }}
    />
  );
}

// Floating label input group
function InputGroup({ label, icon: Icon, children, color = theme.orange }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: theme.muted }}>
        {Icon && <Icon className="w-4 h-4" style={{ color }} />}
        {label}
      </label>
      {children}
    </div>
  );
}

// Value Hypothesis 4-box input (redesigned)
function ValueHypothesisInput({ values, onChange, disabled, color }) {
  const fields = [
    { key: "businessPriorities", label: "Business Priorities", placeholder: "What business objectives can we attach to?", icon: Target },
    { key: "valueGaps", label: "Value Gaps", placeholder: "What are their current challenges?", icon: AlertTriangle },
    { key: "vision", label: "Vision", placeholder: "What is an ideal future state?", icon: Lightbulb },
    { key: "impact", label: "Impact", placeholder: "What would be the personal and business impact?", icon: TrendingUp },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {fields.map(({ key, label, placeholder, icon: Icon }) => (
        <Card key={key} className="p-4" hover={false}>
          <InputGroup label={label} icon={Icon} color={color}>
            <GlowInput
              value={values[key] || ""}
              onChange={(val) => onChange({ ...values, [key]: val })}
              placeholder={placeholder}
              disabled={disabled}
              multiline
              rows={3}
              color={color}
            />
          </InputGroup>
        </Card>
      ))}
    </div>
  );
}

// Multiple choice wobble (redesigned)
function WobbleChoice({ options, selected, onSelect, disabled }) {
  return (
    <div className="space-y-4">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => !disabled && onSelect(idx)}
          disabled={disabled}
          className={`w-full p-6 rounded-xl text-left transition-all duration-300 border-2 ${
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:translate-y-[-2px]"
          }`}
          style={{
            backgroundColor: selected === idx ? "rgba(245, 158, 11, 0.1)" : theme.darker,
            borderColor: selected === idx ? "#F59E0B" : theme.darkMuted,
            boxShadow: selected === idx ? "0 0 30px rgba(245, 158, 11, 0.15)" : "none",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-base transition-all duration-300"
              style={{
                backgroundColor: selected === idx ? "#F59E0B" : theme.darkMuted,
                color: selected === idx ? theme.black : theme.muted,
              }}
            >
              {selected === idx ? <Check className="w-5 h-5" /> : String.fromCharCode(65 + idx)}
            </div>
            <span className="text-base leading-relaxed pt-2" style={{ color: theme.light }}>{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// Score comparison visualization
function ScoreComparison({ initial, final, color }) {
  const diff = final - initial;
  const isPositive = diff >= 0;

  return (
    <div className="flex items-center justify-center gap-6">
      <div className="text-center">
        <div className="text-4xl font-bold" style={{ color: theme.muted }}>{initial}</div>
        <div className="text-xs mt-1" style={{ color: theme.subtle }}>Initial</div>
      </div>
      <div className="flex flex-col items-center">
        <ArrowRight className="w-6 h-6" style={{ color: theme.muted }} />
        <div
          className={`text-sm font-bold mt-1 ${isPositive ? "text-emerald-400" : "text-red-400"}`}
        >
          {isPositive ? "+" : ""}{diff}
        </div>
      </div>
      <div className="text-center">
        <div
          className="text-5xl font-black"
          style={{
            color: theme.white,
            textShadow: `0 0 30px ${color}50`,
          }}
        >
          {final}
        </div>
        <div className="text-xs mt-1" style={{ color }}>Final</div>
      </div>
    </div>
  );
}

// Header component
function Header({ teamName, room, table, roundNumber, roundColor, submissions, onLeaderboardClick }) {
  const completedRounds = Object.keys(submissions).filter(id => submissions[id]?.finalScore);
  const totalScore = completedRounds.reduce((sum, id) => sum + (submissions[id]?.finalScore?.overall || 0), 0);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${theme.black}95`,
        borderColor: theme.darkMuted,
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo area */}
        <div className="flex items-center gap-5">
          <img src="/genesys-logo.png" alt="Genesys" className="h-12 object-contain" />
          <div className="h-8 w-px" style={{ backgroundColor: theme.darkMuted }} />
          <div
            className="text-base font-bold px-4 py-2 rounded-lg"
            style={{ backgroundColor: `${roundColor}30`, color: roundColor }}
          >
            Round {roundNumber}
          </div>
        </div>

        {/* Score, Leaderboard & Team */}
        <div className="flex items-center gap-5">
          {/* Running Score */}
          {completedRounds.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: theme.darker }}>
              <Flame className="w-5 h-5" style={{ color: theme.orange }} />
              <span className="text-2xl font-black text-white">{totalScore}</span>
            </div>
          )}

          {/* Leaderboard Button */}
          <button
            onClick={onLeaderboardClick}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: theme.darker }}
          >
            <Trophy className="w-5 h-5" style={{ color: "#FFD700" }} />
            <span className="text-base font-medium text-white">Leaderboard</span>
          </button>

          {/* Team Info */}
          <div className="text-right pl-2 border-l" style={{ borderColor: theme.darkMuted }}>
            <div className="text-base font-bold text-white">{teamName}</div>
            <div className="text-sm" style={{ color: theme.subtle }}>R{room} • T{table}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// SIMULATION DATA
// ============================================================================

const simulationRounds = [
  {
    id: 1,
    title: "Catch the Whale",
    subtitle: "New Logo Opportunity",
    motion: "Legacy Displacement",
    description: "Large account logo acquisition with embedded legacy player",
    customer: {
      name: "Aureon Financial Holdings",
      industry: "Financial Services",
      size: "42,000 employees",
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
      "What are their current challenges?",
      "What is an ideal future state?",
      "What would be the impact?",
    ],
    wobble: {
      title: "New Intelligence",
      description: "Just before the meeting, you learn Salesforce/ServiceNow/AWS is already engaged: Supporting a broader digital transformation initiative, operating with direct C-suite access, and actively shaping modernization principles.",
      question: "How does this change your approach?",
    },
    scoringCriteria: [
      { name: "Business Alignment", weight: 25, description: "Connects to measurable business outcomes" },
      { name: "Customer Insight", weight: 20, description: "Understanding of known and hidden challenges" },
      { name: "Value Articulation", weight: 25, description: "Genesys differentiation and AI-powered value" },
      { name: "Strategic Positioning", weight: 15, description: "Positions against competitive threats" },
      { name: "Executive Relevance", weight: 15, description: "Frames at appropriate executive level" },
    ],
    icon: Target,
    industryImage: "/financial.jpg",
  },
  {
    id: 2,
    title: "Break Some Glass",
    subtitle: "New Logo Opportunity",
    motion: "CCaaS Replacement",
    description: "Mid-market account with immature CX perspective",
    customer: {
      name: "Everwell Health Services",
      industry: "Healthcare Services",
      size: "4,800 employees",
      revenue: "$1.6B USD",
      currentSolution: "Unknown cloud platform",
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
    challenge: "Prepare for a discovery conversation with the VP of Patient Experience to expose reasons behind resistance to change",
    prompts: [
      "Why might the customer prefer the status quo?",
      "What do we need to learn?",
      "How can we surface value without being pushy?",
    ],
    wobble: {
      title: "Past Failure Revealed",
      description: "Just before the meeting, you learn the company previously migrated to a CCaaS provider, and leadership viewed the initiative as a failure: disruptive transition, promised outcomes not realized.",
      question: "How does this change your discovery approach?",
    },
    scoringCriteria: [
      { name: "Discovery Quality", weight: 30, description: "Questions designed to uncover root causes" },
      { name: "Trust Building", weight: 25, description: "Approach demonstrates empathy" },
      { name: "Status Quo Challenge", weight: 20, description: "Tactfully surfaces cost of inaction" },
      { name: "Healthcare Acumen", weight: 15, description: "Healthcare-specific understanding" },
      { name: "Wobble Adaptation", weight: 10, description: "Incorporates new information" },
    ],
    icon: Zap,
    industryImage: "/healthcare.jpg",
  },
  {
    id: 3,
    title: "Hold the High Ground",
    subtitle: "Account Defense",
    motion: "Expansion",
    description: "Secure current account against AI pure-play intrusion",
    customer: {
      name: "Summit Ridge Retail Group",
      industry: "Retail",
      size: "36,000 employees",
      revenue: "$18.9B USD",
      currentSolution: "Genesys Cloud (voice/routing)",
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
      "How might consultants be redefining criteria?",
      "Which relationships must be strengthened?",
      "What must be true for Genesys to remain strategic?",
    ],
    wobble: {
      title: "AI Pure-Play Threat",
      description: "The Contact Center Director informs us that the AI Committee is recommending a pilot of an AI pure-play competitor. Genesys is being viewed as 'good enough' but not innovative.",
      question: "What actions can you take to defend our position?",
    },
    scoringCriteria: [
      { name: "Competitive Defense", weight: 25, description: "Differentiation against AI pure-plays" },
      { name: "Relationship Strategy", weight: 25, description: "Path to strengthen executive relationships" },
      { name: "Platform Positioning", weight: 20, description: "Elevates Genesys from tactical to strategic" },
      { name: "Transformation Alignment", weight: 20, description: "Connects to transformation narrative" },
      { name: "Urgency & Action", weight: 10, description: "Appropriate urgency and clear next steps" },
    ],
    icon: Shield,
    industryImage: "/retail.jpg",
  },
  {
    id: 4,
    title: "Capture More Share",
    subtitle: "Account Expansion",
    motion: "Pure-Play AI",
    description: "Expand current account footprint and business impact",
    customer: {
      name: "Orion Global Logistics",
      industry: "Logistics & Supply Chain",
      size: "52,000 employees",
      revenue: "$21.4B USD",
      currentSolution: "Genesys Cloud in EMEA; legacy elsewhere",
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
      "Which executive concerns are most likely to stall expansion?",
      "How can we use EMEA success as proof?",
      "How can we leverage our champion(s)?",
      "What trade-offs can we proactively propose?",
    ],
    wobble: {
      title: "Budget Cut Directive",
      description: "The CFO has directed the team to reduce the investment by 30% while still delivering the target outcomes. CFO is looking specifically for trade-offs and impact.",
      question: "How can we adapt and continue to drive momentum?",
    },
    scoringCriteria: [
      { name: "Executive Risk Mitigation", weight: 25, description: "Proactively addresses CFO/CIO concerns" },
      { name: "Proof Point Leverage", weight: 20, description: "Effectively uses EMEA success" },
      { name: "Financial Acumen", weight: 25, description: "Compelling business case and trade-offs" },
      { name: "Champion Activation", weight: 15, description: "Strategy to leverage internal advocates" },
      { name: "Flexibility & Phasing", weight: 15, description: "Creative approach to scope/timeline" },
    ],
    icon: Rocket,
    industryImage: "/logistics.jpg",
  },
];

// ============================================================================
// LOCAL STORAGE
// ============================================================================

const STORAGE_KEYS = {
  TEAM_INFO: "genesys_sim_team",
  LEADERBOARD: "genesys_sim_leaderboard",
  PROGRESS: "genesys_sim_progress",
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

export default function GenesysSimulation() {
  // State
  const [currentView, setCurrentView] = useState("home");
  const [teamName, setTeamName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundPhase, setRoundPhase] = useState("intro");
  const [submissions, setSubmissions] = useState({});
  const [currentSubmission, setCurrentSubmission] = useState("");
  const [valueHypothesis, setValueHypothesis] = useState({});
  const [wobbleChoice, setWobbleChoice] = useState(null);
  const [wobbleOptions, setWobbleOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Load data on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem(STORAGE_KEYS.TEAM_INFO);
    const savedLeaderboard = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);

    if (savedTeam) {
      const team = JSON.parse(savedTeam);
      setTeamName(team.name);
      setTableNumber(team.table);
      setRoomNumber(team.room);
    }

    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Helpers
  const saveProgress = useCallback((newSubmissions, roundIdx, phase) => {
    const progress = { submissions: newSubmissions, currentRound: roundIdx, currentPhase: phase };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }, []);

  const saveTeamInfo = useCallback((name, table, room) => {
    localStorage.setItem(STORAGE_KEYS.TEAM_INFO, JSON.stringify({ name, table, room }));
  }, []);

  const updateLeaderboard = useCallback((name, table, room, score, roundId) => {
    setLeaderboard(prev => {
      const teamKey = `${room}-${table}-${name}`;
      const existing = prev.find(t => `${t.room}-${t.table}-${t.team}` === teamKey);
      let updated;
      if (existing) {
        updated = prev.map(t => {
          if (`${t.room}-${t.table}-${t.team}` === teamKey) {
            const newRounds = { ...t.rounds, [roundId]: score };
            return { ...t, rounds: newRounds, totalScore: Object.values(newRounds).reduce((a, b) => a + b, 0) };
          }
          return t;
        });
      } else {
        updated = [...prev, { team: name, table, room, rounds: { [roundId]: score }, totalScore: score }];
      }
      updated.sort((a, b) => b.totalScore - a.totalScore);
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Handlers
  const handleTeamSubmit = useCallback(() => {
    if (teamName.trim() && tableNumber.trim() && roomNumber.trim()) {
      saveTeamInfo(teamName, tableNumber, roomNumber);
      setSubmissions({});
      setCurrentRoundIndex(0);
      setRoundPhase("intro");
      setCurrentSubmission("");
      setValueHypothesis({});
      setWobbleChoice(null);
      setWobbleOptions([]);
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
      setCurrentView("simulation");
    }
  }, [teamName, tableNumber, roomNumber, saveTeamInfo]);

  const handleResumeSession = useCallback(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSubmissions(progress.submissions || {});
      setCurrentRoundIndex(progress.currentRound || 0);
      setRoundPhase(progress.currentPhase || "intro");
      const currentRoundId = simulationRounds[progress.currentRound || 0]?.id;
      if (progress.currentPhase === "wobble" && progress.submissions[currentRoundId]?.wobbleOptions) {
        setWobbleOptions(progress.submissions[currentRoundId].wobbleOptions);
      }
    }
    setCurrentView("simulation");
  }, []);

  const currentRound = simulationRounds[currentRoundIndex];
  const roundColor = theme.rounds[currentRound?.id]?.color || theme.orange;
  const phases = ["intro", "work", "feedback1", "wobble", "feedback2", "discussion"];
  const phaseIndex = phases.indexOf(roundPhase);

  const goToPhase = useCallback((phase) => {
    setRoundPhase(phase);
    saveProgress(submissions, currentRoundIndex, phase);
  }, [submissions, currentRoundIndex, saveProgress]);

  // Submit initial response
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
        "Reframe approach to position as complementary to existing platforms",
        "Request joint meeting with CX team and transformation committee",
        "Develop competitive analysis showing integration advantages",
        "Propose proof-of-concept demonstrating unique AI capabilities",
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

  // Submit wobble response
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

  // Next round
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

  // ============================================================================
  // RENDER: HOME SCREEN
  // ============================================================================

  if (currentView === "home") {
    const hasSavedSession = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.PROGRESS);

    return (
      <AnimatedBackground>
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-lg">
            {/* Logo */}
            <div className="text-center mb-10">
              <img src="/genesys-logo.png" alt="Genesys" className="h-16 mx-auto mb-8" />
              <h1
                className="text-4xl md:text-5xl font-black tracking-tight mb-3"
                style={{ color: theme.white }}
              >
                Sales Simulation
              </h1>
              <p className="text-lg" style={{ color: theme.muted }}>
                Register your team to begin
              </p>
            </div>

            {/* Registration Card */}
            <Card className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.muted }}>Room #</label>
                    <GlowInput value={roomNumber} onChange={setRoomNumber} placeholder="101" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.muted }}>Table #</label>
                    <GlowInput value={tableNumber} onChange={setTableNumber} placeholder="5" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.muted }}>Team Name</label>
                  <GlowInput value={teamName} onChange={setTeamName} placeholder="Enter your team name" />
                </div>

                <div className="pt-4 space-y-3">
                  <GlowButton
                    onClick={handleTeamSubmit}
                    disabled={!teamName.trim() || !tableNumber.trim() || !roomNumber.trim()}
                    className="w-full"
                  >
                    <Play className="w-5 h-5" />
                    Start Simulation
                  </GlowButton>

                  {hasSavedSession && (
                    <GlowButton
                      onClick={handleResumeSession}
                      variant="ghost"
                      className="w-full"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resume Session
                    </GlowButton>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedBackground>
    );
  }

  // ============================================================================
  // RENDER: SIMULATION
  // ============================================================================

  if (currentView === "simulation" && currentRound) {
    const submission = submissions[currentRound.id];
    const RoundIcon = currentRound.icon;

    // Industry background images by round
    const industryImages = {
      1: "/industries/financial.jpg",
      2: "/industries/healthcare.jpg",
      3: "/industries/retail.jpg",
      4: "/industries/logistics.jpg",
    };

    return (
      <AnimatedBackground industryImage={industryImages[currentRound.id]}>
        <Header
          teamName={teamName}
          room={roomNumber}
          table={tableNumber}
          roundNumber={currentRound.id}
          roundColor={roundColor}
          submissions={submissions}
          onLeaderboardClick={() => setShowLeaderboard(true)}
        />

        <main className="pt-28 pb-12 px-6">
          <div className="max-w-4xl mx-auto">

            {/* Phase Indicator */}
            <div className="mb-8">
              <PhaseIndicator
                phases={phases}
                currentPhase={phaseIndex}
                color={roundColor}
              />
            </div>

            {/* ============ INTRO PHASE ============ */}
            {roundPhase === "intro" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Hero Image + Title */}
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{ minHeight: "280px" }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${industryImages[currentRound.id]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${theme.black} 0%, ${theme.black}90 40%, transparent 100%)`,
                    }}
                  />
                  {/* Content */}
                  <div className="relative z-10 p-8 flex flex-col justify-end h-full" style={{ minHeight: "280px" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-sm font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: roundColor, color: theme.white }}
                      >
                        {currentRound.motion}
                      </span>
                    </div>
                    <h1 className="text-5xl font-black mb-2" style={{ color: theme.white }}>
                      {currentRound.title}
                    </h1>
                    <p className="text-lg" style={{ color: theme.muted }}>
                      {currentRound.description}
                    </p>
                  </div>
                </div>

                {/* Customer Info - Condensed */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Building2 className="w-6 h-6" style={{ color: roundColor }} />
                      <div>
                        <h2 className="text-xl font-bold" style={{ color: theme.white }}>
                          {currentRound.customer.name}
                        </h2>
                        <p className="text-sm" style={{ color: theme.muted }}>
                          {currentRound.customer.industry} • {currentRound.customer.revenue} • {currentRound.customer.currentSolution}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {currentRound.context.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm" style={{ color: theme.light }}>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: roundColor }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Challenge - Condensed */}
                <Card className="p-6 border" style={{ borderColor: `${roundColor}40` }}>
                  <div className="flex items-start gap-4">
                    <Flag className="w-6 h-6 flex-shrink-0" style={{ color: roundColor }} />
                    <div>
                      <h3 className="text-lg font-bold mb-2" style={{ color: theme.white }}>Your Challenge</h3>
                      <p className="text-base" style={{ color: theme.light }}>{currentRound.challenge}</p>
                    </div>
                  </div>
                </Card>

                <GlowButton onClick={() => goToPhase("work")} color={roundColor} className="w-full">
                  Begin Team Work
                  <ChevronRight className="w-5 h-5" />
                </GlowButton>
              </div>
            )}

            {/* ============ WORK PHASE ============ */}
            {roundPhase === "work" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black mb-2" style={{ color: theme.white }}>
                    {currentRound.useValueHypothesis ? "Build Your Value Hypothesis" : "Team Response"}
                  </h1>
                  <p style={{ color: theme.muted }}>Collaborate with your team and capture your strategic approach</p>
                </div>

                {/* Prompts */}
                <Card className="p-5">
                  <h3 className="text-sm font-medium mb-3" style={{ color: theme.muted }}>Consider these questions:</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {currentRound.prompts.map((prompt, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm" style={{ color: theme.light }}>
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: roundColor }} />
                        {prompt}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Input */}
                {currentRound.useValueHypothesis ? (
                  <ValueHypothesisInput
                    values={valueHypothesis}
                    onChange={setValueHypothesis}
                    disabled={isSubmitting}
                    color={roundColor}
                  />
                ) : (
                  <Card className="p-5">
                    <GlowInput
                      value={currentSubmission}
                      onChange={setCurrentSubmission}
                      placeholder="Enter your team's strategic response..."
                      disabled={isSubmitting}
                      multiline
                      rows={8}
                      color={roundColor}
                    />
                  </Card>
                )}

                {error && (
                  <div className="p-4 rounded-xl border" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <GlowButton onClick={() => goToPhase("intro")} variant="ghost" size="md">
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </GlowButton>
                  <GlowButton
                    onClick={handleInitialSubmission}
                    disabled={isSubmitting || (currentRound.useValueHypothesis ? !Object.values(valueHypothesis).some(v => v?.trim()) : !currentSubmission.trim())}
                    color={roundColor}
                    className="flex-1"
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
                  </GlowButton>
                </div>
              </div>
            )}

            {/* ============ FEEDBACK 1 PHASE ============ */}
            {roundPhase === "feedback1" && submission?.initialScore && (
              <div className="space-y-8 animate-fadeIn">
                {/* Score Hero */}
                <div className="text-center py-12">
                  <div className="text-base font-medium mb-4" style={{ color: theme.muted }}>Initial Score</div>
                  <AnimatedScore score={submission.initialScore.overall} size="xl" color={roundColor} />
                  <div
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-full mt-6"
                    style={{ backgroundColor: `${roundColor}20` }}
                  >
                    <Award className="w-5 h-5" style={{ color: roundColor }} />
                    <span className="text-base font-semibold" style={{ color: roundColor }}>
                      {submission.initialCoaching.scoreInterpretation}
                    </span>
                  </div>
                </div>

                {/* Coaching */}
                <Card className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: roundColor }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold" style={{ color: theme.white }}>AI Sales Coach</div>
                      <div className="text-sm" style={{ color: theme.subtle }}>Initial Feedback</div>
                    </div>
                  </div>

                  <p className="text-base mb-6 leading-relaxed" style={{ color: theme.light }}>{submission.initialCoaching.mainFeedback}</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-base font-semibold flex items-center gap-2 mb-4 text-emerald-400">
                        <ThumbsUp className="w-5 h-5" />
                        Strengths
                      </h4>
                      <div className="space-y-3">
                        {submission.initialCoaching.strengths.map((s, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-base" style={{ color: theme.light }}>
                            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            {s}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: theme.orange }}>
                        <TrendingUp className="w-5 h-5" />
                        Areas to Improve
                      </h4>
                      <div className="space-y-3">
                        {submission.initialCoaching.improvements.map((i, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-base" style={{ color: theme.light }}>
                            <ArrowRight className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.orange }} />
                            {i}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                <GlowButton onClick={() => goToPhase("wobble")} color="#F59E0B" className="w-full">
                  <AlertTriangle className="w-5 h-5" />
                  Continue to Wobble
                  <ChevronRight className="w-5 h-5" />
                </GlowButton>
              </div>
            )}

            {/* ============ WOBBLE PHASE ============ */}
            {roundPhase === "wobble" && (
              <div className="space-y-8 animate-fadeIn">
                {/* Wobble Alert */}
                <div
                  className="text-center py-12 px-8 rounded-2xl border-2"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.05)",
                    borderColor: "rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
                    style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}
                  >
                    <AlertTriangle className="w-10 h-10 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold tracking-wider mb-3 text-amber-400">NEW INTELLIGENCE</div>
                  <h2 className="text-3xl font-black mb-4" style={{ color: theme.white }}>
                    {currentRound.wobble.title}
                  </h2>
                  <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: theme.light }}>
                    {currentRound.wobble.description}
                  </p>
                </div>

                {/* Choice Card */}
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-3" style={{ color: theme.white }}>{currentRound.wobble.question}</h3>
                  <p className="text-base mb-6" style={{ color: theme.muted }}>Select the best path forward:</p>
                  <WobbleChoice
                    options={wobbleOptions}
                    selected={wobbleChoice}
                    onSelect={setWobbleChoice}
                    disabled={isSubmitting}
                  />
                </Card>

                {error && (
                  <div className="p-4 rounded-xl border" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <GlowButton onClick={() => goToPhase("feedback1")} variant="ghost" size="md">
                    <ChevronLeft className="w-5 h-5" />
                    Back
                  </GlowButton>
                  <GlowButton
                    onClick={handleWobbleSubmission}
                    disabled={wobbleChoice === null || isSubmitting}
                    color="#F59E0B"
                    className="flex-1"
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
                  </GlowButton>
                </div>
              </div>
            )}

            {/* ============ FEEDBACK 2 PHASE ============ */}
            {roundPhase === "feedback2" && submission?.finalScore && (
              <div className="space-y-8 animate-fadeIn">
                {/* Final Score Hero */}
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Crown className="w-7 h-7 text-yellow-400" />
                    <span className="text-base font-medium" style={{ color: theme.muted }}>Final Score</span>
                  </div>

                  {submission.initialScore && (
                    <ScoreComparison
                      initial={submission.initialScore.overall}
                      final={submission.finalScore.overall}
                      color={roundColor}
                    />
                  )}

                  <div
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-full mt-8"
                    style={{ backgroundColor: `${roundColor}20` }}
                  >
                    <Trophy className="w-5 h-5" style={{ color: roundColor }} />
                    <span className="text-base font-semibold" style={{ color: roundColor }}>
                      {submission.finalCoaching.scoreInterpretation}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown */}
                <Card className="p-8">
                  <h3 className="text-base font-semibold mb-5" style={{ color: theme.muted }}>Performance Breakdown</h3>
                  <div className="space-y-5">
                    {currentRound.scoringCriteria.map((criterion, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-base" style={{ color: theme.light }}>{criterion.name}</span>
                          <span className="text-base font-bold" style={{ color: roundColor }}>
                            {submission.finalScore.criteria[criterion.name]}
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.darkMuted }}>
                          <div
                            className="h-full rounded-full transition-all duration-1000"
                            style={{
                              width: `${submission.finalScore.criteria[criterion.name]}%`,
                              backgroundColor: roundColor,
                              boxShadow: `0 0 10px ${roundColor}`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Final Coaching */}
                <Card className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: roundColor }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold" style={{ color: theme.white }}>AI Sales Coach</div>
                      <div className="text-sm" style={{ color: theme.subtle }}>Final Analysis</div>
                    </div>
                  </div>

                  <p className="text-base mb-6 leading-relaxed" style={{ color: theme.light }}>{submission.finalCoaching.mainFeedback}</p>

                  <div
                    className="p-5 rounded-xl"
                    style={{ backgroundColor: theme.dark }}
                  >
                    <h4 className="text-base font-semibold flex items-center gap-2 mb-4" style={{ color: theme.muted }}>
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                      Key Takeaways
                    </h4>
                    <div className="space-y-3">
                      {submission.finalCoaching.nextSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-base" style={{ color: theme.light }}>
                          <span className="font-bold" style={{ color: roundColor }}>{idx + 1}.</span>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <GlowButton onClick={() => goToPhase("discussion")} color={roundColor} className="w-full">
                  Continue to Discussion
                  <ChevronRight className="w-5 h-5" />
                </GlowButton>
              </div>
            )}

            {/* ============ DISCUSSION PHASE ============ */}
            {roundPhase === "discussion" && (
              <div className="space-y-8 animate-fadeIn">
                <div className="text-center py-12">
                  <div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5"
                    style={{ backgroundColor: `${roundColor}20` }}
                  >
                    <Users className="w-10 h-10" style={{ color: roundColor }} />
                  </div>
                  <h1 className="text-4xl font-black mb-3" style={{ color: theme.white }}>Team Discussion</h1>
                  <p className="text-lg" style={{ color: theme.muted }}>Role Alignment & Teaming</p>
                </div>

                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-5" style={{ color: theme.white }}>Discussion Questions</h3>
                  <div className="space-y-4">
                    {[
                      "As the AE 'Quarterback,' how would you coordinate with your CS, SE, and Partner resources?",
                      "What unique value could each role bring to navigate the wobble scenario?",
                      "What lessons from this round will you apply to future customer conversations?",
                    ].map((question, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-xl border-l-4"
                        style={{
                          backgroundColor: theme.dark,
                          borderLeftColor: roundColor,
                        }}
                      >
                        <p className="text-base" style={{ color: theme.light }}>{question}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <div
                  className="p-5 rounded-xl flex items-center gap-4"
                  style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                >
                  <Clock className="w-6 h-6 text-amber-400" />
                  <div>
                    <div className="text-base font-semibold text-amber-400">Discussion Time</div>
                    <div className="text-sm" style={{ color: theme.muted }}>Take 5 minutes to discuss with your team</div>
                  </div>
                </div>

                {currentRoundIndex < simulationRounds.length - 1 ? (
                  <GlowButton onClick={handleNextRound} color={theme.orange} className="w-full">
                    Continue to Round {currentRoundIndex + 2}
                    <ChevronRight className="w-5 h-5" />
                  </GlowButton>
                ) : (
                  <GlowButton onClick={() => setShowLeaderboard(true)} color={theme.orange} className="w-full">
                    <Trophy className="w-5 h-5" />
                    View Final Leaderboard
                  </GlowButton>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            onClick={() => setShowLeaderboard(false)}
          >
            <Card
              className="w-full max-w-xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: theme.darkMuted }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Trophy className="w-8 h-8" style={{ color: "#FFD700" }} />
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: theme.white }}>Leaderboard</h2>
                      <p className="text-sm" style={{ color: theme.subtle }}>Room {roomNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 text-2xl"
                    style={{ color: theme.muted }}
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-auto max-h-[60vh]">
                {leaderboard.filter(t => t.room === roomNumber).length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: theme.muted }} />
                    <p className="text-base" style={{ color: theme.muted }}>No scores yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.filter(t => t.room === roomNumber).map((team, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-5 rounded-xl"
                        style={{ backgroundColor: idx < 3 ? `${theme.orange}10` : theme.dark }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                          style={{
                            backgroundColor: idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : theme.darkMuted,
                            color: idx < 3 ? theme.black : theme.muted,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold truncate" style={{ color: theme.white }}>{team.team}</div>
                          <div className="text-sm" style={{ color: theme.subtle }}>Table {team.table}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black" style={{ color: theme.orange }}>{team.totalScore}</div>
                          <div className="text-sm" style={{ color: theme.subtle }}>{Object.keys(team.rounds).length} rounds</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </AnimatedBackground>
    );
  }

  return null;
}
