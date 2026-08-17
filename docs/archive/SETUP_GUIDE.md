# 🚀 FINDS Setup Guide for Beginners

This guide will help your teammates set up the FINDS project from scratch on their machines.

## 📋 Prerequisites

Before starting, make sure you have these installed:

### 1. Node.js (Required)
- **Download**: Go to [nodejs.org](https://nodejs.org/)
- **Install**: Download the LTS version (recommended)
- **Verify**: Open terminal and run:
  ```bash
  node --version
  npm --version
  ```
  You should see version numbers (e.g., `v18.17.0` and `9.6.7`)

### 2. Git (Required)
- **Download**: Go to [git-scm.com](https://git-scm.com/)
- **Install**: Follow the installer instructions
- **Verify**: Run:
  ```bash
  git --version
  ```

### 3. Cloudflare Wrangler (Optional - for backend)
- **Install**: Run this command in your terminal:
  ```bash
  npm install -g wrangler
  ```
- **Verify**: Run:
  ```bash
  wrangler --version
  ```

## 🏗️ Step-by-Step Setup

### Step 1: Get the Code
```bash
# Navigate to your desired folder (e.g., Desktop or Documents)
cd ~/Desktop

# Clone the repository
git clone https://github.com/your-username/finds_-shark-hotspot-forecaster.git

# Navigate into the project folder
cd finds_-shark-hotspot-forecaster
```

### Step 2: Install Dependencies
```bash
# Make sure you're in the project root directory
pwd
# Should show: /Users/yourname/Desktop/finds_-shark-hotspot-forecaster

# Install all required packages
npm install
```

### Step 3: Test the Basic Setup
```bash
# Start the development server
npm run dev
```

**Expected Result**: 
- Terminal should show: `Local: http://localhost:5173/`
- Browser should open automatically
- You should see the FINDS app with a map

### Step 4: Test Gesture Controls
1. **Desktop**: Try arrow keys to navigate
2. **Mobile**: Shake your phone to toggle shark gallery
3. **Look for**: Green "Edge IO: ON" indicator in top-left

### Step 5: Test Shark Gallery
1. Click the "🦈 Shark Gallery" button
2. You should see a modal with shark images
3. Close the modal by clicking the "×" button

## 🔧 Troubleshooting Common Issues

### Issue 1: "npm error ENOENT package.json"
**Problem**: You're not in the correct directory
**Solution**:
```bash
# Check where you are
pwd

# Navigate to the project folder
cd /path/to/finds_-shark-hotspot-forecaster

# Verify you're in the right place
ls
# Should see: package.json, src/, public/, etc.
```

### Issue 2: "zsh: command not found: wrangler"
**Problem**: Wrangler CLI not installed
**Solution**:
```bash
# Install wrangler globally
npm install -g wrangler

# Verify installation
wrangler --version
```

### Issue 3: "Port 5173 already in use"
**Problem**: Another app is using the port
**Solution**:
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue 4: Images not loading
**Problem**: Shark images missing
**Solution**:
```bash
# Check if images exist
ls public/sharks/

# If empty, the images will be placeholder images (this is normal for demo)
```

## 🎮 Testing Gesture Controls

### Desktop Testing
1. **Arrow Keys**: 
   - `←` `→`: Should change hotspot count
   - `↑` `↓`: Should cycle through regions
2. **+/- Keys**: Should fine-tune hotspot count
3. **Look for**: "Edge IO: ON" indicator

### Mobile Testing
1. **Open**: `http://your-ip:5173` on your phone
2. **Shake**: Should toggle shark gallery
3. **Tap**: Look for floating tap button (top-right)

## 🚀 Advanced Setup (Optional)

### With Cloudflare Worker (Backend)
```bash
# Create environment file
echo "GEMINI_API_KEY=your_api_key_here" > api/worker/.dev.vars

# Start local worker
npm run worker:dev

# In another terminal, start web app with API
VITE_API_BASE="http://127.0.0.1:8787" npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Mobile Testing

### iOS Safari
1. Open `http://your-ip:5173` in Safari
2. Tap "Share" → "Add to Home Screen"
3. Test shake gesture and tap button

### Android Chrome
1. Open `http://your-ip:5173` in Chrome
2. Tap menu → "Add to Home Screen"
3. Test shake gesture and tap button

## 🆘 Getting Help

### If Something Goes Wrong
1. **Check your directory**: Make sure you're in the project folder
2. **Check Node.js**: Run `node --version`
3. **Check npm**: Run `npm --version`
4. **Restart terminal**: Close and reopen your terminal
5. **Clear cache**: Run `npm cache clean --force`

### Common Commands
```bash
# Check if you're in the right directory
pwd
ls

# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies (if missing)
npm install

# Start development server
npm run dev

# Stop the server
Ctrl + C
```

## ✅ Success Checklist

- [ ] Node.js installed and working
- [ ] Project cloned successfully
- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts the server
- [ ] Browser opens and shows the FINDS app
- [ ] Map loads with hotspots
- [ ] Gesture controls work (arrow keys)
- [ ] Shark gallery opens and closes
- [ ] "Edge IO: ON" indicator visible

## 🎯 Next Steps

Once everything is working:
1. **Explore the app**: Try different regions and hotspot counts
2. **Test gestures**: Use keyboard and mobile controls
3. **Check shark gallery**: Browse the shark species
4. **Test PWA**: Install as mobile app
5. **Share feedback**: Let the team know what works/doesn't work

## 📞 Need Help?

If you're still stuck:
1. **Screenshot the error** and share it
2. **Copy the full error message** from terminal
3. **Check this guide** for your specific error
4. **Ask the team** - someone else might have solved it!

---

**Remember**: It's normal to encounter issues the first time. The key is to follow each step carefully and don't skip the verification steps! 🚀
