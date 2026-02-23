"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
    2: { color: "#FF4F1F", name: "Disrupt Status Quo", subtitle: "New Logo Opportunity", customer: "Aureon Financial Holdings", motion: "CCaaS Replacement" },
    3: { color: "#3B82F6", name: "Hold the High Ground", subtitle: "Account Defense", customer: "Summit Ridge Retail Group", motion: "Expansion" },
    4: { color: "#8B5CF6", name: "Capture More Share", subtitle: "Account Expansion", customer: "Orion Global Logistics", motion: "Pure-Play AI" },
  },
};

// ============================================================================
// WORD CLOUD COMPONENT — Grid-based layout, no overlaps
// ============================================================================

function TeamRegistrationWall({ teams }) {
  const bgColors = [
    { bg: '#10B981', text: '#FFFFFF' },  // emerald
    { bg: '#3B82F6', text: '#FFFFFF' },  // blue
    { bg: '#8B5CF6', text: '#FFFFFF' },  // violet
    { bg: '#F59E0B', text: '#FFFFFF' },  // amber
    { bg: '#EC4899', text: '#FFFFFF' },  // pink
    { bg: '#06B6D4', text: '#FFFFFF' },  // cyan
    { bg: '#EF4444', text: '#FFFFFF' },  // red
    { bg: '#FF4F1F', text: '#FFFFFF' },  // genesys orange
    { bg: '#14B8A6', text: '#FFFFFF' },  // teal
    { bg: '#A855F7', text: '#FFFFFF' },  // purple
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

function LeaderboardDisplay({ teams, currentRound }) {
  const roundColor = theme.rounds[currentRound]?.color || theme.orange;

  const sortedTeams = [...teams].sort((a, b) => {
    const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
    const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
    return bTotal - aTotal;
  });

  const maxScore = sortedTeams.length > 0
    ? Math.max(1, ...sortedTeams.map(t => Object.values(t.scores || {}).reduce((s, v) => s + v, 0) + (t.bonusPoints || 0)))
    : 1;

  const activeRounds = [1, 2, 3, 4].filter(r =>
    sortedTeams.some(t => t.scores?.[r] !== undefined)
  );

  const showBonus = sortedTeams.some(t => (t.bonusPoints || 0) > 0);

  if (sortedTeams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6" style={{ minHeight: '50vh' }}>
        <Trophy className="w-20 h-20" style={{ color: theme.subtle, opacity: 0.3 }} />
        <p className="text-3xl font-medium" style={{ color: theme.subtle }}>
          Scores will appear as teams submit
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      {/* Column Headers */}
      <div
        className="flex items-center gap-4 px-6 py-3 mb-2 text-xs font-bold uppercase tracking-widest"
        style={{ color: theme.subtle }}
      >
        <div style={{ width: '48px' }} />
        <div className="flex-1">Team</div>
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
      </div>

      {/* Team Rows */}
      <div className="space-y-1.5">
        {sortedTeams.slice(0, 15).map((team, index) => {
          const roundScoreTotal = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0);
          const totalScore = roundScoreTotal + (team.bonusPoints || 0);
          const barWidth = (totalScore / maxScore) * 100;
          const isTop3 = index < 3;
          const currentPhase = team.phases?.[currentRound];
          const hasCurrentRoundScore = team.scores?.[currentRound] !== undefined;

          return (
            <div
              key={`${team.teamName}-${team.table}`}
              className="relative flex items-center gap-4 px-6 py-4 rounded-2xl overflow-hidden transition-all"
              style={{
                backgroundColor: theme.bgCard,
                border: `1px solid ${isTop3 ? `${roundColor}15` : theme.faint}`,
                animation: `rowSlideIn 0.4s ease-out ${index * 0.05}s both`,
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
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: theme.subtle }}>
                    Table {team.table}
                  </span>
                  {hasCurrentRoundScore && currentPhase === "initial" && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full animate-pulse font-medium"
                      style={{ backgroundColor: `${roundColor}15`, color: roundColor }}
                    >
                      awaiting wobble
                    </span>
                  )}
                </div>
              </div>

              {/* Round-by-Round Scores */}
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

              {/* Bonus Points */}
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

              {/* Total Score */}
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
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// ACTIVITY IN PROGRESS COMPONENT — Refined timer with ambient design
// ============================================================================

function ActivityInProgress({ currentRound, timerSeconds, isTimerRunning, onToggleTimer, onResetTimer }) {
  const roundInfo = theme.rounds[currentRound];
  const roundColor = roundInfo?.color || theme.orange;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const totalDuration = 15 * 60;
  const progress = timerSeconds / totalDuration;

  const timerColor = timerSeconds <= 60 ? '#EF4444' : timerSeconds <= 180 ? '#F59E0B' : theme.white;

  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ minHeight: '65vh', gap: '48px' }}>
      {/* Round context — pill + customer name */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold mb-6"
          style={{
            background: `linear-gradient(135deg, ${roundColor}18, ${roundColor}08)`,
            color: roundColor,
            border: `1px solid ${roundColor}20`,
            fontSize: '16px',
            letterSpacing: '0.05em',
          }}
        >
          <Target className="w-4 h-4" />
          {roundInfo?.motion}
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 900,
            color: theme.white,
            marginBottom: '8px',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {roundInfo?.customer}
        </h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 500, color: theme.subtle }}>
          {roundInfo?.subtitle}
        </p>
      </div>

      {/* Timer — large, centered, with ambient glow */}
      <div className="text-center relative">
        {/* Ambient glow behind timer */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50vw',
            height: '50vw',
            maxWidth: '500px',
            maxHeight: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${timerColor}08 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          className="relative"
          style={{
            fontSize: 'clamp(5rem, 14vw, 12rem)',
            fontWeight: 900,
            lineHeight: 1,
            color: timerColor,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.03em',
            textShadow: timerSeconds <= 60 ? `0 0 40px ${timerColor}40` : 'none',
          }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Progress bar — thin, elegant */}
        <div
          style={{
            width: 'min(60vw, 700px)',
            margin: '28px auto 0',
            height: '4px',
            borderRadius: '2px',
            backgroundColor: theme.bgSubtle,
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: '2px',
              backgroundColor: timerColor,
              width: `${Math.max(0, progress * 100)}%`,
              transition: 'width 1s linear, background-color 0.5s ease',
              boxShadow: `0 0 12px ${timerColor}40`,
            }}
          />
        </div>

        {/* Status text */}
        <p style={{ marginTop: '16px', fontSize: '15px', color: theme.subtle, minHeight: '24px', letterSpacing: '0.05em' }}>
          {!isTimerRunning && timerSeconds === totalDuration && 'READY TO START'}
          {!isTimerRunning && timerSeconds < totalDuration && timerSeconds > 0 && 'PAUSED'}
          {timerSeconds === 0 && <span style={{ color: '#EF4444', fontWeight: 700, letterSpacing: '0.1em' }}>TIME&apos;S UP</span>}
          {isTimerRunning && '\u00A0'}
        </p>
      </div>

      {/* Timer controls — refined buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={onToggleTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 36px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            backgroundColor: isTimerRunning ? '#EF444412' : `${roundColor}12`,
            color: isTimerRunning ? '#EF4444' : roundColor,
            border: `1px solid ${isTimerRunning ? '#EF444430' : `${roundColor}30`}`,
            cursor: 'pointer',
            transition: 'all 0.2s',
            letterSpacing: '0.02em',
          }}
        >
          {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isTimerRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onResetTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            color: theme.subtle,
            border: `1px solid ${theme.faint}`,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
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

export default function PresenterView() {
  const [roomNumber, setRoomNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [teams, setTeams] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showBonusModal, setShowBonusModal] = useState(false);

  const [viewMode, setViewMode] = useState("activity");

  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const savedRoom = sessionStorage.getItem("presenter_room");
    if (savedRoom) {
      setRoomNumber(savedRoom);
      setIsLoggedIn(true);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isTimerRunning && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, timerSeconds]);

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
      const interval = setInterval(fetchTeams, 3000);
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
      setTimerSeconds(15 * 60);
      setIsTimerRunning(false);
    } else {
      setViewMode("leaderboard");
    }
  };

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(15 * 60);
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
        className="relative z-10 flex items-center px-8 py-4"
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

        {/* Center: Round Navigation — truly centered with flex-1 */}
        <div className="flex-1 flex justify-center">
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
                onClick={() => setViewMode("leaderboard")}
                className="px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 rounded-lg"
                style={{
                  backgroundColor: viewMode === "leaderboard" ? `${roundColor}15` : 'transparent',
                  color: viewMode === "leaderboard" ? roundColor : theme.subtle,
                }}
              >
                <BarChart3 className="w-3 h-3" />
                Scores
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
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
          />
        ) : (
          <LeaderboardDisplay teams={teams} currentRound={currentRound} />
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
