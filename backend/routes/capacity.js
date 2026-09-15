const express = require('express');
const { body, validationResult } = require('express-validator');
const ParkingCapacity = require('../models/ParkingCapacity');
const Vehicle = require('../models/Vehicle');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/capacity/current
// @desc    Get current parking capacity (public)
// @access  Public
router.get('/current', async (req, res) => {
  try {
    const capacity = await ParkingCapacity.getInstance();
    
    res.json({
      totalCapacity: capacity.totalCapacity,
      currentOccupied: capacity.currentOccupied,
      availableSlots: capacity.availableSlots,
      occupancyPercentage: capacity.occupancyPercentage,
      isFull: capacity.currentOccupied >= capacity.totalCapacity,
      lastUpdated: capacity.lastUpdated
    });
  } catch (error) {
    console.error('Get capacity error:', error);
    res.status(500).json({
      message: 'Server error while fetching capacity',
      error: error.message
    });
  }
});

// @route   GET /api/capacity/stats
// @desc    Get detailed capacity statistics (admin only)
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const capacity = await ParkingCapacity.getInstance();
    
    // Get vehicle type breakdown
    const vehicleTypeBreakdown = await Vehicle.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get hourly activity (vehicles parked in last 24 hours by hour)
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);
    
    const hourlyActivity = await Vehicle.aggregate([
      { 
        $match: { 
          entryTime: { $gte: yesterday }
        } 
      },
      {
        $group: {
          _id: { $hour: '$entryTime' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      capacity: {
        totalCapacity: capacity.totalCapacity,
        currentOccupied: capacity.currentOccupied,
        availableSlots: capacity.availableSlots,
        occupancyPercentage: capacity.occupancyPercentage,
        isFull: capacity.currentOccupied >= capacity.totalCapacity,
        lastUpdated: capacity.lastUpdated
      },
      vehicleTypeBreakdown,
      hourlyActivity,
      summary: {
        utilizationRate: capacity.occupancyPercentage,
        status: capacity.occupancyPercentage >= 90 ? 'Critical' :
                capacity.occupancyPercentage >= 75 ? 'High' :
                capacity.occupancyPercentage >= 50 ? 'Moderate' :
                'Low'
      }
    });
  } catch (error) {
    console.error('Get capacity stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching capacity statistics',
      error: error.message
    });
  }
});

// @route   PUT /api/capacity/total
// @desc    Update total parking capacity (admin only)
// @access  Private
router.put('/total', auth, [
  body('totalCapacity')
    .isInt({ min: 1 })
    .withMessage('Total capacity must be a positive integer')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { totalCapacity } = req.body;
    const capacity = await ParkingCapacity.getInstance();

    // Check if new capacity is less than current occupied
    if (totalCapacity < capacity.currentOccupied) {
      return res.status(400).json({
        message: `Cannot reduce capacity to ${totalCapacity}. Currently ${capacity.currentOccupied} vehicles are parked.`,
        currentOccupied: capacity.currentOccupied
      });
    }

    // Update capacity
    await capacity.updateTotalCapacity(totalCapacity, req.user._id);

    res.json({
      message: 'Parking capacity updated successfully',
      capacity: {
        totalCapacity: capacity.totalCapacity,
        currentOccupied: capacity.currentOccupied,
        availableSlots: capacity.availableSlots,
        occupancyPercentage: capacity.occupancyPercentage
      }
    });
  } catch (error) {
    console.error('Update capacity error:', error);
    res.status(500).json({
      message: 'Server error while updating capacity',
      error: error.message
    });
  }
});

// @route   POST /api/capacity/synchronize
// @desc    Synchronize capacity with actual vehicle count (admin only)
// @access  Private
router.post('/synchronize', auth, async (req, res) => {
  try {
    const capacity = await ParkingCapacity.getInstance();
    const oldOccupied = capacity.currentOccupied;
    
    await capacity.synchronizeWithVehicles();
    
    res.json({
      message: 'Capacity synchronized successfully',
      oldOccupied,
      newOccupied: capacity.currentOccupied,
      difference: capacity.currentOccupied - oldOccupied,
      capacity: {
        totalCapacity: capacity.totalCapacity,
        currentOccupied: capacity.currentOccupied,
        availableSlots: capacity.availableSlots,
        occupancyPercentage: capacity.occupancyPercentage
      }
    });
  } catch (error) {
    console.error('Synchronize capacity error:', error);
    res.status(500).json({
      message: 'Server error while synchronizing capacity',
      error: error.message
    });
  }
});

// @route   POST /api/capacity/reset-occupied
// @desc    Reset occupied count (admin only, emergency use)
// @access  Private
router.post('/reset-occupied', auth, [
  body('confirm')
    .equals('RESET')
    .withMessage('Confirmation required: send "RESET" to confirm')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const capacity = await ParkingCapacity.getInstance();
    const oldOccupied = capacity.currentOccupied;
    
    capacity.currentOccupied = 0;
    capacity.lastUpdated = new Date();
    await capacity.save();

    console.warn(`⚠️ EMERGENCY RESET: Occupied count reset from ${oldOccupied} to 0 by admin ${req.user.username}`);

    res.json({
      message: 'Occupied count reset successfully',
      warning: 'This is an emergency action. Consider synchronizing with actual vehicle count.',
      oldOccupied,
      newOccupied: 0,
      capacity: {
        totalCapacity: capacity.totalCapacity,
        currentOccupied: capacity.currentOccupied,
        availableSlots: capacity.availableSlots,
        occupancyPercentage: capacity.occupancyPercentage
      }
    });
  } catch (error) {
    console.error('Reset occupied error:', error);
    res.status(500).json({
      message: 'Server error while resetting occupied count',
      error: error.message
    });
  }
});

module.exports = router;
