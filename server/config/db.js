import mongoose from 'mongoose';

// Shared options for mongoose connection
const baseOptions = {
  serverSelectionTimeoutMS: 10000, // 10 seconds timeout
  socketTimeoutMS: 45000, // 45 seconds socket timeout
  bufferCommands: false,
  maxPoolSize: 10,
};

const connectWithUri = async (uriLabel, uri) => {
  if (!uri) throw new Error(`${uriLabel} is not defined in environment variables`);

  console.log(`Attempting to connect to MongoDB using ${uriLabel}...`.yellow);
  console.log('Connection string:', uri.replace(/:[^@]*@/, ':****@').blue);

  const conn = await mongoose.connect(uri, baseOptions);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
  return conn;
};

const connectDB = async () => {
  try {
    // Primary attempt: SRV URI
    await connectWithUri('MONGODB_URI', process.env.MONGODB_URI);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`.red.bold);

    // DNS / SRV resolution guidance
    if (error.message.includes('ENOTFOUND')) {
      console.error('DNS resolution failed. Check your internet connection and MongoDB cluster status.'.red);
      console.error('Possible solutions:'.yellow);
      console.error('1. Check if your MongoDB Atlas cluster is running'.yellow);
      console.error('2. Verify your connection string is correct'.yellow);
      console.error('3. Check your network/firewall settings'.yellow);
      console.error('4. Try using a different network connection'.yellow);
    }

    // IP whitelist guidance
    if (error.message.includes('IP') || error.message.includes('whitelist') || error.message.includes('not authorized')) {
      console.error('IP whitelist error detected!'.red.bold);
      console.error('Please whitelist your current IP in MongoDB Atlas (Security > Network Access)'.yellow);
      console.error('Or temporarily allow access from anywhere: 0.0.0.0/0 (not recommended for production)'.yellow);
    }

    // Fallback: try non-SRV Standard connection string if provided
    const isSrv = (process.env.MONGODB_URI || '').startsWith('mongodb+srv://');
    const hasStandard = !!process.env.MONGODB_URI_STANDARD;
    if (isSrv && hasStandard) {
      try {
        console.log('Attempting fallback using MONGODB_URI_STANDARD (non-SRV)...'.yellow);
        await connectWithUri('MONGODB_URI_STANDARD', process.env.MONGODB_URI_STANDARD);
        return; // Connected via fallback
      } catch (fallbackErr) {
        console.error(`Fallback connection failed: ${fallbackErr.message}`.red.bold);
      }
    }

    // In development, don't exit the process to allow for easier debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('Running in development mode - server will continue without database'.yellow);
      return; // Return instead of throwing to allow server to start
    }

    // If not in development, exit after failure
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected'.red);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected'.green);
  });
};

export default connectDB;
