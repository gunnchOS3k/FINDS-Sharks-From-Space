#!/bin/bash

echo "🍎 FINDS Mac Quick Start"
echo "========================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: You're not in the project directory"
    echo "   Please run: cd /path/to/finds_-shark-hotspot-forecaster"
    echo "   Then run this script again"
    exit 1
fi

echo "✅ Found project directory"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "   Install from: https://nodejs.org/"
    echo "   Or run: brew install node"
    exit 1
fi

echo "✅ Node.js installed: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    echo "   Please install Node.js first"
    exit 1
fi

echo "✅ npm installed: $(npm --version)"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        echo "   Try: sudo npm install"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Check port availability
if lsof -ti:5173 &> /dev/null; then
    echo "⚠️  Port 5173 is in use"
    echo "   Killing existing process..."
    lsof -ti:5173 | xargs kill -9
    sleep 2
fi

# Get Mac's IP address for mobile testing
MAC_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
if [ -z "$MAC_IP" ]; then
    MAC_IP="localhost"
fi

echo ""
echo "🚀 Starting FINDS app..."
echo "========================="
echo "📱 For mobile testing, use: http://$MAC_IP:5173"
echo "💻 For desktop, use: http://localhost:5173"
echo ""
echo "🎮 Test these gestures:"
echo "   - Arrow keys: Navigate and adjust settings"
echo "   - Shake phone: Toggle shark gallery"
echo "   - Look for: 'Edge IO: ON' indicator"
echo ""
echo "🛑 To stop the server: Press Ctrl + C"
echo ""

# Start the development server
npm run dev
