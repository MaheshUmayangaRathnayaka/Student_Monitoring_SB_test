import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const baseOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
};

const connectWithUri = async (label, uri) => {
  if (!uri) throw new Error(`${label} not found in environment variables`);
  console.log(`⏳ Attempting connection using ${label}...`);
  console.log(`   URI: ${uri.replace(/:[^@]*@/, ':****@')}`);
  const conn = await mongoose.connect(uri, baseOptions);
  return conn;
};

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...\n');

    // Primary attempt with SRV URI
    let conn = await connectWithUri('MONGODB_URI', process.env.MONGODB_URI);

    console.log('✅ MongoDB connection successful!');
    console.log(`   Connected to: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}\n`);

    // Test basic operations
    console.log('🧪 Testing basic database operations...');
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`   Found ${collections.length} collections`);

    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Primary connection test failed:');
    console.error(`   Error: ${error.message}\n`);

    // Attempt fallback with non-SRV standard URI if available
    const isSrv = (process.env.MONGODB_URI || '').startsWith('mongodb+srv://');
    const hasStandard = !!process.env.MONGODB_URI_STANDARD;
    if (isSrv && hasStandard) {
      try {
        console.log('🔁 Trying fallback with MONGODB_URI_STANDARD (non-SRV)...');
        const conn = await connectWithUri('MONGODB_URI_STANDARD', process.env.MONGODB_URI_STANDARD);
        console.log('✅ Fallback connection successful!');
        console.log(`   Connected to: ${conn.connection.host}`);
        await mongoose.disconnect();
        process.exit(0);
      } catch (fallbackErr) {
        console.error('❌ Fallback connection failed:');
        console.error(`   Error: ${fallbackErr.message}\n`);
      }
    }

    if (error.message.includes('ENOTFOUND')) {
      console.log('🔧 DNS Resolution Issue - Possible Solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify MongoDB Atlas cluster is running');
      console.log('   3. Try a different network/VPN');
      console.log('   4. Check firewall settings\n');
    }

    if (error.message.includes('IP') || error.message.includes('not authorized')) {
      console.log('🔧 IP Whitelist Issue - Follow these steps:');
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Select your project > Security > Network Access');
      console.log('   3. Click "Add IP Address"');
      console.log('   4. Add your current IP or temporarily 0.0.0.0/0');
      console.log('   5. Retry the connection\n');
    }

    console.log('📚 More help: https://www.mongodb.com/docs/atlas/troubleshoot-connection/');
    process.exit(1);
  }
};

testConnection();