import express from 'express';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/marketplace/bots
 * Get public bots (placeholder)
 */
router.get('/bots', optionalAuth, async (req, res) => {
  res.json({
    bots: [],
    message: 'Marketplace API - Coming soon',
  });
});

export default router;
