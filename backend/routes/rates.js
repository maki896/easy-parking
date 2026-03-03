const express = require('express');
const { body, validationResult } = require('express-validator');
const Rate = require('../models/Rate');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/rates
// @desc    Get all rates
// @access  Private
router.get('/', async (req, res) => {
  try {
    const rates = await Rate.find({}).sort({ vehicleType: 1 });
    
    res.json({
      rates
    });
  } catch (error) {
    console.error('Get rates error:', error);
    res.status(500).json({
      message: 'Server error while fetching rates',
      error: error.message
    });
  }
});

// @route   GET /api/rates/:vehicleType
// @desc    Get rate for specific vehicle type
// @access  Private
router.get('/:vehicleType', async (req, res) => {
  try {
    const { vehicleType } = req.params;

    // Validate vehicle type
    if (!['Car', 'Motorcycle', 'Truck'].includes(vehicleType)) {
      return res.status(400).json({
        message: 'Invalid vehicle type. Must be Car, Motorcycle, or Truck'
      });
    }

    const rate = await Rate.findOne({ vehicleType });
    
    if (!rate) {
      return res.status(404).json({
        message: 'Rate not found for this vehicle type'
      });
    }

    res.json({
      rate
    });
  } catch (error) {
    console.error('Get rate error:', error);
    res.status(500).json({
      message: 'Server error while fetching rate',
      error: error.message
    });
  }
});

// @route   PUT /api/rates/:vehicleType
// @desc    Update rate for specific vehicle type
// @access  Private
router.put('/:vehicleType', [
  body('ratePerMinute')
    .isFloat({ min: 0 })
    .withMessage('Rate per minute must be a non-negative number')
    .custom((value) => {
      if (value < 0 || value > 9999) {
        throw new Error('Rate per minute must be between 0 and 9999');
      }
      return true;
    })
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

    const { vehicleType } = req.params;
    const { ratePerMinute } = req.body;

    // Validate vehicle type
    if (!['Car', 'Motorcycle', 'Truck'].includes(vehicleType)) {
      return res.status(400).json({
        message: 'Invalid vehicle type. Must be Car, Motorcycle, or Truck'
      });
    }

    // Update or create rate
    const rate = await Rate.findOneAndUpdate(
      { vehicleType },
      { ratePerMinute: parseFloat(ratePerMinute) },
      { 
        new: true, 
        upsert: true, 
        runValidators: true,
        setDefaultsOnInsert: true 
      }
    );

    res.json({
      message: 'Rate updated successfully',
      rate
    });
  } catch (error) {
    console.error('Update rate error:', error);
    res.status(500).json({
      message: 'Server error while updating rate',
      error: error.message
    });
  }
});

// @route   POST /api/rates/initialize
// @desc    Initialize default rates
// @access  Private
router.post('/initialize', async (req, res) => {
  try {
    const rates = await Rate.setDefaultRates();
    
    res.json({
      message: 'Default rates initialized successfully',
      rates
    });
  } catch (error) {
    console.error('Initialize rates error:', error);
    res.status(500).json({
      message: 'Server error while initializing rates',
      error: error.message
    });
  }
});

// @route   GET /api/rates/check
// @desc    Check if rates are initialized
// @access  Private
router.get('/check/initialized', async (req, res) => {
  try {
    const rateCount = await Rate.countDocuments();
    const isInitialized = rateCount === 3; // Car, Motorcycle, Truck
    
    if (!isInitialized) {
      return res.json({
        initialized: false,
        message: 'Rates need to be initialized',
        currentCount: rateCount
      });
    }

    const rates = await Rate.getAllRates();
    
    res.json({
      initialized: true,
      rates
    });
  } catch (error) {
    console.error('Check rates error:', error);
    res.status(500).json({
      message: 'Server error while checking rates',
      error: error.message
    });
  }
});

// @route   POST /api/rates/bulk
// @desc    Update multiple rates at once
// @access  Private
router.post('/bulk', [
  body('rates')
    .isArray({ min: 1, max: 3 })
    .withMessage('Rates must be an array with 1-3 items'),
  body('rates.*.vehicleType')
    .isIn(['Car', 'Motorcycle', 'Truck'])
    .withMessage('Vehicle type must be Car, Motorcycle, or Truck'),
  body('rates.*.ratePerMinute')
    .isFloat({ min: 0 })
    .withMessage('Rate per minute must be a non-negative number')
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

    const { rates } = req.body;

    // Update each rate
    const updatePromises = rates.map(rateData => 
      Rate.findOneAndUpdate(
        { vehicleType: rateData.vehicleType },
        { ratePerMinute: parseFloat(rateData.ratePerMinute) },
        { 
          new: true, 
          upsert: true, 
          runValidators: true 
        }
      )
    );

    const updatedRates = await Promise.all(updatePromises);

    res.json({
      message: 'Rates updated successfully',
      rates: updatedRates
    });
  } catch (error) {
    console.error('Bulk update rates error:', error);
    res.status(500).json({
      message: 'Server error while updating rates',
      error: error.message
    });
  }
});

module.exports = router;
