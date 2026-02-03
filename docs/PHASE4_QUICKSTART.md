# 🚀 Phase 4 Quick Start Guide

## Prerequisites
- MongoDB running
- Phase 3 application installed
- Node.js & npm installed

## Installation Steps

### 1. Install New Dependencies

```bash
# Navigate to server
cd server

# Install new packages
npm install bcryptjs express-async-handler express-validator jsonwebtoken

# Navigate to client (no new dependencies needed)
cd ../client
```

### 2. Update Environment Variables

**server/.env** - Add JWT configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_performance
JWT_SECRET=your_secret_jwt_key_change_this_in_production_minimum_32_chars
JWT_EXPIRE=7d
```

### 3. Start the Application

```bash
# Terminal 1 - Backend
cd server
npm run dev
# Server running on http://localhost:5000

# Terminal 2 - Frontend  
cd client
npm run dev
# Frontend running on http://localhost:5173
```

## Testing Phase 4 Features

### Step 1: Create Demo Users

**Create a Teacher Account**:
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Demo Teacher",
  "email": "teacher@demo.com",
  "password": "password123",
  "role": "teacher",
  "phone": "1234567890"
}
```

**Create a Student Account**:
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Demo Student",
  "email": "student@demo.com",
  "password": "password123",
  "role": "student",
  "studentId": "STU2026001",
  "grade": "12",
  "semester": "2",
  "phone": "0987654321"
}
```

### Step 2: Login as Teacher

1. Go to http://localhost:5173/login
2. Email: `teacher@demo.com`
3. Password: `password123`
4. Should redirect to Teacher Dashboard
5. Can view all students and at-risk alerts

### Step 3: Test RBAC

**As Teacher** - Try these features:
- View all students → ✅ Should work
- Edit student marks → ✅ Should work
- View at-risk students → ✅ Should work
- Create new students → ✅ Should work

### Step 4: Login as Student

1. Logout from teacher account
2. Login with: `student@demo.com` / `password123`
3. Should redirect to Student Dashboard
4. Can only view own data (read-only)

**As Student** - Try these features:
- View own performance → ✅ Should work
- View personal alerts → ✅ Should work
- View radar chart → ✅ Should work (if performance data exists)
- Edit marks → ❌ Should be disabled/hidden

### Step 5: Test Radar Chart

1. First, create some performance data:
```http
POST http://localhost:5000/api/subjects
Authorization: Bearer {teacher_token}
Content-Type: application/json

{
  "name": "Mathematics",
  "code": "MATH101",
  "teacher": "Mr. Smith",
  "credits": 4
}
```

2. Create performance record:
```http
POST http://localhost:5000/api/performance
Authorization: Bearer {teacher_token}
Content-Type: application/json

{
  "student": "{student_id}",
  "subject": "{subject_id}",
  "marks": {
    "internal": 35,
    "external": 50
  },
  "attendance": {
    "attended": 85,
    "total": 100
  }
}
```

3. View radar chart in analytics page
4. Should show purple marks overlay and green attendance overlay

### Step 6: Test Alert System

1. Create low-performing data to trigger alerts:
```http
POST http://localhost:5000/api/performance
Content-Type: application/json

{
  "student": "{student_id}",
  "subject": "{subject_id}",
  "marks": {
    "internal": 10,
    "external": 20  // Total: 30% - triggers critical alert
  },
  "attendance": {
    "attended": 60,  // 60% - triggers critical alert
    "total": 100
  }
}
```

2. Login as teacher → Navigate to Alerts → Should see student in "Critical" section
3. Login as student → Navigate to Alerts → Should see personalized alerts with recommendations

## API Testing with Postman/Thunder Client

### Authentication Endpoints

**Register User**:
```
POST http://localhost:5000/api/auth/register
Body: JSON (see Step 1 above)
```

**Login**:
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "teacher@demo.com",
  "password": "password123"
}

Response:
{
  "_id": "...",
  "name": "Demo Teacher",
  "email": "teacher@demo.com",
  "role": "teacher",
  "token": "jwt_token_here"
}
```

