# 🚀 Getting Started with Daily Journal App

This guide will help you get the Daily Journal application running in just a few minutes!

## ✅ Prerequisites Checklist

Before starting, make sure you have:

- [ ] **Docker** installed and running ([Download Docker](https://docs.docker.com/get-docker/))
- [ ] **Docker Compose** available ([Installation Guide](https://docs.docker.com/compose/install/))
- [ ] **Git** for cloning the repository ([Download Git](https://git-scm.com/downloads))
- [ ] A **modern browser** (Chrome, Firefox, or Edge recommended)
- [ ] **Camera and microphone** permissions for recording features

## 🎯 Quick Start (5 minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/mrjoshuasamuel/personal-jounal.git
cd personal-jounal
```

### Step 2: Start the Application
```bash
# Make the run script executable (Linux/macOS)
chmod +x run.sh

# Start the application
./run.sh start

# Or use Docker Compose directly
docker-compose up --build
```

### Step 3: Access the Application
Open your browser and go to:
- **Main Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Step 4: Create Your First Entry
1. **Sign up** with any email and password (6+ characters)
2. **Allow camera permissions** when prompted
3. **Record your first journal entry** or upload a video
4. **View AI-generated insights** about your entry

## 🛠️ Alternative Setup Methods

### Option A: Development Mode (with hot reload)
```bash
# Start development environment
./run.sh dev

# Access at http://localhost:3001 (with hot reload)
```

### Option B: Local Development (without Docker)
```bash
# Prerequisites: Node.js 16+
npm install
npm start

# Access at http://localhost:3000
```

## 🔧 Common Commands

```bash
# Check application status
./run.sh status

# View application logs
./run.sh logs

# Stop the application
./run.sh stop

# Clean up Docker resources
./run.sh clean

# Show help
./run.sh help
```

## 🎥 Demo Workflow

Try this workflow to explore all features:

1. **Authentication**
   - Sign up with: `demo@example.com` / `password123`
   - Explore the clean, modern interface

2. **Record a Video Entry**
   - Click "Record Entry" tab
   - Allow camera permissions
   - Record a 30-second reflection about your day
   - Save the entry

3. **Upload a Video**
   - Click "Upload Video" tab
   - Drag and drop a video file (or browse)
   - Preview and save the entry

4. **View Your Entries**
   - Click "My Entries" tab
   - Click on any entry to open the video player
   - Explore the AI-generated summary with mood analysis

5. **Dashboard Analytics**
   - View your journaling statistics
   - Check your streak and mood trends
   - Monitor your personal growth journey

## 🌐 Browser Compatibility

### ✅ Fully Supported
- **Chrome 80+** (Recommended - best recording quality)
- **Firefox 75+** (Full feature support)
- **Edge 80+** (Windows integration)

### ⚠️ Limited Support
- **Safari 14+** (iOS camera restrictions may apply)
- **Mobile browsers** (recording features may be limited)

## 🔐 First-Time Setup Tips

### Camera and Microphone Permissions
- **Chrome**: Click the camera icon in the address bar
- **Firefox**: Click the shield icon and allow permissions
- **Safari**: Go to Settings > Websites > Camera/Microphone

### Secure Connection Required
- The app requires HTTPS for camera access
- In development, `localhost` is automatically secure
- For deployment, ensure you have a valid SSL certificate

### Browser Storage
- Your data is stored locally in your browser
- Clear browser data will remove your entries
- Consider exporting important entries regularly

## 🚨 Troubleshooting

### Application Won't Start
```bash
# Check Docker is running
docker --version
docker info

# Check port availability
lsof -i :3000  # Kill any process using port 3000

# Restart with clean build
./run.sh clean
./run.sh start
```

### Camera Not Working
- Ensure browser permissions are granted
- Try refreshing the page
- Check if another app is using the camera
- Test in an incognito/private window

### Video Upload Issues
- Check file format (MP4, WebM, AVI, MOV supported)
- Ensure file size is under 100MB
- Try a different browser
- Disable browser extensions that might interfere

### Performance Issues
```bash
# Check container resources
docker stats

# Restart the application
./run.sh stop
./run.sh start

# Clear browser cache and data
```

## 📱 Mobile Usage

The app is fully responsive and works on mobile devices:

### iOS (Safari)
- Video recording may have limitations
- File upload works well
- Touch gestures supported

### Android (Chrome)
- Full video recording support
- Excellent upload performance
- All features available

## 🔍 Testing Your Setup

Use this checklist to verify everything is working:

- [ ] Application loads at http://localhost:3000
- [ ] User registration and login work
- [ ] Camera preview appears when starting recording
- [ ] Video recording completes successfully
- [ ] File upload accepts video files
- [ ] Video playback works in entries
- [ ] AI summary generation completes
- [ ] Dashboard statistics update correctly

## 🆘 Need Help?

If you encounter issues:

1. **Check the logs**: `./run.sh logs`
2. **Review documentation**: See `/docs` folder
3. **Common solutions**: Check this troubleshooting section
4. **Open an issue**: [GitHub Issues](https://github.com/mrjoshuasamuel/personal-jounal/issues)
5. **Join community**: [Discord Server](https://discord.gg/your-server)

## 🎉 Success!

Once you see the Daily Journal dashboard, you're ready to start your journaling journey!

**Next Steps:**
- Record your first video entry
- Explore the AI insights feature
- Set up a daily journaling routine
- Customize your experience

---

**Happy Journaling! 📝✨**

*Remember: The goal is personal growth through reflection. Be authentic, be consistent, and be kind to yourself.*
