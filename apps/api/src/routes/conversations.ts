import express from 'express';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/conversations
 * Get conversations (placeholder)
 */
router.get('/', requireAuth, async (req, res) => {
  res.json({
    conversations: [],
    message: 'Conversations API - Coming soon',
  });
});

export default router;
