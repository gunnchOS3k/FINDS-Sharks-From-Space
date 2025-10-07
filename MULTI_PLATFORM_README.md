# 🚀 FINDS - Multi-Platform Development Guide

**FINDS (Fin Identification & Navigation from Satellite)** is now available across all major platforms: Web, iOS, Android, and Windows Desktop.

---

## 📱 **Platform Overview**

| Platform | Status | Build Command | Deploy Command |
|----------|--------|---------------|----------------|
| **Web** | ✅ Ready | `npm run build` | Deploy to hosting |
| **PWA** | ✅ Ready | `npm run pwa:build` | Deploy to hosting |
| **iOS** | ✅ Ready | `npm run mobile:build:ios` | `npm run mobile:submit:ios` |
| **Android** | ✅ Ready | `npm run mobile:build:android` | `npm run mobile:submit:android` |
| **Windows** | ✅ Ready | `npm run electron:build` | `npm run electron:dist` |
| **macOS** | ✅ Ready | `npm run electron:build` | `npm run electron:dist` |

---

## 🛠️ **Quick Setup**

### **1. Install Dependencies**
```bash
# Run the setup script
./scripts/setup-platforms.sh

# Or manually install
npm install --legacy-peer-deps
```

### **2. Create App Icons**
```bash
# Generate all required icons
./assets/create-icons.sh
```

### **3. Start Development**
```bash
# Web development
./scripts/dev-web.sh

# Mobile development
./scripts/dev-mobile.sh

# Desktop development
./scripts/dev-desktop.sh
```

---

## 📱 **Mobile App Development**

### **Prerequisites**
- Node.js 18+
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`
- iOS: Xcode (for iOS builds)
- Android: Android Studio (for Android builds)

### **Development**
```bash
# Start Expo development server
npm run mobile:start

# Run on specific platform
npm run mobile:android  # Android
npm run mobile:ios      # iOS
```

### **Building for Stores**
```bash
# Build for Android
npm run mobile:build:android

# Build for iOS
npm run mobile:build:ios

# Submit to stores
npm run mobile:submit:android
npm run mobile:submit:ios
```

### **Mobile Features**
- **Gesture Controls**: Shake device to interact
- **Location Services**: GPS-based hotspot detection
- **Camera Integration**: For gesture recognition
- **Offline Support**: Cached hotspot data
- **Push Notifications**: New hotspot alerts

---

## 🖥️ **Desktop App Development**

### **Prerequisites**
- Node.js 18+
- Electron: `npm install -g electron`
- Platform-specific tools:
  - **Windows**: Visual Studio Build Tools
  - **macOS**: Xcode Command Line Tools
  - **Linux**: build-essential

### **Development**
```bash
# Start desktop development
npm run electron:dev

# This runs both web server and Electron
```

### **Building Desktop Apps**
```bash
# Build for current platform
npm run electron:build

# Create distribution packages
npm run electron:dist
```

### **Desktop Features**
- **Native Menus**: File, View, Analysis menus
- **Keyboard Shortcuts**: Ctrl+N (New), Ctrl+O (Open)
- **File Operations**: Save/load hotspot data
- **Auto-updater**: Automatic app updates
- **System Integration**: Native notifications

---

## 🌐 **Web & PWA Development**

### **Web Development**
```bash
# Start web development server
npm run dev

# Build for production
npm run build
```

### **PWA Features**
```bash
# Build PWA version
npm run pwa:build

# Preview PWA
npm run pwa:preview
```

### **PWA Features**
- **Offline Support**: Works without internet
- **Install Prompt**: "Add to Home Screen"
- **Push Notifications**: Real-time updates
- **Background Sync**: Data synchronization
- **Responsive Design**: Mobile-first approach

---

## 🔧 **Build Scripts**

### **Individual Platform Builds**
```bash
# Web
./scripts/build-web.sh

# Mobile
./scripts/build-mobile.sh

# Desktop
./scripts/build-desktop.sh
```

### **Build All Platforms**
```bash
# Build everything
./scripts/build-all.sh
```

### **Output Locations**
- **Web**: `dist/`
- **PWA**: `dist/` (with service worker)
- **Mobile**: EAS build outputs
- **Desktop**: `dist-electron/`

---

## 📦 **Deployment Guide**

### **Web Deployment**
```bash
# Build web version
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Deploy to Vercel
vercel --prod

