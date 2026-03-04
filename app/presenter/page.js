"use client";

import React, { useState, useEffect, useCallback, useRef, Component } from "react";

// Error boundary — prevents white screen crashes on presenter projector
class PresenterErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Presenter error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#08080C', color: 'white', fontFamily: 'system-ui', textAlign: 'center',
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#FF4F1F' }}>
              Display Error
            </h1>
            <p style={{ color: '#9898A6', marginBottom: '24px' }}>The presenter view hit an error.</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '14px 32px', borderRadius: '12px', background: '#FF4F1F', color: 'white', border: 'none', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
            >
              Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
import {
  Trophy,
  Users,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Crown,
  LogIn,
  Plus,
  Minus,
  Star,
  Clock,
  Play,
  Pause,
  RotateCcw,
  X,
  Award,
  Target,
  Zap,
  Shield,
  TrendingUp,
  BarChart3,
  Timer,
} from "lucide-react";

// ============================================================================
// DESIGN SYSTEM - Presenter Theme (Mentimeter-inspired, refined for projectors)
// ============================================================================

const theme = {
  orange: "#FF4F1F",
  orangeGlow: "rgba(255, 79, 31, 0.25)",

  // Backgrounds — subtle warm-dark palette instead of pure black
  bg: "#08080C",
  bgElevated: "#0F0F14",
  bgCard: "#13131A",
  bgCardHover: "#1A1A24",
  bgSubtle: "#1E1E2A",

  white: "#FFFFFF",
  light: "#EEEEF0",
  muted: "#9898A6",
  subtle: "#5C5C6E",
  faint: "rgba(255,255,255,0.04)",

  // Actual round data from the simulation
  rounds: {
    0: { color: "#F59E0B", name: "Registration", subtitle: "", customer: "", motion: "", icon: "☰" },
    1: { color: "#10B981", name: "Shape the Vision", subtitle: "New Logo Opportunity", customer: "Everwell Health Services", motion: "Legacy Displacement" },
    2: { color: "#FF4F1F", name: "Disrupt Status Quo", subtitle: "New Logo Opportunity", customer: "Aureon Financial Holdings", motion: "Legacy Replacement" },
    3: { color: "#3B82F6", name: "Hold the High Ground", subtitle: "Account Defense", customer: "Summit Ridge Retail Group", motion: "Account Defense" },
    4: { color: "#8B5CF6", name: "Capture More Share", subtitle: "Account Expansion", customer: "Orion Global Logistics", motion: "Global Expansion" },
  },
};

// ============================================================================
// WORD CLOUD COMPONENT — Grid-based layout, no overlaps
// ============================================================================

