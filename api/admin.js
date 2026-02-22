// Admin API for managing leaderboard data
//
// This file goes in: api/admin.js
//
// Set your admin password in Vercel Environment Variables:
// ADMIN_PASSWORD = "your-secret-password"

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check admin password
  const password = req.headers.authorization?.replace('Bearer ', '') || req.query.password;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { action, room, teamKey } = req.method === 'GET' ? req.query : req.body;

    switch (action) {
      // List all rooms that have leaderboard data
      case 'list-rooms': {
        const keys = await redis.keys('leaderboard:room:*');
        const rooms = keys.map(k => k.replace('leaderboard:room:', ''));
        return res.status(200).json({ rooms });
      }

      // Get leaderboard for a specific room
      case 'get-room': {
        if (!room) return res.status(400).json({ error: 'Room required' });
        const key = `leaderboard:room:${room}`;
        const leaderboard = await redis.get(key) || [];
        return res.status(200).json({ room, leaderboard });
      }

      // Clear entire room's leaderboard
      case 'clear-room': {
        if (!room) return res.status(400).json({ error: 'Room required' });
        const key = `leaderboard:room:${room}`;
        await redis.del(key);
        return res.status(200).json({ success: true, message: `Room ${room} cleared` });
      }

      // Remove a specific team from a room
      case 'remove-team': {
        if (!room || !teamKey) return res.status(400).json({ error: 'Room and teamKey required' });
        const key = `leaderboard:room:${room}`;
        let leaderboard = await redis.get(key) || [];
        leaderboard = leaderboard.filter(t => t.teamKey !== teamKey);
        await redis.set(key, leaderboard);
        return res.status(200).json({ success: true, message: `Team ${teamKey} removed`, leaderboard });
      }

      // Reset a team's scores (keep them on leaderboard but zero out)
      case 'reset-team': {
        if (!room || !teamKey) return res.status(400).json({ error: 'Room and teamKey required' });
        const key = `leaderboard:room:${room}`;
        let leaderboard = await redis.get(key) || [];
        leaderboard = leaderboard.map(t => {
          if (t.teamKey === teamKey) {
            return { ...t, scores: {}, lastUpdated: Date.now() };
          }
          return t;
        });
        await redis.set(key, leaderboard);
        return res.status(200).json({ success: true, message: `Team ${teamKey} scores reset`, leaderboard });
      }

      // Reset a team to a specific round — clears that round's score (and all later rounds)
      // from the leaderboard, and stores a reset signal so the team's browser picks it up.
      case 'reset-to-round': {
        const { targetRound } = req.body;
        if (!room || !teamKey || !targetRound) {
          return res.status(400).json({ error: 'Room, teamKey, and targetRound required' });
        }
        const roundNum = parseInt(targetRound);
        if (isNaN(roundNum) || roundNum < 1 || roundNum > 4) {
          return res.status(400).json({ error: 'targetRound must be 1-4' });
        }

        // 1. Clear scores for this round and all later rounds from leaderboard
        const key = `leaderboard:room:${room}`;
        let leaderboard = await redis.get(key) || [];
        let teamName = '';
        leaderboard = leaderboard.map(t => {
          if (t.teamKey === teamKey) {
            teamName = t.teamName;
            const newScores = { ...t.scores };
            const newPhases = { ...(t.phases || {}) };
            for (let r = roundNum; r <= 4; r++) {
              delete newScores[r];
              delete newPhases[r];
            }
            return { ...t, scores: newScores, phases: newPhases, lastUpdated: Date.now() };
          }
          return t;
        });
        await redis.set(key, leaderboard);

        // 2. Store a reset signal the client will check on resume
        // Key: reset:{teamKey}, Value: { targetRound, timestamp }
        // TTL: 4 hours (enough for any event day)
        const resetKey = `reset:${teamKey}`;
        await redis.set(resetKey, { targetRound: roundNum, timestamp: Date.now() }, { ex: 14400 });

        return res.status(200).json({
          success: true,
          message: `${teamName || teamKey} reset to Round ${roundNum}. Scores for R${roundNum}${roundNum < 4 ? `-R4` : ''} cleared. Team will pick up the reset on their next resume.`,
          leaderboard
        });
      }

      // Clear ALL data (use with caution!)
      case 'clear-all': {
        const keys = await redis.keys('leaderboard:room:*');
        for (const key of keys) {
          await redis.del(key);
        }
        return res.status(200).json({ success: true, message: `Cleared ${keys.length} rooms` });
      }

      default:
        return res.status(400).json({
          error: 'Invalid action',
          validActions: ['list-rooms', 'get-room', 'clear-room', 'remove-team', 'reset-team', 'reset-to-round', 'clear-all']
        });
    }

  } catch (error) {
    console.error('Admin API error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
}
