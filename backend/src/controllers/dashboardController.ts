import { Request, Response } from 'express';
import { prisma } from '../prisma';

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get verified users count
    const verifiedUsers = await prisma.user.count({
      where: { emailVerified: true }
    });

    // Get unverified users count
    const unverifiedUsers = totalUsers - verifiedUsers;

    // Get new users today
    const newUsersToday = await prisma.user.count({
      where: { createdAt: { gte: todayStart } }
    });

    // Get new users this week
    const newUsersWeek = await prisma.user.count({
      where: { createdAt: { gte: weekStart } }
    });

    // Get new users this month
    const newUsersMonth = await prisma.user.count({
      where: { createdAt: { gte: monthStart } }
    });

    res.json({
      totalUsers,
      verifiedUsers,
      unverifiedUsers,
      newUsersToday,
      newUsersWeek,
      newUsersMonth,
      verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};

/**
 * Get recent users
 */
export const getRecentUsers = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await prisma.user.count();

    res.json({ users, total, limit, offset });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({ error: 'Failed to fetch recent users' });
  }
};

/**
 * Get user growth data for charts (last 30 days)
 */
export const getUserGrowth = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get users grouped by day
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date
    const growthData: { [key: string]: number } = {};
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      growthData[dateStr] = 0;
    }

    // Count users per day
    users.forEach((user: { createdAt: Date }) => {
      const dateStr = user.createdAt.toISOString().split('T')[0];
      if (growthData[dateStr] !== undefined) {
        growthData[dateStr]++;
      }
    });

    // Convert to array format
    const chartData = Object.entries(growthData).map(([date, count]) => ({
      date,
      count
    }));

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ error: 'Failed to fetch user growth data' });
  }
};

/**
 * Get user activity summary
 */
export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Active users (updated in last 24 hours)
    const activeLastDay = await prisma.user.count({
      where: { updatedAt: { gte: dayAgo } }
    });

    // Active users (updated in last 7 days)
    const activeLastWeek = await prisma.user.count({
      where: { updatedAt: { gte: weekAgo } }
    });

    res.json({
      activeLastDay,
      activeLastWeek
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
};
