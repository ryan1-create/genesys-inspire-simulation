// Winners API - Stores winning team member info per room
//
// This file goes in: api/winners.js

import { Redis } from '@upstash/redis';

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
      const { action, room } = req.query;

      // List all winners across all rooms
      if (action === 'list') {
        const keys = await redis.keys('winners:room:*');
        const winners = [];
        for (const key of keys) {
          const data = await redis.get(key);
          if (data) winners.push(data);
        }
        // Sort by room number
        winners.sort((a, b) => {
          const aRoom = parseInt(a.room) || 0;
          const bRoom = parseInt(b.room) || 0;
          return aRoom - bRoom;
        });
        return res.status(200).json({ winners });
      }

      // Get winner for a specific room
      if (room) {
        const key = `winners:room:${room}`;
        const data = await redis.get(key);
        return res.status(200).json({ winner: data || null });
      }

      return res.status(400).json({ error: 'Provide room or action=list' });

    } else if (req.method === 'POST') {
      const { action } = req.body;

      if (action === 'submit') {
        const { room, table, teamName, teamKey, totalScore, members } = req.body;

        if (!room || !teamName || !members || !Array.isArray(members) || members.length === 0) {
          return res.status(400).json({
            error: 'Missing required fields',
            required: ['room', 'teamName', 'members (array with name/email)']
          });
        }

        // Validate members have at least a name
        const validMembers = members.filter(m => m.name && m.name.trim());
        if (validMembers.length === 0) {
          return res.status(400).json({ error: 'At least one member with a name is required' });
        }

        // Verify this team is actually the winner for this room
        const leaderboardKey = `leaderboard:room:${room}`;
        const leaderboard = await redis.get(leaderboardKey) || [];
        if (Array.isArray(leaderboard) && leaderboard.length > 0) {
          const sorted = leaderboard.sort((a, b) => {
            const aTotal = Object.values(a.scores || {}).reduce((sum, s) => sum + s, 0) + (a.bonusPoints || 0);
            const bTotal = Object.values(b.scores || {}).reduce((sum, s) => sum + s, 0) + (b.bonusPoints || 0);
            return bTotal - aTotal;
          });
          const topTeamKey = sorted[0]?.teamKey;
          if (topTeamKey !== teamKey) {
            return res.status(403).json({ error: 'Only the winning team can submit' });
          }
        }

        const winnerData = {
          teamName,
          teamKey: teamKey || `${room}-${table}`,
          room,
          table,
          totalScore: totalScore || 0,
          members: validMembers.map(m => ({
            name: m.name.trim(),
            email: (m.email || '').trim(),
          })),
          submittedAt: Date.now(),
        };

        const key = `winners:room:${room}`;
        await redis.set(key, winnerData);

        return res.status(200).json({ success: true, winner: winnerData });
      }

      return res.status(400).json({ error: 'Unknown action' });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Winners API error:', error);
    return res.status(500).json({ error: 'Database error', message: error.message });
  }
}
