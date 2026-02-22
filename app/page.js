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
  // Show score in real-time: use finalScore if wobble is done, otherwise initialScore
  const totalScore = Object.values(submissions).reduce((sum, s) => sum + (s.finalScore || s.initialScore || 0), 0);

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
    description: "Regional healthcare system with immature CX perspective",
    customer: {
      name: "Everwell Health Services",
      industry: "Healthcare Services",
      size: "~4,800 employees",
      revenue: "$1.6B USD",
      region: "Regional",
      currentSolution: "Unknown",
      contactCenters: "2 primary contact centers, 1 overflow/outsourced partner, ~220 agents",
      logo: "/customers/everwell.png",
    },
    context: [
      "Executive priorities: Revenue growth, patient loyalty, and competitive differentiation",
      "Over the past 12 months, the VP of Patient Experience has prioritized initiatives to improve in-facility experiences for clinics, hospitals, and specialized service locations",
      "The Contact Center Director has been in-seat since dedicated contact center agents were added (~12 years)",
      "Decision-making is tightly controlled and risk-averse, particularly in the highly-regulated healthcare environment",
      "When asked, the Contact Center Director strongly defends the current system and process – there is no active CCaaS evaluation underway",
      "The VP of Patient Experience has not yet considered CCaaS as a core element of the Patient Experience",
    ],
    objective: "Our BDR has secured a meeting with the VP of Patient Experience. In this conversation, our objective is to share a point of view that expands the VP's thinking about how an AI-powered Contact Center solution can elevate a modern, seamless Patient Experience.",
    challenge: "Use the questions below to prepare a POV for the VP of Patient Experience.",
    // Layout: 3 columns top row, 1 full-width bottom
    inputLayout: "threeColumnPlusOne",
    inputFields: [
      { id: "valueGaps", label: "Value Gaps", sublabel: "How could the current Contact Center model be creating risk or friction in the Patient Experience?", type: "textarea", placeholder: "Identify risks, friction points, and hidden constraints...", column: "left" },
      { id: "artOfPossible", label: "Art of the Possible", sublabel: "How could we improve the Patient Experience through AI-powered orchestration capabilities?", type: "textarea", placeholder: "Describe the AI-powered future state...", column: "center" },
      { id: "impact", label: "Impact", sublabel: "What might be the impact of our solution on Patient Experience and overall business metrics?", type: "textarea", placeholder: "Quantify the business value...", column: "right" },
      { id: "customerStory", label: "Customer Example or Story", sublabel: "What is a customer example or story to illustrate this POV?", type: "textarea", placeholder: "Share a compelling customer story that mirrors Everwell's situation...", fullWidth: true },
    ],
    wobble: {
      title: "Enterprise Platform Influence",
      description: "While meeting with the VP of Patient Experience, you learn that ServiceNow is already engaged: Supporting a broader digital and data transformation initiative. Focused on improving how work, requests, and issues flow across the organization. Not formally leading Patient Experience initiatives, but actively shaping enterprise platform standards, modernization principles, and investment criteria for future initiatives. Operating with direct access to the C-suite, including the CIO and COO.",
      question: "How should we adapt our approach to capitalize on the ServiceNow transformation initiative?",
      type: "choice",
      shuffleOptions: true,
      options: [
        {
          id: "A",
          text: "Engage Everwell's Contact Center team directly to discuss how Patient Experience inputs should be embedded in workflow standards",
          detail: "\"If ServiceNow is defining workflows across the organization, the entire Patient Experience is going to be critical – not just the in-facility experience. It's important that PX inputs are considered in the Contact Center system (i.e., patient requests, issues, and demand).\"",
          points: -2,
        },
        {
          id: "B",
          text: "Continue working with the VP of Patient Experience – showing how the Contact Center must be improved to enhance the Patient Experience",
          detail: "\"With ServiceNow working to modernize workflows, this is a great time for you to tackle the end-to-end Patient Experience. The Contact Center is a critical component of building trust and maintaining continuity of care.\"",
          points: 2,
        },
        {
          id: "C",
          text: "Engage the ServiceNow partner to showcase how the Contact Center should be considered in enterprise workflows",
          detail: "\"The transformation roadmap must take the end-to-end Patient Experience into consideration. The Contact Center is the execution layer that delivers enterprise workflows consistently and enables personalized, continuous patient experience.\"",
          points: 5,
        },
        {
          id: "D",
          text: "Collaborate with the VP of Patient Experience on a plan to engage executive decision-makers around the role of the Patient Experience in the broader transformation",
          detail: "\"Let's discuss what's required to build alignment with the CIO and COO around necessary Patient Experience updates – focusing on the potential for the Contact Center to equip us with better patient data and deliver greater continuity of care.\"",
          points: 8,
        },
      ],
    },
    scoringCriteria: [
      { name: "Business Priority Framing", weight: 15, description: "Connects POV to Everwell's executive priorities", poor: "Focuses on contact center operations only (service levels, staffing, cost). No clear tie to executive agenda.", champion: "Frames the entire POV around growth and differentiation. Positions Patient Experience as a strategic revenue lever and competitive moat – not an operational function." },
      { name: "Depth of Value Gaps Identified", weight: 30, description: "Surfaces unseen enterprise risk beyond the contact center", poor: "Identifies surface-level pain (wait times, inefficiency). Reactive and tactical.", champion: "Surfaces unseen enterprise risk: lost referrals, care leakage, brand erosion, inability to scale personalized care, fragmented data preventing proactive engagement. Expands the problem beyond the contact center." },
      { name: "Art of the Possible", weight: 15, description: "Paints a compelling AI-powered future state", poor: "Describes incremental improvements or features (automation, bots, routing upgrades). Product-heavy language.", champion: "Reframes the contact center as the orchestration engine of the entire patient journey. Describes proactive, personalized, seamless care experiences tied directly to strategic growth and loyalty. Is motivating to senior executives." },
      { name: "Value Impact", weight: 20, description: "Connects to enterprise metrics and personal value for the VP", poor: "Mentions operational metrics only (AHT, cost per contact).", champion: "Connects to enterprise growth metrics and articulates personal value for the VP (strategic visibility, transformation leadership, executive credibility). Makes the stakes feel high." },
      { name: "Customer Story/Example", weight: 20, description: "Provides a compelling, relevant customer example", poor: "Generic case study. Tactical. Feels like a product pitch.", champion: "Tight, emotionally resonant story that mirrors Everwell's situation. Creates urgency, credibility, and belief. Feels like a board-level narrative – not a vendor presentation." },
    ],
    // Penalties the AI should enforce (up to 5-point reduction each)
    penalties: [
      "Leads with product capabilities or operational upgrades instead of framing in the context of Patient Experience as a strategic business priority",
      "Uses vague language/buzz words without clearly explaining the specific business relevance or impact for Everwell",
      "Restates known challenges without surfacing new risks, blind spots, or strategic reframes",
      "Is tailored to technical decision-makers vs an executive-level target audience",
    ],
    icon: Target,
    industryImage: "/industries/healthcare.png",
  },
  {
    id: 2,
    title: "Disrupt Status Quo",
    subtitle: "New Logo Opportunity",
    motion: "CCaaS Replacement",
    description: "Multinational financial services with embedded legacy Avaya",
    customer: {
      name: "Aureon Financial Holdings",
      industry: "Financial Services: Banking & Payments",
      size: "~42,000 employees",
      revenue: "$28.5B USD",
      currentSolution: "Legacy on-prem Avaya instances – de-centralized, regional approach",
      contactCenters: "11 regional contact centers, 4 specialized global service hubs, 3,800 agents",
      logo: "/customers/aureon.png",
    },
    context: [
      "New CEO has initiated a global modernization discussion to future-proof the business and improve operational resilience",
      "VP of Customer Service Operations maintains a regional operating model – empowering Regional Contact Center Directors to optimize locally rather than standardize globally",
      "Performance is viewed as 'good enough' (i.e., Average Handle Time, Abandon Rates, etc.)",
      "Corporate culture emphasizes risk mitigation, regulatory compliance, and phased transformation",
      "IT team prefers data separation/minimal architectural change, and the regional model limits ability to test/scale CX and AI capabilities",
      "Avaya is actively engaged in the account and continuously recommending hybrid-cloud and regional upgrade opportunities – reinforcing decentralization",
    ],
    objective: "Our BDR has secured an initial meeting with the VP of Customer Service Operations. Our objective is to break down the status quo bias by exposing the operational and strategic risks of the current environment.",
    challenge: "For each likely status quo bias, identify the hidden risk of the current solution and determine how you will make that risk visible to the VP.",
    // Layout: Table-style with status quo biases as rows
    inputLayout: "statusQuoBiases",
    inputFields: [
      {
        id: "biasMigration",
        biasLabel: "\"A global platform migration is too disruptive.\"",
        biasContext: "(People, process, regional operations, etc.)",
        riskLabel: "What are the unconsidered risks of this bias?",
        evidenceLabel: "What data, comparison, or diagnostic action will make this risk tangible and credible?",
        type: "dual-textarea",
      },
      {
        id: "biasBudget",
        biasLabel: "\"Every new platform deployment runs over budget – it's going to be too expensive.\"",
        riskLabel: "What are the unconsidered risks of this bias?",
        evidenceLabel: "What data, comparison, or diagnostic action will make this risk tangible and credible?",
        type: "dual-textarea",
      },
      {
        id: "biasAlignment",
        biasLabel: "\"It will be too hard to get everyone aligned – executive team, IT, regional leaders, etc.\"",
        riskLabel: "What are the unconsidered risks of this bias?",
        evidenceLabel: "What data, comparison, or diagnostic action will make this risk tangible and credible?",
        type: "dual-textarea",
      },
      {
        id: "biasAvaya",
        biasLabel: "\"Avaya is working and they're continuously bringing new ideas. Why stop working with them?\"",
        riskLabel: "What are the unconsidered risks of this bias?",
        evidenceLabel: "What data, comparison, or diagnostic action will make this risk tangible and credible?",
        type: "dual-textarea",
      },
      {
        id: "biasOther",
        biasLabel: "Other:",
        riskLabel: "What are the unconsidered risks of this bias?",
        evidenceLabel: "What data, comparison, or diagnostic action will make this risk tangible and credible?",
        type: "dual-textarea",
      },
    ],
    wobble: {
      title: "Past Failure Revealed",
      description: "Right before meeting with the VP of Customer Service Operations, we learn:\n• The LATAM region participated in a hybrid NiCE pilot last year\n• The pilot was highly disruptive to operations and agent workflows\n• Adoption was inconsistent and agent trust was eroded\n• Leadership ultimately pulled the program",
      question: "What is the most effective way to discuss the pilot's failure so the conversation minimizes defensiveness and uncovers systemic lessons?",
      type: "text-questions",
      textQuestions: [
        {
          id: "reframeFailure",
          label: "What is the most effective way to discuss the pilot's failure so the conversation minimizes defensiveness and uncovers systemic lessons?",
          placeholder: "Describe how you would reframe the failure as a structural/operating model issue rather than a vendor or AI problem..."
        },
      ],
      // Scoring guidance for the AI evaluator:
      // +6: Reframes the failure as an operating model and architectural alignment issue
      // +4: Identifies fragmentation or weak enterprise governance as contributing factors
      // +2: Shifts focus to future risk or change management but remains abstract
      // -2: Blames NiCE as inferior vendor or recommends smaller/slower pilots
      basePoints: 0, // AI evaluates quality and assigns 0-6 points
      scoringGuidance: "Award up to +6 if they reframe the failure as an operating model and architectural alignment issue – showing how decentralized governance, inconsistent standards, and lack of orchestration made enterprise scale difficult. Award +4 if they identify fragmentation or weak governance as contributing factors but don't fully elevate to operating model design. Award +2 if they shift focus to future risk or change management but remain abstract. Award -2 if they blame NiCE as an inferior vendor, focus on missing features, or recommend smaller/slower pilots – reinforcing disruption fear.",
    },
    scoringCriteria: [
      { name: "Insightfulness of Risks Surfaced", weight: 35, description: "Reframes status quo as structural ceiling constraining the enterprise", poor: "Restates known facts (regional Avaya, risk aversion, compliance) without elevating them into enterprise or strategic risk.", champion: "Reframes the status quo as a structural ceiling – clearly demonstrating how decentralization, on-prem architecture, and regional autonomy constrain enterprise scalability, AI readiness, resilience, and long-term competitiveness. Articulates the personal risk for the executive." },
      { name: "Use of Evidence/Credibility", weight: 35, description: "Grounds disruption in credible, defensible evidence", poor: "Makes abstract claims without data, comparisons, or relevant examples.", champion: "Grounds disruption in credible financial services examples and/or clear diagnostic logic that makes the risk tangible, defensible, and difficult to dismiss." },
      { name: "Executive-Level Framing", weight: 30, description: "Links risks to CEO modernization and VP's personal risk", poor: "Frames risks at the operational or tool level without linking to executive priorities.", champion: "Positions the current operating model as misaligned with enterprise strategy — connecting operational constraints to CEO-level priorities (resilience, AI scalability, governance, long-term competitiveness). Explicitly connects to the VP's personal risks." },
    ],
    penalties: [
      "References specific Genesys solutions and features, instead of focusing on business outcomes/risks in the customer's language",
      "Attacks the current vendor (Avaya) directly instead of focusing on the customer business implications",
      "Frames discussion only on cost savings without references to scalability, governance, resilience, or AI-readiness",
      "Shifts into selling the future state benefits of Genesys instead of exposing current-state risk",
    ],
    icon: Zap,
    industryImage: "/industries/financial.png",
  },
  {
    id: 3,
    title: "Hold the High Ground",
    subtitle: "Account Defense",
    motion: "Expansion",
    description: "Defend incumbent position against AI pure-play insurgent",
    customer: {
      name: "Summit Ridge Retail Group",
      industry: "Retail: Omnichannel Consumer Goods",
      size: "~36,000 employees",
      revenue: "$18.9B USD",
      currentSolution: "GC2 for past 6 years – added tokens 6 months ago",
      contactCenters: "10 regional contact centers, 3 digital engagement hubs, 2,600 agents",
      logo: "/customers/summit.png",
    },
    context: [
      "New CIO has mandate to modernize and reduce vendor complexity",
      "Genesys is viewed as a trusted and reliable CCaaS platform – current performance is solid, and there is no active service crisis",
      "CIO is leading a broader AI transformation initiative",
      "Our relationship sits primarily with the VP of Customer Experience – the renewal date is 12 months away, and they've expressed some confusion around the AI token pricing model",
      "AI Committee has cross-functional influence (IT, Digital, Data Science)",
      "CIO is in talks with Sierra to explore agentic automation and LLM-powered customer engagement",
      "Sierra is positioning itself as an AI layer that could sit above existing platforms and potentially reduce reliance on traditional CCaaS",
    ],
    objective: "Develop a competitive strategy focused on preserving our position. Our objective is to secure CIO-level alignment and defend against the AI Pure Play insurgent.",
    challenge: "Define a strategy that protects our strategic position with the account.",
    inputLayout: "stackedQuestions",
    inputFields: [
      { id: "keyMessages", label: "What messages reinforce and differentiate our position?", type: "textarea", placeholder: "Draft key messaging points that elevate our AI-powered CX positioning..." },
      { id: "sierraCounterplay", label: "In what ways may Sierra position us as the risk? How can we proactively address these?", type: "textarea", placeholder: "Anticipate Sierra's narrative and prepare counterpoints..." },
      { id: "keyActions", label: "What 2-3 actions can we take in the next 30 days to drive this strategy?", type: "textarea", placeholder: "List specific, actionable steps with clear ownership..." },
      { id: "infoNeeded", label: "What other information do we need to understand to determine the right strategy?", type: "textarea", placeholder: "Identify gaps in our knowledge and how to fill them..." },
    ],
    // Account Plan Snapshot and Selected Customer Data (printed materials, referenced by AI for evaluation)
    accountPlanSnapshot: {
      relationshipStrategy: [
        { department: "Customer Experience", title: "VP, Customer Experience", buyingRole: "Champion", relationship: "Strong; 6-year relationship", riskSignal: "Influence declining in enterprise decisions", strategyFocus: "Leverage credibility; expand influence upward" },
        { department: "IT", title: "CIO (New Hire)", buyingRole: "Economic Buyer", relationship: "No established relationship", riskSignal: "Driving enterprise transformation", strategyFocus: "Establish executive alignment quickly" },
        { department: "AI Committee", title: "Cross-Functional (Data + IT)", buyingRole: "Influencer Collective", relationship: "Unknown visibility", riskSignal: "Shaping evaluation criteria", strategyFocus: "Gain access; influence scoring logic" },
        { department: "Finance", title: "CFO", buyingRole: "Influencer", relationship: "Indirect", riskSignal: "Focused on consolidation savings", strategyFocus: "Tie AI impact to cost discipline" },
        { department: "External Advisor", title: "Accenture", buyingRole: "Strategic Advisor", relationship: "High influence with CIO", riskSignal: "May favor hyperscaler alignment", strategyFocus: "Neutralize; position as platform partner" },
      ],
      accountAssessment: [
        { category: "Executive Sponsorship", rating: "3/5", interpretation: "Strong in CX; weak at CIO level", riskIndicator: "Enterprise influence gap" },
        { category: "Value Position", rating: "3/5", interpretation: "Operationally strong; not yet positioned as transformation partner", riskIndicator: "Platform perception risk" },
        { category: "Competitive Position", rating: "3/5", interpretation: "Stable incumbent; AI pure play pressure emerging", riskIndicator: "Defensive strategy required" },
        { category: "Displacement Risk", rating: "Medium-High", interpretation: "CIO-led evaluation underway", riskIndicator: "Evaluation criteria shifting" },
        { category: "Adoption Depth", rating: "4/5", interpretation: "Mature deployment across 2,600 agents", riskIndicator: "Strong operational proof" },
        { category: "Growth Potential", rating: "4/5", interpretation: "AI expansion opportunity", riskIndicator: "Must align to enterprise agenda" },
      ],
    },
    wobble: {
      title: "AI Pure-Play Threat Escalation",
      description: "The VP of Customer Experience shares new information:\n• The CIO is accelerating a cloud consolidation strategy centered on AWS\n• The AI Committee is close to approving a pilot of Sierra – positioned as an AI-native CX layer running on AWS infrastructure\n• The framing is shifting from 'customer experience platform' to 'AI-driven automation and cost efficiency aligned to AWS'",
      question: "Rank the following strategic adjustments from most effective to least effective.",
      type: "ranking",
      shuffleOptions: true,
      options: [
        { id: "A", text: "Broaden the executive conversation beyond an AI agent pilot", detail: "Broaden the executive conversation from an AI agent pilot to enterprise CX orchestration – positioning Genesys as the layer that connects AI, humans, journeys, and systems across channels and regions (regardless of cloud provider). Reframe the evaluation criteria from 'which AI agent tool do we pilot?' to 'how do we orchestrate AI-driven customer experiences at enterprise scale?'" },
        { id: "B", text: "Discourage the Sierra pilot", detail: "Discourage the Sierra pilot by emphasizing that Genesys already delivers comparable AI capabilities – positioning Sierra as redundant and introducing unnecessary complexity into the tech stack. Highlight the risk of adding yet another vendor when consolidation is the stated enterprise direction." },
        { id: "C", text: "Actively partner with AWS leadership", detail: "Actively partner with AWS leadership to reinforce alignment with the CIO's cloud consolidation strategy – positioning Genesys as the preferred CX orchestration partner within the AWS ecosystem. Demonstrate that Genesys natively runs on AWS, integrates with AWS AI/ML services, and enables the CIO's consolidation vision without requiring a separate AI layer. Discourage the need for an external AI Pure Play by proving enterprise CX orchestration is already available within the AWS stack." },
        { id: "D", text: "Allow the Sierra pilot to proceed", detail: "Allow the Sierra pilot to proceed, but reposition Genesys as the enterprise orchestration and governance layer that integrates and operationalizes AI agents at scale. Frame Genesys as the system that ensures AI agents (from any source, including Sierra) deliver measurable business outcomes, workforce integration, compliance, and enterprise-grade reliability – not just experimentation." },
      ],
      rankingScores: {
        "C,A,B,D": 10, "C,A,D,B": 8, "C,B,A,D": 8, "C,B,D,A": 6,
        "C,D,A,B": 6, "C,D,B,A": 4, "A,C,B,D": 4, "A,C,D,B": 4,
        "A,B,C,D": 2, "A,B,D,C": -2, "A,D,C,B": 2, "A,D,B,C": -3,
        "B,C,A,D": 0, "B,C,D,A": 0, "B,A,C,D": 0, "B,A,D,C": 0,
        "B,D,C,A": -5, "B,D,A,C": -2, "D,C,A,B": -5, "D,C,B,A": -5,
        "D,A,C,B": -5, "D,A,B,C": -5, "D,B,C,A": -5, "D,B,A,C": -5,
      },
    },
    scoringCriteria: [
      { name: "Strategic Positioning", weight: 30, description: "Repositions Genesys as AI-powered CX execution layer that enables enterprise AI", poor: "Reacts defensively to the AI pure play or focuses on feature comparisons (bots, roadmap, pricing). No clear strategic posture.", champion: "Repositions Genesys as the AI-powered CX execution layer that enables enterprise AI to scale safely and measurably – explicitly neutralizing the AI pure play's narrative advantage and elevating discussion to architectural strategy." },
      { name: "Ecosystem Awareness", weight: 20, description: "Demonstrates ecosystem fluency across decision makers and governance bodies", poor: "Focuses primarily on existing VP relationship or treats the AI pure play as a competitor to beat.", champion: "Demonstrates ecosystem fluency – positions Genesys within the broader enterprise AI narrative, adapts to decision makers and governance bodies, and accounts for renewal timing and political risk." },
      { name: "AI Differentiation & Enterprise Framing", weight: 20, description: "Positions AI-powered CX as execution engine converting AI strategy into governed impact", poor: "Makes generic AI claims (automation, bots, efficiency) with no CIO-level relevance or differentiation.", champion: "Positions AI-powered CX as the execution engine that converts enterprise AI strategy into governed, scalable business impact – clearly differentiated from AI point solutions focused on experimentation." },
      { name: "Strategic Messaging Quality", weight: 15, description: "Delivers compelling executive narrative elevating CX as critical to enterprise AI success", poor: "Product- or CCaaS-centric language focused on features or performance metrics.", champion: "Delivers a compelling executive narrative that elevates CX as critical to enterprise AI success and positions Genesys as a strategic architectural choice – not a replaceable application." },
      { name: "Actionability & Risk Mitigation", weight: 15, description: "Proposes targeted actions that reduce AI pure play displacement risk", poor: "Vague or generic next steps with no link to displacement risk.", champion: "Proposes targeted actions that reduce AI pure play displacement risk, strengthen CIO/AI Committee alignment, clarify AI value narrative, and protect Genesys' architectural role ahead of renewal decisions." },
    ],
    penalties: [
      "References specific Genesys technical features instead of operational differentiation and business outcomes",
      "Attacks the AI Pure Play directly rather than focusing on the enterprise strategic opportunity",
      "Frames the discussion as speed and comfort vs future benefits",
      "Fails to elevate the conversation beyond technical stakeholders",
    ],
    icon: Shield,
    industryImage: "/industries/retail.png",
  },
  {
    id: 4,
    title: "Capture More Share",
    subtitle: "Account Expansion",
    motion: "Pure-Play AI",
    description: "Expand global CX platform footprint and build executive confidence",
    customer: {
      name: "Orion Global Logistics",
      industry: "Logistics & Supply Chain Services",
      size: "~52,000 employees",
      revenue: "$21.4B USD",
      currentSolution: "GC3 in EMEA; mix of legacy on-prem and cloud in other regions",
      contactCenters: "14 regional contact centers, 5 global operations hubs, 3,400 agents",
      logo: "/customers/orion.png",
    },
    context: [
      "CX leadership is advocating for global platform expansion to standardize experience and reduce tech sprawl",
      "The EMEA deployment is successful and stable, with improved customer data visibility and agent productivity; however, CX remains fragmented across other regions",
      "There is no enterprise framework for IT/data governance, and regional deployments use automation differently – limiting the ability to scale globally",
      "CIO and CFO are jointly evaluating investment size, timing, migration risk, operational alignment, and long-term economics",
      "Global platform decisions of this scale require executive committee approval – the CFO is asking for predictability and clear ROI models",
      "Company is under margin pressure; cost discipline and ROI clarity are non-negotiable",
      "We have strong advocates on the global Customer Experience team and within EMEA leadership; they have committed to connecting us with executive and regional leaders",
    ],
    objective: "Our objective is to build up executive confidence in Genesys as a global, AI-powered CX platform. Using the Deal Review Framework, collaborate on actions to improve our win probability and minimize deal risk.",
    challenge: "Using the Deal Review Framework, define actions to address executive decision risks in favor of our CX platform expansion initiative.",
    inputFields: [],
    useDealReviewChecklist: true,
    dealReviewChecklist: [
      {
        section: "Value Alignment",
        items: [
          {
            id: "transformationVision",
            label: "Business decision-makers have a defined transformation vision (including CX, AI, digital) that we can attach our solutions to.",
            prefilled: "yes",
            evidence: "CX leadership formally proposed global standardization initiative. CIO/CFO mandated enterprise evaluation of global CX platforms tied to AI and data strategy. AI viewed as strategic, not isolated automation."
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
            evidence: "Initial conversation with VP of Data Science and AI have signaled shift to a global approach, but concerns about migration risks persist."
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
            evidence: "We have strong sponsors in EMEA leaders and in the global CX function. Must activate influence on global approach."
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
            label: "Our co-created business case shows how Genesys can influence business outcomes (e.g., cost reduction, customer satisfaction, etc.).",
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
            prefilled: "no",
            evidence: "EMEA and CX leaders are strong supporters of our platform and impact, but need to engage other stakeholders, particularly CIO and CFO."
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
    // Account Plan Snapshot (printed materials, referenced by AI for evaluation)
    accountPlanSnapshot: {
      relationshipStrategy: [
        { department: "Customer Experience", title: "VP, Global CX", buyingRole: "Champion", relationship: "Strong (EMEA only)", riskSignal: "Influence limited at enterprise level", strategyFocus: "Elevate regional success to enterprise narrative" },
        { department: "IT", title: "CIO", buyingRole: "Economic Buyer", relationship: "Limited", riskSignal: "Only 1 executive touchpoint in 12 months", strategyFocus: "Establish executive cadence; align to global standardization priorities" },
        { department: "Finance", title: "CFO", buyingRole: "Economic Buyer", relationship: "None", riskSignal: "No direct engagement; controls >$5M investments", strategyFocus: "Build CFO-ready ROI model; align to payback expectations" },
        { department: "Executive Committee", title: "CIO, CFO, COO", buyingRole: "Final Approval", relationship: "None", riskSignal: "No presentation delivered; required for expansion approval", strategyFocus: "Secure executive forum; present structured trade-off options" },
        { department: "Regional Ops – EMEA", title: "Director, CC Ops", buyingRole: "Influencer", relationship: "Strong", riskSignal: "Regional proof only", strategyFocus: "Use measurable impact as enterprise case study" },
        { department: "Regional Ops – NA/APAC/LATAM", title: "Regional Ops Leaders", buyingRole: "Influencer", relationship: "Mixed", riskSignal: "Migration resistance risk", strategyFocus: "Clarify phased sequencing and risk mitigation" },
        { department: "External Advisor", title: "Transformation Partner", buyingRole: "Influencer", relationship: "Neutral-to-Competitive", riskSignal: "Shapes CIO evaluation criteria", strategyFocus: "Position platform as aligned to enterprise architecture" },
      ],
      accountAssessment: [
        { category: "Executive Sponsorship", rating: "2/5", interpretation: "Limited CIO engagement; no CFO access", riskIndicator: "High executive alignment risk" },
        { category: "Value Position", rating: "3/5", interpretation: "Strong EMEA proof; enterprise case incomplete", riskIndicator: "ROI translation gap" },
        { category: "Competitive Position", rating: "3/5", interpretation: "Strong regional incumbents; exposed in consolidation review", riskIndicator: "Hyperscaler pressure" },
        { category: "Growth Potential", rating: "5/5", interpretation: "$8–12M expansion opportunity", riskIndicator: "High upside under scrutiny" },
        { category: "Renewal Risk", rating: "Medium", interpretation: "Modernization required; timing pressure", riskIndicator: "Migration risk exposure" },
        { category: "Adoption Depth", rating: "3/5", interpretation: "Mature in EMEA; uneven globally", riskIndicator: "Expansion execution risk" },
      ],
    },
    wobble: {
      title: "Budget Cut Directive",
      description: "After a weak earnings call, the CFO is calling for significant cost reduction across the enterprise. The mandate is to reduce tech spend by 20-30% over the next 12 months.",
      question: "Given this update, which TWO actions best maintain executive confidence and decision momentum? Select top two.",
      type: "multi-select",
      maxSelections: 2,
      options: [
        { id: "A", text: "Reframe the investment as a phased, outcome-based roadmap", detail: "Position a reduced Year 1 investment tied to hard cost and efficiency outcomes, with explicit expansion gates based on CFO-approved metrics." },
        { id: "B", text: "Narrow scope to the highest-cost regions to accelerate payback", detail: "Focus initial expansion only on regions with the highest cost-to-serve and operational inefficiency, deferring lower-impact geos." },
        { id: "C", text: "Present explicit trade-offs and consequences of each option", detail: "Lay out 2-3 investment scenarios (full, phased, reduced), clearly showing what is gained and lost in cost, risk, and AI maturity." },
        { id: "D", text: "Align with the CFO on near-term financial proof points", detail: "Shift the conversation to CFO-defined success metrics (opex reduction, margin protection, avoided spend) before revisiting CX expansion." },
        { id: "E", text: "Proactively reduce Genesys' commercial footprint to preserve momentum", detail: "Offer temporary pricing, ramp schedules, or contractual flexibility to reduce near-term cash impact while keeping the deal alive." },
      ],
      multiSelectScores: {
        "A,C": 10, "C,D": 8, "A,D": 8, "A,B": 6, "B,C": 6,
        "B,D": 4, "C,E": 4, "A,E": 2, "D,E": 0, "B,E": 0,
      },
    },
    scoringCriteria: [
      { name: "Alignment to CIO/CFO Decision Risks", weight: 25, description: "Actions directly de-risk the global platform decision with CIO/CFO-specific mitigation", poor: "Actions focus primarily on CX leadership priorities; CIO/CFO concerns (cost predictability, migration risk, governance, AI economics) are not addressed.", champion: "Actions directly de-risk the global platform decision with CIO/CFO-specific mitigation plans — including AI token economics clarity, governance model, migration risk sequencing, and measurable ROI framing." },
      { name: "Global Platform & AI Positioning", weight: 25, description: "Positions Genesys as enterprise CX + AI execution layer enabling LAMs and governance", poor: "Actions reinforce regional autonomy or pilots; AI framed as incremental efficiency or optional add-on.", champion: "Positions Genesys as the enterprise CX + AI execution layer — enabling action-based AI (LAMs), governance, and predictable AI economics across regions; clearly differentiated from regional tools or infrastructure-only platforms." },
      { name: "Action Coverage Across Roles", weight: 25, description: "Fully orchestrated cross-role plan with clear ownership and sequencing", poor: "Actions concentrated in 1-2 roles (e.g., AE-only); no executive motion; regional or siloed execution.", champion: "Fully orchestrated cross-role plan with clear ownership, sequencing, and executive touchpoints — demonstrating internal alignment equal to the global expansion ambition." },
      { name: "Trade-Off Framing", weight: 15, description: "Proactively frames trade-offs in a decision-ready way for executives", poor: "Assumes expansion is universally positive; avoids naming trade-offs.", champion: "Proactively frames trade-offs in a decision-ready way — helping executives choose a path with clarity on AI economics, migration sequencing, and risk containment." },
      { name: "Sequencing & Global Momentum", weight: 10, description: "Clear executive-aligned sequencing tied to approval gates and phased AI rollout", poor: "Actions are unordered, region-specific, or lack a path to executive approval.", champion: "Clear executive-aligned sequencing tied to approval gates, global governance structure, and phased AI rollout — creating momentum toward enterprise-scale adoption." },
    ],
    penalties: [
      "Frames expansion primarily around EMEA success without translating into global governance, sequencing, or executive-ready business case",
      "Fails to address CIO/CFO concerns around predictability of AI consumption costs",
      "Roadmap does not take cross-functional and cross-regional milestones into account",
      "No actions defined for CSM",
      "No actions defined for BDR",
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
  const [registrationStep, setRegistrationStep] = useState("signin"); // "signin" | "teamname" | "ready"
  const [teamName, setTeamName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isTeamRegistered, setIsTeamRegistered] = useState(false);
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

  const updateLeaderboard = useCallback(async (name, table, room, score, roundId, phase = "final") => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName: name, table, room, score, roundId, phase })
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
  // Step 1: Sign in with room and table
  const handleSignIn = useCallback(() => {
    if (tableNumber.trim() && roomNumber.trim()) {
      // If a different team was previously saved, clear their progress
      // This prevents accidentally resuming another team's session
      const previousTeam = localStorage.getItem(STORAGE_KEYS.TEAM_INFO);
      if (previousTeam) {
        const prev = JSON.parse(previousTeam);
        if (prev.room !== roomNumber || prev.table !== tableNumber) {
          localStorage.removeItem(STORAGE_KEYS.PROGRESS);
        }
      }

      // Save room/table but not team name yet
      localStorage.setItem(STORAGE_KEYS.TEAM_INFO, JSON.stringify({
        room: roomNumber,
        table: tableNumber,
        name: ""
      }));
      setRegistrationStep("teamname");
    }
  }, [tableNumber, roomNumber]);

  // Step 2: Register team name
  const handleTeamNameSubmit = useCallback(async () => {
    if (teamName.trim() && tableNumber.trim() && roomNumber.trim()) {
      setIsSubmitting(true);

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
        setIsTeamRegistered(true);
      } catch (err) {
        console.error("Failed to register team:", err);
        // Still continue
        setIsTeamRegistered(true);
      }

      // Save complete team info
      saveTeamInfo(teamName, tableNumber, roomNumber);
      setIsSubmitting(false);
      setRegistrationStep("ready");
    }
  }, [teamName, tableNumber, roomNumber, saveTeamInfo]);

  // Step 3: Start simulation
  const handleStartSimulation = useCallback(() => {
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
  }, []);

  const handleResumeSession = useCallback(async () => {
    const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!savedProgress) {
      setCurrentView("simulation");
      return;
    }

    const progress = JSON.parse(savedProgress);
    let resumeSubmissions = progress.submissions || {};
    let resumeRoundIndex = progress.currentRound || 0;
    let resumePhase = progress.currentPhase || "intro";

    // Check if the admin has issued a reset-to-round for this team
    const savedTeam = localStorage.getItem(STORAGE_KEYS.TEAM_INFO);
    if (savedTeam) {
      const team = JSON.parse(savedTeam);
      const teamKey = `${team.room}-${team.table}`;
      try {
        const res = await fetch(`/api/leaderboard?action=check-reset&teamKey=${encodeURIComponent(teamKey)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.hasReset) {
            const targetRound = data.targetRound; // 1-4
            const targetRoundIndex = targetRound - 1; // 0-3

            // Clear submissions for this round and all later rounds
            const cleanedSubmissions = {};
            for (const [roundId, submission] of Object.entries(resumeSubmissions)) {
              if (parseInt(roundId) < targetRound) {
                cleanedSubmissions[roundId] = submission;
              }
            }

            resumeSubmissions = cleanedSubmissions;
            resumeRoundIndex = targetRoundIndex;
            resumePhase = "intro";

            // Save the cleaned state back to localStorage
            const cleanedProgress = {
              submissions: cleanedSubmissions,
              currentRound: targetRoundIndex,
              currentPhase: "intro",
            };
            localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(cleanedProgress));

            console.log(`Admin reset detected: resetting to Round ${targetRound}`);
          }
        }
      } catch (err) {
        console.error("Failed to check for admin reset:", err);
        // Continue with normal resume if check fails
      }
    }

    setSubmissions(resumeSubmissions);
    setCurrentRoundIndex(resumeRoundIndex);
    setRoundPhase(resumePhase);
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
        // Format deal review checklist - clearly separate prefilled vs team-authored content
        submissionText = "Deal Review Assessment:\n\n";
        submissionText += "=== CONTEXT (Pre-filled, NOT authored by the team) ===\n\n";
        currentRound.dealReviewChecklist.forEach(section => {
          submissionText += `${section.section}:\n`;
          section.items.forEach(item => {
            const answer = dealReviewAnswers[item.id] || {};
            submissionText += `- ${item.label}\n`;
            submissionText += `  Status: ${answer.value === 'yes' ? 'Yes' : 'No'} (pre-filled)\n`;
            submissionText += `  Evidence: ${item.evidence} (pre-filled)\n`;
          });
          submissionText += "\n";
        });
        submissionText += "\n=== TEAM'S AUTHORED RESPONSES (Score based on THIS content only) ===\n\n";
        let hasTeamContent = false;
        currentRound.dealReviewChecklist.forEach(section => {
          section.items.forEach(item => {
            const answer = dealReviewAnswers[item.id] || {};
            if (answer.nextActions && answer.nextActions.trim()) {
              hasTeamContent = true;
              submissionText += `Next Actions for "${item.label.substring(0, 60)}...":\n${answer.nextActions}\n\n`;
            }
          });
        });
        if (!hasTeamContent) {
          submissionText += "(No next actions provided by the team)\n";
        }
      } else if (currentRound.inputLayout === "statusQuoBiases") {
        // Format status quo biases with dual fields per bias
        submissionText = "Status Quo Bias Analysis:\n\n";
        currentRound.inputFields.forEach(field => {
          submissionText += `Bias: ${field.biasLabel}\n`;
          if (formData[`${field.id}_risk`]) {
            submissionText += `Unconsidered Risks:\n${formData[`${field.id}_risk`]}\n`;
          }
          if (formData[`${field.id}_evidence`]) {
            submissionText += `Evidence/Diagnostic Action:\n${formData[`${field.id}_evidence`]}\n`;
          }
          submissionText += "\n";
        });
      } else if (currentRound.inputLayout === "threeColumnPlusOne") {
        // Format three-column layout with labels
        currentRound.inputFields.forEach(field => {
          if (formData[field.id]) {
            submissionText += `${field.label}:\n${formData[field.id]}\n\n`;
          }
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
            penalties: currentRound.penalties,
            accountPlanSnapshot: currentRound.accountPlanSnapshot,
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

      // Post initial score to leaderboard immediately (so it shows on presenter screen)
      await updateLeaderboard(teamName, tableNumber, roomNumber, result.score.overall, currentRound.id, "initial");

      goToPhase("feedback1");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRound, formData, dealReviewAnswers, submissions, currentRoundIndex, saveProgress, goToPhase, teamName, tableNumber, roomNumber, updateLeaderboard]);

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
            penalties: currentRound.penalties,
            accountPlanSnapshot: currentRound.accountPlanSnapshot,
            wobble: {
              title: currentRound.wobble.title,
              description: currentRound.wobble.description,
              question: currentRound.wobble.question,
              scoringGuidance: currentRound.wobble.scoringGuidance,
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
        },
      };
      setSubmissions(newSubmissions);
      saveProgress(newSubmissions, currentRoundIndex, "feedback2");

      // Update leaderboard with final score (replaces initial score)
      await updateLeaderboard(teamName, tableNumber, roomNumber, finalScore, currentRound.id, "final");

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

  // Check for saved session on home screen — also extract saved team info for display
  const savedSessionRaw = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.PROGRESS);
  const savedTeamRaw = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEYS.TEAM_INFO);
  const savedTeamInfo = savedTeamRaw ? JSON.parse(savedTeamRaw) : null;
  const hasSavedSession = !!savedSessionRaw && savedTeamInfo?.name;

  // ============================================================================
  // RENDER: HOME SCREEN (Multi-step registration)
  // ============================================================================

  if (currentView === "home") {
    return (
      <AnimatedBackground>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src="/genesys-logo.png" alt="Genesys" className="h-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2" style={{ color: theme.white }}>
                The Game
              </h1>
            </div>

            {/* STEP 1: Sign In with Room & Table */}
            {registrationStep === "signin" && (
              <div className="space-y-6">
                <p className="text-lg text-center" style={{ color: theme.muted }}>
                  Sign in to get started
                </p>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.muted }}>
                        Room Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 1"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl text-xl font-bold text-center outline-none transition-all"
                        style={{
                          background: theme.dark,
                          border: `2px solid ${theme.darkMuted}`,
                          color: theme.white,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.muted }}>
                        Table Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 5"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl text-xl font-bold text-center outline-none transition-all"
                        style={{
                          background: theme.dark,
                          border: `2px solid ${theme.darkMuted}`,
                          color: theme.white,
                        }}
                      />
                    </div>
                  </div>

                  <GlowButton
                    onClick={handleSignIn}
                    disabled={!tableNumber.trim() || !roomNumber.trim()}
                    className="w-full mt-4"
                  >
                    Continue <ChevronRight className="inline-block ml-2 w-5 h-5" />
                  </GlowButton>

                  {hasSavedSession && savedTeamInfo && (
                    <button
                      onClick={handleResumeSession}
                      className="w-full py-4 rounded-xl text-lg font-medium transition-all hover:bg-opacity-80"
                      style={{
                        background: theme.dark,
                        border: `2px solid ${theme.darkMuted}`,
                        color: theme.white,
                      }}
                    >
                      <span>Resume Previous Session</span>
                      <span className="block text-sm mt-1" style={{ color: theme.muted }}>
                        {savedTeamInfo.name} · Room {savedTeamInfo.room} · Table {savedTeamInfo.table}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Team Name Registration */}
            {registrationStep === "teamname" && (
              <div className="space-y-6">
                <div className="text-center">
                  <div
                    className="inline-block px-4 py-2 rounded-lg text-sm font-bold mb-4"
                    style={{ backgroundColor: theme.dark, color: theme.muted }}
                  >
                    Room {roomNumber} • Table {tableNumber}
                  </div>
                  <p className="text-lg" style={{ color: theme.muted }}>
                    Discuss with your table and choose a team name!
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.muted }}>
                      Team Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && teamName.trim() && handleTeamNameSubmit()}
                      className="w-full px-5 py-4 rounded-xl text-xl font-bold text-center outline-none transition-all"
                      style={{
                        background: theme.dark,
                        border: `2px solid ${theme.orange}`,
                        color: theme.white,
                      }}
                      autoFocus
                    />
                  </div>

                  <GlowButton
                    onClick={handleTeamNameSubmit}
                    disabled={!teamName.trim() || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="inline-block mr-2 w-5 h-5 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Team Name <Sparkles className="inline-block ml-2 w-5 h-5" />
                      </>
                    )}
                  </GlowButton>

                  <button
                    onClick={() => setRegistrationStep("signin")}
                    className="w-full py-3 text-sm font-medium transition-all hover:bg-white/5 rounded-lg"
                    style={{ color: theme.muted }}
                  >
                    <ChevronLeft className="inline-block mr-1 w-4 h-4" />
                    Back to sign in
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Ready to Begin */}
            {registrationStep === "ready" && (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${theme.orange}20` }}
                  >
                    <CheckCircle className="w-10 h-10" style={{ color: theme.orange }} />
                  </div>
                  <h2 className="text-3xl font-black mb-2" style={{ color: theme.white }}>
                    You're Registered!
                  </h2>
                  <p className="text-xl font-bold mb-1" style={{ color: theme.orange }}>
                    {teamName}
                  </p>
                  <p className="text-sm" style={{ color: theme.muted }}>
                    Room {roomNumber} • Table {tableNumber}
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl text-center"
                  style={{ backgroundColor: theme.dark }}
                >
                  <p className="text-sm" style={{ color: theme.muted }}>
                    Look for your team name on the big screen!<br />
                    Wait for the facilitator to begin The Game.
                  </p>
                </div>

                <GlowButton
                  onClick={handleStartSimulation}
                  className="w-full"
                >
                  Ready to Begin <Rocket className="inline-block ml-2 w-5 h-5" />
                </GlowButton>

                <button
                  onClick={() => {
                    setRegistrationStep("teamname");
                    setIsTeamRegistered(false);
                  }}
                  className="w-full py-3 text-sm font-medium transition-all hover:bg-white/5 rounded-lg"
                  style={{ color: theme.muted }}
                >
                  Change team name
                </button>
              </div>
            )}
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
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: theme.subtle }} />
                    <span style={{ color: theme.muted }}>{currentRound.customer.size}</span>
                  </div>
                  {currentRound.customer.contactCenters && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" style={{ color: theme.subtle }} />
                      <span style={{ color: theme.muted }}>{currentRound.customer.contactCenters}</span>
                    </div>
                  )}
                  {currentRound.customer.currentSolution && currentRound.customer.currentSolution !== "Unknown" && (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" style={{ color: theme.subtle }} />
                      <span style={{ color: theme.muted }}>Current: {currentRound.customer.currentSolution}</span>
                    </div>
                  )}
                  {currentRound.customer.region && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" style={{ color: theme.subtle }} />
                      <span style={{ color: theme.muted }}>{currentRound.customer.region}</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Customer Context Card - Show first 5 items */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6" style={{ color: roundColor }} />
                  <h3 className="text-lg font-bold" style={{ color: theme.white }}>Customer Context</h3>
                </div>
                <ul className="space-y-2.5">
                  {currentRound.context.map((ctx, i) => (
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

                      // Layout: Three columns top row + one full-width bottom (Round 1)
                      if (currentRound.inputLayout === "threeColumnPlusOne") {
                        const columnFields = currentRound.inputFields.filter(f => f.column);
                        const fullWidthFields = currentRound.inputFields.filter(f => f.fullWidth);
                        return (
                          <>
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              {columnFields.map((field) => (
                                <div key={field.id}>
                                  <h3 className="text-base font-bold mb-1" style={{ color: roundColor }}>{field.label}</h3>
                                  <p className="text-xs mb-2" style={{ color: theme.muted }}>{field.sublabel}</p>
                                  <textarea
                                    value={formData[field.id] || ''}
                                    onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                    rows={8}
                                    style={{ backgroundColor: theme.dark, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                  />
                                </div>
                              ))}
                            </div>
                            {fullWidthFields.map((field) => (
                              <div key={field.id}>
                                <h3 className="text-base font-bold mb-1" style={{ color: roundColor }}>{field.label}</h3>
                                <p className="text-xs mb-2" style={{ color: theme.muted }}>{field.sublabel}</p>
                                <textarea
                                  value={formData[field.id] || ''}
                                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                  placeholder={field.placeholder}
                                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                  rows={4}
                                  style={{ backgroundColor: theme.dark, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                />
                              </div>
                            ))}
                          </>
                        );
                      }

                      // Layout: Status Quo Biases table (Round 2)
                      if (currentRound.inputLayout === "statusQuoBiases") {
                        const requiredFields = currentRound.inputFields.filter(f => f.id !== "biasOther");
                        const otherField = currentRound.inputFields.find(f => f.id === "biasOther");
                        return (
                          <div className="space-y-0">
                            {/* Table Header */}
                            <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 rounded-t-xl overflow-hidden">
                              <div className="px-4 py-3" style={{ backgroundColor: `${roundColor}20`, borderRight: `1px solid ${theme.darkMuted}` }}>
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: roundColor }}>Status Quo Bias</span>
                              </div>
                              <div className="px-4 py-3" style={{ backgroundColor: `${roundColor}20`, borderRight: `1px solid ${theme.darkMuted}` }}>
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: roundColor }}>Unconsidered Risks</span>
                              </div>
                              <div className="px-4 py-3" style={{ backgroundColor: `${roundColor}20` }}>
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: roundColor }}>Evidence / Diagnostic Action</span>
                              </div>
                            </div>

                            {/* Table Rows */}
                            {requiredFields.map((field, idx) => (
                              <div
                                key={field.id}
                                className="grid grid-cols-[1fr_1fr_1fr] gap-0"
                                style={{
                                  borderBottom: `1px solid ${theme.darkMuted}`,
                                  borderLeft: `1px solid ${theme.darkMuted}`,
                                  borderRight: `1px solid ${theme.darkMuted}`,
                                  backgroundColor: idx % 2 === 0 ? theme.dark : theme.darker,
                                }}
                              >
                                {/* Bias label cell */}
                                <div className="px-4 py-3 flex items-start" style={{ borderRight: `1px solid ${theme.darkMuted}` }}>
                                  <p className="text-sm font-medium italic leading-relaxed" style={{ color: theme.light }}>{field.biasLabel}</p>
                                </div>
                                {/* Risk textarea cell */}
                                <div className="p-2" style={{ borderRight: `1px solid ${theme.darkMuted}` }}>
                                  <textarea
                                    value={formData[`${field.id}_risk`] || ''}
                                    onChange={(e) => setFormData({ ...formData, [`${field.id}_risk`]: e.target.value })}
                                    placeholder="Hidden risks of staying the course..."
                                    className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                                    rows={3}
                                    style={{ backgroundColor: `${theme.black}80`, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                  />
                                </div>
                                {/* Evidence textarea cell */}
                                <div className="p-2">
                                  <textarea
                                    value={formData[`${field.id}_evidence`] || ''}
                                    onChange={(e) => setFormData({ ...formData, [`${field.id}_evidence`]: e.target.value })}
                                    placeholder="Data, comparisons, or diagnostic actions..."
                                    className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                                    rows={3}
                                    style={{ backgroundColor: `${theme.black}80`, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                  />
                                </div>
                              </div>
                            ))}

                            {/* Optional "Other" bias */}
                            {otherField && (
                              <div
                                className="rounded-b-xl p-4 mt-3"
                                style={{ backgroundColor: theme.dark, border: `1px dashed ${theme.darkMuted}` }}
                              >
                                <p className="text-xs font-medium mb-3" style={{ color: theme.subtle }}>
                                  Optional: Identify another status quo bias not listed above
                                </p>
                                <div className="grid md:grid-cols-2 gap-3">
                                  <textarea
                                    value={formData[`${otherField.id}_risk`] || ''}
                                    onChange={(e) => setFormData({ ...formData, [`${otherField.id}_risk`]: e.target.value })}
                                    placeholder="Additional bias & its unconsidered risks..."
                                    className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                                    rows={2}
                                    style={{ backgroundColor: theme.darker, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                  />
                                  <textarea
                                    value={formData[`${otherField.id}_evidence`] || ''}
                                    onChange={(e) => setFormData({ ...formData, [`${otherField.id}_evidence`]: e.target.value })}
                                    placeholder="Evidence or diagnostic action..."
                                    className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                                    rows={2}
                                    style={{ backgroundColor: theme.darker, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Layout: Stacked questions (Round 3)
                      if (currentRound.inputLayout === "stackedQuestions") {
                        return (
                          <div className="space-y-4">
                            {currentRound.inputFields.map((field) => (
                              <div key={field.id}>
                                <label className="text-sm font-medium mb-2 block" style={{ color: theme.white }}>{field.label}</label>
                                <textarea
                                  value={formData[field.id] || ''}
                                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                  placeholder={field.placeholder}
                                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                                  rows={4}
                                  style={{ backgroundColor: theme.dark, border: `1px solid ${theme.darkMuted}`, color: theme.white }}
                                />
                              </div>
                            ))}
                          </div>
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

                {/* Criteria Scores — show weights so the math is transparent */}
                <div className="mb-6">
                  <div className="flex items-center justify-between px-3 pb-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.muted }}>Scoring Rubric</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.muted }}>Weight</span>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.muted, minWidth: '2.5rem', textAlign: 'right' }}>Score</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {currentRound.scoringCriteria.map((criterion, idx) => {
                      const criterionScore = submissions[currentRound.id].criteriaScores?.[criterion.name] || 0;
                      const barColor = criterionScore >= 75 ? '#10B981' : criterionScore >= 55 ? roundColor : criterionScore >= 35 ? '#F59E0B' : '#EF4444';
                      return (
                        <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: theme.dark }}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium" style={{ color: theme.white }}>{criterion.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.muted}30`, color: theme.muted }}>{criterion.weight}%</span>
                              <span className="text-lg font-bold" style={{ color: barColor, minWidth: '2.5rem', textAlign: 'right' }}>
                                {criterionScore}
                              </span>
                            </div>
                          </div>
                          {/* Score bar */}
                          <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: `${theme.muted}20` }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${criterionScore}%`, backgroundColor: barColor }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs mt-2 text-right" style={{ color: theme.muted }}>
                    Overall = weighted average of criteria scores
                  </p>
                </div>

                {/* Penalty Alert */}
                {submissions[currentRound.id].initialFeedback?.penaltiesApplied?.length > 0 && (
                  <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#7f1d1d20', border: '1px solid #EF444440' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />
                      <h4 className="text-sm font-bold" style={{ color: '#EF4444' }}>
                        Penalty Received ({submissions[currentRound.id].initialFeedback.penaltiesApplied.length * -5} pts)
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {submissions[currentRound.id].initialFeedback.penaltiesApplied.map((penalty, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#FCA5A5' }}>
                          <span className="mt-0.5 flex-shrink-0">-5</span>
                          <span>{penalty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                <div className="text-base leading-relaxed mb-6" style={{ color: theme.light }}>
                  {currentRound.wobble.description.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('•') ? 'ml-2 mb-1' : 'mb-2'}>{line}</p>
                  ))}
                </div>
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

                {/* Penalty Alert — Final Score */}
                {submissions[currentRound.id].finalFeedback?.penaltiesApplied?.length > 0 && (
                  <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#7f1d1d20', border: '1px solid #EF444440' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />
                      <h4 className="text-sm font-bold" style={{ color: '#EF4444' }}>
                        Penalty Received ({submissions[currentRound.id].finalFeedback.penaltiesApplied.length * -5} pts)
                      </h4>
                    </div>
                    <ul className="space-y-2">
                      {submissions[currentRound.id].finalFeedback.penaltiesApplied.map((penalty, i) => (
                        <li key={i} className="text-sm flex items-start gap-2" style={{ color: '#FCA5A5' }}>
                          <span className="mt-0.5 flex-shrink-0">-5</span>
                          <span>{penalty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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

                {/* Coach's Assessment */}
                {submissions[currentRound.id].finalFeedback?.mainFeedback && (
                  <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: `${roundColor}20`, border: `1px solid ${roundColor}40` }}>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: roundColor }} />
                      <div>
                        <h3 className="text-sm font-bold mb-1" style={{ color: roundColor }}>Coach's Assessment</h3>
                        <p className="text-base leading-relaxed" style={{ color: theme.white }}>
                          {submissions[currentRound.id].finalFeedback.mainFeedback}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* What Worked & Growth Area */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {/* Strengths */}
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <div className="flex items-center gap-2 mb-3">
                      <ThumbsUp className="w-5 h-5" style={{ color: "#10B981" }} />
                      <h4 className="text-sm font-bold" style={{ color: "#10B981" }}>What Worked</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {submissions[currentRound.id].finalFeedback?.strengths?.map((s, i) => (
                        <li key={i} className="text-sm leading-relaxed" style={{ color: theme.light }}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5" style={{ color: theme.orange }} />
                      <h4 className="text-sm font-bold" style={{ color: theme.orange }}>Areas for Growth</h4>
                    </div>
                    <ul className="space-y-1.5">
                      {submissions[currentRound.id].finalFeedback?.improvements?.map((s, i) => (
                        <li key={i} className="text-sm leading-relaxed" style={{ color: theme.light }}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Team Debrief */}
                <div className="p-5 rounded-xl" style={{ backgroundColor: `${roundColor}10`, border: `1px solid ${roundColor}30` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5" style={{ color: roundColor }} />
                    <h4 className="text-base font-bold" style={{ color: theme.white }}>Team Debrief</h4>
                  </div>

                  {/* Role-based reflection */}
                  <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: theme.dark }}>
                    <p className="text-sm font-bold mb-3" style={{ color: theme.white }}>
                      Each person: from your role's perspective, what is one specific thing you would do differently to increase our chances of winning in similar situations?
                    </p>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { role: "AE", prompt: "Deal strategy & ownership" },
                        { role: "SC", prompt: "Technical alignment" },
                        { role: "BDR", prompt: "Access & engagement" },
                        { role: "CS", prompt: "Customer outcomes" },
                        { role: "Leader", prompt: "Coaching & orchestration" },
                      ].map(({ role, prompt }) => (
                        <div key={role} className="text-center p-2 rounded-lg" style={{ backgroundColor: theme.darker }}>
                          <div className="text-xs font-bold mb-1" style={{ color: roundColor }}>{role}</div>
                          <div className="text-xs" style={{ color: theme.muted }}>{prompt}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collaboration question */}
                  <div className="p-4 rounded-xl" style={{ backgroundColor: theme.dark }}>
                    <p className="text-sm font-bold" style={{ color: theme.white }}>
                      In what ways can we better collaborate as ONE Genesys in these situations?
                    </p>
                    <p className="text-xs mt-2" style={{ color: theme.muted }}>
                      Discuss as a team – how can each role contribute to a stronger, more coordinated approach?
                    </p>
                  </div>
                </div>
              </Card>

              {currentRoundIndex < simulationRounds.length - 1 ? (
                <GlowButton onClick={handleNextRound} color={roundColor} className="w-full">
                  Continue to Round {currentRound.id + 1} <ChevronRight className="inline-block ml-2 w-5 h-5" />
                </GlowButton>
              ) : (
                <GlowButton onClick={() => setRoundPhase("final")} color={theme.orange} className="w-full">
                  <Trophy className="inline-block mr-2 w-5 h-5" />
                  Complete The Game
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
                    The Game Complete!
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
                    const totalScore = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0) + (team.bonusPoints || 0);
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
                      const totalScore = Object.values(team.scores || {}).reduce((a, b) => a + b, 0) + (team.bonusPoints || 0);
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
