# Quick Start Guide - Student Performance System

## Prerequisites Check
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed or MongoDB Atlas account
- [ ] Terminal/Command Prompt

## Step 1: Install Dependencies

Navigate to the server folder:
```bash
cd server
npm install
```

## Step 2: Configure Environment

The `.env` file is already created. Update if needed:

```env
# Default Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-performance-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### MongoDB Options:

**Option 1: Local MongoDB**
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

**Option 2: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-performance-system
```

## Step 3: Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

## Step 4: Test the API

### Using Browser
Visit: `http://localhost:5000`

You should see:
```json
{
  "success": true,
  "message": "Student Performance Monitoring System API",
  "version": "1.0.0",
  "endpoints": {
    "students": "/api/students",
    "subjects": "/api/subjects",
    "performance": "/api/performance"
  }
}
```

### Using Postman/Thunder Client

#### Create a Student
```http
POST http://localhost:5000/api/students
Content-Type: application/json

{
  "name": "John Doe",
  "studentId": "STU001",
  "grade": "A",
  "semester": "Fall 2024",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

#### Create a Subject
```http
POST http://localhost:5000/api/subjects
Content-Type: application/json

{
  "name": "Data Structures",
  "code": "CS201",
  "teacher": "Dr. Smith",
  "credits": 4,
  "semester": "Fall 2024",
  "description": "Introduction to data structures"
}
```

#### Create Performance Record
```http
POST http://localhost:5000/api/performance
Content-Type: application/json

{
  "student": "<student_id_from_previous_response>",
  "subject": "<subject_id_from_previous_response>",
  "marks": {
    "internal": 45,
    "finals": 85
  },
  "attendance": {
    "present": 40,
    "total": 45
  },
  "semester": "Fall 2024",
  "academicYear": "2024-2025"
}
```

## Common Commands

```bash
# Install new package
npm install package-name

# Check server status
# Server should be running on http://localhost:5000

# View logs
# Watch the terminal where server is running

# Stop server
# Press Ctrl+C in the terminal
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
mongod
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in .env file or kill the process using port 5000

### Missing Environment Variables
```
Error: JWT_SECRET is not defined
```
**Solution**: Check .env file exists and is properly configured

## API Endpoints Summary

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject
- `GET /api/subjects/:id` - Get subject by ID
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Performance
- `GET /api/performance` - Get all performance records
- `POST /api/performance` - Create performance record
- `GET /api/performance/:id` - Get performance by ID
- `PUT /api/performance/:id` - Update performance
- `DELETE /api/performance/:id` - Delete performance

## Next Steps

1. ✅ Backend is ready
2. 🔜 Build React frontend (Phase 3)
3. 🔜 Implement authentication
4. 🔜 Create dashboards and visualizations

## Need Help?

- Check [server/README.md](server/README.md) for detailed documentation
- Check [PHASE2_SUMMARY.md](PHASE2_SUMMARY.md) for implementation details
- Review error messages in the terminal
