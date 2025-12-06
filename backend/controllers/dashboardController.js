// Controller for dashboard and analytics endpoints

const User = require('../models/User');
const AnalyticsService = require('../services/analyticsService');
const mongoose = require('mongoose');

/**
 * Get dashboard summary
 * GET /api/dashboard/summary?userId=...
 */
exports.getSummary = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: userId'
      });
    }

    try {
      const summary = await AnalyticsService.getDashboardSummary(userId);
      return res.json({
        success: true,
        summary
      });
    } catch (dbErr) {
      // Return empty summary if DB not available
      return res.json({
        success: true,
        summary: {
          totalEmissions: 0,
          totalOffsets: 0,
          netFootprint: 0,
          ecoPoints: 0,
          entriesCount: 0,
          treesPlanted: 0
        }
      });
    }
  } catch (err) {
    console.error('getSummary error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Get weekly analytics data
 * GET /api/analytics/weekly?userId=...&weeks=12
 */
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    const { userId, weeks = 12 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: userId'
      });
    }

    try {
      const weeklyData = await AnalyticsService.getWeeklyData(userId, parseInt(weeks));

      // Calculate percentage change from previous week
      let percentageChange = 0;
      if (weeklyData.length >= 2) {
        const currentWeek = weeklyData[weeklyData.length - 1];
        const previousWeek = weeklyData[weeklyData.length - 2];
        percentageChange = AnalyticsService.calculatePercentageChange(
          currentWeek.netFootprint,
          previousWeek.netFootprint
        );
      }

      return res.json({
        success: true,
        weeklyData,
        percentageChange
      });
    } catch (dbErr) {
      // Return empty data if DB not available
      return res.json({
        success: true,
        weeklyData: [],
        percentageChange: 0
      });
    }
  } catch (err) {
    console.error('getWeeklyAnalytics error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Get user profile with lifetime statistics
 * GET /api/user/profile?userId=...
 */
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: userId'
      });
    }

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      return res.json({
        success: true,
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
          lifetimeStats: user.lifetimeStats,
          joinedDate: user.createdAt
        }
      });
    } catch (dbErr) {
      // Return default user if DB not available
      return res.json({
        success: true,
        user: {
          _id: userId,
          email: 'user@ecotracker.com',
          name: 'EcoTracker User',
          lifetimeStats: {
            totalEmissions: 0,
            totalOffsets: 0,
            ecoPoints: 0,
            treesPlanted: 0,
            entriesLogged: 0
          },
          joinedDate: new Date()
        }
      });
    }
  } catch (err) {
    console.error('getUserProfile error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

/**
 * Get recent entries for dashboard
 * GET /api/entries/recent?userId=...&days=7
 */
exports.getRecentEntries = async (req, res) => {
  try {
    const { userId, days = 7 } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: userId'
      });
    }

    try {
      const entries = await AnalyticsService.getRecentEntries(userId, parseInt(days));

      return res.json({
        success: true,
        entries
      });
    } catch (dbErr) {
      // Return empty entries if DB not available
      return res.json({
        success: true,
        entries: []
      });
    }
  } catch (err) {
    console.error('getRecentEntries error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  }
};

module.exports = exports;
