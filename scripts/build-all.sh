#!/bin/bash

# FINDS - Build All Platforms Script
# This script builds the app for all platforms: Web, Mobile, and Desktop

set -e

echo "🦈 FINDS - Building for All Platforms"
echo "====================================="

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
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
    
    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build web version
build_web() {
    print_status "Building web version..."
    npm run build
    print_success "Web version built successfully"
}

# Build PWA version
build_pwa() {
    print_status "Building PWA version..."
    npm run pwa:build
    print_success "PWA version built successfully"
}

# Build Electron desktop app
build_desktop() {
    print_status "Building desktop app..."
    
    # Check if Electron is available
    if ! command -v electron &> /dev/null; then
        print_warning "Electron not found, installing..."
        npm install -g electron
    fi
    
    npm run electron:build
    print_success "Desktop app built successfully"
}

# Build mobile apps
build_mobile() {
    print_status "Building mobile apps..."
    
    # Check if Expo CLI is available
    if ! command -v expo &> /dev/null; then
        print_warning "Expo CLI not found, installing..."
        npm install -g @expo/cli
    fi
    
    # Check if EAS CLI is available
    if ! command -v eas &> /dev/null; then
        print_warning "EAS CLI not found, installing..."
        npm install -g eas-cli
    fi
    
    print_status "Building Android app..."
    npm run mobile:build:android
    
    print_status "Building iOS app..."
    npm run mobile:build:ios
    
    print_success "Mobile apps built successfully"
}

# Create distribution packages
create_distributions() {
    print_status "Creating distribution packages..."
    
    # Create dist directory structure
    mkdir -p dist-packages/{web,mobile,desktop}
    
    # Copy web build
    cp -r dist/* dist-packages/web/
    
    # Copy mobile builds (if they exist)
    if [ -d "dist-electron" ]; then
        cp -r dist-electron/* dist-packages/desktop/
    fi
    
    # Create archive
    print_status "Creating distribution archive..."
    tar -czf finds-distribution.tar.gz dist-packages/
    
    print_success "Distribution packages created"
}

# Main build process
main() {
    echo "Starting build process..."
    
    check_dependencies
    install_dependencies
    
    # Build web version
    build_web
    
    # Build PWA version
    build_pwa
    
    # Build desktop app (if on supported platform)
    if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "msys" ]]; then
        build_desktop
    else
        print_warning "Desktop build skipped (unsupported platform)"
    fi
    
    # Build mobile apps (requires EAS setup)
    if [ -f "eas.json" ]; then
        build_mobile
    else
        print_warning "Mobile build skipped (EAS not configured)"
    fi
    
    create_distributions
    
    print_success "All builds completed successfully!"
    echo ""
    echo "📦 Distribution packages created:"
    echo "   - Web: dist/"
    echo "   - PWA: dist/ (with service worker)"
    echo "   - Desktop: dist-electron/"
    echo "   - Mobile: Check EAS build outputs"
    echo "   - Archive: finds-distribution.tar.gz"
}

# Run main function
main "$@"
