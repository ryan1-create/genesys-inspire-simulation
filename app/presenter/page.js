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
  Settings,
  X,
  Award,
  Target,
  Zap,
} from "lucide-react";

// ============================================================================
// DESIGN SYSTEM - Presenter Theme (High contrast for projectors)
// ============================================================================

const theme = {
  // Core brand colors
  orange: "#FF4F1F",

  // Dark palette
  black: "#000000",
  darker: "#0A0A0B",
  dark: "#111111",

  // Light palette
  white: "#FFFFFF",
  light: "#F4F4F5",
  muted: "#A1A1AA",

  // Round colors & info
  rounds: {
    0: { color: "#F59E0B", name: "Registration", subtitle: "", customer: "" },
    1: { color: "#10B981", name: "Shape the Vision", subtitle: "New Logo Opportunity", customer: "Everwell Health Services" },
    2: { color: "#FF4F1F", name: "Disrupt Status Quo", subtitle: "Expand / Cross-Sell", customer: "Meridian Financial Group" },
    3: { color: "#3B82F6", name: "Hold the High Ground", subtitle: "Competitive Defend", customer: "Summit Telecom" },
    4: { color: "#8B5CF6", name: "Capture More Share", subtitle: "Deal Review", customer: "NovaTech Industries" },
  },
};

// ============================================================================
// WORD CLOUD COMPONENT
// ============================================================================

