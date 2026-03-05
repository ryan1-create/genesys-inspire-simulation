// Admin API for managing leaderboard data
//
// This file goes in: api/admin.js
//
// Uses Redis Hash (HSET/HGETALL/HDEL) — matches leaderboard.js pattern.
// Set your admin password in Vercel Environment Variables:
// ADMIN_PASSWORD = "your-secret-password"

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

// Helper: read all teams from a room hash and return as array
async function getRoomTeams(room) {
  const key = `leaderboard:room:${room}`;
  const hash = await redis.hgetall(key);
  if (!hash || typeof hash !== 'object') return [];
  return Object.values(hash);
}

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
        const leaderboard = await getRoomTeams(room);
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
        // Atomic delete of just this team's field
        await redis.hdel(key, teamKey);
        const leaderboard = await getRoomTeams(room);
        return res.status(200).json({ success: true, message: `Team ${teamKey} removed`, leaderboard });
      }

      // Reset a team's scores (keep them on leaderboard but zero out)
      case 'reset-team': {
        if (!room || !teamKey) return res.status(400).json({ error: 'Room and teamKey required' });
        const key = `leaderboard:room:${room}`;
        const existing = await redis.hget(key, teamKey);
        if (existing) {
          const updated = { ...existing, scores: {}, phases: {}, lastUpdated: Date.now() };
          await redis.hset(key, { [teamKey]: updated });
        }
        const leaderboard = await getRoomTeams(room);
        return res.status(200).json({ success: true, message: `Team ${teamKey} scores reset`, leaderboard });
      }

      // Reset a team to a specific round
      case 'reset-to-round': {
        const { targetRound } = req.body;
        if (!room || !teamKey || !targetRound) {
          return res.status(400).json({ error: 'Room, teamKey, and targetRound required' });
        }
        const roundNum = parseInt(targetRound);
        if (isNaN(roundNum) || roundNum < 1 || roundNum > 4) {
          return res.status(400).json({ error: 'targetRound must be 1-4' });
        }

        // 1. Update only this team's data (atomic read + write of single field)
        const key = `leaderboard:room:${room}`;
        const existing = await redis.hget(key, teamKey);
        let teamName = teamKey;

        if (existing) {
          teamName = existing.teamName || teamKey;
          const newScores = { ...(existing.scores || {}) };
          const newPhases = { ...(existing.phases || {}) };
          for (let r = roundNum; r <= 4; r++) {
            delete newScores[r];
            delete newPhases[r];
          }
          const updated = { ...existing, scores: newScores, phases: newPhases, lastUpdated: Date.now() };
          await redis.hset(key, { [teamKey]: updated });
        }

        // 2. Store reset signal for client
        const resetKey = `reset:${teamKey}`;
        await redis.set(resetKey, { targetRound: roundNum, timestamp: Date.now() }, { ex: 14400 });

        const leaderboard = await getRoomTeams(room);
        return res.status(200).json({
          success: true,
          message: `${teamName} reset to Round ${roundNum}. Scores for R${roundNum}${roundNum < 4 ? `-R4` : ''} cleared. Team will pick up the reset on their next resume.`,
          leaderboard
        });
      }

      // Clear ALL data — requires superkey (only event owner)
      case 'clear-all': {
        const superkey = req.body.superkey || '';
        if (!process.env.ADMIN_SUPERKEY || superkey !== process.env.ADMIN_SUPERKEY) {
          return res.status(403).json({ error: 'This action requires the super admin key.' });
        }
        const keys = await redis.keys('leaderboard:room:*');
        for (const k of keys) {
          await redis.del(k);
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
