# 🍎 FINDS Mac Terminal Setup Guide

This guide is specifically designed for Mac users using Terminal. It addresses common Mac-specific issues and provides step-by-step instructions.

## 📋 Mac Prerequisites

### 1. Install Xcode Command Line Tools
```bash
# Open Terminal (Cmd + Space, type "Terminal")
# Install Xcode command line tools
xcode-select --install
```

### 2. Install Node.js (Mac-specific)
```bash
# Option A: Using Homebrew (recommended)
# First install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via Homebrew
brew install node

# Option B: Download from nodejs.org
# Go to https://nodejs.org/ and download the macOS installer
```

### 3. Verify Installation
```bash
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# Check if you're in the right directory
pwd
# Should show your current location
```

## 🚀 Mac-Specific Setup Steps

### Step 1: Navigate to Your Project
```bash
# Open Terminal
# Navigate to your Desktop (or wherever you want the project)
cd ~/Desktop

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/your-username/finds_-shark-hotspot-forecaster.git

# Navigate into the project
cd finds_-shark-hotspot-forecaster

# Verify you're in the right place
ls
# Should see: package.json, App.tsx, public/, etc.
```

### Step 2: Install Dependencies
```bash
# Make sure you're in the project directory
pwd
# Should end with: finds_-shark-hotspot-forecaster

# Install all dependencies
npm install

# If you get permission errors, try:
sudo npm install
# Or fix npm permissions:
sudo chown -R $(whoami) ~/.npm
```

### Step 3: Start the Development Server
```bash
# Start the app
npm run dev

# If port 5173 is busy, try:
npm run dev -- --port 3000
```

**Expected Output:**
```
  VITE v6.2.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

## 🔧 Mac-Specific Troubleshooting

### Issue 1: "npm error ENOENT package.json"
**Problem**: You're not in the project directory
**Solution**:
```bash
# Check where you are
pwd

# Navigate to the project folder
cd ~/Desktop/finds_-shark-hotspot-forecaster

# Verify you're in the right place
ls -la
# Should see package.json, App.tsx, etc.
```

### Issue 2: "zsh: command not found: wrangler"
**Problem**: Wrangler CLI not installed
**Solution**:
```bash
# Install wrangler globally
npm install -g wrangler

# If you get permission errors:
sudo npm install -g wrangler

# Verify installation
wrangler --version
```

### Issue 3: "Port 5173 already in use"
**Problem**: Another process is using the port
**Solution**:
```bash
# Find what's using port 5173
lsof -ti:5173

# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### Issue 4: "Permission denied" errors
**Problem**: npm permission issues
**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Or use nvm instead of system Node.js
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install node
nvm use node
```

### Issue 5: "Command not found" errors
**Problem**: Shell not finding commands
**Solution**:
```bash
# Check your shell
echo $SHELL
# Should show: /bin/zsh or /bin/bash

# If using zsh, add to ~/.zshrc:
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# If using bash, add to ~/.bash_profile:
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bash_profile
source ~/.bash_profile
```

## 🎮 Mac-Specific Testing

### Desktop Testing
```bash
# Start the app
npm run dev

# Open browser to http://localhost:5173
# Test these keyboard shortcuts:
# - Arrow keys: Navigate and adjust settings
# - Cmd + R: Refresh the page
# - Cmd + Shift + R: Hard refresh
```

### Mobile Testing (from Mac)
```bash
# Find your Mac's IP address
ifconfig | grep "inet " | grep -v 127.0.0.1

# Look for something like: 192.168.1.100
# On your phone, go to: http://192.168.1.100:5173
```

### Terminal Shortcuts for Mac
```bash
# Stop the server
Ctrl + C

# Clear terminal
Cmd + K

# Open new terminal tab
Cmd + T

# Find and replace in terminal
Cmd + F
```

## 🚀 Mac-Specific Development Commands

### Quick Commands
```bash
# Check if everything is working
./check-setup.sh

# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 3000

# Build for production
npm run build

# Preview production build
npm run preview
```

### Advanced Mac Setup (Optional)
```bash
# Install Cloudflare Wrangler for backend
npm install -g wrangler

# Create environment file for worker
echo "GEMINI_API_KEY=your_api_key_here" > api/worker/.dev.vars

# Start local worker (in one terminal)
npm run worker:dev

# Start web app with API (in another terminal)
VITE_API_BASE="http://127.0.0.1:8787" npm run dev
```

## 📱 Mac to Mobile Testing

### 1. Find Your Mac's IP
```bash
# Method 1: Using ifconfig
ifconfig | grep "inet " | grep -v 127.00.1

# Method 2: Using system preferences
# System Preferences → Network → Wi-Fi → Advanced → TCP/IP
```

### 2. Start Server with Network Access
```bash
# Start with network access
npm run dev

# Look for output like:
# ➜  Network: http://192.168.1.100:5173/
```

### 3. Test on Mobile
1. **Connect phone to same Wi-Fi** as your Mac
2. **Open phone browser** to `http://192.168.1.100:5173`
3. **Test gestures**: Shake phone, tap floating button
4. **Install PWA**: Look for "Add to Home Screen"

## 🔍 Mac-Specific Diagnostic

### Run the Diagnostic Script
```bash
# Make sure you're in the project directory
cd ~/Desktop/finds_-shark-hotspot-forecaster

# Run the diagnostic
./check-setup.sh
```

### Manual Checks
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check if you're in the right directory
pwd
ls -la

# Check if dependencies are installed
ls node_modules

# Check if the app starts
npm run dev
```

## 🆘 Mac-Specific Help

### If Terminal Won't Open
1. **Spotlight Search**: Cmd + Space, type "Terminal"
2. **Applications**: Go to Applications → Utilities → Terminal
3. **Dock**: Right-click Terminal icon, select "New Window"

### If Commands Don't Work
1. **Check your shell**: `echo $SHELL`
2. **Restart Terminal**: Close and reopen
3. **Check PATH**: `echo $PATH`

### If npm is Slow
```bash
# Clear npm cache
npm cache clean --force

# Use a different registry
npm config set registry https://registry.npmjs.org/
```

## ✅ Mac Success Checklist

- [ ] Terminal opens and works
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Project cloned successfully
- [ ] `npm install` completed
- [ ] `npm run dev` starts server
- [ ] Browser opens to http://localhost:5173
- [ ] Map loads with hotspots
- [ ] Arrow keys work for gestures
- [ ] Shark gallery opens
- [ ] "Edge IO: ON" indicator visible

## 🎯 Next Steps for Mac Users

1. **Test the app**: Try all the gestures and features
2. **Test on mobile**: Use your phone to test the mobile features
3. **Install PWA**: Add to home screen on your phone
4. **Share feedback**: Let the team know what works/doesn't work

---

**Mac Pro Tip**: Use `Cmd + Tab` to switch between Terminal and Browser quickly while testing! 🚀