function WordCloud({ teams, roomColor }) {
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
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-4xl font-medium" style={{ color: theme.muted }}>
            Waiting for teams to register...
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// LEADERBOARD COMPONENT (Large format for projector)
// ============================================================================

function LeaderboardDisplay({ teams, currentRound }) {
  const roundColor = theme.rounds[currentRound]?.color || theme.orange;

  // Sort teams by total score including bonus
  const sortedTeams = [...teams].sort((a, b) => {
    const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
    const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
    return bTotal - aTotal;
  });

  const getMedalStyle = (index) => {
    if (index === 0) return { bg: '#FFD700', text: '#000000' }; // Gold
    if (index === 1) return { bg: '#C0C0C0', text: '#000000' }; // Silver
    if (index === 2) return { bg: '#CD7F32', text: '#000000' }; // Bronze
    return { bg: theme.dark, text: theme.muted };
  };

  return (
    <div className="w-full space-y-4">
      {sortedTeams.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl font-medium" style={{ color: theme.muted }}>
            No scores yet for this round
          </p>
        </div>
      ) : (
        sortedTeams.slice(0, 15).map((team, index) => {
          const roundScoreTotal = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0);
          const totalScore = roundScoreTotal + (team.bonusPoints || 0);
          const medalStyle = getMedalStyle(index);
          // Check if this team's current round score is still "initial" (pre-wobble)
          const currentPhase = team.phases?.[currentRound];
          const hasCurrentRoundScore = team.scores?.[currentRound] !== undefined;

          return (
            <div
              key={`${team.teamName}-${team.table}`}
              className="flex items-center gap-6 p-5 rounded-2xl transition-all"
              style={{ backgroundColor: theme.dark }}
            >
              {/* Rank */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-black text-3xl flex-shrink-0"
                style={{ backgroundColor: medalStyle.bg, color: medalStyle.text }}
              >
                {index + 1}
              </div>

              {/* Team Name & Table */}
              <div className="flex-1 min-w-0">
                <div className="text-4xl font-black truncate" style={{ color: theme.white }}>
                  {team.teamName}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl" style={{ color: theme.muted }}>
                    Table {team.table}
                  </span>
                  {team.bonusPoints > 0 && (
                    <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FFD70030', color: '#FFD700' }}>
                      +{team.bonusPoints} bonus
                    </span>
                  )}
                  {hasCurrentRoundScore && currentPhase === "initial" && (
                    <span className="text-sm px-2 py-0.5 rounded-full animate-pulse" style={{ backgroundColor: `${roundColor}30`, color: roundColor }}>
                      awaiting wobble
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div className="text-6xl font-black" style={{ color: roundColor }}>
                {totalScore}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ============================================================================
// ACTIVITY IN PROGRESS COMPONENT (shown while teams are working)
// ============================================================================

function ActivityInProgress({ currentRound, timerSeconds, isTimerRunning, onToggleTimer, onResetTimer }) {
  const roundInfo = theme.rounds[currentRound];
  const roundColor = roundInfo?.color || theme.orange;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const progress = timerSeconds / (15 * 60); // 15 min total

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-12">
      {/* Round info */}
      <div className="text-center">
        <div
          className="inline-block px-6 py-2 rounded-full text-2xl font-bold mb-6"
          style={{ backgroundColor: `${roundColor}25`, color: roundColor }}
        >
          {roundInfo?.subtitle}
        </div>
        <h2 className="text-6xl font-black mb-4" style={{ color: theme.white }}>
          {roundInfo?.customer}
        </h2>
        <p className="text-3xl" style={{ color: theme.muted }}>
          Activity in progress...
        </p>
      </div>

      {/* Timer */}
      <div className="text-center">
        <div
          className="text-[12rem] font-black leading-none tabular-nums"
          style={{ color: timerSeconds <= 60 ? '#EF4444' : timerSeconds <= 180 ? '#F59E0B' : theme.white }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>

        {/* Progress bar */}
        <div className="w-[600px] mx-auto mt-6 h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.dark }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${Math.max(0, progress * 100)}%`,
              backgroundColor: timerSeconds <= 60 ? '#EF4444' : timerSeconds <= 180 ? '#F59E0B' : roundColor,
            }}
          />
        </div>

        {/* Timer controls (small, bottom of screen - for presenter to tap) */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={onToggleTimer}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold transition-all"
            style={{ backgroundColor: isTimerRunning ? '#EF4444' : '#10B981', color: theme.white }}
          >
            {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isTimerRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={onResetTimer}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold transition-all"
            style={{ backgroundColor: theme.dark, color: theme.muted }}
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>
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

  const sortedTeams = [...teams].sort((a, b) => (a.table || '').localeCompare(b.table || '', undefined, { numeric: true }));

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div
        className="w-full max-w-2xl p-8 rounded-3xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: theme.darker }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black" style={{ color: theme.white }}>
            <Award className="inline-block w-8 h-8 mr-3" style={{ color: '#FFD700' }} />
            Award Bonus Points
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <X className="w-6 h-6" style={{ color: theme.muted }} />
          </button>
        </div>

        {/* Team Selection */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-3" style={{ color: theme.muted }}>Select Team</label>
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {sortedTeams.map((team) => (
              <button
                key={team.teamKey}
                onClick={() => setSelectedTeam(team)}
                className="text-left p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: selectedTeam?.teamKey === team.teamKey ? `${theme.orange}30` : theme.dark,
                  border: selectedTeam?.teamKey === team.teamKey ? `2px solid ${theme.orange}` : '2px solid transparent',
                  color: theme.white,
                }}
              >
                <div className="font-bold truncate">{team.teamName}</div>
                <div className="text-sm" style={{ color: theme.muted }}>Table {team.table}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Points Amount */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-3" style={{ color: theme.muted }}>Points</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBonusAmount(Math.max(-10, bonusAmount - 1))}
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.dark, color: theme.white }}
            >
              <Minus className="w-5 h-5" />
            </button>
            <div
              className="text-5xl font-black w-32 text-center"
              style={{ color: bonusAmount > 0 ? '#10B981' : bonusAmount < 0 ? '#EF4444' : theme.muted }}
            >
              {bonusAmount > 0 ? '+' : ''}{bonusAmount}
            </div>
            <button
              onClick={() => setBonusAmount(Math.min(25, bonusAmount + 1))}
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.dark, color: theme.white }}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {/* Quick select */}
          <div className="flex gap-2 mt-3">
            {[1, 2, 5, 10, 15].map((pts) => (
              <button
                key={pts}
                onClick={() => setBonusAmount(pts)}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  backgroundColor: bonusAmount === pts ? theme.orange : theme.dark,
                  color: theme.white,
                }}
              >
                +{pts}
              </button>
            ))}
          </div>
        </div>

        {/* Reason (optional) */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-3" style={{ color: theme.muted }}>Reason (optional)</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Great teamwork, Best presentation..."
            className="w-full px-4 py-3 rounded-xl text-lg"
            style={{ backgroundColor: theme.dark, color: theme.white, border: `1px solid ${theme.dark}` }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedTeam || bonusAmount === 0 || isSubmitting}
          className="w-full py-4 rounded-xl text-xl font-bold transition-all disabled:opacity-40"
          style={{ backgroundColor: theme.orange, color: theme.white }}
        >
          {isSubmitting ? 'Awarding...' : `Award ${bonusAmount > 0 ? '+' : ''}${bonusAmount} pts to ${selectedTeam?.teamName || '...'}`}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PRESENTER COMPONENT
// ============================================================================

export default function PresenterView() {
  // State
  const [roomNumber, setRoomNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRound, setCurrentRound] = useState(0); // 0 = registration
  const [teams, setTeams] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showBonusModal, setShowBonusModal] = useState(false);

  // View mode: "leaderboard" or "activity"
  const [viewMode, setViewMode] = useState("leaderboard");

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
      const interval = setInterval(fetchTeams, 3000); // Every 3 seconds
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

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("presenter_room");
    setIsLoggedIn(false);
    setRoomNumber("");
    setCurrentRound(0);
    setTeams([]);
  };

  // Round navigation
  const goToRound = (round) => {
    setCurrentRound(Math.max(0, Math.min(4, round)));
    setViewMode("leaderboard"); // Reset view when changing rounds
  };

  // Timer controls
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
        <div
          className="w-full max-w-lg p-12 rounded-3xl text-center"
          style={{ backgroundColor: theme.darker }}
        >
          <img
            src="/genesys-logo.png"
            alt="Genesys"
            className="h-16 mx-auto mb-8"
          />
          <h1
            className="text-4xl font-black mb-2"
            style={{ color: theme.white }}
          >
            The Game
          </h1>
          <p
            className="text-xl mb-10"
            style={{ color: theme.muted }}
          >
            Presenter View
          </p>

          <div className="space-y-6">
            <div>
              <label
                className="block text-lg font-medium mb-3 text-left"
                style={{ color: theme.muted }}
              >
                Enter Room Number
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
                  border: `2px solid ${theme.orange}`,
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={!roomNumber.trim()}
              className="w-full py-4 px-8 rounded-xl text-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              style={{
                backgroundColor: theme.orange,
                color: theme.white,
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
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.black }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b"
        style={{ borderColor: theme.dark }}
      >
        {/* Left: Room Info */}
        <div className="flex items-center gap-6">
          <img src="/genesys-logo.png" alt="Genesys" className="h-12" />
          <div
            className="px-6 py-2 rounded-xl text-2xl font-black"
            style={{ backgroundColor: roundColor, color: theme.white }}
          >
            ROOM {roomNumber}
          </div>
        </div>

        {/* Center: Round Indicator */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((round) => (
            <button
              key={round}
              onClick={() => goToRound(round)}
              className="w-4 h-4 rounded-full transition-all"
              style={{
                backgroundColor: currentRound === round ? roundColor : theme.dark,
                border: currentRound === round ? 'none' : `2px solid ${theme.muted}`,
                transform: currentRound === round ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ color: theme.muted }}>
            <Users className="w-5 h-5" />
            <span className="text-lg font-medium">{teams.length} teams</span>
          </div>

          {/* View Toggle (only for rounds 1-4) */}
          {currentRound > 0 && (
            <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${theme.dark}` }}>
              <button
                onClick={() => setViewMode("leaderboard")}
                className="px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: viewMode === "leaderboard" ? roundColor : 'transparent',
                  color: viewMode === "leaderboard" ? theme.white : theme.muted,
                }}
              >
                <Trophy className="w-4 h-4" />
                Scores
              </button>
              <button
                onClick={() => setViewMode("activity")}
                className="px-4 py-2 text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: viewMode === "activity" ? roundColor : 'transparent',
                  color: viewMode === "activity" ? theme.white : theme.muted,
                }}
              >
                <Clock className="w-4 h-4" />
                Activity
              </button>
            </div>
          )}

          {/* Bonus Points Button */}
          {currentRound > 0 && (
            <button
              onClick={() => setShowBonusModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ backgroundColor: '#FFD70020', color: '#FFD700', border: '1px solid #FFD70040' }}
            >
              <Star className="w-4 h-4" />
              Bonus
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
            style={{ color: theme.muted }}
          >
            Change Room
          </button>
        </div>
      </header>

      {/* Round Title Bar */}
      <div
        className="px-8 py-6 text-center"
        style={{ backgroundColor: `${roundColor}15` }}
      >
        <h1
          className="text-5xl font-black"
          style={{ color: roundColor }}
        >
          {currentRound === 0 ? 'TEAM REGISTRATION' : `ROUND ${currentRound}: ${roundInfo?.name?.toUpperCase()}`}
        </h1>
        {viewMode === "activity" && currentRound > 0 && (
          <p className="text-xl mt-2" style={{ color: theme.muted }}>
            Teams are working on their submissions
          </p>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {currentRound === 0 ? (
          // Registration: Word Cloud
          <WordCloud teams={teams} roomColor={roundColor} />
        ) : viewMode === "activity" ? (
          // Activity in progress with timer
          <ActivityInProgress
            currentRound={currentRound}
            timerSeconds={timerSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
          />
        ) : (
          // Leaderboard
          <LeaderboardDisplay teams={teams} currentRound={currentRound} />
        )}
      </main>

      {/* Footer: Navigation */}
      <footer
        className="px-8 py-4 border-t flex items-center justify-between"
        style={{ borderColor: theme.dark }}
      >
        {/* Previous */}
        {currentRound > 0 ? (
          <button
            onClick={() => goToRound(currentRound - 1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xl font-bold transition-all"
            style={{ backgroundColor: theme.dark, color: theme.white }}
          >
            <ChevronLeft className="w-6 h-6" />
            {currentRound === 1 ? 'Registration' : `Round ${currentRound - 1}`}
          </button>
        ) : (
          <div style={{ width: '180px' }} />
        )}

        {/* Last Updated */}
        <div className="flex items-center gap-2" style={{ color: theme.muted }}>
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm">
            {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : 'Updating...'}
          </span>
        </div>

        {/* Next */}
        <button
          onClick={() => goToRound(currentRound + 1)}
          disabled={currentRound === 4}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xl font-bold transition-all disabled:opacity-30"
          style={{ backgroundColor: roundColor, color: theme.white }}
        >
          {currentRound === 0 ? 'Round 1' : currentRound === 4 ? 'Final' : `Round ${currentRound + 1}`}
          <ChevronRight className="w-6 h-6" />
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
