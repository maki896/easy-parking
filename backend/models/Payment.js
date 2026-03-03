const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  tx_ref: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'ETB',
    enum: ['ETB']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['chapa', 'cash', 'other'],
    default: 'chapa'
  },
  checkoutUrl: {
    type: String,
    default: null
  },
  chapaData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  failedReason: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentSchema.index({ vehicle: 1 });
paymentSchema.index({ tx_ref: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Static method to create payment
paymentSchema.statics.createPayment = async function(vehicleId, amount, tx_ref) {
  const payment = new this({
    vehicle: vehicleId,
    amount,
    tx_ref
  });
  
  return await payment.save();
};

// Static method to find payment by transaction reference
paymentSchema.statics.findByTxRef = async function(tx_ref) {
  return await this.findOne({ tx_ref }).populate('vehicle');
};

// Method to mark payment as completed
paymentSchema.methods.markAsCompleted = function(chapaData = null) {
  this.status = 'completed';
  this.verifiedAt = new Date();
  if (chapaData) {
    this.chapaData = chapaData;
  }
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failedReason = reason;
  return this.save();
};

module.exports = mongoose.model('Payment', paymentSchema);
