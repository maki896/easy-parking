const express = require('express');
const QRCode = require('qrcode');
const Vehicle = require('../models/Vehicle');
const { auth } = require('../middleware/auth');
const chapa = require('../utils/chapa');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   POST /api/payments/initialize/:vehicleId
// @desc    Initialize payment for a vehicle
// @access  Private
router.post('/initialize/:vehicleId', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    if (vehicle.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'Payment has already been completed for this vehicle'
      });
    }

    if (vehicle.status !== 'completed') {
      return res.status(400).json({
        message: 'Vehicle must be marked as exited before payment can be initialized'
      });
    }

    // Generate transaction reference
    const tx_ref = chapa.generateTxRef();

    // Initialize payment with Chapa
    const paymentData = {
      amount: chapa.formatAmount(vehicle.fee),
      email: `customer@easyparking.com`, // Default email since we don't collect customer email
      firstName: 'Easy Park',
      lastName: 'Customer',
      tx_ref: tx_ref,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      return_url: `${process.env.FRONTEND_URL}/payment/return`,
      customization: {
        title: 'Easy Park',
        description: `Parking fee for ${vehicle.plateNumber}`
      }
    };

    const chapaResponse = await chapa.initializePayment(paymentData);

    if (!chapaResponse.success) {
      return res.status(500).json({
        message: 'Failed to initialize payment',
        error: chapaResponse.error
      });
    }

    // Generate QR code from checkout URL
    const qrCodeDataUrl = await QRCode.toDataURL(chapaResponse.data.checkout_url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update vehicle with payment info
    vehicle.paymentReference = tx_ref;
    vehicle.paymentCheckoutUrl = chapaResponse.data.checkout_url;
    await vehicle.save();

    res.json({
      message: 'Payment initialized successfully',
      payment: {
        tx_ref: tx_ref,
        amount: vehicle.fee,
        checkout_url: chapaResponse.data.checkout_url,
        qr_code: qrCodeDataUrl
      },
      vehicle
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      message: 'Server error while initializing payment',
      error: error.message
    });
  }
});

// @route   POST /api/payments/verify/:tx_ref
// @desc    Verify payment status
// @access  Private
router.post('/verify/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // Find vehicle with this transaction reference
    const vehicle = await Vehicle.findOne({ paymentReference: tx_ref });
    
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found for this transaction'
      });
    }

    // Verify transaction with Chapa
    const verificationResponse = await chapa.verifyPayment(tx_ref);

    if (!verificationResponse.success) {
      return res.status(500).json({
        message: 'Failed to verify payment',
        error: verificationResponse.error
      });
    }

    const transactionData = verificationResponse.data;

    // Check if payment was successful
    if (transactionData.status === 'success') {
      // Update vehicle payment status
      vehicle.paymentStatus = 'paid';
      await vehicle.save();

      res.json({
        message: 'Payment verified successfully',
        status: 'paid',
        transaction: transactionData,
        vehicle
      });
    } else {
      res.json({
        message: 'Payment not completed',
        status: 'pending',
        transaction: transactionData,
        vehicle
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      message: 'Server error while verifying payment',
      error: error.message
    });
  }
});

// @route   GET /api/payments/vehicle/:vehicleId
// @desc    Get payment status for a vehicle
// @access  Private
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({
        message: 'Vehicle not found'
      });
    }

    const paymentInfo = {
      vehicleId: vehicle._id,
      plateNumber: vehicle.plateNumber,
      fee: vehicle.fee,
      paymentStatus: vehicle.paymentStatus,
      paymentReference: vehicle.paymentReference,
      paymentCheckoutUrl: vehicle.paymentCheckoutUrl
    };

    res.json({
      payment: paymentInfo
    });
  } catch (error) {
    console.error('Get payment info error:', error);
    res.status(500).json({
      message: 'Server error while fetching payment info',
      error: error.message
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 50, status } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.paymentStatus = status;

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get vehicles with payment info
    const vehicles = await Vehicle.find(filter)
      .select('plateNumber vehicleType entryTime exitTime durationInMinutes ratePerMinute fee paymentStatus paymentReference createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Vehicle.countDocuments(filter);

    res.json({
      payments: vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      message: 'Server error while fetching payment history',
      error: error.message
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Chapa webhook endpoint (redundant with main webhook in server.js)
// @access  Public
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const event = JSON.parse(req.body);
    console.log('Payment webhook received:', event);
    
    // Handle successful payment
    if (event.event === 'transaction.successful') {
      const tx_ref = event.data.tx_ref;
      
      // Find and update vehicle
      const vehicle = await Vehicle.findOne({ paymentReference: tx_ref });
      if (vehicle) {
        vehicle.paymentStatus = 'paid';
        await vehicle.save();
        console.log(`Payment verified for vehicle ${vehicle.plateNumber}`);
      }
    }
    
    res.status(200).json({received: true});
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({error: 'Invalid webhook payload'});
  }
});

module.exports = router;
