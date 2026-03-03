const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Direct MongoDB connection without models
async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easyparking');
    console.log('✅ Connected to MongoDB');

    // Create admin user directly in MongoDB
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('🔑 Username: admin');
      console.log('🔑 Password: admin123');
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create admin user
      const result = await usersCollection.insertOne({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('🔑 Username: admin');
      console.log('🔑 Password: admin123');
      console.log('🆔 Admin ID:', result.insertedId);
    }

    // Initialize default rates
    const ratesCollection = db.collection('rates');
    const existingRates = await ratesCollection.findOne();
    
    if (!existingRates) {
      await ratesCollection.insertMany([
        { vehicleType: 'Car', ratePerMinute: 1, createdAt: new Date(), updatedAt: new Date() },
        { vehicleType: 'Motorcycle', ratePerMinute: 0.5, createdAt: new Date(), updatedAt: new Date() },
        { vehicleType: 'Truck', ratePerMinute: 1.5, createdAt: new Date(), updatedAt: new Date() }
      ]);
      console.log('✅ Default rates initialized');
    }

    console.log('🎉 Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
