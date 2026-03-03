// Leaderboard API - Shared across all devices using Upstash Redis
//
// This file goes in: api/leaderboard.js
//
// Uses Redis Hash (HSET/HGETALL) for atomic per-team writes.
// Each team is a separate field in the hash — no read-modify-write race conditions.
// Key: leaderboard:room:{room}  |  Field: teamKey  |  Value: team JSON

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Helper: read all teams from a room hash and return sorted array
async function getRoomLeaderboard(room) {
  const key = `leaderboard:room:${room}`;
  const hash = await redis.hgetall(key);
  if (!hash || typeof hash !== 'object') return [];

  // hash is { teamKey: teamData, teamKey: teamData, ... }
  const teams = Object.values(hash);

  // Sort by total score descending
  teams.sort((a, b) => {
    const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
    const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
    return bTotal - aTotal;
  });

  return teams;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { room, action, teamKey } = req.query;

      // Check for a pending reset signal for a specific team
      if (action === 'check-reset' && teamKey) {
        const resetKey = `reset:${teamKey}`;
        const resetData = await redis.get(resetKey);
        if (resetData) {
          await redis.del(resetKey);
          return res.status(200).json({ hasReset: true, targetRound: resetData.targetRound, timestamp: resetData.timestamp });
        }
        return res.status(200).json({ hasReset: false });
      }

      // Get leaderboard for a specific room
      if (!room) {
        return res.status(400).json({ error: 'Room number required' });
      }

      const leaderboard = await getRoomLeaderboard(room);
      return res.status(200).json({ leaderboard });

    } else if (req.method === 'POST') {
      const { room, table, teamName, roundId, score, action } = req.body;

      // Registration action - just adds team with no scores
      if (action === 'register') {
        if (!room || !table || !teamName) {
          return res.status(400).json({
            error: 'Missing required fields for registration',
            required: ['room', 'table', 'teamName']
          });
        }

        const key = `leaderboard:room:${room}`;
        const teamKey = `${room}-${table}`;

        // Read only this team's data (atomic read)
        const existing = await redis.hget(key, teamKey);

        if (existing) {
          // Update team name only
          const updated = { ...existing, teamName, lastUpdated: Date.now() };
          await redis.hset(key, { [teamKey]: updated });
        } else {
          // New team
          const newTeam = {
            teamKey,
            teamName,
            room,
            table,
            scores: {},
            registeredAt: Date.now(),
            lastUpdated: Date.now()
          };
          await redis.hset(key, { [teamKey]: newTeam });
        }

        const leaderboard = await getRoomLeaderboard(room);
        return res.status(200).json({ success: true, leaderboard });
      }

      // Bonus points action
      if (action === 'bonus') {
        const { points, reason } = req.body;
        if (!room || !table || points === undefined) {
          return res.status(400).json({
            error: 'Missing required fields for bonus',
            required: ['room', 'table', 'points']
          });
        }

        const key = `leaderboard:room:${room}`;
        const teamKey = `${room}-${table}`;

        // Retry loop to handle concurrent bonus awards (optimistic locking)
        for (let attempt = 0; attempt < 3; attempt++) {
          const existing = await redis.hget(key, teamKey);

          if (!existing) {
            return res.status(404).json({ error: 'Team not found' });
          }

          const currentBonus = existing.bonusPoints || 0;
          const bonusLog = existing.bonusLog || [];
          bonusLog.push({ points, reason: reason || '', time: Date.now() });

          const updated = {
            ...existing,
            bonusPoints: currentBonus + points,
            bonusLog,
            lastUpdated: Date.now()
          };
          await redis.hset(key, { [teamKey]: updated });

          // Verify the write stuck (read-after-write check)
          const verify = await redis.hget(key, teamKey);
          if (verify && verify.bonusPoints === currentBonus + points) {
            break; // Write succeeded
          }
          // If mismatch, retry
          console.log(`Bonus write conflict for ${teamKey}, retrying (attempt ${attempt + 1})`);
        }

        const leaderboard = await getRoomLeaderboard(room);
        return res.status(200).json({ success: true, leaderboard });
      }

      // Score submission action
      if (!room || !table || !teamName || !roundId || score === undefined) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['room', 'table', 'teamName', 'roundId', 'score']
        });
      }

      const { phase } = req.body;
      const key = `leaderboard:room:${room}`;
      const teamKey = `${room}-${table}`;

      // Read only this team's data
      const existing = await redis.hget(key, teamKey);

      let teamData;
      if (existing) {
        teamData = {
          ...existing,
          teamName,
          scores: { ...(existing.scores || {}), [roundId]: score },
          phases: { ...(existing.phases || {}), [roundId]: phase || 'final' },
          lastUpdated: Date.now()
        };
      } else {
        teamData = {
          teamKey,
          teamName,
          room,
          table,
          scores: { [roundId]: score },
          phases: { [roundId]: phase || 'final' },
          lastUpdated: Date.now()
        };
      }

      // Atomic write — only touches this team's field
      await redis.hset(key, { [teamKey]: teamData });

      const leaderboard = await getRoomLeaderboard(room);
      return res.status(200).json({ success: true, leaderboard });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({
      error: 'Database error',
      message: error.message
    });
  }
}
