# 🍎 FINDS Mac Setup - Start Here!

This is the **main guide** for Mac users. It addresses the specific terminal errors you encountered and provides step-by-step solutions.

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)
```bash
# 1. Open Terminal (Cmd + Space, type "Terminal")
# 2. Navigate to your Desktop
cd ~/Desktop

# 3. Clone the project (replace with your repo URL)
git clone https://github.com/your-username/finds_-shark-hotspot-forecaster.git

# 4. Go into the project
cd finds_-shark-hotspot-forecaster

# 5. Run the automated setup
./mac-quick-start.sh
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm run dev
```

## 🔧 If You Get Errors

### Common Mac Terminal Errors:

1. **"npm error ENOENT package.json"**
   - **Solution**: You're not in the project directory
   - **Fix**: `cd finds_-shark-hotspot-forecaster`

2. **"zsh: command not found: wrangler"**
   - **Solution**: Install wrangler
   - **Fix**: `npm install -g wrangler`

3. **"Port 5173 already in use"**
   - **Solution**: Kill the process using the port
   - **Fix**: `lsof -ti:5173 | xargs kill -9`

4. **"zsh: command not found: #"**
   - **Solution**: Don't copy comments, only commands
   - **Fix**: Copy only the actual commands, not the `#` lines

## 📚 Complete Guides

### For Beginners:
- **`MAC_SETUP_GUIDE.md`** - Complete step-by-step guide
- **`MAC_TROUBLESHOOTING.md`** - Detailed error solutions

### For Quick Reference:
- **`QUICK_START.md`** - 5-minute setup
- **`SETUP_GUIDE.md`** - General setup guide

## 🎮 What You'll Get

Once setup is complete, you'll have:
- ✅ **Working FINDS app** with 3D map
- ✅ **Gesture controls** (keyboard + mobile)
- ✅ **Shark gallery** with species information
- ✅ **PWA support** for mobile installation
- ✅ **Edge IO indicators** showing gesture status

## 📱 Mobile Testing

### Find Your Mac's IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Test on Mobile:
1. **Connect phone to same Wi-Fi** as your Mac
2. **Open phone browser** to `http://YOUR_IP:5173`
3. **Test gestures**: Shake phone, tap floating button
4. **Install PWA**: Look for "Add to Home Screen"

## 🔍 Diagnostic Tools

### Run Diagnostic:
```bash
./check-setup.sh
```

This will tell you exactly what's missing and how to fix it.

### Quick Commands:
```bash
# Check if you're in the right directory
pwd
ls

# Check Node.js
node --version

# Check npm
npm --version

# Start the app
npm run dev
```

## 🆘 Still Stuck?

1. **Check the guides**: `MAC_SETUP_GUIDE.md` and `MAC_TROUBLESHOOTING.md`
2. **Run diagnostic**: `./check-setup.sh`
3. **Screenshot the error** and share it
4. **Ask the team** - someone else might have solved it!

---

**Mac Pro Tip**: Use `Cmd + Tab` to switch between Terminal and Browser quickly while testing! 🚀
