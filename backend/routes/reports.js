const express = require('express');
const Vehicle = require('../models/Vehicle');
const { auth } = require('../middleware/auth');
const moment = require('moment');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/reports/summary
// @desc    Get comprehensive report summary
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;

    // Determine date range
    let start, end;
    let dateFilter = {};

    if (period === 'all') {
      // No date filter - return all-time data
      dateFilter = {};
    } else if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    } else if (period) {
      const now = moment();
      switch (period) {
        case 'today':
          start = now.clone().startOf('day').toDate();
          end = now.clone().endOf('day').toDate();
          break;
        case 'week':
          start = now.clone().startOf('week').toDate();
          end = now.clone().endOf('week').toDate();
          break;
        case 'month':
          start = now.clone().startOf('month').toDate();
          end = now.clone().endOf('month').toDate();
          break;
        case 'year':
          start = now.clone().startOf('year').toDate();
          end = now.clone().endOf('year').toDate();
          break;
        default:
          start = now.clone().startOf('month').toDate();
          end = now.clone().endOf('month').toDate();
      }
      dateFilter = { createdAt: { $gte: start, $lte: end } };
    } else {
      // Default to all-time for dashboard
      dateFilter = {};
    }

    // Simplified queries for better performance
    const totalVehicles = await Vehicle.countDocuments(dateFilter);
    const activeVehicles = await Vehicle.countDocuments({ ...dateFilter, status: 'active' });
    const completedVehicles = await Vehicle.countDocuments({ ...dateFilter, status: 'completed' });
    const paidVehicles = await Vehicle.countDocuments({ ...dateFilter, paymentStatus: 'paid' });
    const unpaidVehicles = await Vehicle.countDocuments({ ...dateFilter, paymentStatus: 'pending' });

    // Simple revenue calculation
    const paidVehiclesData = await Vehicle.find({ ...dateFilter, paymentStatus: 'paid' })
      .select('fee')
      .lean();
    const totalRevenue = paidVehiclesData.reduce((sum, vehicle) => sum + (vehicle.fee || 0), 0);
    const avgFee = paidVehiclesData.length > 0 ? totalRevenue / paidVehiclesData.length : 0;

    // Simplified vehicle type stats
    const vehicleTypeStats = await Vehicle.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$fee', 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      period: {
        start,
        end,
        type: period || 'custom'
      },
      summary: {
        totalVehicles,
        activeVehicles,
        completedVehicles,
        paidVehicles,
        unpaidVehicles,
        totalRevenue,
        avgFee,
        maxFee: Math.max(...paidVehiclesData.map(v => v.fee || 0), 0),
        minFee: Math.min(...paidVehiclesData.map(v => v.fee || 0), 0),
        paymentRate: totalVehicles > 0 ? (paidVehicles / totalVehicles * 100).toFixed(2) : 0
      },
      vehicleTypeStats,
      dailyRevenue: [], // Simplified for performance
      paymentStats: []   // Simplified for performance
    });
  } catch (error) {
    console.error('Report summary error:', error);
    res.status(500).json({
      message: 'Server error while generating report summary',
      error: error.message
    });
  }
});

