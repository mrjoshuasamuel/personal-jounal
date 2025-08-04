# Daily Journal App - Windows PowerShell Start Script
# Run this script to start the application on Windows

Write-Host "🎯 Daily Journal App - Windows Quick Start" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if Docker is running
Write-Host "🔍 Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "💡 Download Docker Desktop from: https://docs.docker.com/docker-for-windows/install/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    
    $envContent = @"
NODE_ENV=development
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_MAX_VIDEO_SIZE=104857600
REACT_APP_SUPPORTED_FORMATS=mp4,webm,avi,mov
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Created .env file" -ForegroundColor Green
}

Write-Host "🐳 Starting Docker containers..." -ForegroundColor Yellow

# Stop any existing containers
docker-compose down 2>$null

# Build and start the application
Write-Host "🔨 Building and starting application..." -ForegroundColor Yellow
$result = docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Application started successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Access the application at:" -ForegroundColor Cyan
    Write-Host "   🌐 Main App: http://localhost:3000" -ForegroundColor White
    Write-Host "   ❤️  Health Check: http://localhost:3000/health" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 Useful commands:" -ForegroundColor Cyan
    Write-Host "   View logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "   Stop app:  docker-compose down" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Opening browser..." -ForegroundColor Yellow
    Start-Process "http://localhost:3000"
    Write-Host ""
    Write-Host "Happy journaling! 📝✨" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start the application" -ForegroundColor Red
    Write-Host "💡 Try running: docker-compose logs" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Read-Host "Press Enter to continue"