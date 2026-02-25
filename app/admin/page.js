"use client";

import React, { useState } from "react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Bonus points state
  const [bonusTeam, setBonusTeam] = useState(null);
  const [bonusAmount, setBonusAmount] = useState(5);
  const [bonusReason, setBonusReason] = useState("");

  // Reset-to-round state
  const [resetTeamData, setResetTeamData] = useState(null);
  const [resetTargetRound, setResetTargetRound] = useState(1);

  // Winners state
  const [showWinners, setShowWinners] = useState(false);
  const [winners, setWinners] = useState([]);

  const apiCall = async (action, extra = {}) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setLoading(false);
      return data;
    } catch (err) {
      setMessage(`Error: ${err.message}`);
      setLoading(false);
      return null;
    }
  };

  const handleLogin = async () => {
    const data = await apiCall("list-rooms");
    if (data) {
      setIsLoggedIn(true);
      setRooms(data.rooms || []);
      setMessage(`Logged in. Found ${data.rooms?.length || 0} rooms.`);
    }
  };

  const refreshRooms = async () => {
    const data = await apiCall("list-rooms");
    if (data) {
      setRooms(data.rooms || []);
      setMessage(`Found ${data.rooms?.length || 0} rooms.`);
    }
  };

  const viewRoom = async (room) => {
    const data = await apiCall("get-room", { room });
    if (data) {
      setSelectedRoom(room);
      setLeaderboard(data.leaderboard || []);
    }
  };

  const clearRoom = async (room) => {
    if (!confirm(`Are you sure you want to clear ALL scores for Room ${room}?`)) return;
    const data = await apiCall("clear-room", { room });
    if (data) {
      setMessage(data.message);
      setLeaderboard([]);
      refreshRooms();
    }
  };

  const removeTeam = async (teamKey) => {
    if (!confirm(`Remove team ${teamKey} from Room ${selectedRoom}?`)) return;
    const data = await apiCall("remove-team", { room: selectedRoom, teamKey });
    if (data) {
      setMessage(data.message);
      setLeaderboard(data.leaderboard || []);
    }
  };

  const resetTeam = async (teamKey) => {
    if (!confirm(`Reset scores for team ${teamKey}? They will stay on the leaderboard with 0 points.`)) return;
    const data = await apiCall("reset-team", { room: selectedRoom, teamKey });
    if (data) {
      setMessage(data.message);
      setLeaderboard(data.leaderboard || []);
    }
  };

  const clearAll = async () => {
    if (!confirm("⚠️ DANGER: This will delete ALL leaderboard data for ALL rooms. Are you absolutely sure?")) return;
    if (!confirm("FINAL WARNING: This cannot be undone. Type 'yes' in the next prompt to confirm.")) return;
    const data = await apiCall("clear-all");
    if (data) {
      setMessage(data.message);
      setRooms([]);
      setSelectedRoom(null);
      setLeaderboard([]);
    }
  };

  const awardBonus = async () => {
    if (!bonusTeam || bonusAmount === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bonus",
          room: selectedRoom,
          table: bonusTeam.table,
          points: bonusAmount,
          reason: bonusReason,
        }),
      });
      if (res.ok) {
        setMessage(`Awarded ${bonusAmount > 0 ? '+' : ''}${bonusAmount} bonus pts to ${bonusTeam.teamName}`);
        setBonusTeam(null);
        setBonusAmount(5);
        setBonusReason("");
        viewRoom(selectedRoom);
      } else {
        const err = await res.json();
        setMessage(`Error: ${err.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/winners?action=list");
      if (res.ok) {
        const data = await res.json();
        setWinners(data.winners || []);
        setMessage(`Found ${data.winners?.length || 0} winning team(s).`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  const resetToRound = async () => {
    if (!resetTeamData || !resetTargetRound) return;
    if (!confirm(`Reset ${resetTeamData.teamName} to the beginning of Round ${resetTargetRound}? This will clear their scores for Round ${resetTargetRound}${resetTargetRound < 4 ? ` through Round 4` : ''} and signal their browser to restart from that round.`)) return;
    const data = await apiCall("reset-to-round", {
      room: selectedRoom,
      teamKey: resetTeamData.teamKey,
      targetRound: resetTargetRound,
    });
    if (data) {
      setMessage(data.message);
      setResetTeamData(null);
      setResetTargetRound(1);
      setLeaderboard(data.leaderboard || []);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0A0A0B",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif"
      }}>
        <div style={{
          background: "#18181B",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "400px"
        }}>
          <h1 style={{ color: "#FF4F1F", marginBottom: "24px", fontSize: "24px" }}>
            Admin Panel
          </h1>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#0A0A0B",
              color: "white",
              fontSize: "16px",
              marginBottom: "16px",
              boxSizing: "border-box"
            }}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              background: "#FF4F1F",
              color: "white",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading ? "..." : "Login"}
          </button>
          {message && (
            <p style={{ color: "#ff6b6b", marginTop: "16px", fontSize: "14px" }}>{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0B",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      color: "white"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ color: "#FF4F1F", fontSize: "28px", margin: 0 }}>
            Leaderboard Admin
          </h1>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={refreshRooms}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#27272A",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Refresh
            </button>
            <button
              onClick={clearAll}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#7f1d1d",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Clear ALL Data
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: "#18181B",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "24px",
            borderLeft: "4px solid #FF4F1F"
          }}>
            {message}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "24px" }}>
          {/* Rooms List */}
          <div style={{ background: "#18181B", borderRadius: "12px", padding: "20px" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "16px", color: "#a1a1aa" }}>Rooms</h2>
            {rooms.length === 0 ? (
              <p style={{ color: "#71717a" }}>No active rooms</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => { viewRoom(room); setShowWinners(false); }}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "8px",
                      background: selectedRoom === room && !showWinners ? "#FF4F1F" : "#27272A",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "16px"
                    }}
                  >
                    Room {room}
                  </button>
                ))}
              </div>
            )}

            {/* Winners Section */}
            <div style={{ borderTop: "1px solid #27272A", marginTop: "20px", paddingTop: "20px" }}>
              <button
                onClick={() => { setShowWinners(true); setSelectedRoom(null); fetchWinners(); }}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "8px",
                  background: showWinners ? "#FFD700" : "#422006",
                  color: showWinners ? "#000" : "#FFD700",
                  border: showWinners ? "none" : "1px solid #FFD70030",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "16px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                🏆 Winners
              </button>
            </div>
          </div>

          {/* Room Details / Winners */}
          <div style={{ background: "#18181B", borderRadius: "12px", padding: "20px" }}>
            {showWinners ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h2 style={{ fontSize: "22px", margin: 0, color: "#FFD700" }}>🏆 Room Winners</h2>
                  <button
                    onClick={fetchWinners}
                    disabled={loading}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "#27272A",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Refresh
                  </button>
                </div>

                {winners.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <p style={{ color: "#71717a", fontSize: "18px", marginBottom: "8px" }}>No winners submitted yet</p>
                    <p style={{ color: "#52525b", fontSize: "14px" }}>Winners will appear here once all teams in a room complete all rounds and the winning team submits their info.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {winners.map((winner) => (
                      <div
                        key={winner.room}
                        style={{
                          padding: "24px",
                          background: "#0f0a00",
                          borderRadius: "12px",
                          border: "1px solid #FFD70025"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                              <span style={{
                                padding: "4px 12px",
                                borderRadius: "6px",
                                background: "#FFD70020",
                                color: "#FFD700",
                                fontSize: "12px",
                                fontWeight: "bold"
                              }}>
                                Room {winner.room}
                              </span>
                              <span style={{ color: "#a1a1aa", fontSize: "13px" }}>
                                Table {winner.table}
                              </span>
                            </div>
                            <h3 style={{ fontSize: "20px", fontWeight: "bold", margin: "8px 0 0", color: "white" }}>
                              {winner.teamName}
                            </h3>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "28px", fontWeight: "900", color: "#FF4F1F" }}>
                              {winner.totalScore}
                            </div>
                            <div style={{ fontSize: "11px", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              Total Score
                            </div>
                          </div>
                        </div>

                        <div style={{ borderTop: "1px solid #27272A", paddingTop: "16px" }}>
                          <h4 style={{ fontSize: "13px", color: "#a1a1aa", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Team Members ({winner.members?.length || 0})
                          </h4>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                <th style={{ textAlign: "left", padding: "6px 8px", color: "#71717a", fontSize: "12px", borderBottom: "1px solid #27272A" }}>Name</th>
                                <th style={{ textAlign: "left", padding: "6px 8px", color: "#71717a", fontSize: "12px", borderBottom: "1px solid #27272A" }}>Email</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(winner.members || []).map((member, idx) => (
                                <tr key={idx}>
                                  <td style={{ padding: "8px", color: "white", fontSize: "14px", borderBottom: "1px solid #1a1a1a" }}>
                                    {member.name}
                                  </td>
                                  <td style={{ padding: "8px", fontSize: "14px", borderBottom: "1px solid #1a1a1a" }}>
                                    <a href={`mailto:${member.email}`} style={{ color: "#60a5fa", textDecoration: "none" }}>
                                      {member.email || '—'}
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div style={{ marginTop: "12px", fontSize: "11px", color: "#52525b" }}>
                          Submitted {winner.submittedAt ? new Date(winner.submittedAt).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : selectedRoom ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "20px", margin: 0 }}>Room {selectedRoom}</h2>
                  <button
                    onClick={() => clearRoom(selectedRoom)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      background: "#7f1d1d",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Clear Room
                  </button>
                </div>

                {leaderboard.length === 0 ? (
                  <p style={{ color: "#71717a" }}>No teams in this room</p>
                ) : (
                  <>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #333" }}>
                          <th style={{ textAlign: "left", padding: "12px 8px", color: "#a1a1aa" }}>Team</th>
                          <th style={{ textAlign: "left", padding: "12px 8px", color: "#a1a1aa" }}>Table</th>
                          <th style={{ textAlign: "left", padding: "12px 8px", color: "#a1a1aa" }}>Scores</th>
                          <th style={{ textAlign: "center", padding: "12px 8px", color: "#FFD700", fontSize: "12px" }}>Bonus</th>
                          <th style={{ textAlign: "right", padding: "12px 8px", color: "#a1a1aa" }}>Total</th>
                          <th style={{ textAlign: "right", padding: "12px 8px", color: "#a1a1aa" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboard.map((team) => {
                          const roundTotal = Object.values(team.scores || {}).reduce((a, b) => a + b, 0);
                          const bonus = team.bonusPoints || 0;
                          const total = roundTotal + bonus;
                          return (
                            <tr key={team.teamKey} style={{ borderBottom: "1px solid #27272A" }}>
                              <td style={{ padding: "12px 8px", fontWeight: "bold" }}>{team.teamName}</td>
                              <td style={{ padding: "12px 8px", color: "#a1a1aa" }}>{team.table}</td>
                              <td style={{ padding: "12px 8px", color: "#a1a1aa", fontSize: "14px" }}>
                                {Object.entries(team.scores || {}).map(([round, score]) => (
                                  <span key={round} style={{ marginRight: "12px" }}>
                                    R{round}: {score}
                                  </span>
                                ))}
                              </td>
                              <td style={{ padding: "12px 8px", textAlign: "center", color: bonus > 0 ? "#FFD700" : "#555", fontSize: "14px" }}>
                                {bonus > 0 ? `+${bonus}` : '–'}
                              </td>
                              <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "bold", color: "#FF4F1F", fontSize: "18px" }}>
                                {total}
                              </td>
                              <td style={{ padding: "12px 8px", textAlign: "right" }}>
                                <button
                                  onClick={() => setBonusTeam(team)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    background: "#422006",
                                    color: "#FFD700",
                                    border: "1px solid #FFD70040",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                    fontSize: "12px"
                                  }}
                                >
                                  +Bonus
                                </button>
                                <button
                                  onClick={() => { setResetTeamData(team); setResetTargetRound(1); }}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    background: "#1e1b4b",
                                    color: "#818cf8",
                                    border: "1px solid #818cf840",
                                    cursor: "pointer",
                                    marginRight: "8px",
                                    fontSize: "12px"
                                  }}
                                >
                                  ↩ Reset Round
                                </button>
                                <button
                                  onClick={() => removeTeam(team.teamKey)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: "4px",
                                    background: "#7f1d1d",
                                    color: "white",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "12px"
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Bonus Points Quick Award */}
                    {bonusTeam && (
                      <div style={{
                        marginTop: "20px",
                        padding: "20px",
                        background: "#1a1500",
                        borderRadius: "12px",
                        border: "1px solid #FFD70030"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                          <h3 style={{ margin: 0, color: "#FFD700", fontSize: "16px" }}>
                            Award Bonus to: <strong>{bonusTeam.teamName}</strong>
                          </h3>
                          <button
                            onClick={() => setBonusTeam(null)}
                            style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", fontSize: "18px" }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {[1, 2, 5, 10, 15].map((pts) => (
                              <button
                                key={pts}
                                onClick={() => setBonusAmount(pts)}
                                style={{
                                  padding: "8px 16px",
                                  borderRadius: "6px",
                                  background: bonusAmount === pts ? "#FF4F1F" : "#27272A",
                                  color: "white",
                                  border: "none",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  fontSize: "14px"
                                }}
                              >
                                +{pts}
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={bonusReason}
                            onChange={(e) => setBonusReason(e.target.value)}
                            placeholder="Reason (optional)"
                            style={{
                              flex: 1,
                              minWidth: "180px",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              border: "1px solid #333",
                              background: "#0A0A0B",
                              color: "white",
                              fontSize: "14px"
                            }}
                          />
                          <button
                            onClick={awardBonus}
                            disabled={loading}
                            style={{
                              padding: "8px 20px",
                              borderRadius: "6px",
                              background: "#FFD700",
                              color: "#000",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "14px"
                            }}
                          >
                            Award +{bonusAmount}
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Reset to Round Panel */}
                    {resetTeamData && (
                      <div style={{
                        marginTop: "20px",
                        padding: "20px",
                        background: "#0f0a2a",
                        borderRadius: "12px",
                        border: "1px solid #818cf830"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                          <h3 style={{ margin: 0, color: "#818cf8", fontSize: "16px" }}>
                            Reset <strong>{resetTeamData.teamName}</strong> to Round:
                          </h3>
                          <button
                            onClick={() => setResetTeamData(null)}
                            style={{ background: "none", border: "none", color: "#a1a1aa", cursor: "pointer", fontSize: "18px" }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            {[1, 2, 3, 4].map((round) => (
                              <button
                                key={round}
                                onClick={() => setResetTargetRound(round)}
                                style={{
                                  padding: "10px 20px",
                                  borderRadius: "8px",
                                  background: resetTargetRound === round ? "#4f46e5" : "#27272A",
                                  color: "white",
                                  border: resetTargetRound === round ? "2px solid #818cf8" : "2px solid transparent",
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  fontSize: "15px",
                                  minWidth: "60px"
                                }}
                              >
                                R{round}
                              </button>
                            ))}
                          </div>
                          <div style={{ flex: 1, color: "#a1a1aa", fontSize: "13px", lineHeight: "1.4" }}>
                            {resetTargetRound === 1
                              ? "Clears all scores. Team restarts from Round 1."
                              : `Keeps R1${resetTargetRound > 2 ? `–R${resetTargetRound - 1}` : ''} scores. Clears R${resetTargetRound}${resetTargetRound < 4 ? `–R4` : ''}.`}
                          </div>
                          <button
                            onClick={resetToRound}
                            disabled={loading}
                            style={{
                              padding: "10px 24px",
                              borderRadius: "8px",
                              background: "#4f46e5",
                              color: "white",
                              border: "none",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "14px"
                            }}
                          >
                            Reset to R{resetTargetRound}
                          </button>
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "12px", fontStyle: "italic" }}>
                          The team will pick up this reset when they tap &quot;Resume Previous Session&quot; on the registration page.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <p style={{ color: "#71717a" }}>Select a room to view teams</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
