const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form (public)
// @access  Public
router.post('/', [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name cannot exceed 100 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
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

    const { name, email, message } = req.body;

    // Create new contact message
    const contact = new Contact({
      name,
      email,
      message,
      status: 'new'
    });

    await contact.save();

    res.status(201).json({
      message: 'Contact form submitted successfully',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        status: contact.status,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'Server error while submitting contact form',
      error: error.message
    });
  }
});

// @route   GET /api/contact
// @desc    Get all contact messages (admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;

    // Calculate skip for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get contact messages
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      message: 'Server error while fetching contact messages',
      error: error.message
    });
  }
});

// @route   GET /api/contact/:id
// @desc    Get contact message by ID (admin only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        message: 'Contact message not found'
      });
    }

    res.json({
      contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      message: 'Server error while fetching contact message',
      error: error.message
    });
  }
});

// @route   PUT /api/contact/:id/status
// @desc    Update contact message status (admin only)
// @access  Private
router.put('/:id/status', auth, [
  body('status')
    .isIn(['new', 'read', 'replied'])
    .withMessage('Status must be new, read, or replied')
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

    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        message: 'Contact message not found'
      });
    }

    res.json({
      message: 'Contact status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({
      message: 'Server error while updating contact status',
      error: error.message
    });
  }
});

// @route   DELETE /api/contact/:id
// @desc    Delete contact message (admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        message: 'Contact message not found'
      });
    }

    res.json({
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      message: 'Server error while deleting contact message',
      error: error.message
    });
  }
});

// @route   GET /api/contact/stats/summary
// @desc    Get contact statistics summary (admin only)
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });

    // Messages in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMessages = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      summary: {
        totalMessages,
        newMessages,
        readMessages,
        repliedMessages,
        recentMessages
      }
    });
  } catch (error) {
    console.error('Contact stats error:', error);
    res.status(500).json({
      message: 'Server error while fetching contact statistics',
      error: error.message
    });
  }
});

module.exports = router;
