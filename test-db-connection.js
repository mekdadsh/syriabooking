const mongoose = require('mongoose');

// Test MongoDB connection
const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGO URL:', process.env.MONGO ? 'Set' : 'Not set');
    
    if (!process.env.MONGO) {
      console.error('MONGO environment variable is not set!');
      return;
    }
    
    await mongoose.connect(process.env.MONGO + 'test?retryWrites=true&w=majority');
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test if we can access the hotels collection
    const Hotel = mongoose.model('Hotel', new mongoose.Schema({}, { strict: false }));
    const hotelCount = await Hotel.countDocuments();
    console.log(`📊 Found ${hotelCount} hotels in the database`);
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};

testConnection();
