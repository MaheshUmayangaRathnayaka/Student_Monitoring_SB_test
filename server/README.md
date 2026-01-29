# Student Performance Monitoring System - Backend API

A comprehensive RESTful API for monitoring student performance, built with Node.js, Express, and MongoDB.

## 📁 Project Structure (MVC Pattern)

```
server/
├── config/
│   └── db.js                 # Database connection configuration
├── controllers/
│   ├── studentController.js  # Student CRUD operations
│   ├── subjectController.js  # Subject CRUD operations
│   └── performanceController.js # Performance CRUD operations
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── validator.js         # Request validation
├── models/
│   ├── Student.js           # Student schema
│   ├── Subject.js           # Subject schema
│   └── Performance.js       # Performance schema
├── routes/
│   ├── studentRoutes.js     # Student API endpoints
│   ├── subjectRoutes.js     # Subject API endpoints
│   └── performanceRoutes.js # Performance API endpoints
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── server.js                 # Main entry point
```

## 🗄️ Database Schema

### Student Model
- `name`: String (required)
- `studentId`: String (required, unique)
- `grade`: String (required)
- `semester`: String (required)
- `subjects`: Array of Subject ObjectIds
- `email`: String (required, unique)
- `phone`: String

### Subject Model
- `name`: String (required)
- `code`: String (required, unique)
- `teacher`: String (required)
- `credits`: Number (1-10)
- `semester`: String (required)
- `description`: String

### Performance Model
- `student`: ObjectId (ref: Student)
- `subject`: ObjectId (ref: Subject)
- `marks.internal`: Number (0-50)
- `marks.finals`: Number (0-100)
- `marks.total`: Number (auto-calculated)
- `attendance.present`: Number
- `attendance.total`: Number
- `attendance.percentage`: Number (auto-calculated)
- `grade`: String (A+, A, B+, B, C+, C, D, F, I)
- `semester`: String
- `academicYear`: String

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Edit `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-performance-system
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Students

#### Get all students
```
GET /api/students
```

#### Get student by ID
```
GET /api/students/:id
```

#### Get student performance
```
GET /api/students/:id/performance
```

#### Create new student
```
POST /api/students
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

#### Update student
```
PUT /api/students/:id
Content-Type: application/json
```

#### Delete student
```
DELETE /api/students/:id
```

### Subjects

#### Get all subjects
```
GET /api/subjects
```

#### Get subject by ID
```
GET /api/subjects/:id
```

#### Get subject statistics
```
GET /api/subjects/:id/statistics
```

#### Create new subject
```
POST /api/subjects
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

#### Update subject
```
PUT /api/subjects/:id
```

#### Delete subject
```
DELETE /api/subjects/:id
```

### Performance

#### Get all performance records
```
GET /api/performance
Query Parameters:
- semester: Filter by semester
- academicYear: Filter by academic year
- student: Filter by student ID
- subject: Filter by subject ID
```

#### Get performance analytics
```
GET /api/performance/analytics/overview
Query Parameters:
- semester: Filter by semester
- academicYear: Filter by academic year
```

#### Get performance by ID
```
GET /api/performance/:id
```

#### Create performance record
```
POST /api/performance
Content-Type: application/json

{
  "student": "student_objectId",
  "subject": "subject_objectId",
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

#### Update performance record
```
PUT /api/performance/:id
```

#### Delete performance record
```
DELETE /api/performance/:id
```

## 🔐 Authentication

The API includes JWT authentication middleware. To protect routes, use the `protect` middleware:

```javascript
const { protect } = require('../middleware/auth');
router.post('/', protect, createStudent);
```

To authenticate requests, include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🛠️ Middleware

### Authentication (`auth.js`)
- `protect`: Validates JWT tokens
- `authorize`: Role-based access control
- `generateToken`: Creates JWT tokens

### Error Handling (`errorHandler.js`)
- Global error handler
- Mongoose error formatting
- Validation error formatting

### Validation (`validator.js`)
- Request validation using express-validator
- Field-level validation

## 📊 Features

### Auto-calculations
- Total marks = Internal + Finals
- Attendance percentage automatically calculated
- Grade auto-assigned based on marks percentage

### Data Integrity
- Unique constraints on student IDs and emails
- Cascade deletion of related records
- Referential integrity with ObjectId references

### Analytics
- Subject-wise statistics
- Overall performance analytics
- Grade distribution
- Pass rate calculations
- At-risk student identification

## 🔧 Technologies Used

- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment configuration
- **colors**: Console output styling

## 📝 Notes

- Make sure MongoDB is running before starting the server
- Change JWT_SECRET in production
- Use proper MongoDB Atlas URI for production
- The server includes automatic error logging and graceful shutdown

## 🧩 MongoDB Connection & Troubleshooting

This server reads connection strings from `.env`:

- `MONGODB_URI`: SRV connection string (`mongodb+srv://...`) copied from Atlas (Drivers).
- `MONGODB_URI_STANDARD` (optional): Non-SRV standard string (`mongodb://host1,host2,...`) copied from Atlas (Standard). If SRV DNS fails, the server will automatically attempt this fallback.

### Common Errors

- `MongoDB connection error: querySrv ENOTFOUND _mongodb._tcp.<cluster>`
  - Flush DNS: `ipconfig /flushdns`
  - Check internet/VPN/proxy/firewall
  - Ensure Atlas cluster is running
  - Add `MONGODB_URI_STANDARD` to `.env` and retry

- `IP not authorized` / whitelist issues
  - In Atlas: Security > Network Access > Add Current IP
  - For testing only, temporarily allow `0.0.0.0/0` (not for production)

### Test the Connection

Run the built-in script:

```bash
cd server
node scripts/test-connection.js
```

See `.env.example` for sample values and guidance.

## 🔜 Next Steps

Phase 3 will include:
- Frontend integration
- User authentication system
- Real-time dashboards
- Data visualization
- Export functionality
