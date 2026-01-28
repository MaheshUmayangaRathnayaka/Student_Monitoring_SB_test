import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...'.yellow);
    console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^@]*@/, ':****@').blue);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      bufferCommands: false,
      maxPoolSize: 10,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'.red);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected'.green);
    });
    
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`.red.bold);
    
    // Provide helpful error messages based on error type
    if (error.message.includes('ENOTFOUND')) {
      console.error('DNS resolution failed. Check your internet connection and MongoDB cluster status.'.red);
      console.error('Possible solutions:'.yellow);
      console.error('1. Check if your MongoDB Atlas cluster is running'.yellow);
      console.error('2. Verify your connection string is correct'.yellow);
      console.error('3. Check your network/firewall settings'.yellow);
      console.error('4. Try using a different network connection'.yellow);
    }
    
    if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('not authorized')) {
      console.error('IP whitelist error detected!'.red.bold);
      console.error(`Your current IP address appears to be: 212.104.228.97`.yellow);
      console.error('Please whitelist this IP in your MongoDB Atlas cluster:'.yellow);
      console.error('1. Go to https://cloud.mongodb.com/'.yellow);
      console.error('2. Select your project and cluster'.yellow);
      console.error('3. Go to Security > Network Access'.yellow);
      console.error('4. Click "Add IP Address"'.yellow);
      console.error('5. Add your IP: 212.104.228.97'.yellow);
      console.error('6. Or temporarily allow access from anywhere: 0.0.0.0/0'.yellow);
    }
    
    // In development, don't exit the process to allow for easier debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Running in development mode - server will continue without database'.yellow);
      return;
    }
    
    process.exit(1);
  }
};

export default connectDB;