function TeamRegistrationWall({ teams }) {
  // Genesys-inspired palette — warm oranges, corals, teals, navy
  const bgColors = [
    { bg: '#FF4F1F', text: '#FFFFFF' },  // genesys orange
    { bg: '#FF6B3D', text: '#FFFFFF' },  // coral orange
    { bg: '#E8461E', text: '#FFFFFF' },  // deep orange
    { bg: '#2A6B6A', text: '#FFFFFF' },  // teal
    { bg: '#1A4B5C', text: '#FFFFFF' },  // dark teal
    { bg: '#37857F', text: '#FFFFFF' },  // warm teal
    { bg: '#1B2A4A', text: '#FFFFFF' },  // navy
    { bg: '#D4451A', text: '#FFFFFF' },  // burnt orange
    { bg: '#F28C5A', text: '#FFFFFF' },  // light coral
    { bg: '#3A9994', text: '#FFFFFF' },  // mid teal
  ];

  if (teams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6" style={{ minHeight: '60vh' }}>
        <div
          className="w-28 h-28 rounded-3xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${theme.bgSubtle}, ${theme.bgCard})` }}
        >
          <Users className="w-14 h-14" style={{ color: theme.subtle }} />
        </div>
        <p className="text-3xl font-medium" style={{ color: theme.subtle }}>
          Waiting for teams to register...
        </p>
        <p className="text-lg" style={{ color: theme.subtle, opacity: 0.6 }}>
          Team names will appear here as they join
        </p>
      </div>
    );
  }

  // Colored tile grid — like Mentimeter participant wall
  return (
    <div
      className="w-full max-w-[1600px] mx-auto px-6 py-6"
      style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {teams.map((team, index) => {
          const seed = team.teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          const colorSet = bgColors[seed % bgColors.length];

          return (
            <div
              key={team.teamKey || team.teamName}
              style={{
                backgroundColor: colorSet.bg,
                color: colorSet.text,
                borderRadius: '20px',
                padding: '28px 32px',
                fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                animation: `tilePop 0.4s ease-out ${index * 0.05}s both`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                minHeight: '80px',
              }}
            >
              {team.teamName}
            </div>
          );
        })}
      </div>

      {/* Team count */}
      <div className="text-center mt-8">
        <span
          className="text-lg font-bold"
          style={{ color: theme.subtle }}
        >
          {teams.length} {teams.length === 1 ? 'team' : 'teams'} registered
        </span>
      </div>

      <style jsx>{`
        @keyframes tilePop {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// LEADERBOARD COMPONENT — Clean, Mentimeter-style with score bars
// ============================================================================

function LeaderboardDisplay({ teams, currentRound, leaderboardMode }) {
  const roundColor = theme.rounds[currentRound]?.color || theme.orange;
  const isRoundView = leaderboardMode === 'round';

  // Sort by round score or total score depending on mode — stable tiebreaker by team name
  const sortedTeams = [...teams].sort((a, b) => {
    if (isRoundView) {
      const aRound = a.scores?.[currentRound] || 0;
      const bRound = b.scores?.[currentRound] || 0;
      if (bRound !== aRound) return bRound - aRound;
      return a.teamName.localeCompare(b.teamName);
    }
    const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
    const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
    if (bTotal !== aTotal) return bTotal - aTotal;
    return a.teamName.localeCompare(b.teamName);
  });

  // Filter teams with scores in this round for round view
  const teamsWithRoundScore = isRoundView
    ? sortedTeams.filter(t => t.scores?.[currentRound] !== undefined)
    : sortedTeams;

  const displayTeams = teamsWithRoundScore.slice(0, 20);

  const maxScore = displayTeams.length > 0
    ? Math.max(1, ...displayTeams.map(t => {
        if (isRoundView) return t.scores?.[currentRound] || 0;
        return Object.values(t.scores || {}).reduce((s, v) => s + v, 0) + (t.bonusPoints || 0);
      }))
    : 1;

  const activeRounds = [1, 2, 3, 4].filter(r =>
    sortedTeams.some(t => t.scores?.[r] !== undefined)
  );

  const showBonus = !isRoundView && sortedTeams.some(t => (t.bonusPoints || 0) > 0);

  if (displayTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6" style={{ minHeight: '50vh' }}>
        <Trophy className="w-20 h-20" style={{ color: theme.subtle, opacity: 0.3 }} />
        <p className="text-3xl font-medium" style={{ color: theme.subtle }}>
          {isRoundView ? 'Waiting for round scores...' : 'Scores will appear as teams submit'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Round Winner Header */}
      {isRoundView && (
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-2"
            style={{ backgroundColor: `${roundColor}15`, color: roundColor, border: `1px solid ${roundColor}25` }}
          >
            <Trophy className="w-4 h-4" />
            ROUND {currentRound} RESULTS
          </div>
        </div>
      )}

      {/* Column Headers */}
      <div
        className="flex items-center gap-4 px-6 py-3 mb-2 text-xs font-bold uppercase tracking-widest"
        style={{ color: theme.subtle }}
      >
        <div style={{ width: '48px' }} />
        <div className="flex-1">Team</div>
        {isRoundView ? (
          <div className="text-right" style={{ width: '120px', color: roundColor }}>Round {currentRound}</div>
        ) : (
          <>
            {activeRounds.map(r => (
              <div
                key={r}
                className="text-center"
                style={{ width: '72px', color: theme.rounds[r]?.color || theme.muted, opacity: 0.7 }}
              >
                R{r}
              </div>
            ))}
            {showBonus && (
              <div className="text-center" style={{ width: '56px', color: '#FFD700', opacity: 0.7 }}>
                <Star className="w-3.5 h-3.5 mx-auto" />
              </div>
            )}
            <div className="text-right" style={{ width: '100px' }}>Total</div>
          </>
        )}
      </div>

      {/* Team Rows */}
      <div className="space-y-1.5">
        {displayTeams.map((team, index) => {
          const roundScore = team.scores?.[currentRound] || 0;
          const roundScoreTotal = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0);
          const totalScore = roundScoreTotal + (team.bonusPoints || 0);
          const displayScore = isRoundView ? roundScore : totalScore;
          const barWidth = (displayScore / maxScore) * 100;
          const isTop3 = index < 3;

          return (
            <div
              key={`${team.teamName}-${team.table}`}
              className="relative flex items-center gap-4 px-6 py-4 rounded-2xl overflow-hidden transition-all"
              style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${isTop3 ? `${roundColor}15` : theme.faint}`,
              }}
            >
              {/* Score bar background */}
              <div
                className="absolute inset-0 rounded-2xl transition-all duration-1000"
                style={{
                  background: `linear-gradient(90deg, ${roundColor}${isTop3 ? '12' : '06'} 0%, transparent ${Math.min(barWidth + 10, 100)}%)`,
                  width: `${barWidth}%`,
                }}
              />

              {/* Rank */}
              <div
                className="relative z-10 flex-shrink-0 flex items-center justify-center font-black text-xl"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: isTop3
                    ? `linear-gradient(135deg, ${roundColor}20, ${roundColor}08)`
                    : theme.bgSubtle,
                  color: isTop3 ? roundColor : theme.muted,
                  border: `1px solid ${isTop3 ? `${roundColor}25` : theme.faint}`,
                }}
              >
                {index === 0 ? <Crown className="w-6 h-6" style={{ color: '#FFD700' }} /> : index + 1}
              </div>

              {/* Team Name & Table */}
              <div className="relative z-10 flex-1 min-w-0">
                <div
                  className="font-black truncate"
                  style={{
                    color: theme.white,
                    fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
                  }}
                >
                  {team.teamName}
                </div>
                <span className="text-sm" style={{ color: theme.subtle }}>
                  Table {team.table}
                </span>
              </div>

              {isRoundView ? (
                /* Round View — just the round score, big */
                <div
                  className="relative z-10 text-right font-black tabular-nums"
                  style={{
                    width: '120px',
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                    color: isTop3 ? roundColor : theme.light,
                  }}
                >
                  {roundScore}
                </div>
              ) : (
                <>
                  {/* Cumulative View — per-round + total */}
                  {activeRounds.map(r => {
                    const rScore = team.scores?.[r];
                    const rColor = theme.rounds[r]?.color || theme.muted;
                    return (
                      <div
                        key={r}
                        className="relative z-10 text-center font-bold"
                        style={{
                          width: '72px',
                          fontSize: '1.15rem',
                          color: rScore !== undefined ? rColor : `${theme.subtle}30`,
                        }}
                      >
                        {rScore !== undefined ? rScore : '\u2013'}
                      </div>
                    );
                  })}

                  {showBonus && (
                    <div
                      className="relative z-10 text-center text-sm font-medium"
                      style={{
                        width: '56px',
                        color: (team.bonusPoints || 0) > 0 ? '#FFD700' : `${theme.subtle}30`,
                      }}
                    >
                      {(team.bonusPoints || 0) > 0 ? `+${team.bonusPoints}` : '\u2013'}
                    </div>
                  )}

                  <div
                    className="relative z-10 text-right font-black tabular-nums"
                    style={{
                      width: '100px',
                      fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                      color: isTop3 ? roundColor : theme.light,
                    }}
                  >
                    {totalScore}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}

// ============================================================================
// SVG RING COMPONENT — Apple Watch fitness ring style
// ============================================================================

function FitnessRing({ radius, stroke, progress, color, glowColor, label, timeText, isActive, isPulsing }) {
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <g>
      {/* Track (background ring) */}
      <circle
        cx={radius > 120 ? 200 : 200}
        cy={200}
        r={normalizedRadius}
        fill="none"
        stroke={`${color}15`}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Active ring */}
      <circle
        cx={200}
        cy={200}
        r={normalizedRadius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 200 200)"
        style={{
          transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
          filter: isActive ? `drop-shadow(0 0 ${isPulsing ? '12px' : '6px'} ${glowColor || color}80)` : 'none',
        }}
      />
    </g>
  );
}

