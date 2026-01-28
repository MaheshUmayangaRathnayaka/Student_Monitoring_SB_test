@echo off
echo Setting up SPMS Backend Environment...

REM Set default environment variables if not already set
if "%MONGODB_URI%"=="" set MONGODB_URI=mongodb://localhost:27017/spms
if "%JWT_SECRET%"=="" set JWT_SECRET=myVerySecretJWTKey123456789AbCdEfGhIjKlMnOpQrStUvWxYz
if "%CORS_ORIGINS%"=="" set CORS_ORIGINS=http://localhost:3000

echo MONGODB_URI=%MONGODB_URI%
echo JWT_SECRET is set
echo CORS_ORIGINS=%CORS_ORIGINS%

echo.
echo Starting Spring Boot Application...
.\gradle-8.5\bin\gradle.bat bootRun