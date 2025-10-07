# 🚀 FINDS - Multi-Platform Deployment Guide

This guide covers deploying FINDS to all major platforms: Web, iOS App Store, Google Play Store, and Windows Desktop.

---

## 📱 **Mobile App Deployment**

### **iOS App Store**

#### **Prerequisites**
- Apple Developer Account ($99/year)
- Xcode (latest version)
- EAS CLI configured

#### **Setup Steps**
1. **Configure EAS:**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Update app.json:**
   ```json
   {
     "expo": {
       "ios": {
         "bundleIdentifier": "com.gunnchos.finds",
         "buildNumber": "1.0.0"
       }
     }
   }
   ```

3. **Build for iOS:**
   ```bash
   npm run mobile:build:ios
   ```

4. **Submit to App Store:**
   ```bash
   npm run mobile:submit:ios
   ```

#### **App Store Requirements**
- App icons (1024x1024, 180x180, 120x120, 87x87, 60x60)
- Screenshots for all device sizes
- App description and keywords
- Privacy policy URL
- Age rating information

### **Google Play Store**

#### **Prerequisites**
- Google Play Console account ($25 one-time fee)
- Android Studio (for testing)
- EAS CLI configured

#### **Setup Steps**
1. **Configure Google Play:**
   ```bash
   # Create service account in Google Play Console
   # Download service account JSON key
   # Place in project root as google-service-account.json
   ```

2. **Update app.json:**
   ```json
   {
     "expo": {
       "android": {
         "package": "com.gunnchos.finds",
         "versionCode": 1
       }
     }
   }
   ```

3. **Build for Android:**
   ```bash
   npm run mobile:build:android
   ```

4. **Submit to Play Store:**
   ```bash
   npm run mobile:submit:android
   ```

#### **Play Store Requirements**
- App icons (512x512, 192x192, 144x144, 96x96, 72x72, 48x48)
- Screenshots for phone and tablet
- Feature graphic (1024x500)
- App description and short description
- Privacy policy URL
- Content rating questionnaire

---

## 🖥️ **Desktop App Deployment**

### **Windows Desktop App**

#### **Prerequisites**
- Windows 10/11
- Node.js and npm
- Code signing certificate (optional but recommended)

#### **Build Steps**
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the app:**
   ```bash
   npm run electron:build
   ```

3. **Output location:**
   - Built app: `dist-electron/`
   - Installer: `dist-electron/FINDS Setup.exe`

#### **Distribution Options**
- **Direct download**: Host installer on your website
- **Microsoft Store**: Submit through Partner Center
- **GitHub Releases**: Upload to GitHub releases

### **macOS Desktop App**

#### **Prerequisites**
- macOS with Xcode
- Apple Developer Account (for notarization)
- Code signing certificate

#### **Build Steps**
1. **Build for macOS:**
   ```bash
   npm run electron:build
   ```

2. **Notarize the app:**
   ```bash
   # Configure notarization in electron-builder
   # Upload to Apple for notarization
   ```

3. **Output:**
   - DMG file: `dist-electron/FINDS-1.0.0.dmg`
   - App bundle: `dist-electron/FINDS.app`

---

## 🌐 **Web Deployment**

### **PWA Deployment**

#### **Build PWA:**
```bash
npm run pwa:build
```

#### **Deployment Options**

1. **Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

2. **Vercel:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **GitHub Pages:**
   ```bash
   # Add to package.json scripts
   "deploy": "gh-pages -d dist"
   
   # Deploy
   npm run deploy
   ```

### **Cloudflare Pages**

1. **Connect repository** to Cloudflare Pages
2. **Build settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `18`

---

## 🔧 **Build Scripts**

### **All Platforms**
```bash
# Build everything
./scripts/build-all.sh

# Or manually:
npm run build          # Web
npm run pwa:build      # PWA
npm run electron:build # Desktop
npm run mobile:build:android # Android
npm run mobile:build:ios     # iOS
```

### **Development**
```bash
# Web development
npm run dev

# Desktop development
npm run electron:dev

# Mobile development
npm run mobile:start
```

---

## 📋 **Checklist for Each Platform**

### **iOS App Store**
- [ ] Apple Developer Account
- [ ] App icons in all required sizes
- [ ] Screenshots for all device sizes
- [ ] App description and metadata
- [ ] Privacy policy
- [ ] Age rating
- [ ] TestFlight testing
- [ ] App Store review submission

### **Google Play Store**
- [ ] Google Play Console account
- [ ] App icons in all required sizes
- [ ] Screenshots for phone and tablet
- [ ] Feature graphic
- [ ] App description and short description
- [ ] Privacy policy
- [ ] Content rating
- [ ] Internal testing
- [ ] Production release

### **Windows Desktop**
- [ ] Code signing certificate (recommended)
- [ ] Windows Defender compatibility
- [ ] Installer testing
- [ ] Auto-updater configuration
- [ ] Distribution method (website, store, etc.)

### **Web/PWA**
- [ ] HTTPS deployment
- [ ] Service worker configuration
- [ ] Offline functionality
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics integration

---

## 🚨 **Common Issues & Solutions**

### **Mobile Build Issues**
- **EAS build fails**: Check app.json configuration
- **Icons missing**: Ensure all required icon sizes are present
- **Permissions**: Update app.json with required permissions

### **Desktop Build Issues**
- **Electron build fails**: Check Node.js version compatibility
- **Code signing**: Ensure certificates are properly configured
- **Notarization**: Follow Apple's notarization process

### **Web Deployment Issues**
- **PWA not working**: Check service worker configuration
- **Build fails**: Ensure all dependencies are installed
- **Performance**: Optimize bundle size and loading

---

## 📞 **Support & Resources**

- **Expo Documentation**: https://docs.expo.dev/
- **Electron Documentation**: https://www.electronjs.org/docs
- **PWA Documentation**: https://web.dev/progressive-web-apps/
- **Apple Developer**: https://developer.apple.com/
- **Google Play Console**: https://play.google.com/console/

---

**🦈 Deploy FINDS to reach shark conservation researchers worldwide!**
