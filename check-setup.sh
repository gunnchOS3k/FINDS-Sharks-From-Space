#!/bin/bash

echo "🔍 FINDS Setup Diagnostic Tool"
echo "================================"

# Check if we're in the right directory
echo "📁 Checking directory..."
if [ -f "package.json" ]; then
    echo "✅ Found package.json - you're in the right directory"
else
    echo "❌ No package.json found - you need to navigate to the project folder"
    echo "   Run: cd /path/to/finds_-shark-hotspot-forecaster"
    exit 1
fi

# Check Node.js
echo ""
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js not found - please install from nodejs.org"
    exit 1
fi

# Check npm
echo ""
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm installed: $NPM_VERSION"
else
    echo "❌ npm not found - please install Node.js"
    exit 1
fi

# Check if node_modules exists
echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "⚠️  Dependencies not installed - run: npm install"
fi

# Check for required files
echo ""
echo "📄 Checking project files..."
REQUIRED_FILES=("App.tsx" "index.html" "vite.config.ts" "public/manifest.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Check for shark images
echo ""
echo "🦈 Checking shark images..."
if [ -d "public/sharks" ]; then
    SHARK_COUNT=$(ls public/sharks/*.jpg 2>/dev/null | wc -l)
    echo "✅ Found $SHARK_COUNT shark images"
else
    echo "⚠️  No shark images found - this is normal for demo"
fi

# Check wrangler (optional)
echo ""
echo "☁️  Checking Cloudflare Wrangler (optional)..."
if command -v wrangler &> /dev/null; then
    WRANGLER_VERSION=$(wrangler --version)
    echo "✅ Wrangler installed: $WRANGLER_VERSION"
else
    echo "⚠️  Wrangler not installed - run: npm install -g wrangler"
fi

# Check port availability
echo ""
echo "🌐 Checking port availability..."
if lsof -ti:5173 &> /dev/null; then
    echo "⚠️  Port 5173 is in use - you may need to kill the process"
    echo "   Run: lsof -ti:5173 | xargs kill -9"
else
    echo "✅ Port 5173 is available"
fi

echo ""
echo "🎯 Summary:"
echo "==========="
echo "If you see any ❌ errors above, fix those first"
echo "If you see ⚠️  warnings, those are optional but recommended"
echo "If everything looks ✅, you're ready to run: npm run dev"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm install (if dependencies missing)"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo "4. Test the app and gestures!"
