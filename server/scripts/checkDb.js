const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('../models/Job');

dotenv.config();

async function checkDatabase() {
  try {
    // MongoDB connection string (using default if not set in .env)
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobportal';
    
    console.log('Connecting to MongoDB at:', mongoUri);
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB');
    
    // Check if jobs collection exists and get count
    const jobCount = await Job.countDocuments();
    console.log(\n📊 Jobs in database: ${jobCount});
    
    if (jobCount > 0) {
      console.log('\nSample job:');
      const sampleJob = await Job.findOne();
      console.log(JSON.stringify(sampleJob, null, 2));
    }
    
    // Check database stats
    const stats = await mongoose.connection.db.stats();
    console.log('\n📈 Database stats:', {
      'Database Name': stats.db,
      'Collections': stats.collections,
      'Data Size': ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB,
      'Storage Size': ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB
    });
    
  } catch (error) {
    console.error('\n❌ Error connecting to MongoDB:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔴 MongoDB might not be running. Please ensure MongoDB is running and try again.');
      console.log('   You can start MongoDB with: mongod --dbpath=/path/to/your/db');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the check
console.log('🔍 Checking MongoDB connection...\n');
checkDatabase();