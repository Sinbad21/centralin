import express from 'express';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/analytics/overview
 * Get analytics overview (placeholder)
 */
router.get('/overview', requireAuth, async (req, res) => {
  res.json({
    totalConversations: 0,
    totalMessages: 0,
    avgSentiment: 0,
    message: 'Analytics API - Coming soon',
  });
});

export default router;
