@echo off
:: Daily Journal App - Windows Batch Start Script
:: Run this script to start the application on Windows

echo.
echo 🎯 Daily Journal App - Windows Quick Start
echo ==========================================

:: Check if Docker is running
echo 🔍 Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo 💡 Download Docker Desktop from: https://docs.docker.com/docker-for-windows/install/
    pause
    exit /b 1
)
echo ✅ Docker is running

:: Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    (
        echo NODE_ENV=development
        echo REACT_APP_API_BASE_URL=http://localhost:5000
        echo REACT_APP_MAX_VIDEO_SIZE=104857600
        echo REACT_APP_SUPPORTED_FORMATS=mp4,webm,avi,mov
    ) > .env
    echo ✅ Created .env file
)

echo 🐳 Starting Docker containers...

:: Stop any existing containers
docker-compose down >nul 2>&1

:: Build and start the application
echo 🔨 Building and starting application...
docker-compose up --build -d

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Application started successfully!
    echo.
    echo 📱 Access the application at:
    echo    🌐 Main App: http://localhost:3000
    echo    ❤️  Health Check: http://localhost:3000/health
    echo.
    echo 🔍 Useful commands:
    echo    View logs: docker-compose logs -f
    echo    Stop app:  docker-compose down
    echo.
    echo 🌐 Opening browser...
    start http://localhost:3000
    echo.
    echo Happy journaling! 📝✨
) else (
    echo ❌ Failed to start the application
    echo 💡 Try running: docker-compose logs
    pause
    exit /b 1
)

echo.
pause