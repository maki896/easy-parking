const express = require('express');
const { body, validationResult } = require('express-validator');
const Vehicle = require('../models/Vehicle');
const Rate = require('../models/Rate');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/vehicles
// @desc    Add a new vehicle
// @access  Private
router.post('/', [
  body('plateNumber')
    .notEmpty()
    .withMessage('Plate number is required')
    .isLength({ min: 3, max: 10 })
    .withMessage('Plate number must be 3-10 characters')
    .matches(/^[A-Z0-9]+$/i)
    .withMessage('Plate number must contain only letters and numbers')
    .trim()
    .toUpperCase(),
  body('vehicleType')
    .isIn(['Car', 'Motorcycle', 'Truck'])
    .withMessage('Vehicle type must be Car, Motorcycle, or Truck'),
  body('color')
    .optional()
    .isLength({ max: 30 })
    .withMessage('Color cannot exceed 30 characters')
    .trim()
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

    const { plateNumber, vehicleType, color } = req.body;

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ 
      plateNumber: plateNumber.toUpperCase(),
      status: 'active'
    });
    if (existingVehicle) {
      return res.status(400).json({
        message: 'Vehicle with this plate number is already parked'
      });
    }

    // Get rate for vehicle type
    const ratePerMinute = await Rate.getRate(vehicleType);
    if (ratePerMinute === null) {
      return res.status(400).json({
        message: 'Rate not configured for this vehicle type'
      });
    }

    // Create new vehicle
    const vehicle = new Vehicle({
      plateNumber: plateNumber.toUpperCase(),
      vehicleType,
      color: color || '',
      ratePerMinute,
      entryTime: new Date()
    });

    await vehicle.save();

    res.status(201).json({
      message: 'Vehicle added successfully',
      vehicle
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    res.status(500).json({
      message: 'Server error while adding vehicle',
      error: error.message
    });
  }
});

// @route   GET /api/vehicles
// @desc    Get all vehicles with optional filtering
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { status, paymentStatus, vehicleType, page = 1, limit = 50 } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (vehicleType) filter.vehicleType = vehicleType;

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get vehicles
    const vehicles = await Vehicle.find(filter)
      .sort({ entryTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Vehicle.countDocuments(filter);

    res.json({
      vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      message: 'Server error while fetching vehicles',
      error: error.message
    });
  }
});

// @route   GET /api/vehicles/:id
// @desc    Get vehicle by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    res.json({
      vehicle
    });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({
      message: 'Server error while fetching vehicle',
      error: error.message
    });
  }
});

// @route   PUT /api/vehicles/:id/exit
// @desc    Mark vehicle as exited and calculate fee
// @access  Private
router.put('/:id/exit', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    if (vehicle.status === 'completed') {
      return res.status(400).json({
        message: 'Vehicle has already been marked as exited'
      });
    }

    // Complete parking and calculate fee
    await vehicle.completeParking();

    res.json({
      message: 'Vehicle exit recorded successfully',
      vehicle
    });
  } catch (error) {
    console.error('Vehicle exit error:', error);
    res.status(500).json({
      message: 'Server error while recording vehicle exit',
      error: error.message
    });
  }
});

// @route   DELETE /api/vehicles/:id
// @desc    Delete a vehicle (only for testing/admin use)
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({
      message: 'Server error while deleting vehicle',
      error: error.message
    });
  }
});

// @route   GET /api/vehicles/stats/summary
// @desc    Get vehicle statistics summary
// @access  Private
router.get('/stats/summary', async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const activeVehicles = await Vehicle.countDocuments({ status: 'active' });
    const completedVehicles = await Vehicle.countDocuments({ status: 'completed' });
    const paidVehicles = await Vehicle.countDocuments({ paymentStatus: 'paid' });
    const unpaidVehicles = await Vehicle.countDocuments({ paymentStatus: 'pending' });

    // Calculate total revenue
    const paidVehiclesData = await Vehicle.find({ paymentStatus: 'paid' });
    const totalRevenue = paidVehiclesData.reduce((sum, vehicle) => sum + vehicle.fee, 0);

    // Vehicle type breakdown
    const vehicleTypeStats = await Vehicle.aggregate([
      {
        $group: {
          _id: '$vehicleType',
          count: { $sum: 1 },
          avgFee: { $avg: '$fee' }
        }
      }
    ]);

    res.json({
      summary: {
        totalVehicles,
        activeVehicles,
        completedVehicles,
        paidVehicles,
        unpaidVehicles,
        totalRevenue
      },
      vehicleTypeStats
    });
  } catch (error) {
    console.error('Vehicle stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching vehicle statistics',
      error: error.message
    });
  }
});

module.exports = router;
