import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...\n');
    
    // Check if connection string exists
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI not found in environment variables');
    }
    
    console.log('📋 Connection Details:');
    console.log(`   URI: ${process.env.MONGODB_URI.replace(/:[^@]*@/, ':****@')}`);
    console.log(`   Timeout: 10 seconds\n`);
    
    console.log('⏳ Attempting connection...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    
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
    console.error('❌ Connection test failed:');
    console.error(`   Error: ${error.message}\n`);
    
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
      console.log('   4. Add your IP: 212.104.228.97');
      console.log('   5. Or temporarily use 0.0.0.0/0 for all IPs\n');
    }
    
    console.log('📚 More help: https://www.mongodb.com/docs/atlas/troubleshoot-connection/');
    process.exit(1);
  }
};

testConnection();