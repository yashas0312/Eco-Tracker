const Entry = require('../models/Entry');
const mongoose = require('mongoose');

class AnalyticsService {
  static async getWeeklyData(userId, weeks = 12) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    const weeklyData = await Entry.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' }
          },
          emissions: { $sum: '$co2Emissions' },
          offsets: { $sum: '$co2Offset' },
          entries: { $push: '$$ROOT' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 }
      }
    ]);

    return weeklyData.map(week => ({
      week: `${week._id.year}-W${week._id.week}`,
      year: week._id.year,
      weekNumber: week._id.week,
      emissions: parseFloat(week.emissions.toFixed(2)),
      offsets: parseFloat(week.offsets.toFixed(2)),
      netFootprint: parseFloat((week.emissions - week.offsets).toFixed(2)),
      entryCount: week.entries.length
    }));
  }

  static calculatePercentageChange(current, previous) {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
  }

  static async getCategoryBreakdown(userId, startDate, endDate) {
    const breakdown = await Entry.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$type',
          totalEmissions: { $sum: '$co2Emissions' },
          totalOffsets: { $sum: '$co2Offset' },
          count: { $sum: 1 }
        }
      }
    ]);

    return breakdown.map(item => ({
      type: item._id,
      totalEmissions: parseFloat(item.totalEmissions.toFixed(2)),
      totalOffsets: parseFloat(item.totalOffsets.toFixed(2)),
      count: item.count
    }));
  }

  static async getDashboardSummary(userId) {
    const entries = await Entry.find({ userId: mongoose.Types.ObjectId(userId) });

    const totalEmissions = entries.reduce((sum, entry) => sum + entry.co2Emissions, 0);
    const totalOffsets = entries.reduce((sum, entry) => sum + entry.co2Offset, 0);
    const ecoPoints = entries.reduce((sum, entry) => sum + entry.ecoPointsEarned, 0);
    const treesPlanted = entries
      .filter(entry => entry.type === 'plantation')
      .reduce((sum, entry) => sum + (entry.details.treesPlanted || 0), 0);

    return {
      totalEmissions: parseFloat(totalEmissions.toFixed(2)),
      totalOffsets: parseFloat(totalOffsets.toFixed(2)),
      netFootprint: parseFloat((totalEmissions - totalOffsets).toFixed(2)),
      ecoPoints,
      entriesCount: entries.length,
      treesPlanted
    };
  }

  static async getRecentEntries(userId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await Entry.find({
      userId: mongoose.Types.ObjectId(userId),
      date: { $gte: startDate }
    }).sort({ date: -1 });

    return entries.map(entry => ({
      _id: entry._id,
      type: entry.type,
      co2Emissions: entry.co2Emissions,
      co2Offset: entry.co2Offset,
      ecoPointsEarned: entry.ecoPointsEarned,
      date: entry.date,
      details: entry.details
    }));
  }
}

module.exports = AnalyticsService;
