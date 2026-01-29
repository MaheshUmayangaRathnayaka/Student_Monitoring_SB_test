import fetch from 'node-fetch';

const testSignup = async () => {
  try {
    console.log('🧪 Testing user registration endpoint...\n');
    
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "testpassword123",
      role: "student",
      studentId: "ST001",
      phone: "+1234567890",
      grade: "A",
      semester: "1"
    };
    
    console.log('📤 Sending registration request...');
    console.log('Data:', JSON.stringify(userData, null, 2));
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.text();
    
    console.log(`\n📊 Response Status: ${response.status}`);
    console.log(`📊 Response Headers:`, response.headers.raw());
    console.log(`📊 Response Body:`, result);
    
    if (response.ok) {
      console.log('✅ Registration successful!');
    } else {
      console.log('❌ Registration failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
};

testSignup();