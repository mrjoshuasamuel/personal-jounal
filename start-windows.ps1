# Daily Journal App - Windows Setup Helper
# This script helps create the folder structure for the project

Write-Host "🏗️  Daily Journal App - Windows Setup Helper" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (!(Test-Path "package.json")) {
    Write-Host "📁 Creating project folder structure..." -ForegroundColor Yellow
    
    # Create main directories
    $directories = @(
        "src",
        "src\components",
        "src\components\auth",
        "src\components\video", 
        "src\components\dashboard",
        "src\components\common",
        "src\hooks",
        "src\services",
        "src\utils",
        "src\styles",
        "public",
        "docs",
        "docs\modules",
        "docs\deployment"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "✅ Created: $dir" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "📝 Folder structure created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy all artifact files to their respective locations" -ForegroundColor White
    Write-Host "2. Use WINDOWS_FILE_CHECKLIST.txt to verify all files are in place" -ForegroundColor White
    Write-Host "3. Run start-local.bat to start the application" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✅ Package.json found - project already set up!" -ForegroundColor Green
}

# Check Docker
Write-Host "🔍 Checking Docker installation..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "💡 Download from: https://docs.docker.com/docker-for-windows/install/" -ForegroundColor Yellow
}

# Check if Docker is running
Write-Host "🔍 Checking if Docker is running..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker is installed but not running." -ForegroundColor Yellow
    Write-Host "💡 Please start Docker Desktop and try again." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎯 Setup Status Summary:" -ForegroundColor Cyan
Write-Host "- Folder structure: ✅ Created" -ForegroundColor Green
Write-Host "- Docker installation: $(if (Get-Command docker -ErrorAction SilentlyContinue) { '✅ Found' } else { '❌ Not found' })" -ForegroundColor $(if (Get-Command docker -ErrorAction SilentlyContinue) { 'Green' } else { 'Red' })
Write-Host "- Docker running: $(try { docker info | Out-Null; '✅ Running' } catch { '❌ Not running' })" -ForegroundColor $(try { docker info | Out-Null; 'Green' } catch { 'Red' })

Write-Host ""
Write-Host "📖 For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "- WINDOWS_QUICK_START.md (5-minute setup guide)" -ForegroundColor White
Write-Host "- WINDOWS_SETUP.md (comprehensive guide)" -ForegroundColor White
Write-Host "- WINDOWS_FILE_CHECKLIST.txt (file creation checklist)" -ForegroundColor White

Read-Host "`nPress Enter to continue"