"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy,
  Users,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Crown,
  Flame,
  LogIn,
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

  // Round colors
  rounds: {
    0: { color: "#F59E0B", name: "Registration" },
    1: { color: "#10B981", name: "Shape the Vision" },
    2: { color: "#FF4F1F", name: "Disrupt Status Quo" },
    3: { color: "#3B82F6", name: "Hold the High Ground" },
    4: { color: "#8B5CF6", name: "Capture More Share" },
  },
};

// ============================================================================
// WORD CLOUD COMPONENT
// ============================================================================

function WordCloud({ teams, roomColor }) {
  // Generate random but consistent positions for each team
  const getTeamStyle = (team, index) => {
    // Use team name to generate pseudo-random values
    const seed = team.teamName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Random position within bounds (15-85% to avoid edges)
    const left = 15 + (seed * 7 % 70);
    const top = 15 + ((seed * 13 + index * 17) % 60);

    // Much larger sizes for max 15 teams on a projector
    const sizes = ['text-5xl', 'text-6xl', 'text-7xl', 'text-6xl', 'text-5xl'];
    const size = sizes[seed % sizes.length];

    // Cycle through round colors for variety
    const colors = [theme.rounds[1].color, theme.rounds[2].color, theme.rounds[3].color, theme.rounds[4].color];
    const color = colors[seed % colors.length];

    // Random rotation (-12 to 12 degrees)
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
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
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

  // Sort teams by total score
  const sortedTeams = [...teams].sort((a, b) => {
    const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0);
    const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0);
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
        sortedTeams.slice(0, 10).map((team, index) => {
          const totalScore = Object.values(team.scores || {}).reduce((sum, s) => sum + s, 0);
          const medalStyle = getMedalStyle(index);

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
                <div className="text-xl" style={{ color: theme.muted }}>
                  Table {team.table}
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
// MAIN PRESENTER COMPONENT
// ============================================================================

export default function PresenterView() {
  // State
  const [roomNumber, setRoomNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRound, setCurrentRound] = useState(0); // 0 = registration
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Check for saved room on mount
  useEffect(() => {
    const savedRoom = sessionStorage.getItem("presenter_room");
    if (savedRoom) {
      setRoomNumber(savedRoom);
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch teams data
  const fetchTeams = useCallback(async () => {
    if (!roomNumber) return;

    try {
      const response = await fetch(`/api/leaderboard?room=${encodeURIComponent(roomNumber)}`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data.leaderboard || []);
        setLastUpdate(new Date());

        // Auto-detect round based on team progress (hybrid approach)
        if (data.leaderboard?.length > 0) {
          const roundCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 };
          data.leaderboard.forEach(team => {
            const completedRounds = Object.keys(team.scores || {}).length;
            roundCounts[completedRounds] = (roundCounts[completedRounds] || 0) + 1;
          });

          // Find the most common round
          // But don't auto-decrease the round (only suggest increases)
          const detectedRound = Object.entries(roundCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 0;

          // Only auto-advance if detected round is higher
          if (parseInt(detectedRound) > currentRound) {
            // Could show a suggestion UI here, for now just note it
            console.log(`Detected round: ${detectedRound}, current: ${currentRound}`);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  }, [roomNumber, currentRound]);

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

        {/* Right: Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2" style={{ color: theme.muted }}>
            <Users className="w-5 h-5" />
            <span className="text-lg font-medium">{teams.length} teams</span>
          </div>
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
      </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-hidden">
        {currentRound === 0 ? (
          // Registration: Word Cloud
          <WordCloud teams={teams} roomColor={roundColor} />
        ) : (
          // Rounds 1-4: Leaderboard
          <LeaderboardDisplay teams={teams} currentRound={currentRound} />
        )}
      </main>

      {/* Footer: Navigation */}
      <footer
        className="px-8 py-4 border-t flex items-center justify-between"
        style={{ borderColor: theme.dark }}
      >
        {/* Previous - hidden on Round 0 */}
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
          <div style={{ width: '180px' }} /> // Placeholder for alignment
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
    </div>
  );
}
