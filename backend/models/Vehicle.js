const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    uppercase: true,
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Basic plate number validation (adjust as needed for Ethiopian plates)
        return /^[A-Z0-9]{3,10}$/.test(v);
      },
      message: 'Plate number must be 3-10 alphanumeric characters'
    }
  },
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Car', 'Motorcycle', 'Truck'],
    trim: true
  },
  color: {
    type: String,
    trim: true,
    maxlength: [30, 'Color cannot exceed 30 characters']
  },
  entryTime: {
    type: Date,
    default: Date.now,
    required: true
  },
  exitTime: {
    type: Date,
    default: null
  },
  durationInMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  ratePerMinute: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  paymentReference: {
    type: String,
    default: null
  },
  paymentCheckoutUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
vehicleSchema.index({ plateNumber: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ paymentStatus: 1 });
vehicleSchema.index({ entryTime: -1 });
vehicleSchema.index({ vehicleType: 1 });

// Method to calculate duration and fee
vehicleSchema.methods.calculateDurationAndFee = function() {
  const now = new Date();
  const exitTime = this.exitTime || now;
  
  // Calculate duration in minutes (rounded up)
  const durationMs = exitTime - this.entryTime;
  this.durationInMinutes = Math.ceil(durationMs / (1000 * 60));
  
  // Calculate fee
  this.fee = this.durationInMinutes * this.ratePerMinute;
  
  return {
    durationInMinutes: this.durationInMinutes,
    fee: this.fee
  };
};

// Method to complete vehicle parking
vehicleSchema.methods.completeParking = function() {
  this.exitTime = new Date();
  this.status = 'completed';
  this.calculateDurationAndFee();
  return this.save();
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
