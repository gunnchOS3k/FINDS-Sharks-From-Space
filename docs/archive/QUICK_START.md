# ⚡ FINDS Quick Start (5 Minutes)

## 🚀 Super Quick Setup

### 1. Prerequisites (2 minutes)
- **Install Node.js**: Go to [nodejs.org](https://nodejs.org/) → Download LTS version
- **Verify**: Open terminal, run `node --version` (should show a version number)

### 2. Get the Code (1 minute)
```bash
# Navigate to your desired folder
cd ~/Desktop

# Clone the project (replace with your actual repo URL)
git clone https://github.com/your-username/finds_-shark-hotspot-forecaster.git

# Go into the project folder
cd finds_-shark-hotspot-forecaster
```

### 3. Install & Run (2 minutes)
```bash
# Install dependencies
npm install

# Start the app
npm run dev
```

**That's it!** 🎉
- Browser should open automatically
- You should see the FINDS app with a map
- Try the arrow keys to test gestures

## 🔧 If Something Goes Wrong

### Run the diagnostic tool:
```bash
./check-setup.sh
```

This will tell you exactly what's missing and how to fix it.

### Common fixes:
- **"command not found"**: Make sure you're in the project folder (`cd finds_-shark-hotspot-forecaster`)
- **"npm error"**: Run `npm install` first
- **Port already in use**: Run `lsof -ti:5173 | xargs kill -9`

## 🎮 Test the App

1. **Map loads**: You should see a 3D map with hotspots
2. **Arrow keys work**: Try `←` `→` to change hotspot count
3. **Shark gallery**: Click "🦈 Shark Gallery" button
4. **Edge IO indicator**: Look for green "Edge IO: ON" in top-left

## 📱 Mobile Testing

1. **Find your IP**: Run `ifconfig | grep inet` (look for 192.168.x.x or 10.x.x.x)
2. **Open on phone**: Go to `http://YOUR_IP:5173`
3. **Test gestures**: Shake phone to toggle shark gallery
4. **Install PWA**: Look for "Add to Home Screen" option

## 🆘 Still Stuck?

1. **Check the full guide**: `SETUP_GUIDE.md`
2. **Run diagnostic**: `./check-setup.sh`
3. **Ask the team**: Share your error message

---

**Remember**: The first time setup might take a few tries, but once it works, you're all set! 🚀
