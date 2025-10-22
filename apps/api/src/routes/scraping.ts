import express from 'express';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/scraping/campaigns
 * Get scraping campaigns (placeholder)
 */
router.get('/campaigns', requireAuth, async (req, res) => {
  res.json({
    campaigns: [],
    message: 'Scraping API - Coming soon',
  });
});

export default router;
