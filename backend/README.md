# Spring Boot Backend for SPMS

## Setup Instructions

### 1. MongoDB Setup
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
- Create a new cluster
- Create a database named `spms`
- Create a database user with username and password
- Get the connection string in format: `mongodb+srv://<username>:<password>@<cluster-url>/spms?retryWrites=true&w=majority`

### 2. Environment Variables
Create a `.env` file in this directory with:
```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/spms?retryWrites=true&w=majority
JWT_SECRET=myVerySecretJWTKey123456789
CORS_ORIGINS=http://localhost:3000
```

### 3. Build and Run
```bash
# Build the application
./gradlew build

# Run the application
./gradlew bootRun
```

### 4. API Endpoints

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user

#### Test Endpoints
- `GET /api/test/all` - Public access
- `GET /api/test/user` - Requires authentication

### 5. Test with curl

#### Sign Up
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "password123"
  }'
```

#### Sign In
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'
```

#### Protected Route (use JWT from signin response)
```bash
curl -X GET http://localhost:8080/api/test/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Project Structure
```
src/main/java/com/spms/
├── SpmsApplication.java           # Main application class
├── config/
│   └── WebSecurityConfig.java    # Security configuration with CORS
├── controller/
│   ├── AuthController.java       # Authentication endpoints
│   └── TestController.java       # Test endpoints
├── dto/
│   ├── SignUpRequest.java        # Sign up request DTO
│   ├── SignInRequest.java        # Sign in request DTO
│   ├── JwtResponse.java          # JWT response DTO
│   └── MessageResponse.java      # Generic message response
├── model/
│   └── User.java                 # User entity for MongoDB
├── repository/
│   └── UserRepository.java      # User data access layer
├── security/
│   ├── AuthEntryPointJwt.java    # JWT authentication entry point
│   ├── AuthTokenFilter.java     # JWT token filter
│   ├── JwtUtils.java            # JWT utility functions
│   ├── UserDetailsServiceImpl.java # User details service
│   └── UserPrincipal.java       # User principal for Spring Security
└── service/
    └── AuthService.java         # Authentication business logic
```