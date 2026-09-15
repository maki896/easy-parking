const mongoose = require('mongoose');

const parkingCapacitySchema = new mongoose.Schema({
  totalCapacity: {
    type: Number,
    required: [true, 'Total capacity is required'],
    min: [1, 'Total capacity must be at least 1'],
    default: 100
  },
  currentOccupied: {
    type: Number,
    default: 0,
    min: [0, 'Current occupied cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.totalCapacity;
      },
      message: 'Current occupied cannot exceed total capacity'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Virtual field for available slots
parkingCapacitySchema.virtual('availableSlots').get(function() {
  return Math.max(0, this.totalCapacity - this.currentOccupied);
});

// Virtual field for occupancy percentage
parkingCapacitySchema.virtual('occupancyPercentage').get(function() {
  if (this.totalCapacity === 0) return 0;
  return Math.round((this.currentOccupied / this.totalCapacity) * 100);
});

// Ensure virtuals are included in JSON
parkingCapacitySchema.set('toJSON', { virtuals: true });
parkingCapacitySchema.set('toObject', { virtuals: true });

// Static method to get or create the singleton instance
parkingCapacitySchema.statics.getInstance = async function() {
  let capacity = await this.findOne({});
  
  if (!capacity) {
    // Create default capacity if none exists
    capacity = new this({
      totalCapacity: 100,
      currentOccupied: 0
    });
    await capacity.save();
    console.log('✅ Default parking capacity initialized (100 slots)');
  }
  
  return capacity;
};

// Method to check if parking can accept a vehicle
parkingCapacitySchema.methods.canAcceptVehicle = function() {
  return this.currentOccupied < this.totalCapacity;
};

// Method to increment occupied count
parkingCapacitySchema.methods.incrementOccupied = async function() {
  if (this.currentOccupied >= this.totalCapacity) {
    throw new Error('Parking lot is full');
  }
  
  this.currentOccupied += 1;
  this.lastUpdated = new Date();
  return await this.save();
};

// Method to decrement occupied count
parkingCapacitySchema.methods.decrementOccupied = async function() {
  if (this.currentOccupied <= 0) {
    console.warn('⚠️ Attempted to decrement occupied count below 0');
    this.currentOccupied = 0;
  } else {
    this.currentOccupied -= 1;
  }
  
  this.lastUpdated = new Date();
  return await this.save();
};

// Method to synchronize with actual vehicle count
parkingCapacitySchema.methods.synchronizeWithVehicles = async function() {
  const Vehicle = mongoose.model('Vehicle');
  const actualCount = await Vehicle.countDocuments({ status: 'active' });
  
  const oldCount = this.currentOccupied;
  this.currentOccupied = actualCount;
  this.lastUpdated = new Date();
  
  if (oldCount !== actualCount) {
    console.log(`🔄 Synchronized parking capacity: ${oldCount} → ${actualCount}`);
  }
  
  return await this.save();
};

// Method to update total capacity
parkingCapacitySchema.methods.updateTotalCapacity = async function(newTotal, userId = null) {
  if (newTotal < this.currentOccupied) {
    throw new Error(`Cannot set total capacity to ${newTotal} when ${this.currentOccupied} vehicles are currently parked`);
  }
  
  this.totalCapacity = newTotal;
  this.updatedBy = userId;
  this.lastUpdated = new Date();
  
  return await this.save();
};

module.exports = mongoose.model('ParkingCapacity', parkingCapacitySchema);