**Get Current User**:
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer {token}
```

### Alert Endpoints

**Get At-Risk Students (Teacher/Admin only)**:
```
GET http://localhost:5000/api/alerts/at-risk
Authorization: Bearer {teacher_token}
```

**Get My Alerts (Student only)**:
```
GET http://localhost:5000/api/alerts/my-alerts
Authorization: Bearer {student_token}
```

**Get Alert Thresholds**:
```
GET http://localhost:5000/api/alerts/thresholds
Authorization: Bearer {token}
```

### Analytics Endpoints

**Get Subject Performance (Radar Chart Data)**:
```
GET http://localhost:5000/api/analytics/subject-performance/{studentId}
Authorization: Bearer {token}
```

**Get My Performance (Student)**:
```
GET http://localhost:5000/api/analytics/my-performance
Authorization: Bearer {student_token}
```

**Get Class Analytics (Teacher/Admin)**:
```
GET http://localhost:5000/api/analytics/class-analytics
Authorization: Bearer {teacher_token}
```

## Troubleshooting

### Issue: "Token is not defined" error
**Solution**: Make sure JWT_SECRET is set in server/.env

### Issue: "Cannot read property 'role' of null"
**Solution**: User model might not be populated correctly. Check MongoDB connection and User schema.

### Issue: Radar chart not showing
**Solution**: 
1. Ensure performance records exist for the student
2. Check if data is being fetched from `/api/analytics/subject-performance`
3. Verify Recharts is installed: `npm install recharts`

### Issue: Alerts not appearing
**Solution**:
1. Create performance data below thresholds (< 40% marks or < 75% attendance)
2. Check API response at `/api/alerts/my-alerts` or `/api/alerts/at-risk`
3. Verify user role permissions

### Issue: 403 Forbidden on API calls
**Solution**:
1. Check if correct role is accessing the endpoint
2. Verify JWT token is valid and not expired
3. Check authorization header format: `Bearer {token}`

## Feature Demo Checklist

For exhibition/presentation:

- [ ] Show teacher login → Full dashboard access
- [ ] Show student login → Limited read-only access
- [ ] Demonstrate RBAC: Student tries to edit → Gets blocked
- [ ] Show radar chart with at least 5 subjects
- [ ] Show alert system with critical/warning alerts
- [ ] Demonstrate at-risk student list (teacher view)
- [ ] Show student getting personalized recommendations
- [ ] Highlight color-coded alerts (red/orange)
- [ ] Show strengths vs weaknesses analysis
- [ ] Display real-time metrics and thresholds

## Quick Data Setup for Demo

Run this script to create comprehensive demo data:

```javascript
// Create 3 subjects
POST /api/subjects (3 times with different data)

// Create 3 students  
POST /api/auth/register (3 times with role: "student")

// Create performance records
// Student 1: Excellent (90% avg) - No alerts
// Student 2: Average (60% avg) - Warning alerts
// Student 3: Poor (30% avg) - Critical alerts

// Now you have:
// - 1 teacher account
// - 3 student accounts (various performance levels)
// - 9 performance records (3 students × 3 subjects)
// - Multiple alerts at different levels
// - Radar charts with data
```

## Success Indicators

✅ Teacher can view all students and edit marks  
✅ Student can only view their own data (read-only)  
✅ Radar chart displays with dual overlays  
✅ Alerts show with proper color coding  
✅ At-risk students appear in teacher view  
✅ Personal recommendations appear in student view  
✅ JWT authentication works correctly  
✅ Role-based redirects work after login  

## What's Next?

Phase 4 is complete! Optional enhancements:
1. Create dedicated Student/Teacher dashboard pages
2. Add real-time notifications
3. Implement email alerts
4. Add bulk data import
5. Create mobile-responsive improvements

---

**Phase 4 is fully functional and ready for demonstration!** 🎉

For detailed documentation, see:
- **PHASE4_SUMMARY.md** - Complete implementation details
- **COMPLETE_GUIDE.md** - Full project documentation
- **API endpoints** - Test with Postman/Thunder Client