// ============================================================================
// ACTIVITY IN PROGRESS COMPONENT — Apple Watch fitness ring timer
// ============================================================================

function ActivityInProgress({
  currentRound,
  activitySeconds, activityDuration, isActivityRunning,
  wobbleSeconds, wobbleDuration, isWobbleRunning, wobbleStarted,
  onToggleActivity, onResetActivity, onAdjustActivity,
  onToggleWobble, onResetWobble, onAdjustWobble,
}) {
  const roundInfo = theme.rounds[currentRound];
  const roundColor = roundInfo?.color || theme.orange;

  const activityProgress = 1 - (activitySeconds / activityDuration);
  const wobbleProgress = wobbleStarted ? 1 - (wobbleSeconds / wobbleDuration) : 0;

  const activityMin = Math.floor(activitySeconds / 60);
  const activitySec = activitySeconds % 60;
  const wobbleMin = Math.floor(wobbleSeconds / 60);
  const wobbleSec = wobbleSeconds % 60;

  const activityColor = activitySeconds <= 60 ? '#EF4444' : activitySeconds <= 180 ? '#F59E0B' : roundColor;
  const wobbleColor = wobbleSeconds <= 30 ? '#EF4444' : wobbleSeconds <= 60 ? '#F59E0B' : '#8B5CF6';

  const activityComplete = activitySeconds === 0;
  const wobbleComplete = wobbleStarted && wobbleSeconds === 0;

  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ minHeight: '65vh', gap: '32px' }}>
      {/* Round context — customer name */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold"
          style={{
            background: `linear-gradient(135deg, ${roundColor}18, ${roundColor}08)`,
            color: roundColor,
            border: `1px solid ${roundColor}20`,
            fontSize: '16px',
            letterSpacing: '0.05em',
          }}
        >
          <Target className="w-4 h-4" />
          {roundInfo?.customer}
        </div>
      </div>

      {/* Fitness Rings + Timer Display */}
      <div className="relative" style={{ width: '400px', height: '400px' }}>
        <svg viewBox="0 0 400 400" width="400" height="400">
          {/* Outer ring — Activity timer */}
          <FitnessRing
            radius={185}
            stroke={28}
            progress={activityProgress}
            color={activityComplete ? '#10B981' : activityColor}
            glowColor={activityColor}
            isActive={isActivityRunning || activityComplete}
            isPulsing={activitySeconds <= 60 && isActivityRunning}
          />
          {/* Inner ring — Wobble timer */}
          <FitnessRing
            radius={148}
            stroke={22}
            progress={wobbleProgress}
            color={wobbleComplete ? '#10B981' : wobbleStarted ? wobbleColor : `${theme.subtle}30`}
            glowColor={wobbleColor}
            isActive={isWobbleRunning || wobbleComplete}
            isPulsing={wobbleSeconds <= 30 && isWobbleRunning}
          />
        </svg>

        {/* Center time display */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          {/* Activity time */}
          <div
            style={{
              fontSize: activityComplete ? '3.5rem' : 'clamp(3rem, 8vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1,
              color: activityComplete ? '#10B981' : activityColor,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.03em',
              textShadow: (activitySeconds <= 60 && isActivityRunning) ? `0 0 30px ${activityColor}50` : 'none',
            }}
          >
            {activityComplete ? '✓' : `${String(activityMin).padStart(2, '0')}:${String(activitySec).padStart(2, '0')}`}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.subtle, letterSpacing: '0.15em', marginTop: '4px' }}>
            THE CHALLENGE
          </div>

          {/* Divider */}
          <div style={{ width: '40px', height: '1px', backgroundColor: `${theme.subtle}30`, margin: '10px 0' }} />

          {/* Wobble time */}
          <div
            style={{
              fontSize: wobbleComplete ? '1.8rem' : '1.8rem',
              fontWeight: 800,
              lineHeight: 1,
              color: !wobbleStarted ? `${theme.subtle}40` : wobbleComplete ? '#10B981' : wobbleColor,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.02em',
            }}
          >
            {wobbleComplete ? '✓' : `${String(wobbleMin).padStart(2, '0')}:${String(wobbleSec).padStart(2, '0')}`}
          </div>
          <div style={{ fontSize: '10px', fontWeight: 700, color: `${theme.subtle}${wobbleStarted ? '' : '50'}`, letterSpacing: '0.15em', marginTop: '2px' }}>
            WOBBLE
          </div>
        </div>
      </div>

      {/* Timer Controls — Two rows */}
      <div className="flex flex-col items-center gap-4" style={{ width: '100%', maxWidth: '600px' }}>
        {/* Activity Controls */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '11px', fontWeight: 700, color: roundColor, letterSpacing: '0.1em', width: '100px', textAlign: 'right' }}>THE CHALLENGE</span>
          <button
            onClick={() => onAdjustActivity(-60)}
            disabled={activitySeconds <= 0}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20"
            style={{ backgroundColor: theme.bgSubtle, color: theme.muted, border: `1px solid ${theme.faint}` }}
            title="−1 min"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: theme.muted, minWidth: '50px', textAlign: 'center' }}
          >
            {Math.floor(activityDuration / 60)}m
          </span>
          <button
            onClick={() => onAdjustActivity(60)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ backgroundColor: theme.bgSubtle, color: theme.muted, border: `1px solid ${theme.faint}` }}
            title="+1 min"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleActivity}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: isActivityRunning ? '#EF444412' : `${roundColor}15`,
              color: isActivityRunning ? '#EF4444' : roundColor,
              border: `1px solid ${isActivityRunning ? '#EF444425' : `${roundColor}25`}`,
              cursor: 'pointer',
            }}
          >
            {isActivityRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActivityRunning ? 'Pause' : activityComplete ? 'Done' : 'Start'}
          </button>
          <button
            onClick={onResetActivity}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: theme.subtle, border: `1px solid ${theme.faint}`, backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Wobble Controls */}
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#8B5CF6', letterSpacing: '0.1em', width: '70px', textAlign: 'right' }}>WOBBLE</span>
          <button
            onClick={() => onAdjustWobble(-60)}
            disabled={wobbleSeconds <= 0}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-20"
            style={{ backgroundColor: theme.bgSubtle, color: theme.muted, border: `1px solid ${theme.faint}` }}
            title="−1 min"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: theme.muted, minWidth: '50px', textAlign: 'center' }}
          >
            {Math.floor(wobbleDuration / 60)}m
          </span>
          <button
            onClick={() => onAdjustWobble(60)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ backgroundColor: theme.bgSubtle, color: theme.muted, border: `1px solid ${theme.faint}` }}
            title="+1 min"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleWobble}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              backgroundColor: isWobbleRunning ? '#EF444412' : '#8B5CF615',
              color: isWobbleRunning ? '#EF4444' : '#8B5CF6',
              border: `1px solid ${isWobbleRunning ? '#EF444425' : '#8B5CF625'}`,
              cursor: 'pointer',
              opacity: activityComplete || wobbleStarted ? 1 : 0.5,
            }}
          >
            {isWobbleRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isWobbleRunning ? 'Pause' : wobbleComplete ? 'Done' : 'Start'}
          </button>
          <button
            onClick={onResetWobble}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: theme.subtle, border: `1px solid ${theme.faint}`, backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Status */}
      <p style={{ fontSize: '14px', color: theme.subtle, letterSpacing: '0.05em', textAlign: 'center' }}>
        {!isActivityRunning && !wobbleStarted && activitySeconds === activityDuration && 'READY TO START'}
        {isActivityRunning && 'THE CHALLENGE IN PROGRESS'}
        {activityComplete && !wobbleStarted && 'THE CHALLENGE COMPLETE — START WOBBLE'}
        {isWobbleRunning && 'WOBBLE IN PROGRESS'}
        {wobbleComplete && <span style={{ color: '#10B981', fontWeight: 700 }}>ROUND COMPLETE</span>}
        {!isActivityRunning && !isWobbleRunning && activitySeconds < activityDuration && activitySeconds > 0 && !wobbleStarted && 'PAUSED'}
        {!isWobbleRunning && wobbleStarted && !wobbleComplete && wobbleSeconds > 0 && 'WOBBLE PAUSED'}
      </p>
    </div>
  );
}

