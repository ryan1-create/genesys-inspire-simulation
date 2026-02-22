"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Trophy,
  Users,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Crown,
  Flame,
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
} from "lucide-react";

// ============================================================================
// DESIGN SYSTEM - Presenter Theme (Refined, high contrast for projectors)
// ============================================================================

const theme = {
  orange: "#FF4F1F",
  orangeGlow: "rgba(255, 79, 31, 0.35)",
  orangeSubtle: "rgba(255, 79, 31, 0.08)",

  black: "#000000",
  darker: "#0A0A0B",
  dark: "#111113",
  darkMuted: "#1A1A1F",
  darkCard: "#141417",

  white: "#FFFFFF",
  light: "#F4F4F5",
  muted: "#A1A1AA",
  subtle: "#71717A",

  // Actual round data from the simulation
  rounds: {
    0: { color: "#F59E0B", name: "Registration", subtitle: "", customer: "", motion: "" },
    1: { color: "#10B981", name: "Shape the Vision", subtitle: "New Logo Opportunity", customer: "Everwell Health Services", motion: "Legacy Displacement" },
    2: { color: "#FF4F1F", name: "Disrupt Status Quo", subtitle: "New Logo Opportunity", customer: "Aureon Financial Holdings", motion: "CCaaS Replacement" },
    3: { color: "#3B82F6", name: "Hold the High Ground", subtitle: "Account Defense", customer: "Summit Ridge Retail Group", motion: "Expansion" },
    4: { color: "#8B5CF6", name: "Capture More Share", subtitle: "Account Expansion", customer: "Orion Global Logistics", motion: "Pure-Play AI" },
  },

  transition: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "250ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// ============================================================================
// SHARED UI COMPONENTS
// ============================================================================

function GlassCard({ children, className = "", style = {}, ...props }) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        backgroundColor: theme.darkCard,
        border: `1px solid rgba(255,255,255,0.04)`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// WORD CLOUD COMPONENT
// ============================================================================

function WordCloud({ teams }) {
  const getTeamStyle = (team, index) => {
    const seed = team.teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const left = 15 + (seed * 7 % 70);
    const top = 15 + ((seed * 13 + index * 17) % 60);
    const sizes = ['text-5xl', 'text-6xl', 'text-7xl', 'text-6xl', 'text-5xl'];
    const colors = [theme.rounds[1].color, theme.rounds[2].color, theme.rounds[3].color, theme.rounds[4].color];
    const color = colors[seed % colors.length];
    const rotation = ((seed * 3) % 24) - 12;

    return {
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
      color: color,
      textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
      animation: 'fadeInScale 0.5s ease-out',
    };
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
      {teams.map((team, index) => {
        const seed = team.teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const sizes = ['text-5xl', 'text-6xl', 'text-7xl', 'text-6xl', 'text-5xl'];
        const sizeClass = sizes[seed % sizes.length];
        return (
          <div
            key={team.teamName}
            className={`font-black whitespace-nowrap transition-all duration-300 ${sizeClass}`}
            style={getTeamStyle(team, index)}
          >
            {team.teamName}
          </div>
        );
      })}
      {teams.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Users className="w-20 h-20 opacity-10" style={{ color: theme.muted }} />
          <p className="text-4xl font-medium" style={{ color: theme.subtle }}>
            Waiting for teams to register...
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LEADERBOARD COMPONENT (Refined, with round-by-round + bonus columns)
// ============================================================================

function LeaderboardDisplay({ teams, currentRound }) {
  const roundColor = theme.rounds[currentRound]?.color || theme.orange;

  // Sort teams by total score including bonus
  const sortedTeams = [...teams].sort((a, b) => {
    const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
    const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
    return bTotal - aTotal;
  });

  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700';
    if (index === 1) return '#C0C0C0';
    if (index === 2) return '#CD7F32';
    return theme.subtle;
  };

  // Determine which rounds have any scores
  const activeRounds = [1, 2, 3, 4].filter(r =>
    sortedTeams.some(t => t.scores?.[r] !== undefined)
  );

  return (
    <div className="w-full">
      {sortedTeams.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-20 h-20 mx-auto mb-4 opacity-10" style={{ color: theme.muted }} />
          <p className="text-3xl font-medium" style={{ color: theme.subtle }}>
            Scores will appear as teams submit
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Column Headers */}
          <div className="flex items-center gap-4 px-6 py-3 text-sm font-medium" style={{ color: theme.subtle }}>
            <div className="w-14" />
            <div className="flex-1">TEAM</div>
            {activeRounds.map(r => (
              <div
                key={r}
                className="w-20 text-center font-bold"
                style={{ color: theme.rounds[r]?.color || theme.muted }}
              >
                R{r}
              </div>
            ))}
            {sortedTeams.some(t => (t.bonusPoints || 0) > 0) && (
              <div className="w-16 text-center" style={{ color: '#FFD700' }}>
                <Star className="w-4 h-4 mx-auto" />
              </div>
            )}
            <div className="w-28 text-right font-bold">TOTAL</div>
          </div>

          {/* Team Rows */}
          {sortedTeams.slice(0, 15).map((team, index) => {
            const roundScoreTotal = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0);
            const totalScore = roundScoreTotal + (team.bonusPoints || 0);
            const medalColor = getMedalColor(index);
            const hasCurrentRoundScore = team.scores?.[currentRound] !== undefined;
            const currentPhase = team.phases?.[currentRound];
            const showBonus = sortedTeams.some(t => (t.bonusPoints || 0) > 0);

            return (
              <GlassCard
                key={`${team.teamName}-${team.table}`}
                className="flex items-center gap-4 px-6 py-4 transition-all"
                style={{
                  backgroundColor: index < 3 ? `${roundColor}08` : theme.darkCard,
                  borderColor: index === 0 ? `${medalColor}30` : 'rgba(255,255,255,0.04)',
                }}
              >
                {/* Rank */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl flex-shrink-0"
                  style={{
                    background: index < 3
                      ? `linear-gradient(135deg, ${medalColor}25, ${medalColor}10)`
                      : theme.dark,
                    color: medalColor,
                    border: `1px solid ${medalColor}30`,
                  }}
                >
                  {index + 1}
                </div>

                {/* Team Name & Table */}
                <div className="flex-1 min-w-0">
                  <div className="text-3xl font-black truncate" style={{ color: theme.white }}>
                    {team.teamName}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base" style={{ color: theme.subtle }}>
                      Table {team.table}
                    </span>
                    {hasCurrentRoundScore && currentPhase === "initial" && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full animate-pulse font-medium"
                        style={{ backgroundColor: `${roundColor}20`, color: roundColor }}
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
                      className="w-20 text-center text-2xl font-bold"
                      style={{ color: rScore !== undefined ? rColor : `${theme.subtle}40` }}
                    >
                      {rScore !== undefined ? rScore : '–'}
                    </div>
                  );
                })}

                {/* Bonus Points (smaller column) */}
                {showBonus && (
                  <div
                    className="w-16 text-center text-base font-medium"
                    style={{ color: (team.bonusPoints || 0) > 0 ? '#FFD700' : `${theme.subtle}40` }}
                  >
                    {(team.bonusPoints || 0) > 0 ? `+${team.bonusPoints}` : '–'}
                  </div>
                )}

                {/* Total Score */}
                <div
                  className="w-28 text-right text-5xl font-black"
                  style={{ color: roundColor }}
                >
                  {totalScore}
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ACTIVITY IN PROGRESS COMPONENT (Refined design with timer)
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
    <div className="flex flex-col items-center justify-center h-full min-h-[500px]" style={{ gap: '40px' }}>
      {/* Round context */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold mb-5"
          style={{ backgroundColor: `${roundColor}15`, color: roundColor, border: `1px solid ${roundColor}25`, fontSize: '18px' }}
        >
          <Target className="w-5 h-5" />
          {roundInfo?.motion}
        </div>
        <h2 style={{ fontSize: '52px', fontWeight: 900, color: theme.white, marginBottom: '8px', lineHeight: 1.1 }}>
          {roundInfo?.customer}
        </h2>
        <p style={{ fontSize: '22px', fontWeight: 500, color: theme.subtle }}>
          {roundInfo?.subtitle}
        </p>
      </div>

      {/* Timer display — clean, large, centered */}
      <div className="text-center">
        <div
          style={{
            fontSize: '10vw',
            fontWeight: 900,
            lineHeight: 1,
            color: timerColor,
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div style={{ width: '50vw', maxWidth: '600px', margin: '24px auto 0', height: '6px', borderRadius: '3px', backgroundColor: theme.dark }}>
          <div
            style={{
              height: '100%',
              borderRadius: '3px',
              backgroundColor: timerColor,
              width: `${Math.max(0, progress * 100)}%`,
              transition: 'width 1s linear, background-color 0.5s ease',
            }}
          />
        </div>

        {/* Status text */}
        <p style={{ marginTop: '12px', fontSize: '16px', color: theme.subtle, minHeight: '24px' }}>
          {!isTimerRunning && timerSeconds === totalDuration && 'Ready to start'}
          {!isTimerRunning && timerSeconds < totalDuration && timerSeconds > 0 && 'Paused'}
          {timerSeconds === 0 && <span style={{ color: '#EF4444', fontWeight: 700 }}>Time&apos;s up!</span>}
          {isTimerRunning && '\u00A0'}
        </p>
      </div>

      {/* Timer controls */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button
          onClick={onToggleTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 32px',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: 700,
            backgroundColor: isTimerRunning ? '#EF444420' : `${roundColor}20`,
            color: isTimerRunning ? '#EF4444' : roundColor,
            border: `1px solid ${isTimerRunning ? '#EF444440' : `${roundColor}40`}`,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isTimerRunning ? 'Pause' : 'Start Timer'}
        </button>
        <button
          onClick={onResetTimer}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 24px',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: 700,
            color: theme.muted,
            border: `1px solid ${theme.dark}`,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <RotateCcw className="w-5 h-5" />
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

  // Sort by team name alphabetically for easy finding
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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      <GlassCard
        className="w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: theme.darker, border: `1px solid rgba(255,255,255,0.06)` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFD70015', border: '1px solid #FFD70025' }}>
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

        {/* Team Selection - showing team names */}
        <div className="mb-6">
          <label className="block text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.subtle }}>Select Team</label>
          <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
            {sortedTeams.map((team) => (
              <button
                key={team.teamKey}
                onClick={() => setSelectedTeam(team)}
                className="text-left p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: selectedTeam?.teamKey === team.teamKey ? `${theme.orange}15` : theme.dark,
                  border: selectedTeam?.teamKey === team.teamKey ? `2px solid ${theme.orange}` : '2px solid transparent',
                  color: theme.white,
                }}
              >
                <div className="font-bold truncate">{team.teamName}</div>
                <div className="text-xs" style={{ color: theme.subtle }}>Table {team.table}{(team.bonusPoints || 0) > 0 ? ` · +${team.bonusPoints} bonus` : ''}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Points Amount */}
        <div className="mb-6">
          <label className="block text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.subtle }}>Points</label>
          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => setBonusAmount(Math.max(-10, bonusAmount - 1))}
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
              style={{ backgroundColor: theme.dark, color: theme.white }}
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
              style={{ backgroundColor: theme.dark, color: theme.white }}
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
                  backgroundColor: bonusAmount === pts ? theme.orange : theme.dark,
                  color: theme.white,
                  border: bonusAmount === pts ? 'none' : `1px solid ${theme.darkMuted}`,
                }}
              >
                +{pts}
              </button>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="mb-8">
          <label className="block text-sm font-bold uppercase tracking-wider mb-3" style={{ color: theme.subtle }}>Reason (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Great teamwork, Best presentation..."
            className="w-full px-4 py-3 rounded-xl text-base"
            style={{ backgroundColor: theme.dark, color: theme.white, border: `1px solid ${theme.darkMuted}` }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedTeam || bonusAmount === 0 || isSubmitting}
          className="w-full py-4 rounded-xl text-lg font-bold transition-all disabled:opacity-30 hover:scale-[1.01]"
          style={{
            background: `linear-gradient(135deg, ${theme.orange}, ${theme.orange}DD)`,
            color: theme.white,
            boxShadow: `0 4px 20px ${theme.orangeGlow}`,
          }}
        >
          {isSubmitting ? 'Awarding...' : selectedTeam ? `Award ${bonusAmount > 0 ? '+' : ''}${bonusAmount} to ${selectedTeam.teamName}` : 'Select a team above'}
        </button>
      </GlassCard>
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

  // View mode: "leaderboard" or "activity"
  const [viewMode, setViewMode] = useState("activity");

  // Timer state (15 minutes = 900 seconds)
  const [timerSeconds, setTimerSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Check for saved room on mount
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

  // Poll for updates when logged in
  useEffect(() => {
    if (isLoggedIn && roomNumber) {
      fetchTeams();
      const interval = setInterval(fetchTeams, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, roomNumber, fetchTeams]);

  // Handle room login
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

  // Round navigation — default to "activity" for rounds 1-4, reset timer
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
        className="min-h-screen flex items-center justify-center p-8"
        style={{ backgroundColor: theme.black }}
      >
        <GlassCard className="w-full max-w-lg p-12 text-center" style={{ backgroundColor: theme.darker }}>
          <img
            src="/genesys-logo.png"
            alt="Genesys"
            className="h-16 mx-auto mb-8"
          />
          <h1 className="text-5xl font-black mb-2" style={{ color: theme.white }}>
            The Game
          </h1>
          <p className="text-xl mb-10" style={{ color: theme.subtle }}>
            Presenter Dashboard
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-3 text-left" style={{ color: theme.subtle }}>
                Room Number
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="e.g., 1"
                className="w-full px-6 py-4 rounded-xl text-2xl text-center font-bold"
                style={{
                  backgroundColor: theme.dark,
                  color: theme.white,
                  border: `2px solid ${theme.orange}40`,
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={!roomNumber.trim()}
              className="w-full py-4 px-8 rounded-xl text-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-30 hover:scale-[1.01]"
              style={{
                background: `linear-gradient(135deg, ${theme.orange}, ${theme.orange}DD)`,
                color: theme.white,
                boxShadow: `0 4px 20px ${theme.orangeGlow}`,
              }}
            >
              <LogIn className="w-6 h-6" />
              Enter Room
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN PRESENTER VIEW
  // ============================================================================

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.black }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: `1px solid rgba(255,255,255,0.06)` }}
      >
        {/* Left: Logo + Room */}
        <div className="flex items-center gap-5">
          <img src="/genesys-logo.png" alt="Genesys" className="h-10 opacity-80" />
          <div className="h-8 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div
            className="px-5 py-1.5 rounded-lg text-lg font-black tracking-wider"
            style={{ backgroundColor: `${roundColor}20`, color: roundColor, border: `1px solid ${roundColor}30` }}
          >
            ROOM {roomNumber}
          </div>
        </div>

        {/* Center: Round Dots */}
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map((round) => {
            const rc = theme.rounds[round]?.color || theme.muted;
            const isActive = currentRound === round;
            return (
              <button
                key={round}
                onClick={() => goToRound(round)}
                className="relative flex items-center justify-center transition-all"
                style={{
                  width: isActive ? '36px' : '12px',
                  height: '12px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? rc : `${rc}30`,
                }}
                title={theme.rounds[round]?.name}
              />
            );
          })}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: theme.dark, color: theme.subtle }}>
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{teams.length} teams</span>
          </div>

          {/* View Toggle (rounds 1-4) */}
          {currentRound > 0 && (
            <div className="flex rounded-lg overflow-hidden" style={{ border: `1px solid rgba(255,255,255,0.06)` }}>
              <button
                onClick={() => setViewMode("activity")}
                className="px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: viewMode === "activity" ? `${roundColor}20` : 'transparent',
                  color: viewMode === "activity" ? roundColor : theme.subtle,
                }}
              >
                <Clock className="w-3.5 h-3.5" />
                Timer
              </button>
              <button
                onClick={() => setViewMode("leaderboard")}
                className="px-3 py-1.5 text-sm font-medium transition-all flex items-center gap-1.5"
                style={{
                  backgroundColor: viewMode === "leaderboard" ? `${roundColor}20` : 'transparent',
                  color: viewMode === "leaderboard" ? roundColor : theme.subtle,
                }}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Scores
              </button>
            </div>
          )}

          {/* Bonus Points Button */}
          {currentRound > 0 && (
            <button
              onClick={() => setShowBonusModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all hover:scale-105"
              style={{ backgroundColor: '#FFD70010', color: '#FFD700', border: '1px solid #FFD70020' }}
            >
              <Star className="w-3.5 h-3.5" />
              Bonus
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: theme.subtle }}
          >
            Exit
          </button>
        </div>
      </header>

      {/* Round Title Bar */}
      <div
        className="px-8 py-5 text-center"
        style={{
          background: `linear-gradient(180deg, ${roundColor}12 0%, transparent 100%)`,
        }}
      >
        <h1 className="text-5xl font-black tracking-tight" style={{ color: roundColor }}>
          {currentRound === 0 ? 'TEAM REGISTRATION' : `ROUND ${currentRound}: ${roundInfo?.name?.toUpperCase()}`}
        </h1>
        {currentRound > 0 && viewMode === "leaderboard" && (
          <p className="text-lg mt-1" style={{ color: theme.subtle }}>{roundInfo?.customer}</p>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-8 py-4 overflow-auto">
        {currentRound === 0 ? (
          <WordCloud teams={teams} />
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

      {/* Footer: Navigation */}
      <footer
        className="px-8 py-3 flex items-center justify-between"
        style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}
      >
        {currentRound > 0 ? (
          <button
            onClick={() => goToRound(currentRound - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-lg font-bold transition-all hover:bg-white/5"
            style={{ color: theme.muted, border: `1px solid rgba(255,255,255,0.06)` }}
          >
            <ChevronLeft className="w-5 h-5" />
            {currentRound === 1 ? 'Registration' : `Round ${currentRound - 1}`}
          </button>
        ) : (
          <div style={{ width: '180px' }} />
        )}

        <div className="flex items-center gap-2" style={{ color: theme.subtle }}>
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="text-xs">
            {lastUpdate ? `${lastUpdate.toLocaleTimeString()}` : '...'}
          </span>
        </div>

        <button
          onClick={() => goToRound(currentRound + 1)}
          disabled={currentRound === 4}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-lg font-bold transition-all disabled:opacity-20 hover:scale-[1.01]"
          style={{
            background: currentRound < 4 ? `linear-gradient(135deg, ${roundColor}, ${roundColor}DD)` : theme.dark,
            color: theme.white,
            boxShadow: currentRound < 4 ? `0 2px 12px ${roundColor}30` : 'none',
          }}
        >
          {currentRound === 0 ? 'Round 1' : currentRound === 4 ? 'Final' : `Round ${currentRound + 1}`}
          <ChevronRight className="w-5 h-5" />
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
