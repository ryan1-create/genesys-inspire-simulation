// Leaderboard API - Shared across all devices using Upstash Redis
//
// This file goes in: api/leaderboard.js
//
// Your Upstash Redis is already connected - the environment variables
// (KV_REST_API_URL, KV_REST_API_TOKEN) are automatically available.

import { Redis } from '@upstash/redis';

// Initialize Redis client using the env vars Vercel automatically added
const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

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
      // Get leaderboard for a specific room
      const { room } = req.query;

      if (!room) {
        return res.status(400).json({ error: 'Room number required' });
      }

      const key = `leaderboard:room:${room}`;
      const leaderboard = await redis.get(key) || [];

      // Sort by total score (including bonus points) descending
      const sorted = Array.isArray(leaderboard) ? leaderboard.sort((a, b) => {
        const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
        const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
        return bTotal - aTotal;
      }) : [];

      return res.status(200).json({ leaderboard: sorted });

    } else if (req.method === 'POST') {
      // Submit or update a team's score, or register a new team
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
        let leaderboard = await redis.get(key) || [];

        if (!Array.isArray(leaderboard)) {
          leaderboard = [];
        }

        const teamKey = `${room}-${table}`;
        const existingIdx = leaderboard.findIndex(t => t.teamKey === teamKey);

        if (existingIdx < 0) {
          // Add new team with empty scores
          leaderboard.push({
            teamKey,
            teamName,
            room,
            table,
            scores: {},
            registeredAt: Date.now(),
            lastUpdated: Date.now()
          });
          await redis.set(key, leaderboard);
        } else {
          // Update team name if already registered
          leaderboard[existingIdx].teamName = teamName;
          leaderboard[existingIdx].lastUpdated = Date.now();
          await redis.set(key, leaderboard);
        }

        return res.status(200).json({
          success: true,
          leaderboard: leaderboard
        });
      }

      // Bonus points action - admin/presenter can add bonus points
      if (action === 'bonus') {
        const { points, reason } = req.body;
        if (!room || !table || points === undefined) {
          return res.status(400).json({
            error: 'Missing required fields for bonus',
            required: ['room', 'table', 'points']
          });
        }

        const key = `leaderboard:room:${room}`;
        let leaderboard = await redis.get(key) || [];
        if (!Array.isArray(leaderboard)) leaderboard = [];

        const teamKey = `${room}-${table}`;
        const existingIdx = leaderboard.findIndex(t => t.teamKey === teamKey);

        if (existingIdx >= 0) {
          const currentBonus = leaderboard[existingIdx].bonusPoints || 0;
          leaderboard[existingIdx].bonusPoints = currentBonus + points;
          leaderboard[existingIdx].lastUpdated = Date.now();
          if (!leaderboard[existingIdx].bonusLog) leaderboard[existingIdx].bonusLog = [];
          leaderboard[existingIdx].bonusLog.push({ points, reason: reason || '', time: Date.now() });
          await redis.set(key, leaderboard);
          return res.status(200).json({ success: true, leaderboard });
        } else {
          return res.status(404).json({ error: 'Team not found' });
        }
      }

      // Score submission action
      if (!room || !table || !teamName || !roundId || score === undefined) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['room', 'table', 'teamName', 'roundId', 'score']
        });
      }

      // phase indicates whether this is an initial or final (wobble) score
      const { phase } = req.body;

      const key = `leaderboard:room:${room}`;
      let leaderboard = await redis.get(key) || [];

      // Ensure it's an array
      if (!Array.isArray(leaderboard)) {
        leaderboard = [];
      }

      // Find existing team entry or create new one
      const teamKey = `${room}-${table}`;
      const existingIdx = leaderboard.findIndex(t => t.teamKey === teamKey);

      if (existingIdx >= 0) {
        // Update existing team's score for this round
        leaderboard[existingIdx].scores[roundId] = score;
        leaderboard[existingIdx].teamName = teamName;
        leaderboard[existingIdx].lastUpdated = Date.now();
        // Track phase for display purposes
        if (!leaderboard[existingIdx].phases) leaderboard[existingIdx].phases = {};
        leaderboard[existingIdx].phases[roundId] = phase || 'final';
      } else {
        // Add new team
        leaderboard.push({
          teamKey,
          teamName,
          room,
          table,
          scores: { [roundId]: score },
          phases: { [roundId]: phase || 'final' },
          lastUpdated: Date.now()
        });
      }

      // Save to Redis
      await redis.set(key, leaderboard);

      // Return updated leaderboard sorted by score
      const sorted = leaderboard.sort((a, b) => {
        const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
        const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
        return bTotal - aTotal;
      });

      return res.status(200).json({
        success: true,
        leaderboard: sorted
      });

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