// ============================================================================
// BONUS POINTS MODAL
// ============================================================================

function BonusPointsModal({ teams, roomNumber, onClose, onBonusAdded }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [bonusAmount, setBonusAmount] = useState(5);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sortedTeams = [...teams].sort((a, b) => a.teamName.localeCompare(b.teamName));

  const handleSubmit = async () => {
    if (!selectedTeam || bonusAmount === 0) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bonus',
          room: roomNumber,
          table: selectedTeam.table,
          points: bonusAmount,
          reason,
        }),
      });
      if (response.ok) {
        onBonusAdded();
        setSelectedTeam(null);
        setBonusAmount(5);
        setReason("");
      }
    } catch (err) {
      console.error("Failed to add bonus:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div
        className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{ backgroundColor: theme.bgElevated, border: `1px solid rgba(255,255,255,0.06)`, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD70015, #FFD70005)', border: '1px solid #FFD70020' }}>
              <Award className="w-6 h-6" style={{ color: '#FFD700' }} />
            </div>
            <div>
              <h2 className="text-2xl font-black" style={{ color: theme.white }}>Award Bonus Points</h2>
              <p className="text-sm" style={{ color: theme.subtle }}>Room {roomNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
            <X className="w-6 h-6" style={{ color: theme.muted }} />
          </button>
        </div>

        {/* Team Selection */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.subtle }}>Select Team</label>
          <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
            {sortedTeams.map((team) => (
              <button
                key={team.teamKey}
                onClick={() => setSelectedTeam(team)}
                className="text-left p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: selectedTeam?.teamKey === team.teamKey ? `${theme.orange}12` : theme.bgSubtle,
                  border: selectedTeam?.teamKey === team.teamKey ? `2px solid ${theme.orange}` : '2px solid transparent',
                  color: theme.white,
                }}
              >
                <div className="font-bold truncate">{team.teamName}</div>
                <div className="text-xs" style={{ color: theme.subtle }}>Table {team.table}{(team.bonusPoints || 0) > 0 ? ` \u00B7 +${team.bonusPoints} bonus` : ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Points Amount */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.subtle }}>Points</label>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => setBonusAmount(Math.max(-10, bonusAmount - 1))}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ backgroundColor: theme.bgSubtle, color: theme.white }}
            >
              <Minus className="w-5 h-5" />
            </button>
            <div
              className="text-6xl font-black w-36 text-center tabular-nums"
              style={{ color: bonusAmount > 0 ? '#10B981' : bonusAmount < 0 ? '#EF4444' : theme.subtle }}
            >
              {bonusAmount > 0 ? '+' : ''}{bonusAmount}
            </div>
            <button
              onClick={() => setBonusAmount(Math.min(25, bonusAmount + 1))}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ backgroundColor: theme.bgSubtle, color: theme.white }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2 mt-4 justify-center">
            {[1, 2, 5, 10, 15].map((pts) => (
              <button
                key={pts}
                onClick={() => setBonusAmount(pts)}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  backgroundColor: bonusAmount === pts ? theme.orange : theme.bgSubtle,
                  color: theme.white,
                  border: bonusAmount === pts ? 'none' : `1px solid ${theme.faint}`,
                }}
              >
                +{pts}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.subtle }}>Reason (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Great teamwork, Best presentation..."
            className="w-full px-4 py-3 rounded-xl text-base"
            style={{ backgroundColor: theme.bgSubtle, color: theme.white, border: `1px solid ${theme.faint}` }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedTeam || bonusAmount === 0 || isSubmitting}
          className="w-full py-4 rounded-2xl text-lg font-bold transition-all disabled:opacity-30"
          style={{
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orange}DD)`,
            color: theme.white,
            boxShadow: `0 4px 24px ${theme.orangeGlow}`,
          }}
        >
          {isSubmitting ? 'Awarding...' : selectedTeam ? `Award ${bonusAmount > 0 ? '+' : ''}${bonusAmount} to ${selectedTeam.teamName}` : 'Select a team above'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PRESENTER COMPONENT
// ============================================================================

export default function PresenterViewWrapper() {
  return (
    <PresenterErrorBoundary>
      <PresenterView />
    </PresenterErrorBoundary>
  );
}

function PresenterView() {
  const [roomNumber, setRoomNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [teams, setTeams] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showBonusModal, setShowBonusModal] = useState(false);

  const [viewMode, setViewMode] = useState("activity");
  const [leaderboardMode, setLeaderboardMode] = useState("round"); // "round" or "cumulative"

  // Activity timer (configurable, default 20 min)
  const [activityDuration, setActivityDuration] = useState(20 * 60);
  const [activitySeconds, setActivitySeconds] = useState(20 * 60);
  const [isActivityRunning, setIsActivityRunning] = useState(false);
  const activityRef = useRef(null);

  // Wobble timer (configurable, default 5 min)
  const [wobbleDuration, setWobbleDuration] = useState(5 * 60);
  const [wobbleSeconds, setWobbleSeconds] = useState(5 * 60);
  const [isWobbleRunning, setIsWobbleRunning] = useState(false);
  const [wobbleStarted, setWobbleStarted] = useState(false);
  const wobbleRef = useRef(null);

  useEffect(() => {
    const savedRoom = sessionStorage.getItem("presenter_room");
    if (savedRoom) {
      setRoomNumber(savedRoom);
      setIsLoggedIn(true);
    }
  }, []);

  // Activity timer countdown
  useEffect(() => {
    if (isActivityRunning && activitySeconds > 0) {
      activityRef.current = setInterval(() => {
        setActivitySeconds((prev) => {
          if (prev <= 1) {
            setIsActivityRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(activityRef.current);
    }
    return () => clearInterval(activityRef.current);
  }, [isActivityRunning, activitySeconds]);

  // Wobble timer countdown
  useEffect(() => {
    if (isWobbleRunning && wobbleSeconds > 0) {
      wobbleRef.current = setInterval(() => {
        setWobbleSeconds((prev) => {
          if (prev <= 1) {
            setIsWobbleRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(wobbleRef.current);
    }
    return () => clearInterval(wobbleRef.current);
  }, [isWobbleRunning, wobbleSeconds]);

  // Fetch teams data
  const fetchTeams = useCallback(async () => {
    if (!roomNumber) return;
    try {
      const response = await fetch(`/api/leaderboard?room=${encodeURIComponent(roomNumber)}`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data.leaderboard || []);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  }, [roomNumber]);

  useEffect(() => {
    if (isLoggedIn && roomNumber) {
      fetchTeams();
      const interval = setInterval(fetchTeams, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, roomNumber, fetchTeams]);

  const handleLogin = () => {
    if (roomNumber.trim()) {
      sessionStorage.setItem("presenter_room", roomNumber);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("presenter_room");
    setIsLoggedIn(false);
    setRoomNumber("");
    setCurrentRound(0);
    setTeams([]);
  };

  const goToRound = (round) => {
    const r = Math.max(0, Math.min(4, round));
    setCurrentRound(r);
    if (r > 0) {
      setViewMode("activity");
      setActivityDuration(20 * 60);
      setActivitySeconds(20 * 60);
      setIsActivityRunning(false);
      setWobbleDuration(5 * 60);
      setWobbleSeconds(5 * 60);
      setIsWobbleRunning(false);
      setWobbleStarted(false);
      setLeaderboardMode("round");
    } else {
      setViewMode("leaderboard");
      setLeaderboardMode("cumulative");
    }
  };

  const toggleActivity = () => {
    if (activitySeconds > 0) setIsActivityRunning(!isActivityRunning);
  };
  const resetActivity = () => {
    setIsActivityRunning(false);
    setActivitySeconds(activityDuration);
  };
  const adjustActivity = (delta) => {
    const newDuration = Math.max(60, activityDuration + delta);
    const diff = newDuration - activityDuration;
    setActivityDuration(newDuration);
    setActivitySeconds(prev => Math.max(0, prev + diff));
  };

  const toggleWobble = () => {
    if (activitySeconds > 0) return; // Block until activity timer is done
    if (wobbleSeconds > 0) {
      setWobbleStarted(true);
      setIsWobbleRunning(!isWobbleRunning);
    }
  };
  const resetWobble = () => {
    setIsWobbleRunning(false);
    setWobbleStarted(false);
    setWobbleSeconds(wobbleDuration);
  };
  const adjustWobble = (delta) => {
    const newDuration = Math.max(60, wobbleDuration + delta);
    const diff = newDuration - wobbleDuration;
    setWobbleDuration(newDuration);
    setWobbleSeconds(prev => Math.max(0, prev + diff));
  };

  const roundInfo = theme.rounds[currentRound];
  const roundColor = roundInfo?.color || theme.orange;

  // ============================================================================
  // RENDER: LOGIN SCREEN
  // ============================================================================

  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-8 relative"
        style={{ backgroundImage: 'url(/gradient-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', pointerEvents: 'none' }} />
        <div
          className="relative z-10 w-full max-w-lg p-12 text-center rounded-3xl"
          style={{ backgroundColor: theme.bgCard, border: `1px solid rgba(255,255,255,0.04)`, boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}
        >
          <img
            src="/genesys-logo.png"
            alt="Genesys"
            className="h-20 mx-auto mb-8"
          />
          <h1 className="text-5xl font-black mb-2" style={{ color: theme.white, letterSpacing: '-0.02em' }}>
            The Game
          </h1>
          <p className="text-lg mb-10" style={{ color: theme.subtle, letterSpacing: '0.05em' }}>
            Presenter Dashboard
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-left" style={{ color: theme.subtle }}>
                Room Number
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="e.g., 1"
                className="w-full px-6 py-4 rounded-2xl text-2xl text-center font-bold"
                style={{
                  backgroundColor: theme.bgSubtle,
                  color: theme.white,
                  border: `1px solid ${theme.faint}`,
                  outline: 'none',
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={!roomNumber.trim()}
              className="w-full py-4 px-8 rounded-2xl text-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-30"
              style={{
                background: `linear-gradient(135deg, ${theme.orange}, ${theme.orange}DD)`,
                color: theme.white,
                boxShadow: `0 4px 24px ${theme.orangeGlow}`,
              }}
            >
              <LogIn className="w-6 h-6" />
              Enter Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN PRESENTER VIEW
  // ============================================================================

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ backgroundImage: 'url(/gradient-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-8 py-4"
        style={{ borderBottom: `1px solid ${theme.faint}` }}
      >
        {/* Left: Logo + Room */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <img src="/genesys-logo.png" alt="Genesys" className="h-12 opacity-90" />
          <div className="h-8 w-px" style={{ backgroundColor: `${theme.subtle}30` }} />
          <span
            className="text-base font-bold tracking-widest"
            style={{ color: theme.muted }}
          >
            ROOM {roomNumber}
          </span>
        </div>

        {/* Center: Round Navigation — absolutely positioned for true center */}
        <div className="absolute left-1/2 top-1/2" style={{ transform: 'translate(-50%, -50%)' }}>
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl" style={{ backgroundColor: theme.bgCard, border: `1px solid ${theme.faint}` }}>
            {[0, 1, 2, 3, 4].map((round) => {
              const rc = theme.rounds[round]?.color || theme.muted;
              const isActive = currentRound === round;
              return (
                <button
                  key={round}
                  onClick={() => goToRound(round)}
                  className="relative flex items-center justify-center transition-all"
                  style={{
                    padding: isActive ? '8px 20px' : '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: isActive ? `${rc}18` : 'transparent',
                    color: isActive ? rc : theme.subtle,
                    fontSize: '14px',
                    fontWeight: isActive ? 800 : 600,
                    border: isActive ? `1px solid ${rc}25` : '1px solid transparent',
                  }}
                  title={theme.rounds[round]?.name}
                >
                  {round === 0 ? (isActive ? 'Lobby' : '\u2302') : `R${round}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center justify-end gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ color: theme.subtle }}>
            <Users className="w-4 h-4" />
            {teams.length}
          </div>

          {/* View Toggle */}
          {currentRound > 0 && (
            <div className="flex rounded-xl overflow-hidden p-0.5" style={{ backgroundColor: theme.bgCard }}>
              <button
                onClick={() => setViewMode("activity")}
                className="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 rounded-lg"
                style={{
                  backgroundColor: viewMode === "activity" ? `${roundColor}15` : 'transparent',
                  color: viewMode === "activity" ? roundColor : theme.subtle,
                }}
              >
                <Clock className="w-3 h-3" />
                Timer
              </button>
              <button
                onClick={() => { setViewMode("leaderboard"); setLeaderboardMode("round"); }}
                className="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 rounded-lg"
                style={{
                  backgroundColor: viewMode === "leaderboard" && leaderboardMode === "round" ? `${roundColor}15` : 'transparent',
                  color: viewMode === "leaderboard" && leaderboardMode === "round" ? roundColor : theme.subtle,
                }}
              >
                <Trophy className="w-3 h-3" />
                Round
              </button>
              <button
                onClick={() => { setViewMode("leaderboard"); setLeaderboardMode("cumulative"); }}
                className="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 rounded-lg"
                style={{
                  backgroundColor: viewMode === "leaderboard" && leaderboardMode === "cumulative" ? `${roundColor}15` : 'transparent',
                  color: viewMode === "leaderboard" && leaderboardMode === "cumulative" ? roundColor : theme.subtle,
                }}
              >
                <BarChart3 className="w-3 h-3" />
                Overall
              </button>
            </div>
          )}

          {/* Bonus Points */}
          {currentRound > 0 && (
            <button
              onClick={() => setShowBonusModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ backgroundColor: '#FFD70008', color: '#FFD700', border: '1px solid #FFD70015' }}
            >
              <Star className="w-3 h-3" />
              Bonus
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
            style={{ color: theme.subtle }}
          >
            Exit
          </button>
        </div>
      </header>

      {/* Round Title Area */}
      <div className="relative z-10 px-8 pt-6 pb-2 text-center">
        <h1
          style={{
            fontSize: currentRound === 0 ? 'clamp(2rem, 4vw, 3.5rem)' : 'clamp(1.5rem, 3vw, 2.5rem)',
            fontWeight: 900,
            color: roundColor,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {currentRound === 0
            ? 'TEAM REGISTRATION'
            : `ROUND ${currentRound}: ${roundInfo?.name?.toUpperCase()}`
          }
        </h1>
        {currentRound > 0 && viewMode === "leaderboard" && (
          <p className="text-base mt-1" style={{ color: theme.subtle }}>{roundInfo?.customer}</p>
        )}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-8 py-2 overflow-auto">
        {currentRound === 0 ? (
          <TeamRegistrationWall teams={teams} />
        ) : viewMode === "activity" ? (
          <ActivityInProgress
            currentRound={currentRound}
            activitySeconds={activitySeconds}
            activityDuration={activityDuration}
            isActivityRunning={isActivityRunning}
            wobbleSeconds={wobbleSeconds}
            wobbleDuration={wobbleDuration}
            isWobbleRunning={isWobbleRunning}
            wobbleStarted={wobbleStarted}
            onToggleActivity={toggleActivity}
            onResetActivity={resetActivity}
            onAdjustActivity={adjustActivity}
            onToggleWobble={toggleWobble}
            onResetWobble={resetWobble}
            onAdjustWobble={adjustWobble}
          />
        ) : (
          <LeaderboardDisplay teams={teams} currentRound={currentRound} leaderboardMode={leaderboardMode} />
        )}
      </main>

      {/* Footer — minimal */}
      <footer
        className="relative z-10 px-8 py-3 flex items-center justify-between"
        style={{ borderTop: `1px solid ${theme.faint}` }}
      >
        {currentRound > 0 ? (
          <button
            onClick={() => goToRound(currentRound - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-white/5"
            style={{ color: theme.muted, border: `1px solid ${theme.faint}` }}
          >
            <ChevronLeft className="w-4 h-4" />
            {currentRound === 1 ? 'Lobby' : `Round ${currentRound - 1}`}
          </button>
        ) : (
          <div style={{ width: '140px' }} />
        )}

        <div className="flex items-center gap-2" style={{ color: theme.subtle }}>
          <RefreshCw className="w-3 h-3" />
          <span className="text-xs">
            {lastUpdate ? `${lastUpdate.toLocaleTimeString()}` : '...'}
          </span>
        </div>

        <button
          onClick={() => goToRound(currentRound + 1)}
          disabled={currentRound === 4}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-20"
          style={{
            background: currentRound < 4 ? `linear-gradient(135deg, ${roundColor}, ${roundColor}DD)` : theme.bgSubtle,
            color: theme.white,
            boxShadow: currentRound < 4 ? `0 2px 16px ${roundColor}25` : 'none',
          }}
        >
          {currentRound === 0 ? 'Round 1' : currentRound === 4 ? 'Final' : `Round ${currentRound + 1}`}
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>

      {/* Bonus Points Modal */}
      {showBonusModal && (
        <BonusPointsModal
          teams={teams}
          roomNumber={roomNumber}
          onClose={() => setShowBonusModal(false)}
          onBonusAdded={() => {
            fetchTeams();
            setShowBonusModal(false);
          }}
        />
      )}
    </div>
  );
}
