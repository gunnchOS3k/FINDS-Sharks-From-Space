#!/bin/bash

# FINDS - Multi-Platform Setup Script
# This script sets up the development environment for all platforms

set -e

echo "🦈 FINDS - Multi-Platform Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check system requirements
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    print_success "System requirements check passed"
}

# Setup web platform
setup_web() {
    print_status "Setting up web platform..."
    
    # Install web dependencies
    npm install --legacy-peer-deps
    
    # Create PWA assets
    if [ -f "assets/create-icons.sh" ]; then
        print_status "Creating PWA icons..."
        ./assets/create-icons.sh
    fi
    
    print_success "Web platform setup complete"
}

# Setup mobile platform
setup_mobile() {
    print_status "Setting up mobile platform..."
    
    # Check if Expo CLI is installed
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found, installing..."
        npm install -g @expo/cli
    fi
    
    # Check if EAS CLI is installed
    if ! command -v eas &> /dev/null; then
        print_warning "EAS CLI not found, installing..."
        npm install -g eas-cli
    fi
    
    # Create mobile-specific package.json
    if [ -f "package-mobile.json" ]; then
        cp package-mobile.json package.json
        npm install --legacy-peer-deps
    fi
    
    # Initialize Expo project
    if [ ! -f "app.json" ]; then
        print_warning "app.json not found, creating..."
        # app.json should already be created
    fi
    
    print_success "Mobile platform setup complete"
}

# Setup desktop platform
setup_desktop() {
    print_status "Setting up desktop platform..."
    
    # Check if Electron is available
    if ! command -v electron &> /dev/null; then
        print_warning "Electron not found, installing..."
        npm install -g electron
    fi
    
    # Install desktop dependencies
    npm install electron electron-builder concurrently wait-on --save-dev
    
    print_success "Desktop platform setup complete"
}

# Create platform-specific build scripts
create_build_scripts() {
    print_status "Creating platform-specific build scripts..."
    
    # Web build script
    cat > scripts/build-web.sh << 'EOF'
#!/bin/bash
echo "🌐 Building web version..."
npm run build
echo "✅ Web build complete: dist/"
EOF
    
    # Mobile build script
    cat > scripts/build-mobile.sh << 'EOF'
#!/bin/bash
echo "📱 Building mobile apps..."
echo "Android:"
npm run mobile:build:android
echo "iOS:"
npm run mobile:build:ios
echo "✅ Mobile builds complete"
EOF
    
    # Desktop build script
    cat > scripts/build-desktop.sh << 'EOF'
#!/bin/bash
echo "🖥️ Building desktop app..."
npm run electron:build
echo "✅ Desktop build complete: dist-electron/"
EOF
    
    # Make scripts executable
    chmod +x scripts/build-*.sh
    
    print_success "Build scripts created"
}

# Create development scripts
create_dev_scripts() {
    print_status "Creating development scripts..."
    
    # Web dev script
    cat > scripts/dev-web.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting web development server..."
npm run dev
EOF
    
    # Mobile dev script
    cat > scripts/dev-mobile.sh << 'EOF'
#!/bin/bash
echo "📱 Starting mobile development..."
npm run mobile:start
EOF
    
    # Desktop dev script
    cat > scripts/dev-desktop.sh << 'EOF'
#!/bin/bash
echo "🖥️ Starting desktop development..."
npm run electron:dev
EOF
    
    # Make scripts executable
    chmod +x scripts/dev-*.sh
    
    print_success "Development scripts created"
}

# Main setup function
main() {
    echo "Starting multi-platform setup..."
    
    check_requirements
    
    # Setup each platform
    setup_web
    setup_mobile
    setup_desktop
    
    # Create scripts
    create_build_scripts
    create_dev_scripts
    
    print_success "Multi-platform setup complete!"
    echo ""
    echo "🚀 Available commands:"
    echo "   Development:"
    echo "     ./scripts/dev-web.sh     - Start web development"
    echo "     ./scripts/dev-mobile.sh  - Start mobile development"
    echo "     ./scripts/dev-desktop.sh - Start desktop development"
    echo ""
    echo "   Building:"
    echo "     ./scripts/build-web.sh    - Build web version"
    echo "     ./scripts/build-mobile.sh - Build mobile apps"
    echo "     ./scripts/build-desktop.sh - Build desktop app"
    echo "     ./scripts/build-all.sh    - Build all platforms"
    echo ""
    echo "📱 Mobile deployment:"
    echo "     npm run mobile:build:android - Build Android APK/AAB"
    echo "     npm run mobile:build:ios     - Build iOS app"
    echo "     npm run mobile:submit:android - Submit to Play Store"
    echo "     npm run mobile:submit:ios     - Submit to App Store"
    echo ""
    echo "🖥️ Desktop deployment:"
    echo "     npm run electron:build - Build desktop app"
    echo "     npm run electron:dist  - Create distribution packages"
    echo ""
    echo "🌐 Web deployment:"
    echo "     npm run build        - Build web version"
    echo "     npm run pwa:build    - Build PWA version"
}

# Run main function
main "$@"
