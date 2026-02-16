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
  GripVertical,
  CircleDot,
  Square,
  CheckSquare,
  X,
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

  // Light palette - improved legibility
  white: "#FFFFFF",
  light: "#F4F4F5",
  muted: "#D4D4D8",
  subtle: "#A1A1AA",

  // Accent colors for rounds
  rounds: {
    1: { color: "#10B981", glow: "rgba(16, 185, 129, 0.3)", name: "Shape the Vision" },
    2: { color: "#FF4F1F", glow: "rgba(255, 79, 31, 0.3)", name: "Disrupt Status Quo" },
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

function AnimatedBackground({ children, industryImage = null }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient background image */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/gradient-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Dark overlay for content readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.4) 100%)",
        }}
      />
      {/* Industry background image - subtle overlay */}
      {industryImage && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${industryImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.1,
            mixBlendMode: "overlay",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function GlowButton({ children, onClick, disabled, color = theme.orange, className = "", size = "default" }) {
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    default: "px-8 py-4 text-lg",
    large: "px-12 py-5 text-xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative font-bold rounded-xl
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:scale-[1.02] active:scale-[0.98]
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        background: disabled ? theme.darkMuted : color,
        boxShadow: disabled ? "none" : `0 0 30px ${color}40`,
        color: theme.white,
      }}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "", glow = false, color = theme.orange }) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-sm ${className}`}
      style={{
        background: `${theme.darker}ee`,
        border: `1px solid ${theme.darkMuted}`,
        boxShadow: glow ? `0 0 40px ${color}20` : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </div>
  );
}

function ProgressDots({ total, current, roundColor }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="relative"
          style={{
            width: i === current ? "12px" : "8px",
            height: i === current ? "12px" : "8px",
            borderRadius: "50%",
            background: i <= current ? roundColor : theme.darkMuted,
            transition: theme.transition.base,
            boxShadow: i === current ? `0 0 12px ${roundColor}` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header({ teamName, room, table, roundNumber, roundColor, submissions, onLeaderboardClick }) {
  const totalScore = Object.values(submissions).reduce((sum, s) => sum + (s.finalScore || 0), 0);

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{
        background: `${theme.black}dd`,
        borderColor: theme.darkMuted,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Round */}
        <div className="flex items-center gap-6">
          <img src="/genesys-logo.png" alt="Genesys" className="h-14" />
          <div
            className="px-4 py-2 rounded-lg font-bold text-base"
            style={{ backgroundColor: roundColor, color: theme.white }}
          >
            Round {roundNumber}
          </div>
        </div>

        {/* Score, Leaderboard & Team */}
        <div className="flex items-center gap-4">
          {/* Score Display */}
          {totalScore > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg" style={{ backgroundColor: theme.darker }}>
              <Flame className="w-5 h-5" style={{ color: theme.orange }} />
              <span className="text-xl font-bold" style={{ color: theme.white }}>{totalScore}</span>
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
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: theme.white }}>{teamName}</div>
            <div className="text-sm" style={{ color: theme.muted }}>R{room} • T{table}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// SIMULATION ROUNDS DATA - UPDATED FROM MASTER DECK
// ============================================================================

const simulationRounds = [
  {
    id: 1,
    title: "Shape the Vision",
    subtitle: "New Logo Opportunity",
    motion: "Legacy Displacement",
    description: "Large account logo acquisition with immature CX perspective",
    customer: {
      name: "Everwell Health Services",
      industry: "Healthcare Services",
      size: "~4,800 employees",
      revenue: "$1.6B USD",
      currentSolution: "Unknown cloud contact center platform",
      logo: "/customers/everwell.png",
    },
    context: [
      "Leadership has set a mandate to improve operating margins through modernizing patient experience and driving cost efficiencies",
      "VP of Patient Experience has prioritized initiatives to improve in-facility experiences for clinics, hospitals, and specialized service locations",
      "Contact Center Director has been in-seat for ~12 years and strongly defends the current system",
      "No active CCaaS evaluation underway",
      "VP of Patient Experience has not yet considered CCaaS as a core element of Patient Experience",
      "Patient Experience challenges are treated as executive priorities",
      "Leadership team has concerns about the unknown impact of AI on Patient Experience",
      "Decision-making is tightly controlled and risk-averse in this highly-regulated healthcare environment",
    ],
    objective: "Build leadership attention around the negative impact of the current Contact Center on Patient Experience – and ultimately, operating margin.",
    challenge: "Develop a POV to share with the VP of Patient Experience to expand their thinking around the whole patient experience, including AI-powered Contact Center capabilities.",
    // Input fields for this round - Layout: single question top, then 2x2 grid
    inputLayout: "singleTop-2x2",
    inputFields: [
      { id: "businessPriority", label: "From Everwell's perspective, why does this matter now?", type: "textarea", placeholder: "Describe the business context and urgency...", fullWidth: true },
      { id: "knownChallenges", label: "What challenges related to Patient Experience or the Contact Center are they already aware of?", type: "textarea", placeholder: "List known challenges..." },
      { id: "valueGaps", label: "What challenges or potential unrealized value are limiting Everwell's ability to achieve their priorities?", type: "textarea", placeholder: "Identify hidden gaps and limitations..." },
      { id: "futureState", label: "What is an ideal future state in their terms – linking the Contact Center to the overall Patient Experience?", type: "textarea", placeholder: "Describe the vision..." },
      { id: "businessImpact", label: "Through the lens of the VP of Patient Experience, what measurable business impact does this unlock?", type: "textarea", placeholder: "Quantify the value..." },
    ],
    wobble: {
      title: "Enterprise Platform Influence",
      description: "While meeting with the VP of Patient Experience, you learn that ServiceNow is already engaged: Supporting a broader digital and data transformation initiative, focused on improving how work, requests, and issues flow across the organization. Not formally leading Patient Experience initiatives, but actively shaping enterprise platform standards, modernization principles, and investment criteria. Operating with direct access to the C-suite, including the CIO and COO.",
      question: "How should we evolve our POV and executive framing with the VP of Patient Experience?",
      type: "choice",
      shuffleOptions: true,
      options: [
        {
          id: "A",
          text: "Ensure Patient Experience isn't overlooked in enterprise workflow design",
          detail: "If ServiceNow is defining how patient-related work flows across the organization, we should ensure Patient Experience inputs are represented – so patient requests, issues, and demand are visible within enterprise workflows.",
          points: -2,
        },
        {
          id: "B",
          text: "Position the contact center as the execution layer for enterprise workflows",
          detail: "ServiceNow may define how work is managed, but Patient Experience is where that work is delivered. We should position the contact center as the execution layer that reliably delivers predefined enterprise workflows with consistent patient interactions.",
          points: 2,
        },
        {
          id: "C",
          text: "Use Patient Experience outcomes to define whether transformation is working",
          detail: "If modernization principles and investment criteria are being set now, Patient Experience should be the standard for success - and the signal that dynamically guides how work is orchestrated across channels and moments. If access, trust, and continuity don't improve for patients, then the transformation hasn't delivered value.",
          points: 5,
        },
        {
          id: "D",
          text: "Position Patient Experience as the unifying force across platforms and decisions",
          detail: "Workflows, data, and platforms only matter if they come together – dynamically - in the moments that define patient trust and access. We should position Patient Experience as the connective tissue that governs orchestration across systems, with the contact center activating how enterprise decisions show up for patients in real time.",
          points: 8,
        },
      ],
    },
    scoringCriteria: [
      { name: "Business Priority Framing", weight: 25, description: "Frames Patient Experience as strategic lever for margin, access, and trust", poor: "Frames problem as CX/contact center issue with no link to enterprise priorities", champion: "Frames Patient Experience as strategic lever for protecting margin, improving access, and sustaining patient trust" },
      { name: "Insight into Value Gaps", weight: 35, description: "Surfaces unseen constraints Everwell may not be fully considering", poor: "Focuses only on surface-level or known challenges", champion: "Reframes problem by exposing unseen constraint (e.g., Patient Experience limited by how work is governed and orchestrated)" },
      { name: "Ideal Future State", weight: 15, description: "Presents AI-powered experience orchestration vision", poor: "Feature- or platform-centric description of the future", champion: "Presents future where AI-powered experience orchestration improves patient access, reduces operational burden, scales safely" },
      { name: "Value Impact", weight: 25, description: "Clearly articulates measurable business impact for the VP", poor: "No clear business impact or personal relevance for the VP", champion: "Clearly articulates measurable business impact and positions VP as trusted leader who can modernize safely" },
    ],
    icon: Target,
    industryImage: "/industries/healthcare.png",
  },
  {
    id: 2,
    title: "Disrupt Status Quo",
    subtitle: "New Logo Opportunity",
    motion: "CCaaS Replacement",
    description: "New large account opportunity with embedded legacy player",
    customer: {
      name: "Aureon Financial Holdings",
      industry: "Financial Services: Banking and Payments",
      size: "~42,000 employees",
      revenue: "$28.5B USD",
      currentSolution: "Legacy Avaya (on-prem)",
      logo: "/customers/aureon.png",
    },
    context: [
      "Global VP of Customer Operations maintains a regional operating model empowering Regional Contact Center Directors to optimize locally",
      "Each contact center is operating on stable, region-specific Avaya on-prem systems",
      "Performance is viewed as 'good enough' – Average Handle Time (AHT) and Customer Satisfaction (CSAT)",
      "Limited ability to create consistent process for predicting and responding to customer issues globally",
      "VP of Cybersecurity is hyper-risk averse – preferring regional data separation and minimal architectural change",
      "CEO has initiated global modernization discussion to future-proof business and improve operational resilience",
      "No immediate CCaaS crisis – leading to a 'why now?' mindset",
      "AI-for-CX has been introduced at executive level, but leaders lack clarity on enterprise-ready use cases",
      "Avaya is actively defending with hybrid-cloud and regional upgrade strategies",
    ],
    objective: "Break down the perception that the current CX environment is 'good enough' by exposing the risks and limitations of the status quo — creating openness to change without positioning a solution",
    challenge: "Prepare for a discovery conversation with the Global VP of Customer Operations to expose reasons behind resistance to change and surface unrecognized value.",
    // Layout: Two columns side by side with headers
    inputLayout: "twoColumnHeaders",
    inputFields: [
      {
        id: "insightsToShare",
        header: "Insights to Share",
        label: "How can we bring attention to the risks of the current approach – even if performance appears 'good enough'?",
        type: "textarea",
        placeholder: "Include data points, customer examples, etc. that point to hidden operational risk, limited agility, non-optimal customer outcomes, and/or constrained future options...",
        column: "left"
      },
      {
        id: "questionsToAsk",
        header: "Questions to Ask",
        label: "What can we ask to help leaders recognize these risks and reflect on the tradeoffs of status quo?",
        type: "textarea",
        placeholder: "What additional areas would you explore to understand where the current model may limit future outcomes?",
        column: "right"
      },
    ],
    wobble: {
      title: "Past Failure Revealed",
      description: "Right before meeting with the VP of Customer Operations, one of the Regional Contact Center Directors gives you more insight: The LATAM region participated in a hybrid NiCE pilot last year. The pilot was highly disruptive to operations and agent workflows. Adoption was inconsistent and agent trust was eroded. Leadership ultimately pulled the program, and the failure influenced the decision to halt CX platform change globally.",
      question: "Given this new information about the failed pilot, respond to the following:",
      type: "text-questions",
      textQuestions: [
        {
          id: "reframeInsight",
          label: "What is one insight you would use to reframe why the pilot failed – in a way that helps the VP of Customer Operations see the root cause differently, without reinforcing fear or defensiveness?",
          placeholder: "Describe your insight for reframing the failure..."
        },
        {
          id: "discoveryQuestion",
          label: "What question would you ask to learn more about why the pilot failed?",
          placeholder: "Write a discovery question..."
        }
      ],
      // Text questions are scored by the AI - base points awarded for thoughtful completion
      basePoints: 5,
    },
    scoringCriteria: [
      { name: "Insightfulness of Risks Surfaced", weight: 30, description: "Reframes status quo as structural constraint limiting resilience, agility, and future CX transformation", poor: "Restates known facts without reframing them as business risk", champion: "Reframes status quo as structural constraint showing how regional autonomy limits resilience, agility, and transformation" },
      { name: "Use of Evidence", weight: 20, description: "Grounds insights in realistic financial services examples", poor: "Makes abstract claims with no supporting evidence", champion: "Grounds insights in realistic financial services examples showing how 'stable' environments struggle to adapt" },
      { name: "Questions to Test Status Quo", weight: 30, description: "Questions help leaders recognize systemic risk masked by local metrics", poor: "Questions push for change directly or imply current approach is wrong", champion: "Questions help leaders recognize that optimizing AHT/CSAT locally masks systemic risk and constrains enterprise outcomes" },
      { name: "Depth of Discovery Plan", weight: 20, description: "Demonstrates deliberate discovery path exposing architectural limitations", poor: "Discovery stays focused on current tools, processes, or isolated performance", champion: "Demonstrates deliberate discovery path that exposes how current architecture limits ability to test, scale, and govern AI-driven CX" },
    ],
    icon: Zap,
    industryImage: "/industries/financial.png",
  },
  {
    id: 3,
    title: "Hold the High Ground",
    subtitle: "Account Defense",
    motion: "Expansion",
    description: "Secure and strengthen current account against AI pure-play intrusion",
    customer: {
      name: "Summit Ridge Retail Group",
      industry: "Retail: Omnichannel Consumer Goods",
      size: "~36,000 employees",
      revenue: "$18.9B USD",
      currentSolution: "GC2 for past 6 years, added tokens 6 months ago",
      logo: "/customers/summit.png",
    },
    context: [
      "Genesys is viewed as a trusted and reliable CCaaS platform",
      "Current CCaaS performance is solid; there is no active service crisis",
      "Relationship strength sits primarily with the VP of Customer Experience",
      "Renewal date is 12 months away",
      "A new CIO has joined with a mandate to drive enterprise-wide digital transformation",
      "CIO has engaged Accenture to shape the transformation roadmap, working with the AI Committee",
      "Accenture is likely to recommend a hyperscaler platform solution (AWS Connect or Azure)",
      "Executive focus shifting toward platform consolidation, data and AI strategy, long-term scalability",
    ],
    objective: "Preserve our position by attaching to the broader transformation and positioning Genesys as an innovator in AI-powered CX",
    challenge: "Prepare our competitive strategy – elevating our capabilities to CIO-level priorities.",
    // Layout: strategy selection + rationale paired, then remaining fields in 2x2
    inputLayout: "strategyPaired",
    inputFields: [
      { id: "strategySelection", label: "Which strategy is most effective in this scenario?", type: "strategy-select", options: ["Direct", "Reframe", "Expand", "Pinpoint"], group: "strategy" },
      { id: "strategyRationale", label: "Given what's changing in the account, why is this the right strategy?", type: "textarea", placeholder: "Explain your strategic rationale...", group: "strategy" },
      { id: "keyActions", label: "What 2-3 actions can we take in the next 30 days to drive this strategy?", type: "textarea", placeholder: "List specific, actionable steps..." },
      { id: "keyMessages", label: "What messages communicate our POV on AI-powered CX?", type: "textarea", placeholder: "Draft key messaging points..." },
      { id: "mustBeTrue", label: "What must be true for Genesys to remain a strategic choice as decisions progress?", type: "textarea", placeholder: "Identify critical success factors..." },
    ],
    wobble: {
      title: "AI Pure-Play Threat",
      description: "The VP of Customer Experience informs you that the AI Committee is recommending a pilot of an AI pure-play – changing how CX value is being evaluated: AI competitors are reframing CX primarily as a cost takeout lever. CX decisions are shifting toward enterprise AI and data economics. Genesys is increasingly viewed through a seat-based lens, rather than as an AI innovator. Influence is moving toward the CIO, AI Committee, and Accenture.",
      question: "Rank the following strategy adjustments from most effective to least effective.",
      type: "ranking",
      shuffleOptions: true,
      options: [
        { id: "Reframe", text: "Reframe", detail: "Reposition Genesys as the AI-powered CX execution layer within the broader enterprise transformation, aligning closely with Accenture and the CIO agenda." },
        { id: "Expand", text: "Expand", detail: "Expand the decision beyond contact center efficiency to include journey orchestration, data activation, and enterprise-wide CX outcomes." },
        { id: "Pinpoint", text: "Pinpoint", detail: "Defend and deepen a high-value CX domain where Genesys is uniquely strong, creating a protected foothold while broader decisions unfold." },
        { id: "Direct", text: "Direct", detail: "Directly counter the AI pure-play by defending Genesys on cost efficiency, feature parity, and near-term ROI." },
      ],
      // Scoring table for rankings
      rankingScores: {
        "Reframe,Expand,Pinpoint,Direct": 10,
        "Expand,Reframe,Pinpoint,Direct": 8,
        "Reframe,Expand,Direct,Pinpoint": 8,
        "Reframe,Pinpoint,Expand,Direct": 8,
        "Expand,Pinpoint,Reframe,Direct": 6,
        "Expand,Reframe,Direct,Pinpoint": 6,
        "Pinpoint,Reframe,Expand,Direct": 6,
        "Reframe,Direct,Expand,Pinpoint": 6,
        "Reframe,Pinpoint,Direct,Expand": 6,
        "Direct,Reframe,Expand,Pinpoint": 3,
        "Expand,Direct,Reframe,Pinpoint": 3,
        "Expand,Pinpoint,Direct,Reframe": 3,
        "Pinpoint,Expand,Reframe,Direct": 3,
        "Pinpoint,Reframe,Direct,Expand": 3,
        "Reframe,Direct,Pinpoint,Expand": 3,
        "Direct,Expand,Reframe,Pinpoint": 0,
        "Direct,Reframe,Pinpoint,Expand": 0,
        "Expand,Direct,Pinpoint,Reframe": 0,
        "Pinpoint,Direct,Reframe,Expand": 0,
        "Pinpoint,Expand,Direct,Reframe": 0,
        "Direct,Expand,Pinpoint,Reframe": -2,
        "Direct,Pinpoint,Reframe,Expand": -2,
        "Pinpoint,Direct,Expand,Reframe": -2,
        "Direct,Pinpoint,Expand,Reframe": -5,
      },
    },
    scoringCriteria: [
      { name: "Competitive Strategy Selection", weight: 25, description: "Selects Reframe to reposition Genesys as AI-powered CX innovation layer", poor: "Selects Direct without acknowledging Accenture, hyperscalers, or CIO-led transformation", champion: "Selects Reframe to reposition Genesys as AI-powered CX innovation layer within Accenture-led ecosystem" },
      { name: "Competitive & Partner Awareness", weight: 20, description: "Demonstrates ecosystem fluency positioning Genesys as complementary to Accenture", poor: "Focuses primarily on Contact Center Director or Genesys-only relationships", champion: "Demonstrates ecosystem fluency by positioning Genesys as complementary to Accenture and differentiated from hyperscalers" },
      { name: "AI Positioning & Differentiation", weight: 20, description: "Positions AI-powered CX as execution layer converting enterprise AI strategy into outcomes", poor: "Generic AI claims with no differentiation", champion: "Positions AI-powered CX as execution layer that converts enterprise AI strategy into measurable business outcomes" },
      { name: "Strategic Messaging Quality", weight: 20, description: "Delivers executive-level narrative elevating CX as critical to transformation success", poor: "Product- or CCaaS-centric messaging", champion: "Delivers clear, executive-level narrative that elevates CX as critical to enterprise AI and digital transformation success" },
      { name: "Actionability & Focus", weight: 15, description: "Actions directly reduce displacement risk and protect strategic position", poor: "Vague or generic next steps with no link to account risk", champion: "Actions directly reduce displacement risk, strengthen Accenture alignment, and protect strategic position" },
    ],
    icon: Shield,
    industryImage: "/industries/retail.png",
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
      size: "~52,000 employees",
      revenue: "$21.4B USD",
      currentSolution: "GC3 in EMEA; mix of legacy on-prem and cloud in other regions",
      logo: "/customers/orion.png",
    },
    context: [
      "EMEA deployment viewed as successful and stable with improved customer data visibility and agent productivity",
      "Outside EMEA, CX is fragmented, costly, and difficult to manage consistently",
      "CX leadership is advocating for global platform expansion to standardize experience and enable AI-driven efficiency",
      "Expansion requires executive committee approval",
      "CIO and CFO are jointly evaluating investment size, timing, and migration risk across regions",
      "Company is under margin pressure and cost discipline is high",
    ],
    objective: "Shore up executive confidence in Genesys as a global, AI-powered CX platform and our proposed roadmap",
    challenge: "Using the Deal Review Framework, define actions to address executive decision risks in favor of our CX platform expansion initiative.",
    inputFields: [], // This round uses the deal review checklist instead
    useDealReviewChecklist: true,
    // Pre-filled Deal Review Framework - users only provide Next Actions for "No" items
    dealReviewChecklist: [
      {
        section: "Value Alignment",
        items: [
          {
            id: "transformationVision",
            label: "Business decision-makers have a defined transformation vision (including CX, AI, digital) that we can attach our solutions to.",
            prefilled: "yes",
            evidence: "CX leadership recommended standardization. CIO/CFO mandated the VP of Data Science and AI to evaluate global platform solutions."
          },
          {
            id: "transformationPartner",
            label: "Key leaders (across CX, contact center ops, digital, etc.) see us as a transformation partner, not just a tech vendor.",
            prefilled: "no",
            evidence: "Genesys viewed as successful EMEA solution; mostly referenced in CX forums. Limited direct exposure to CIO/CFO."
          },
          {
            id: "keyKPIs",
            label: "We have identified key business impact/KPIs (e.g., customer growth, cost to serve, speed to market) that we can attach to.",
            prefilled: "yes",
            evidence: "Quantified EMEA productivity gains can be leveraged globally – needs to be applied to a global or by-region business case."
          },
          {
            id: "technicalExcellence",
            label: "We have demonstrated technical excellence to meet the customer's requirements and have translated into business outcomes.",
            prefilled: "no",
            evidence: "GC3 stable in EMEA. Agent Force pilot in LATAM; exploring options in APAC; unclear in NA."
          },
        ],
      },
      {
        section: "Value Discovery",
        items: [
          {
            id: "broughtInsights",
            label: "We have brought insights based on our incumbency or market experience to help the customer see what they haven't.",
            prefilled: "no",
            evidence: "Initial conversations with VP of Data Science and AI have signaled shift to a global approach, but concerns about migration risks persist."
          },
          {
            id: "uncoveredGaps",
            label: "We have uncovered current-state gaps in CX strategy and service experience – beyond contact center metrics.",
            prefilled: "no",
            evidence: "Likely inconsistent employee and customer experience across regions. Have not explicitly identified gaps globally."
          },
          {
            id: "partneringChampion",
            label: "We are partnering with a champion to build stakeholder alignment around value opportunities, challenges, etc.",
            prefilled: "yes",
            evidence: "We have strong sponsors in EMEA leaders and in the global CX function. Must test for influence on global approach."
          },
          {
            id: "validatedUrgency",
            label: "We have validated the urgency for transformation across key business decision-makers.",
            prefilled: "yes",
            evidence: "CIO/CFO evaluation underway. Various regions are looking to optimize/improve current approach."
          },
        ],
      },
      {
        section: "Value Story",
        items: [
          {
            id: "businessCase",
            label: "Our co-created business case shows how Genesys can influence business outcomes (e.g., cost reduction, customer satisfaction).",
            prefilled: "no",
            evidence: "EMEA success story exists, but has not been translated to enterprise cost/risk/impact model."
          },
          {
            id: "pricingAlignment",
            label: "Our investment positioning and pricing strategy clearly aligns to decision-makers' views of value.",
            prefilled: "no",
            evidence: "Must fully map global and regional decision-makers – influence and view of value."
          },
          {
            id: "championArticulate",
            label: "Our champion and decision-makers can confidently articulate our value in business terms — emphasizing 'why Genesys' and 'why now'.",
            prefilled: "yes",
            evidence: "EMEA and CX leaders are strong supporters of our platform and impact – need to activate with other stakeholders, particularly CIO and CFO."
          },
          {
            id: "milestones",
            label: "We are achieving the time-bound milestones of our joint success plan (including technical, procurement, legal, etc. approvals).",
            prefilled: "no",
            evidence: "No agreed global sequencing or decision gates yet; regions still operating independently."
          },
        ],
      },
    ],
    wobble: {
      title: "Budget Cut Directive",
      description: "Following a weak earnings call, the CFO mandates a 30% reduction in investment, while still expecting delivery against the target outcomes. The CFO is explicitly asking for trade-offs and bottom-line impact, not optimism. Reducing investment might not mean reducing scope, but instead a phased approach.",
      question: "Given this update, which TWO actions best maintain executive confidence and decision momentum? Select top two.",
      type: "multi-select",
      maxSelections: 2,
      options: [
        { id: "A", text: "Reframe investment as phased, outcome-locked roadmap", detail: "Position a reduced Year 1 investment tied to hard cost and efficiency outcomes, with explicit expansion gates based on CFO-approved metrics." },
        { id: "B", text: "Narrow scope to highest-cost regions to accelerate payback", detail: "Focus initial expansion only on regions with highest cost-to-serve and operational inefficiency, deferring lower-impact geos." },
        { id: "C", text: "Present explicit trade-offs and consequences of each option", detail: "Lay out 2-3 investment scenarios (full, phased, reduced), clearly showing what is gained and lost in cost, risk, and AI maturity." },
        { id: "D", text: "Align with CFO on near-term financial proof points", detail: "Shift the conversation to CFO-defined success metrics (opex reduction, margin protection, avoided spend) before revisiting CX expansion." },
        { id: "E", text: "Proactively reduce Genesys' commercial footprint to preserve momentum", detail: "Offer temporary pricing, ramp schedules, or contractual flexibility to reduce near-term cash impact while keeping the deal alive." },
      ],
      multiSelectScores: {
        "A,C": 10,
        "C,D": 8,
        "A,D": 8,
        "A,B": 6,
        "B,C": 6,
        "B,D": 4,
        "C,E": 4,
        "A,E": 2,
        "D,E": 0,
        "B,E": 0,
      },
    },
    scoringCriteria: [
      { name: "Alignment to CIO/CFO Decision Risks", weight: 25, description: "Actions directly de-risk global platform decision with CIO/CFO-specific steps", poor: "Actions focus on CX leadership only; CIO/CFO concerns not addressed", champion: "Actions directly de-risk the global platform decision with CIO/CFO-specific steps" },
      { name: "Global Platform & AI Positioning", weight: 25, description: "Actions position Genesys as enterprise CX + AI execution layer across regions", poor: "Actions reinforce regional autonomy or pilots; AI treated as optional", champion: "Actions position Genesys as the enterprise CX + AI execution layer across regions" },
      { name: "Action Coverage Across Roles", weight: 25, description: "Fully orchestrated actions across roles with clear ownership and sequencing", poor: "Actions concentrated in 1-2 roles; regional or siloed execution", champion: "Fully orchestrated actions across roles with clear ownership, sequencing, and handoffs" },
      { name: "Trade-Off Framing", weight: 15, description: "Proactively frames trade-offs to help executives choose a path", poor: "Assumes expansion is universally positive; avoids trade-offs", champion: "Proactively frames trade-offs to help executives choose a path" },
      { name: "Sequencing & Global Momentum", weight: 10, description: "Clear sequencing tied to executive milestones and global rollout governance", poor: "Actions are unordered or region-specific; no path to approval", champion: "Clear sequencing tied to executive milestones and global rollout governance" },
    ],
    icon: Rocket,
    industryImage: "/industries/logistics.png",
  },
];

// ============================================================================
// STORAGE AND STATE
// ============================================================================

const STORAGE_KEYS = {
  TEAM_INFO: "genesys_sim_team",
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
  const [formData, setFormData] = useState({});
  const [wobbleChoice, setWobbleChoice] = useState(null);
  const [wobbleRanking, setWobbleRanking] = useState([]);
  const [wobbleMultiSelect, setWobbleMultiSelect] = useState([]);
  const [wobbleTextAnswers, setWobbleTextAnswers] = useState({});
  const [dealReviewAnswers, setDealReviewAnswers] = useState({});
  const [shuffledWobbleOptions, setShuffledWobbleOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Load team info on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem(STORAGE_KEYS.TEAM_INFO);
    if (savedTeam) {
      const team = JSON.parse(savedTeam);
      setTeamName(team.name);
      setTableNumber(team.table);
      setRoomNumber(team.room);
    }
  }, []);

  // Fetch leaderboard from API
  const fetchLeaderboard = useCallback(async (room) => {
    if (!room) return;
    try {
      const response = await fetch(`/api/leaderboard?room=${encodeURIComponent(room)}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    }
  }, []);

  // Fetch leaderboard when showing it
  useEffect(() => {
    if (roomNumber && showLeaderboard) {
      fetchLeaderboard(roomNumber);
      const interval = setInterval(() => fetchLeaderboard(roomNumber), 10000);
      return () => clearInterval(interval);
    }
  }, [roomNumber, showLeaderboard, fetchLeaderboard]);

  // Helpers
  const saveProgress = useCallback((newSubmissions, roundIdx, phase) => {
    const progress = { submissions: newSubmissions, currentRound: roundIdx, currentPhase: phase };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  }, []);

  const saveTeamInfo = useCallback((name, table, room) => {
    localStorage.setItem(STORAGE_KEYS.TEAM_INFO, JSON.stringify({ name, table, room }));
  }, []);

  const updateLeaderboard = useCallback(async (name, table, room, score, roundId) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: name, table, room, score, roundId })
      });
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error("Failed to update leaderboard:", err);
    }
  }, []);

  // Fetch with retry for API calls (client-side rate limit handling)
  const fetchWithRetry = useCallback(async (url, options, maxRetries = 3) => {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        // If rate limited, wait and retry
        if (response.status === 429 && attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 1) * 1000 + Math.random() * 1000;
          setError(`High demand - retrying in ${Math.round(delay/1000)} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        return response;
      } catch (err) {
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt + 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          throw err;
        }
      }
    }
  }, []);

  // Handlers
  const handleTeamSubmit = useCallback(async () => {
    if (teamName.trim() && tableNumber.trim() && roomNumber.trim()) {
      saveTeamInfo(teamName, tableNumber, roomNumber);

      // Register team with leaderboard API (for presenter word cloud)
      try {
        await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'register',
            room: roomNumber,
            table: tableNumber,
            teamName: teamName,
          })
        });
      } catch (err) {
        console.error("Failed to register team:", err);
        // Don't block - continue anyway
      }

      setSubmissions({});
      setCurrentRoundIndex(0);
      setRoundPhase("intro");
      setFormData({});
      setWobbleChoice(null);
      setWobbleRanking([]);
      setWobbleMultiSelect([]);
      setDealReviewAnswers({});
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
    }
    setCurrentView("simulation");
  }, []);

  const currentRound = simulationRounds[currentRoundIndex];
  const roundColor = theme.rounds[currentRound?.id]?.color || theme.orange;
  const phases = ["intro", "work", "feedback1", "wobble", "feedback2", "discussion"];
  const phaseIndex = phases.indexOf(roundPhase);

  // Fisher-Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const goToPhase = useCallback((phase) => {
    // Shuffle wobble options when entering wobble phase
    if (phase === "wobble" && currentRound?.wobble?.shuffleOptions && currentRound.wobble.options) {
      setShuffledWobbleOptions(shuffleArray(currentRound.wobble.options));
    }
    setRoundPhase(phase);
    saveProgress(submissions, currentRoundIndex, phase);
  }, [submissions, currentRoundIndex, saveProgress, currentRound]);

  // Submit initial response
  const handleInitialSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Build submission text from form data
      let submissionText = "";
      if (currentRound.useDealReviewChecklist) {
        // Format deal review checklist
        submissionText = "Deal Review Assessment:\n\n";
        currentRound.dealReviewChecklist.forEach(section => {
          submissionText += `${section.section}:\n`;
          section.items.forEach(item => {
            const answer = dealReviewAnswers[item.id] || {};
            submissionText += `- ${item.label}\n`;
            submissionText += `  Answer: ${answer.value === 'yes' ? 'Yes' : 'No'}\n`;
            if (answer.evidence) submissionText += `  Evidence: ${answer.evidence}\n`;
            if (answer.nextActions) submissionText += `  Next Actions: ${answer.nextActions}\n`;
          });
          submissionText += "\n";
        });
      } else {
        currentRound.inputFields.forEach(field => {
          if (formData[field.id]) {
            submissionText += `${field.label}:\n${formData[field.id]}\n\n`;
          }
        });
      }

      // Add small random delay (0-2s) to spread out concurrent requests
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));

      const response = await fetchWithRetry("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: submissionText,
          round: {
            title: currentRound.title,
            subtitle: currentRound.subtitle,
            motion: currentRound.motion,
            customer: currentRound.customer,
            objective: currentRound.objective,
            challenge: currentRound.challenge,
            context: currentRound.context,
            scoringCriteria: currentRound.scoringCriteria,
            wobble: { title: currentRound.wobble.title, description: currentRound.wobble.description },
          },
          phase: "initial",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get score. Please try again.");
      }

      const result = await response.json();

      // Check if fallback was used
      if (result.isFallback) {
        console.log("Received fallback score due to high demand");
      }

      // Store submission with results
      const newSubmissions = {
        ...submissions,
        [currentRound.id]: {
          formData: currentRound.useDealReviewChecklist ? dealReviewAnswers : formData,
          submissionText,
          initialScore: result.score.overall,
          initialFeedback: result.coaching,
          criteriaScores: result.score.criteria,
        },
      };
      setSubmissions(newSubmissions);
      saveProgress(newSubmissions, currentRoundIndex, "feedback1");
      goToPhase("feedback1");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRound, formData, dealReviewAnswers, submissions, currentRoundIndex, saveProgress, goToPhase]);

  // Submit wobble response
  const handleWobbleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate wobble points based on type
      let wobblePoints = 0;
      let wobbleResponseText = "";

      if (currentRound.wobble.type === "choice") {
        const selectedOption = currentRound.wobble.options.find(o => o.id === wobbleChoice);
        wobblePoints = selectedOption?.points || 0;
        wobbleResponseText = `Selected: ${selectedOption?.text}\n${selectedOption?.detail}`;
      } else if (currentRound.wobble.type === "ranking") {
        const rankingKey = wobbleRanking.join(",");
        wobblePoints = currentRound.wobble.rankingScores[rankingKey] || 0;
        wobbleResponseText = `Ranking: ${wobbleRanking.join(" > ")}`;
      } else if (currentRound.wobble.type === "multi-select") {
        const selectionKey = wobbleMultiSelect.sort().join(",");
        wobblePoints = currentRound.wobble.multiSelectScores[selectionKey] || 0;
        wobbleResponseText = `Selected: ${wobbleMultiSelect.join(", ")}`;
      } else if (currentRound.wobble.type === "text-questions") {
        // Text questions get base points for completion, AI evaluates quality
        wobblePoints = currentRound.wobble.basePoints || 5;
        wobbleResponseText = currentRound.wobble.textQuestions.map(q =>
          `${q.label}\n${wobbleTextAnswers[q.id] || "(No response)"}`
        ).join("\n\n");
      }

      // Get final score with AI evaluation
      const currentSubmission = submissions[currentRound.id];

      // Add small random delay to spread out concurrent requests
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000));

      const response = await fetchWithRetry("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission: currentSubmission.submissionText,
          wobbleResponse: wobbleResponseText,
          round: {
            title: currentRound.title,
            subtitle: currentRound.subtitle,
            motion: currentRound.motion,
            customer: currentRound.customer,
            objective: currentRound.objective,
            challenge: currentRound.challenge,
            context: currentRound.context,
            scoringCriteria: currentRound.scoringCriteria,
            wobble: {
              title: currentRound.wobble.title,
              description: currentRound.wobble.description,
              question: currentRound.wobble.question,
            },
          },
          phase: "wobble",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get final score. Please try again.");
      }

      const result = await response.json();

      // Calculate final score: use INITIAL score (not re-scored) + wobble points, capped at 100
      // The API call is for getting discussion summary and feedback, but we preserve the original score
      const baseScore = currentSubmission.initialScore;
      const finalScore = Math.min(100, Math.max(0, baseScore + wobblePoints));

      // Update submission with final results
      const newSubmissions = {
        ...submissions,
        [currentRound.id]: {
          ...currentSubmission,
          wobbleChoice: currentRound.wobble.type === "choice" ? wobbleChoice :
                        currentRound.wobble.type === "ranking" ? wobbleRanking :
                        wobbleMultiSelect,
          wobblePoints,
          wobbleResponse: wobbleResponseText,
          finalScore,
          finalFeedback: result.coaching,
          finalCriteriaScores: result.score.criteria,
          discussionSummary: result.discussionSummary,
        },
      };
      setSubmissions(newSubmissions);
      saveProgress(newSubmissions, currentRoundIndex, "feedback2");

      // Update leaderboard
      await updateLeaderboard(teamName, tableNumber, roomNumber, finalScore, currentRound.id);

      goToPhase("feedback2");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRound, wobbleChoice, wobbleRanking, wobbleMultiSelect, wobbleTextAnswers, submissions, currentRoundIndex, saveProgress, goToPhase, teamName, tableNumber, roomNumber, updateLeaderboard]);

  // Move to next round
  const handleNextRound = useCallback(() => {
    if (currentRoundIndex < simulationRounds.length - 1) {
      const nextIndex = currentRoundIndex + 1;
      setCurrentRoundIndex(nextIndex);
      setRoundPhase("intro");
      setFormData({});
      setWobbleChoice(null);
      setWobbleRanking([]);
      setWobbleMultiSelect([]);
      setWobbleTextAnswers({});
      setDealReviewAnswers({});
      saveProgress(submissions, nextIndex, "intro");
    }
  }, [currentRoundIndex, submissions, saveProgress]);

  // Industry images for background
  const industryImages = {
    1: "/industries/healthcare.png",
    2: "/industries/financial.png",
    3: "/industries/retail.png",
    4: "/industries/logistics.png",
  };

  // Check for saved session on home screen
  const hasSavedSession = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.PROGRESS);

  // ============================================================================
  // RENDER: HOME SCREEN
  // ============================================================================

  if (currentView === "home") {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8">
            {/* Logo and Title */}
            <div className="text-center mb-10">
              <img src="/genesys-logo.png" alt="Genesys" className="h-16 mx-auto mb-8" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3" style={{ color: theme.white }}>
                Sales Simulation
              </h1>
              <p className="text-lg" style={{ color: theme.muted }}>
                Register your team to begin
              </p>
            </div>

            {/* Registration Form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-5 py-4 rounded-xl text-lg font-medium outline-none transition-all"
                style={{
                  background: theme.dark,
                  border: `2px solid ${theme.darkMuted}`,
                  color: theme.white,
                }}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Room #"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl text-lg font-medium outline-none transition-all"
                  style={{
                    background: theme.dark,
                    border: `2px solid ${theme.darkMuted}`,
                    color: theme.white,
                  }}
                />
                <input
                  type="text"
                  placeholder="Table #"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl text-lg font-medium outline-none transition-all"
                  style={{
                    background: theme.dark,
                    border: `2px solid ${theme.darkMuted}`,
                    color: theme.white,
                  }}
                />
              </div>

              <GlowButton
                onClick={handleTeamSubmit}
                disabled={!teamName.trim() || !tableNumber.trim() || !roomNumber.trim()}
                className="w-full mt-6"
              >
                {hasSavedSession ? "Start New Session" : "Begin Simulation"}
                <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </GlowButton>

              {hasSavedSession && (
                <button
                  onClick={handleResumeSession}
                  className="w-full py-4 rounded-xl text-lg font-medium transition-all hover:bg-opacity-80"
                  style={{
                    background: theme.dark,
                    border: `2px solid ${theme.darkMuted}`,
                    color: theme.white,
                  }}
                >
                  Resume Previous Session
                </button>
              )}
            </div>
          </Card>
        </div>
      </AnimatedBackground>
    );
  }

  // ============================================================================
  // RENDER: SIMULATION
  // ============================================================================

  if (currentView === "simulation" && currentRound) {
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

        <main className="max-w-6xl mx-auto px-4 py-8">
          <ProgressDots total={phases.length} current={phaseIndex} roundColor={roundColor} />

          {/* INTRO PHASE */}
          {roundPhase === "intro" && (
            <div className="space-y-6">
              {/* Hero Image with Title Overlay */}
              <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: "280px" }}>
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${industryImages[currentRound.id]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${theme.black} 0%, ${theme.black}90 40%, transparent 100%)`,
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4"
                    style={{ backgroundColor: roundColor, color: theme.white }}
                  >
                    {currentRound.motion}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: theme.white }}>
                    {currentRound.title}
                  </h1>
                  <p className="text-lg" style={{ color: theme.muted }}>
                    {currentRound.description}
                  </p>
                </div>
              </div>

              {/* Customer Info Card */}
              <Card className="p-6">
                <div className="flex items-start gap-5 mb-4">
                  {/* Customer Logo - larger size, falls back to icon if no image */}
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: theme.dark }}>
                    {currentRound.customer.logo ? (
                      <img
                        src={currentRound.customer.logo}
                        alt={currentRound.customer.name}
                        className="w-full h-full object-contain p-3"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full items-center justify-center ${currentRound.customer.logo ? 'hidden' : 'flex'}`}>
                      <Building2 className="w-12 h-12" style={{ color: roundColor }} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold" style={{ color: theme.white }}>{currentRound.customer.name}</h2>
                    <p className="text-lg" style={{ color: theme.muted }}>{currentRound.customer.industry}</p>
                    <p className="text-base" style={{ color: theme.subtle }}>{currentRound.customer.revenue}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: theme.subtle }} />
                    <span style={{ color: theme.muted }}>{currentRound.customer.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" style={{ color: theme.subtle }} />
                    <span style={{ color: theme.muted }}>{currentRound.customer.currentSolution}</span>
                  </div>
                </div>
              </Card>

              {/* Customer Context Card - Show first 5 items */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6" style={{ color: roundColor }} />
                  <h3 className="text-lg font-bold" style={{ color: theme.white }}>Customer Context</h3>
                </div>
                <ul className="space-y-2.5">
                  {currentRound.context.slice(0, 5).map((ctx, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: theme.light }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: roundColor }} />
                      {ctx}
                    </li>
                  ))}
                </ul>
              </Card>

              <GlowButton onClick={() => goToPhase("work")} color={roundColor} className="w-full">
                Begin Team Work <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </GlowButton>
            </div>
          )}

          {/* WORK PHASE */}
          {roundPhase === "work" && (
            <div className="space-y-6">
              {/* Selling Objective Header */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6" style={{ color: roundColor }} />
                  <h2 className="text-xl font-bold" style={{ color: theme.white }}>Selling Objective</h2>
                </div>
                <p className="text-base mb-4 pb-4 border-b" style={{ color: theme.light, borderColor: theme.darkMuted }}>
                  {currentRound.objective}
                </p>
                <div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: theme.muted }}>YOUR TASK</h3>
                  <p className="text-base" style={{ color: theme.white }}>{currentRound.challenge}</p>
                </div>
              </Card>

              {/* Input Card */}
              <Card className="p-6">

                {/* Input Fields or Deal Review Checklist */}
                {currentRound.useDealReviewChecklist ? (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold mb-2" style={{ color: theme.white }}>Deal Review Framework</h3>
                      <p className="text-sm" style={{ color: theme.muted }}>
                        Review the assessment below. For items marked <span style={{ color: theme.orange }}>"No"</span>, define the <strong>Next Actions</strong> your team would take to address the gap.
                      </p>
                    </div>

                    {/* Table-style Deal Review - Light theme for contrast */}
                    <div className="rounded-xl overflow-hidden border-2" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-0 text-xs font-bold" style={{ backgroundColor: '#1F2937' }}>
                        <div className="col-span-5 px-4 py-3 border-r" style={{ borderColor: '#374151', color: '#D1D5DB' }}>
                          CRITERIA
                        </div>
                        <div className="col-span-1 px-2 py-3 text-center border-r" style={{ borderColor: '#374151', color: '#D1D5DB' }}>
                          Y/N
                        </div>
                        <div className="col-span-3 px-4 py-3 border-r" style={{ borderColor: '#374151', color: '#D1D5DB' }}>
                          EVIDENCE
                        </div>
                        <div className="col-span-3 px-4 py-3" style={{ color: theme.orange }}>
                          NEXT ACTIONS
                        </div>
                      </div>

                      {/* Table Body by Section */}
                      {currentRound.dealReviewChecklist.map((section, sIdx) => (
                        <div key={sIdx}>
                          {/* Section Header Row */}
                          <div
                            className="px-4 py-2 text-sm font-bold border-t"
                            style={{
                              backgroundColor: `${roundColor}20`,
                              borderColor: '#E5E7EB',
                              color: roundColor
                            }}
                          >
                            {section.section}
                          </div>

                          {/* Section Items */}
                          {section.items.map((item, iIdx) => {
                            const isNo = item.prefilled === 'no';
                            const answer = dealReviewAnswers[item.id] || {};
                            return (
                              <div
                                key={iIdx}
                                className="grid grid-cols-12 gap-0 border-t"
                                style={{
                                  backgroundColor: isNo ? '#FEF3F2' : '#FFFFFF',
                                  borderColor: '#E5E7EB'
                                }}
                              >
                                {/* Criteria Column */}
                                <div className="col-span-5 px-4 py-3 border-r text-sm" style={{ borderColor: '#E5E7EB', color: '#374151' }}>
                                  {item.label}
                                </div>

                                {/* Yes/No Column */}
                                <div className="col-span-1 px-2 py-3 flex items-center justify-center border-r" style={{ borderColor: '#E5E7EB' }}>
                                  <div
                                    className="px-2 py-1 rounded text-xs font-bold"
                                    style={{
                                      backgroundColor: isNo ? '#FEE2E2' : '#D1FAE5',
                                      color: isNo ? '#DC2626' : '#059669',
                                    }}
                                  >
                                    {isNo ? 'N' : 'Y'}
                                  </div>
                                </div>

                                {/* Evidence Column */}
                                <div className="col-span-3 px-4 py-3 border-r text-xs" style={{ borderColor: '#E5E7EB', color: '#6B7280' }}>
                                  {item.evidence}
                                </div>

                                {/* Next Actions Column */}
                                <div className="col-span-3 px-3 py-2" style={{ backgroundColor: isNo ? '#FEF3F2' : '#F9FAFB' }}>
                                  {isNo ? (
                                    <textarea
                                      value={answer.nextActions || ''}
                                      onChange={(e) => setDealReviewAnswers({
                                        ...dealReviewAnswers,
                                        [item.id]: { ...answer, nextActions: e.target.value }
                                      })}
                                      placeholder="Define actions to address this gap..."
                                      className="w-full px-3 py-2 rounded text-xs resize-none"
                                      rows={3}
                                      style={{
                                        backgroundColor: '#FFFFFF',
                                        border: '2px solid #F97316',
                                        color: '#1F2937',
                                      }}
                                    />
                                  ) : (
                                    <span className="text-xs italic" style={{ color: '#9CA3AF' }}>—</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Render input field */}
                    {(() => {
                      const renderField = (field) => (
                        <div key={field.id}>
                          <label className="text-sm font-medium mb-2 block" style={{ color: theme.white }}>
                            {field.label}
                          </label>
                          {field.type === "strategy-select" ? (
                            <div className="grid grid-cols-4 gap-3">
                              {field.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => setFormData({ ...formData, [field.id]: opt })}
                                  className={`p-4 rounded-xl text-center transition-all ${
                                    formData[field.id] === opt ? 'ring-2' : ''
                                  }`}
                                  style={{
                                    backgroundColor: formData[field.id] === opt ? `${roundColor}20` : theme.dark,
                                    color: formData[field.id] === opt ? roundColor : theme.white,
                                    ringColor: roundColor,
                                  }}
                                >
                                  <div className="flex flex-col items-center gap-1">
                                    {formData[field.id] === opt ? (
                                      <CheckCircle className="w-6 h-6" />
                                    ) : (
                                      <CircleDot className="w-6 h-6" style={{ color: theme.muted }} />
                                    )}
                                    <span className="font-bold">{opt}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <textarea
                              value={formData[field.id] || ''}
                              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                              rows={3}
                              style={{
                                backgroundColor: theme.dark,
                                border: `1px solid ${theme.darkMuted}`,
                                color: theme.white,
                              }}
                            />
                          )}
                        </div>
                      );

                      // Layout: Single question at top, then 2x2 grid
                      if (currentRound.inputLayout === "singleTop-2x2") {
                        const [firstField, ...restFields] = currentRound.inputFields;
                        return (
                          <>
                            {/* Single question at top */}
                            <div className="mb-6">
                              {renderField(firstField)}
                            </div>
                            {/* 2x2 grid for remaining questions */}
                            <div className="grid md:grid-cols-2 gap-4">
                              {restFields.map(renderField)}
                            </div>
                          </>
                        );
                      }

                      // Layout: Two columns side by side with headers (Round 2)
                      if (currentRound.inputLayout === "twoColumnHeaders") {
                        const leftField = currentRound.inputFields.find(f => f.column === "left");
                        const rightField = currentRound.inputFields.find(f => f.column === "right");
                        return (
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div>
                              <h3 className="text-xl font-bold mb-3" style={{ color: roundColor }}>{leftField.header}</h3>
                              <p className="text-sm mb-3" style={{ color: theme.muted }}>{leftField.label}</p>
                              <textarea
                                value={formData[leftField.id] || ''}
                                onChange={(e) => setFormData({ ...formData, [leftField.id]: e.target.value })}
                                placeholder={leftField.placeholder}
                                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                rows={10}
                                style={{
                                  backgroundColor: theme.dark,
                                  border: `1px solid ${theme.darkMuted}`,
                                  color: theme.white,
                                }}
                              />
                            </div>
                            {/* Right Column */}
                            <div>
                              <h3 className="text-xl font-bold mb-3" style={{ color: roundColor }}>{rightField.header}</h3>
                              <p className="text-sm mb-3" style={{ color: theme.muted }}>{rightField.label}</p>
                              <textarea
                                value={formData[rightField.id] || ''}
                                onChange={(e) => setFormData({ ...formData, [rightField.id]: e.target.value })}
                                placeholder={rightField.placeholder}
                                className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                rows={10}
                                style={{
                                  backgroundColor: theme.dark,
                                  border: `1px solid ${theme.darkMuted}`,
                                  color: theme.white,
                                }}
                              />
                            </div>
                          </div>
                        );
                      }

                      // Layout: Strategy selection paired with rationale, then remaining fields
                      if (currentRound.inputLayout === "strategyPaired") {
                        const strategyFields = currentRound.inputFields.filter(f => f.group === "strategy");
                        const otherFields = currentRound.inputFields.filter(f => f.group !== "strategy");
                        const strategySelect = strategyFields.find(f => f.type === "strategy-select");
                        const strategyRationale = strategyFields.find(f => f.type === "textarea");

                        return (
                          <>
                            {/* Strategy Selection + Rationale in connected group */}
                            <div className="p-5 rounded-xl mb-6" style={{ backgroundColor: theme.dark, border: `1px solid ${theme.darkMuted}` }}>
                              {/* Strategy Selection */}
                              <label className="text-sm font-medium mb-3 block" style={{ color: theme.white }}>
                                {strategySelect.label}
                              </label>
                              <div className="grid grid-cols-4 gap-3 mb-5">
                                {strategySelect.options.map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => setFormData({ ...formData, [strategySelect.id]: opt })}
                                    className={`p-4 rounded-xl text-center transition-all ${
                                      formData[strategySelect.id] === opt ? 'ring-2' : ''
                                    }`}
                                    style={{
                                      backgroundColor: formData[strategySelect.id] === opt ? `${roundColor}20` : theme.darker,
                                      color: formData[strategySelect.id] === opt ? roundColor : theme.white,
                                      ringColor: roundColor,
                                    }}
                                  >
                                    <div className="flex flex-col items-center gap-1">
                                      {formData[strategySelect.id] === opt ? (
                                        <CheckCircle className="w-6 h-6" />
                                      ) : (
                                        <CircleDot className="w-6 h-6" style={{ color: theme.muted }} />
                                      )}
                                      <span className="font-bold">{opt}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              {/* Rationale directly below */}
                              <div className="pt-4 border-t" style={{ borderColor: theme.darkMuted }}>
                                <label className="text-sm font-medium mb-2 block" style={{ color: theme.white }}>
                                  {strategyRationale.label}
                                </label>
                                <textarea
                                  value={formData[strategyRationale.id] || ''}
                                  onChange={(e) => setFormData({ ...formData, [strategyRationale.id]: e.target.value })}
                                  placeholder={strategyRationale.placeholder}
                                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                  rows={3}
                                  style={{
                                    backgroundColor: theme.darker,
                                    border: `1px solid ${theme.darkMuted}`,
                                    color: theme.white,
                                  }}
                                />
                              </div>
                            </div>

                            {/* Remaining fields - 2 on top, 1 full width below */}
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              {otherFields.slice(0, 2).map(renderField)}
                            </div>
                            <div>
                              {otherFields.slice(2).map(renderField)}
                            </div>
                          </>
                        );
                      }

                      // Default layout: stacked
                      return currentRound.inputFields.map(renderField);
                    })()}
                  </div>
                )}
              </Card>

              {error && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${theme.orange}20`, border: `1px solid ${theme.orange}` }}>
                  <p className="text-sm" style={{ color: theme.orange }}>{error}</p>
                </div>
              )}

              <GlowButton
                onClick={handleInitialSubmit}
                disabled={isSubmitting}
                color={roundColor}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="inline-block mr-2 w-5 h-5 animate-spin" />
                    AI Coach is Reviewing...
                  </>
                ) : (
                  <>
                    Submit for Feedback <Send className="inline-block ml-2 w-5 h-5" />
                  </>
                )}
              </GlowButton>
            </div>
          )}

          {/* FEEDBACK 1 PHASE */}
          {roundPhase === "feedback1" && submissions[currentRound.id] && (
            <div className="space-y-6">
              <Card className="p-6" glow color={roundColor}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: theme.white }}>Initial Feedback</h2>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl font-black" style={{ color: roundColor }}>
                      {submissions[currentRound.id].initialScore}
                    </div>
                    <div className="text-sm" style={{ color: theme.muted }}>
                      / 100
                    </div>
                  </div>
                </div>

                <p className="text-base leading-relaxed mb-6" style={{ color: theme.light }}>
                  {submissions[currentRound.id].initialFeedback?.mainFeedback}
                </p>

                {/* Criteria Scores */}
                <div className="space-y-3 mb-6">
                  {currentRound.scoringCriteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.dark }}>
                      <span className="text-sm font-medium" style={{ color: theme.white }}>{criterion.name}</span>
                      <span className="text-lg font-bold" style={{ color: roundColor }}>
                        {submissions[currentRound.id].criteriaScores?.[criterion.name] || 0}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Strengths & Improvements */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "#10B981" }}>
                      <ThumbsUp className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                      {submissions[currentRound.id].initialFeedback?.strengths?.map((s, i) => (
                        <li key={i} className="text-sm" style={{ color: theme.light }}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: theme.orange }}>
                      <Lightbulb className="w-4 h-4" /> Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {submissions[currentRound.id].initialFeedback?.improvements?.map((s, i) => (
                        <li key={i} className="text-sm" style={{ color: theme.light }}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <GlowButton onClick={() => goToPhase("wobble")} color={roundColor} className="w-full">
                Continue to Wobble <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </GlowButton>
            </div>
          )}

          {/* WOBBLE PHASE */}
          {roundPhase === "wobble" && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6" style={{ color: "#F59E0B" }} />
                  <h2 className="text-2xl font-bold" style={{ color: theme.white }}>Wobble: {currentRound.wobble.title}</h2>
                </div>
                <p className="text-base leading-relaxed mb-6" style={{ color: theme.light }}>
                  {currentRound.wobble.description}
                </p>
                <p className="text-lg font-medium mb-6" style={{ color: theme.white }}>
                  {currentRound.wobble.question}
                </p>

                {/* CHOICE TYPE */}
                {currentRound.wobble.type === "choice" && (
                  <div className="space-y-3">
                    {(currentRound.wobble.shuffleOptions ? shuffledWobbleOptions : currentRound.wobble.options).map((option, idx) => (
                      <button
                        key={option.id}
                        onClick={() => setWobbleChoice(option.id)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          wobbleChoice === option.id ? 'ring-2' : ''
                        }`}
                        style={{
                          backgroundColor: wobbleChoice === option.id ? `${roundColor}20` : theme.dark,
                          ringColor: roundColor,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              backgroundColor: wobbleChoice === option.id ? roundColor : theme.darkMuted,
                              color: theme.white,
                            }}
                          >
                            {wobbleChoice === option.id ? (
                              <Check className="w-5 h-5" />
                            ) : (
                              <CircleDot className="w-5 h-5" style={{ color: theme.subtle }} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium mb-1" style={{ color: theme.white }}>{option.text}</p>
                            <p className="text-sm" style={{ color: theme.muted }}>{option.detail}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* RANKING TYPE */}
                {currentRound.wobble.type === "ranking" && (
                  <div className="space-y-3">
                    <p className="text-sm mb-4" style={{ color: theme.muted }}>
                      Click the options below in order from most effective (1st) to least effective (4th).
                    </p>
                    {wobbleRanking.length < 4 && (
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-medium" style={{ color: theme.subtle }}>Click to add to ranking:</p>
                        {(currentRound.wobble.shuffleOptions ? shuffledWobbleOptions : currentRound.wobble.options)
                          .filter(o => !wobbleRanking.includes(o.id))
                          .map((option) => (
                            <button
                              key={option.id}
                              onClick={() => setWobbleRanking([...wobbleRanking, option.id])}
                              className="w-full p-3 rounded-lg text-left transition-all hover:bg-opacity-80"
                              style={{ backgroundColor: theme.dark }}
                            >
                              <p className="font-medium text-sm" style={{ color: theme.white }}>{option.text}</p>
                              <p className="text-xs mt-1" style={{ color: theme.muted }}>{option.detail}</p>
                            </button>
                          ))}
                      </div>
                    )}
                    {wobbleRanking.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium" style={{ color: theme.subtle }}>Your ranking:</p>
                        {wobbleRanking.map((id, idx) => {
                          const option = currentRound.wobble.options.find(o => o.id === id);
                          return (
                            <div
                              key={id}
                              className="flex items-center gap-3 p-3 rounded-lg"
                              style={{ backgroundColor: `${roundColor}20` }}
                            >
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                                style={{ backgroundColor: roundColor, color: theme.white }}
                              >
                                {idx + 1}
                              </div>
                              <p className="font-medium text-sm flex-1" style={{ color: theme.white }}>{option?.text}</p>
                              <button
                                onClick={() => setWobbleRanking(wobbleRanking.filter(r => r !== id))}
                                className="p-1 rounded hover:bg-white/10"
                              >
                                <X className="w-4 h-4" style={{ color: theme.muted }} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* MULTI-SELECT TYPE */}
                {currentRound.wobble.type === "multi-select" && (
                  <div className="space-y-3">
                    <p className="text-sm mb-4" style={{ color: theme.muted }}>
                      Select exactly {currentRound.wobble.maxSelections} options.
                    </p>
                    {currentRound.wobble.options.map((option) => {
                      const isSelected = wobbleMultiSelect.includes(option.id);
                      const canSelect = isSelected || wobbleMultiSelect.length < currentRound.wobble.maxSelections;
                      return (
                        <button
                          key={option.id}
                          onClick={() => {
                            if (isSelected) {
                              setWobbleMultiSelect(wobbleMultiSelect.filter(s => s !== option.id));
                            } else if (canSelect) {
                              setWobbleMultiSelect([...wobbleMultiSelect, option.id]);
                            }
                          }}
                          disabled={!canSelect && !isSelected}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            isSelected ? 'ring-2' : ''
                          } ${!canSelect && !isSelected ? 'opacity-50' : ''}`}
                          style={{
                            backgroundColor: isSelected ? `${roundColor}20` : theme.dark,
                            ringColor: roundColor,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{
                                backgroundColor: isSelected ? roundColor : theme.darkMuted,
                                color: theme.white,
                              }}
                            >
                              {isSelected ? <Check className="w-5 h-5" /> : option.id}
                            </div>
                            <div>
                              <p className="font-medium mb-1" style={{ color: theme.white }}>{option.text}</p>
                              <p className="text-sm" style={{ color: theme.muted }}>{option.detail}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* TEXT QUESTIONS TYPE */}
                {currentRound.wobble.type === "text-questions" && (
                  <div className="space-y-5">
                    {currentRound.wobble.textQuestions.map((question) => (
                      <div key={question.id}>
                        <label className="text-sm font-medium mb-2 block" style={{ color: theme.white }}>
                          {question.label}
                        </label>
                        <textarea
                          value={wobbleTextAnswers[question.id] || ''}
                          onChange={(e) => setWobbleTextAnswers({
                            ...wobbleTextAnswers,
                            [question.id]: e.target.value
                          })}
                          placeholder={question.placeholder}
                          className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                          rows={4}
                          style={{
                            backgroundColor: theme.dark,
                            border: `1px solid ${theme.darkMuted}`,
                            color: theme.white,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {error && (
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${theme.orange}20`, border: `1px solid ${theme.orange}` }}>
                  <p className="text-sm" style={{ color: theme.orange }}>{error}</p>
                </div>
              )}

              <GlowButton
                onClick={handleWobbleSubmit}
                disabled={
                  isSubmitting ||
                  (currentRound.wobble.type === "choice" && !wobbleChoice) ||
                  (currentRound.wobble.type === "ranking" && wobbleRanking.length !== 4) ||
                  (currentRound.wobble.type === "multi-select" && wobbleMultiSelect.length !== currentRound.wobble.maxSelections) ||
                  (currentRound.wobble.type === "text-questions" && !currentRound.wobble.textQuestions.every(q => wobbleTextAnswers[q.id]?.trim()))
                }
                color={roundColor}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="inline-block mr-2 w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Submit Wobble Response <Send className="inline-block ml-2 w-5 h-5" />
                  </>
                )}
              </GlowButton>
            </div>
          )}

          {/* FEEDBACK 2 PHASE */}
          {roundPhase === "feedback2" && submissions[currentRound.id] && (
            <div className="space-y-6">
              <Card className="p-6" glow color={roundColor}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: theme.white }}>Final Score</h2>
                  <div className="flex items-center gap-3">
                    <div className="text-5xl font-black" style={{ color: roundColor }}>
                      {submissions[currentRound.id].finalScore}
                    </div>
                    <div className="text-sm" style={{ color: theme.muted }}>
                      / 100
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: theme.dark }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: theme.muted }}>Base Score</span>
                    <span className="font-bold" style={{ color: theme.white }}>
                      {submissions[currentRound.id].finalScore - submissions[currentRound.id].wobblePoints}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.muted }}>Wobble Adjustment</span>
                    <span className="font-bold" style={{ color: submissions[currentRound.id].wobblePoints >= 0 ? "#10B981" : theme.orange }}>
                      {submissions[currentRound.id].wobblePoints >= 0 ? "+" : ""}{submissions[currentRound.id].wobblePoints}
                    </span>
                  </div>
                </div>

                <p className="text-base leading-relaxed mb-6" style={{ color: theme.light }}>
                  {submissions[currentRound.id].finalFeedback?.mainFeedback}
                </p>

                {/* Tier Badge */}
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-8 h-8" style={{ color: "#FFD700" }} />
                  <span className="text-xl font-bold" style={{ color: theme.white }}>
                    {submissions[currentRound.id].finalFeedback?.scoreInterpretation}
                  </span>
                </div>
              </Card>

              <GlowButton onClick={() => goToPhase("discussion")} color={roundColor} className="w-full">
                View Round Summary <ChevronRight className="inline-block ml-2 w-5 h-5" />
              </GlowButton>
            </div>
          )}

          {/* DISCUSSION PHASE */}
          {roundPhase === "discussion" && submissions[currentRound.id] && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: theme.white }}>Round {currentRound.id} Summary</h2>

                {/* Final Score Display */}
                <div className="flex items-center justify-center gap-4 p-6 rounded-xl mb-6" style={{ backgroundColor: theme.dark }}>
                  <Trophy className="w-12 h-12" style={{ color: "#FFD700" }} />
                  <div className="text-center">
                    <div className="text-5xl font-black" style={{ color: roundColor }}>
                      {submissions[currentRound.id].finalScore}
                    </div>
                    <div className="text-sm" style={{ color: theme.muted }}>
                      {submissions[currentRound.id].finalFeedback?.scoreInterpretation}
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <div className="text-sm" style={{ color: theme.muted }}>Wobble</div>
                    <div className="font-bold" style={{ color: submissions[currentRound.id].wobblePoints >= 0 ? "#10B981" : theme.orange }}>
                      {submissions[currentRound.id].wobblePoints >= 0 ? "+" : ""}{submissions[currentRound.id].wobblePoints}
                    </div>
                  </div>
                </div>

                {/* Key Insight - Big takeaway */}
                {submissions[currentRound.id].discussionSummary?.keyInsight && (
                  <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: `${roundColor}20`, border: `1px solid ${roundColor}40` }}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: roundColor }} />
                      <div>
                        <h3 className="text-sm font-bold mb-1" style={{ color: roundColor }}>Key Insight</h3>
                        <p className="text-base font-medium" style={{ color: theme.white }}>
                          {submissions[currentRound.id].discussionSummary.keyInsight}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* What Worked & Growth Area */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* What Worked */}
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp className="w-5 h-5" style={{ color: "#10B981" }} />
                      <h4 className="text-sm font-bold" style={{ color: "#10B981" }}>What Worked</h4>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: theme.light }}>
                      {submissions[currentRound.id].discussionSummary?.whatWorked ||
                       submissions[currentRound.id].finalFeedback?.strengths?.join(". ")}
                    </p>
                  </div>

                  {/* Growth Area */}
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5" style={{ color: theme.orange }} />
                      <h4 className="text-sm font-bold" style={{ color: theme.orange }}>Area for Growth</h4>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: theme.light }}>
                      {submissions[currentRound.id].discussionSummary?.growthArea ||
                       submissions[currentRound.id].finalFeedback?.improvements?.join(". ")}
                    </p>
                  </div>
                </div>

                {/* Team Discussion Questions */}
                <div className="p-5 rounded-xl" style={{ backgroundColor: `${roundColor}10`, border: `1px solid ${roundColor}30` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5" style={{ color: roundColor }} />
                    <h4 className="text-base font-bold" style={{ color: theme.white }}>Team Discussion</h4>
                  </div>
                  <ul className="space-y-3">
                    {(submissions[currentRound.id].discussionSummary?.discussionQuestions ||
                      submissions[currentRound.id].finalFeedback?.nextSteps)?.map((question, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{ backgroundColor: roundColor, color: theme.white }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: theme.light }}>{question}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {currentRoundIndex < simulationRounds.length - 1 ? (
                <GlowButton onClick={handleNextRound} color={roundColor} className="w-full">
                  Continue to Round {currentRound.id + 1} <ChevronRight className="inline-block ml-2 w-5 h-5" />
                </GlowButton>
              ) : (
                <GlowButton onClick={() => setRoundPhase("final")} color={theme.orange} className="w-full">
                  <Trophy className="inline-block mr-2 w-5 h-5" />
                  Complete Simulation
                </GlowButton>
              )}
            </div>
          )}

          {/* FINAL CELEBRATION PHASE */}
          {roundPhase === "final" && (
            <div className="space-y-6">
              {/* Celebration Header */}
              <Card className="p-8 text-center" glow color={theme.orange}>
                <div className="relative">
                  <Crown className="w-20 h-20 mx-auto mb-4" style={{ color: "#FFD700" }} />
                  <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: theme.white }}>
                    Simulation Complete!
                  </h1>
                  <p className="text-xl mb-6" style={{ color: theme.muted }}>
                    Congratulations, {teamName}!
                  </p>
                  <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl" style={{ backgroundColor: theme.dark }}>
                    <Flame className="w-10 h-10" style={{ color: theme.orange }} />
                    <div className="text-left">
                      <div className="text-sm font-medium" style={{ color: theme.muted }}>Total Score</div>
                      <div className="text-5xl font-black" style={{ color: theme.orange }}>
                        {Object.values(submissions).reduce((sum, s) => sum + (s.finalScore || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Round-by-Round Scores */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3" style={{ color: theme.white }}>
                  <BarChart3 className="w-6 h-6" style={{ color: theme.orange }} />
                  Round-by-Round Performance
                </h2>
                <div className="space-y-3">
                  {simulationRounds.map((round) => {
                    const submission = submissions[round.id];
                    const roundTheme = theme.rounds[round.id];
                    return (
                      <div
                        key={round.id}
                        className="flex items-center gap-4 p-4 rounded-xl"
                        style={{ backgroundColor: theme.dark }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                          style={{ backgroundColor: roundTheme.color, color: theme.white }}
                        >
                          {round.id}
                        </div>
                        <div className="flex-1">
                          <div className="font-bold" style={{ color: theme.white }}>{round.title}</div>
                          <div className="text-sm" style={{ color: theme.muted }}>{round.motion}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black" style={{ color: roundTheme.color }}>
                            {submission?.finalScore || 0}
                          </div>
                          {submission?.wobblePoints !== undefined && (
                            <div className="text-xs" style={{ color: theme.subtle }}>
                              Base: {submission.initialScore} | Wobble: {submission.wobblePoints > 0 ? '+' : ''}{submission.wobblePoints}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Leaderboard Preview */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-3" style={{ color: theme.white }}>
                    <Trophy className="w-6 h-6" style={{ color: "#FFD700" }} />
                    Room Leaderboard
                  </h2>
                  <button
                    onClick={() => fetchLeaderboard(roomNumber)}
                    className="text-sm px-3 py-1 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: theme.muted }}
                  >
                    <RefreshCw className="w-4 h-4 inline-block mr-1" /> Refresh
                  </button>
                </div>
                <div className="space-y-2">
                  {leaderboard.slice(0, 10).map((team, idx) => {
                    const isCurrentTeam = team.teamName === teamName && team.table === tableNumber;
                    const totalScore = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all ${isCurrentTeam ? 'ring-2' : ''}`}
                        style={{
                          backgroundColor: isCurrentTeam ? `${theme.orange}20` : theme.dark,
                          ringColor: theme.orange,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                          style={{
                            backgroundColor: idx === 0 ? "#FFD700" : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : theme.darkMuted,
                            color: idx < 3 ? theme.black : theme.muted,
                          }}
                        >
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate" style={{ color: theme.white }}>
                            {team.teamName} {isCurrentTeam && <span style={{ color: theme.orange }}>(You)</span>}
                          </div>
                          <div className="text-xs" style={{ color: theme.subtle }}>Table {team.table}</div>
                        </div>
                        <div className="text-2xl font-black" style={{ color: isCurrentTeam ? theme.orange : theme.white }}>
                          {totalScore}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <GlowButton onClick={() => setShowLeaderboard(true)} color={theme.orange} className="w-full">
                  <Trophy className="inline-block mr-2 w-5 h-5" />
                  Full Leaderboard
                </GlowButton>
                <GlowButton onClick={() => {
                  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
                  localStorage.removeItem(STORAGE_KEYS.TEAM_INFO);
                  setCurrentView("home");
                  setSubmissions({});
                  setCurrentRoundIndex(0);
                  setRoundPhase("intro");
                }} color={theme.darkMuted} className="w-full">
                  Start New Session
                </GlowButton>
              </div>
            </div>
          )}
        </main>

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowLeaderboard(false)}
          >
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b" style={{ borderColor: theme.darkMuted }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8" style={{ color: "#FFD700" }} />
                    <h2 className="text-2xl font-bold" style={{ color: theme.white }}>Leaderboard</h2>
                  </div>
                  <button
                    onClick={() => setShowLeaderboard(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6" style={{ color: theme.muted }} />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-auto max-h-[60vh]">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: theme.muted }} />
                    <p className="text-base" style={{ color: theme.muted }}>No scores yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((team, idx) => {
                      const totalScore = Object.values(team.scores || {}).reduce((a, b) => a + b, 0);
                      const roundCount = Object.keys(team.scores || {}).length;
                      return (
                        <div
                          key={team.teamKey || idx}
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
                            <div className="text-lg font-bold truncate" style={{ color: theme.white }}>{team.teamName}</div>
                            <div className="text-sm" style={{ color: theme.subtle }}>Table {team.table}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black" style={{ color: theme.orange }}>{totalScore}</div>
                            <div className="text-sm" style={{ color: theme.subtle }}>{roundCount} round{roundCount !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      );
                    })}
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
