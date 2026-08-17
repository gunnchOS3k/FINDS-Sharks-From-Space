# 🔧 Mac Terminal Troubleshooting Guide

This guide addresses the specific errors you encountered and provides Mac-specific solutions.

## 🚨 Common Mac Terminal Errors & Solutions

### Error 1: "npm error ENOENT package.json"
**What it means**: You're not in the project directory
**Mac Solution**:
```bash
# Check where you are
pwd

# Navigate to the project folder
cd ~/Desktop/finds_-shark-hotspot-forecaster

# Verify you're in the right place
ls -la
# Should see: package.json, App.tsx, public/, etc.
```

### Error 2: "zsh: command not found: wrangler"
**What it means**: Wrangler CLI not installed
**Mac Solution**:
```bash
# Install wrangler globally
npm install -g wrangler

# If you get permission errors:
sudo npm install -g wrangler

# Verify installation
wrangler --version
```

### Error 3: "zsh: command not found: #"
**What it means**: You're trying to run a comment as a command
**Mac Solution**:
```bash
# Don't copy comments (lines starting with #)
# Only copy the actual commands

# Example - DON'T copy this:
# Install dependencies
npm install

# Example - DO copy this:
npm install
```

### Error 4: "Port 5173 already in use"
**What it means**: Another process is using the port
**Mac Solution**:
```bash
# Find what's using port 5173
lsof -ti:5173

# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

## 🍎 Mac-Specific Terminal Tips

### Terminal Navigation
```bash
# Go to Desktop
cd ~/Desktop

# Go to Home directory
cd ~

# Go to specific folder
cd /Users/yourusername/Desktop/finds_-shark-hotspot-forecaster

# List files
ls

# List files with details
ls -la

# Show current directory
pwd
```

### Terminal Shortcuts (Mac)
```bash
# Clear terminal
Cmd + K

# Stop current command
Ctrl + C

# Open new terminal tab
Cmd + T

# Find text in terminal
Cmd + F

# Copy text
Cmd + C

# Paste text
Cmd + V
```

### Fixing Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Fix global npm packages
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Alternative: Use nvm instead
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## 🔍 Step-by-Step Mac Setup

### Step 1: Open Terminal
```bash
# Method 1: Spotlight Search
# Press Cmd + Space, type "Terminal", press Enter

# Method 2: Applications
# Go to Applications → Utilities → Terminal

# Method 3: Launchpad
# Open Launchpad, search "Terminal"
```

### Step 2: Navigate to Project
```bash
# Go to Desktop
cd ~/Desktop

# Clone project (replace with your repo URL)
git clone https://github.com/your-username/finds_-shark-hotspot-forecaster.git

# Go into project folder
cd finds_-shark-hotspot-forecaster

# Verify you're in the right place
pwd
# Should end with: finds_-shark-hotspot-forecaster
```

### Step 3: Install Dependencies
```bash
# Install all dependencies
npm install

# If you get permission errors:
sudo npm install

# Or fix permissions first:
sudo chown -R $(whoami) ~/.npm
npm install
```

### Step 4: Start the App
```bash
# Start development server
npm run dev

# If port is busy:
npm run dev -- --port 3000
```

## 🚀 Mac Quick Start Script

Instead of manual setup, use the automated script:

```bash
# Make sure you're in the project directory
cd ~/Desktop/finds_-shark-hotspot-forecaster

# Run the Mac quick start script
./mac-quick-start.sh
```

This script will:
- ✅ Check if you're in the right directory
- ✅ Check Node.js and npm
- ✅ Install dependencies if needed
- ✅ Kill any processes using port 5173
- ✅ Start the development server
- ✅ Show you the mobile testing URL

## 📱 Mac to Mobile Testing

### Find Your Mac's IP Address
```bash
# Method 1: Using ifconfig
ifconfig | grep "inet " | grep -v 127.0.0.1

# Method 2: Using system preferences
# System Preferences → Network → Wi-Fi → Advanced → TCP/IP
```

### Start Server with Network Access
```bash
# Start the app
npm run dev

# Look for output like:
# ➜  Network: http://192.168.1.100:5173/
```

### Test on Mobile
1. **Connect phone to same Wi-Fi** as your Mac
2. **Open phone browser** to `http://192.168.1.100:5173`
3. **Test gestures**: Shake phone, tap floating button
4. **Install PWA**: Look for "Add to Home Screen"

## 🔧 Advanced Mac Troubleshooting

### If Terminal Won't Open
1. **Restart Terminal**: Close and reopen
2. **Check permissions**: System Preferences → Security & Privacy
3. **Reset Terminal**: Terminal → Preferences → Profiles → Reset

### If Commands Don't Work
1. **Check shell**: `echo $SHELL`
2. **Restart Terminal**: Close and reopen
3. **Check PATH**: `echo $PATH`

### If npm is Slow
```bash
# Clear npm cache
npm cache clean --force

# Use a different registry
npm config set registry https://registry.npmjs.org/
```

### If You Get "Command not found"
```bash
# Check if command exists
which node
which npm

# If not found, add to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
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

## 🆘 Still Stuck?

### Run the Diagnostic
```bash
# Run the diagnostic script
./check-setup.sh
```

### Check These Files
```bash
# Make sure these files exist
ls -la package.json
ls -la App.tsx
ls -la public/manifest.json
```

### Get Help
1. **Screenshot the error** and share it
2. **Copy the full error message** from terminal
3. **Check this guide** for your specific error
4. **Ask the team** - someone else might have solved it!

---

**Mac Pro Tip**: Use `Cmd + Tab` to switch between Terminal and Browser quickly while testing! 🚀
