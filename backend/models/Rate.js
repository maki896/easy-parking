const mongoose = require('mongoose');

const rateSchema = new mongoose.Schema({
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: ['Car', 'Motorcycle', 'Truck'],
    unique: true,
    trim: true
  },
  ratePerMinute: {
    type: Number,
    required: [true, 'Rate per minute is required'],
    min: [0, 'Rate must be non-negative'],
    default: 0
  }
}, {
  timestamps: true
});

// Static method to get rate for vehicle type
rateSchema.statics.getRate = async function(vehicleType) {
  const rate = await this.findOne({ vehicleType });
  return rate ? rate.ratePerMinute : null;
};

// Static method to get all rates
rateSchema.statics.getAllRates = async function() {
  const rates = await this.find({});
  const rateMap = {};
  rates.forEach(rate => {
    rateMap[rate.vehicleType] = rate.ratePerMinute;
  });
  return rateMap;
};

// Static method to set default rates
rateSchema.statics.setDefaultRates = async function() {
  const defaultRates = [
    { vehicleType: 'Car', ratePerMinute: 1 },
    { vehicleType: 'Motorcycle', ratePerMinute: 0.5 },
    { vehicleType: 'Truck', ratePerMinute: 1.5 }
  ];
  
  for (const rateData of defaultRates) {
    await this.findOneAndUpdate(
      { vehicleType: rateData.vehicleType },
      rateData,
      { upsert: true, new: true }
    );
  }
  
  return this.getAllRates();
};

module.exports = mongoose.model('Rate', rateSchema);