# Deploy to GitHub Pages
npm run deploy
```

### **Mobile Store Deployment**

#### **iOS App Store**
1. **Configure EAS:**
   ```bash
   eas login
   eas build:configure
   ```

2. **Update app.json:**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.gunnchos.finds"
       }
     }
   }
   ```

3. **Build and Submit:**
   ```bash
   npm run mobile:build:ios
   npm run mobile:submit:ios
   ```

#### **Google Play Store**
1. **Configure Google Play:**
   - Create service account in Google Play Console
   - Download service account JSON key
   - Place as `google-service-account.json`

2. **Build and Submit:**
   ```bash
   npm run mobile:build:android
   npm run mobile:submit:android
   ```

### **Desktop Distribution**

#### **Windows**
```bash
# Build Windows installer
npm run electron:build

# Output: dist-electron/FINDS Setup.exe
```

#### **macOS**
```bash
# Build macOS app
npm run electron:build

# Output: dist-electron/FINDS-1.0.0.dmg
```

---

## 🎯 **Platform-Specific Features**

### **Mobile (iOS/Android)**
- **Gesture Recognition**: Shake, tilt, swipe controls
- **Location Services**: GPS-based hotspot detection
- **Camera Integration**: Visual gesture recognition
- **Push Notifications**: Real-time hotspot alerts
- **Offline Maps**: Cached satellite imagery

### **Desktop (Windows/macOS/Linux)**
- **Native Menus**: File operations, keyboard shortcuts
- **System Integration**: Native notifications, file associations
- **Auto-updater**: Automatic app updates
- **Multi-window**: Multiple analysis windows
- **File I/O**: Save/load analysis data

### **Web/PWA**
- **Progressive Enhancement**: Works on any device
- **Offline Support**: Service worker caching
- **Install Prompt**: "Add to Home Screen"
- **Responsive Design**: Mobile-first approach
- **Cross-platform**: Works on any OS

---

## 🔍 **Testing & Quality Assurance**

### **Testing Commands**
```bash
# Test web version
npm run dev
# Open http://localhost:3000

# Test mobile version
npm run mobile:start
# Scan QR code with Expo Go app

# Test desktop version
npm run electron:dev
# Opens Electron window
```

### **Quality Checklist**
- [ ] **Web**: Responsive design, PWA features
- [ ] **Mobile**: Gesture controls, location services
- [ ] **Desktop**: Native menus, keyboard shortcuts
- [ ] **All Platforms**: Performance, accessibility

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Mobile Build Fails**
```bash
# Clear Expo cache
expo r -c

# Reset Metro cache
npx react-native start --reset-cache
```

#### **Desktop Build Fails**
```bash
# Clear Electron cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install --legacy-peer-deps
```

#### **Web Build Fails**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Reinstall dependencies
npm install --legacy-peer-deps
```

### **Platform-Specific Issues**

#### **iOS**
- **Xcode required** for iOS builds
- **Apple Developer Account** for App Store
- **Provisioning profiles** for device testing

#### **Android**
- **Android Studio** for Android builds
- **Google Play Console** for Play Store
- **Signing keys** for app distribution

#### **Windows**
- **Visual Studio Build Tools** for Windows builds
- **Code signing certificate** for distribution
- **Windows Defender** compatibility

---

## 📞 **Support & Resources**

### **Documentation**
- **Expo**: https://docs.expo.dev/
- **Electron**: https://www.electronjs.org/docs
- **PWA**: https://web.dev/progressive-web-apps/
- **React Native**: https://reactnative.dev/docs

### **Platform Resources**
- **Apple Developer**: https://developer.apple.com/
- **Google Play Console**: https://play.google.com/console/
- **Microsoft Store**: https://partner.microsoft.com/

---

## 🎉 **Success Metrics**

### **Deployment Targets**
- **Web**: 100% browser compatibility
- **Mobile**: App Store + Play Store approval
- **Desktop**: Windows + macOS + Linux support
- **PWA**: 90+ Lighthouse score

### **Performance Goals**
- **Web**: < 3s load time
- **Mobile**: < 2s app launch
- **Desktop**: < 1s window open
- **PWA**: Offline functionality

---

**🦈 Deploy FINDS across all platforms to reach shark conservation researchers worldwide!**