// @route   GET /api/reports/export/csv
// @desc    Export vehicles data as CSV
// @access  Private
router.get('/export/csv', async (req, res) => {
  try {
    const { startDate, endDate, status, paymentStatus } = req.query;

    // Build filter
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Get vehicles data
    const vehicles = await Vehicle.find(filter)
      .select('plateNumber vehicleType color entryTime exitTime durationInMinutes ratePerMinute fee status paymentStatus paymentReference createdAt')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate summary statistics
    const totalVehicles = vehicles.length;
    const totalRevenue = vehicles.reduce((sum, v) => sum + (v.paymentStatus === 'paid' ? v.fee : 0), 0);
    const paidCount = vehicles.filter(v => v.paymentStatus === 'paid').length;
    const pendingCount = vehicles.filter(v => v.paymentStatus === 'pending').length;
    const activeCount = vehicles.filter(v => v.status === 'active').length;
    const completedCount = vehicles.filter(v => v.status === 'completed').length;

    // Build beautiful CSV with proper formatting
    const csvLines = [];
    
    // UTF-8 BOM for proper Excel encoding
    const BOM = '\uFEFF';
    
    // Report Header
    csvLines.push('EASY PARKING SYSTEM - VEHICLE REPORT');
    csvLines.push(`Generated: ${moment().format('MMMM DD, YYYY [at] HH:mm:ss')}`);
    csvLines.push('');
    
    // Filter Information
    csvLines.push('REPORT FILTERS');
    if (startDate) csvLines.push(`Start Date: ${moment(startDate).format('MMMM DD, YYYY')}`);
    if (endDate) csvLines.push(`End Date: ${moment(endDate).format('MMMM DD, YYYY')}`);
    if (status) csvLines.push(`Status Filter: ${status.toUpperCase()}`);
    if (paymentStatus) csvLines.push(`Payment Filter: ${paymentStatus.toUpperCase()}`);
    if (!startDate && !endDate && !status && !paymentStatus) csvLines.push('No filters applied - All records');
    csvLines.push('');
    
    // Summary Statistics
    csvLines.push('SUMMARY STATISTICS');
    csvLines.push(`Total Vehicles: ${totalVehicles}`);
    csvLines.push(`Active Vehicles: ${activeCount}`);
    csvLines.push(`Completed Vehicles: ${completedCount}`);
    csvLines.push(`Paid Transactions: ${paidCount}`);
    csvLines.push(`Pending Payments: ${pendingCount}`);
    csvLines.push(`Total Revenue: ETB ${totalRevenue.toFixed(2)}`);
    csvLines.push('');
    csvLines.push('');
    
    // Data Table Header
    csvLines.push('VEHICLE RECORDS');
    csvLines.push('');
    
    // Column Headers
    const headers = [
      'Plate Number',
      'Vehicle Type',
      'Color',
      'Entry Time',
      'Exit Time',
      'Duration (min)',
      'Rate (ETB/min)',
      'Total Fee (ETB)',
      'Status',
      'Payment Status',
      'Payment Reference',
      'Record Created'
    ];
    csvLines.push(headers.join(','));
    
    // Data Rows
    vehicles.forEach(vehicle => {
      const row = [
        vehicle.plateNumber,
        vehicle.vehicleType,
        vehicle.color || 'N/A',
        moment(vehicle.entryTime).format('YYYY-MM-DD HH:mm'),
        vehicle.exitTime ? moment(vehicle.exitTime).format('YYYY-MM-DD HH:mm') : 'Still Parked',
        vehicle.durationInMinutes || '0',
        vehicle.ratePerMinute.toFixed(2),
        vehicle.fee.toFixed(2),
        vehicle.status.toUpperCase(),
        vehicle.paymentStatus.toUpperCase(),
        vehicle.paymentReference || 'N/A',
        moment(vehicle.createdAt).format('YYYY-MM-DD HH:mm')
      ];
      // Properly escape fields containing commas or quotes
      const escapedRow = row.map(cell => {
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      });
      csvLines.push(escapedRow.join(','));
    });
    
    // Footer
    csvLines.push('');
    csvLines.push('');
    csvLines.push('END OF REPORT');
    csvLines.push('Easy Parking System © 2026');
    
    // Combine all lines
    const csvContent = BOM + csvLines.join('\n');

    // Set headers for file download
    const filename = `EasyParking_Report_${moment().format('YYYY-MM-DD_HHmmss')}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({
      message: 'Server error while exporting CSV',
      error: error.message
    });
  }
});

// @route   GET /api/reports/analytics
// @desc    Get detailed analytics with charts data
// @access  Private
router.get('/analytics', async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    // Determine date range based on period
    const now = moment();
    let start, end, groupBy;

    switch (period) {
      case 'day':
        start = now.clone().startOf('day').toDate();
        end = now.clone().endOf('day').toDate();
        groupBy = {
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'week':
        start = now.clone().startOf('week').toDate();
        end = now.clone().endOf('week').toDate();
        groupBy = {
          day: { $dayOfWeek: '$createdAt' }
        };
        break;
      case 'month':
        start = now.clone().startOf('month').toDate();
        end = now.clone().endOf('month').toDate();
        groupBy = {
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'year':
        start = now.clone().startOf('year').toDate();
        end = now.clone().endOf('year').toDate();
        groupBy = {
          month: { $month: '$createdAt' }
        };
        break;
      default:
        start = now.clone().startOf('month').toDate();
        end = now.clone().endOf('month').toDate();
        groupBy = {
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const dateFilter = {
      createdAt: { $gte: start, $lte: end }
    };

    // Revenue trend
    const revenueTrend = await Vehicle.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$fee' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Vehicle count trend
    const vehicleTrend = await Vehicle.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: groupBy,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Vehicle type distribution
    const vehicleTypeDistribution = await Vehicle.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 },
          revenue: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$fee', 0] } }
        }
      }
    ]);

    // Payment status distribution
    const paymentDistribution = await Vehicle.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          amount: { $sum: '$fee' }
        }
      }
    ]);

    // Peak hours analysis (for day/week periods)
    let peakHours = [];
    if (period === 'day' || period === 'week') {
      peakHours = await Vehicle.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $hour: '$entryTime' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
    }

    res.json({
      period,
      dateRange: { start, end },
      revenueTrend,
      vehicleTrend,
      vehicleTypeDistribution,
      paymentDistribution,
      peakHours
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      message: 'Server error while fetching analytics',
      error: error.message
    });
  }
});

module.exports = router;
