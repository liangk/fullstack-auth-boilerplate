import { Router } from 'express';
import {
  getDashboardStats,
  getRecentUsers,
  getUserGrowth,
  getUserActivity
} from '../controllers/dashboardController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// All dashboard routes require authentication
router.use(requireAuth);

// Get dashboard statistics
router.get('/stats', getDashboardStats);

// Get recent users
router.get('/users/recent', getRecentUsers);

// Get user growth data
router.get('/users/growth', getUserGrowth);

// Get user activity
router.get('/users/activity', getUserActivity);

export default router;
