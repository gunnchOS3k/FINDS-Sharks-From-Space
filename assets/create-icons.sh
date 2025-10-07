#!/bin/bash

# FINDS - Create App Icons Script
# This script creates all required app icons for different platforms

echo "🦈 Creating FINDS app icons..."

# Create base icon (this would normally be created from a design file)
# For now, we'll create placeholder icons

# iOS Icons
echo "Creating iOS icons..."
mkdir -p assets/ios
# 1024x1024 (App Store)
convert -size 1024x1024 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 1024,1024" -fill "#00ff00" -pointsize 200 -gravity center -annotate +0+0 "🦈" assets/ios/icon-1024.png
# 180x180 (iPhone)
convert -size 180x180 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 180,180" -fill "#00ff00" -pointsize 40 -gravity center -annotate +0+0 "🦈" assets/ios/icon-180.png
# 120x120 (iPhone)
convert -size 120x120 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 120,120" -fill "#00ff00" -pointsize 25 -gravity center -annotate +0+0 "🦈" assets/ios/icon-120.png
# 87x87 (iPhone)
convert -size 87x87 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 87,87" -fill "#00ff00" -pointsize 18 -gravity center -annotate +0+0 "🦈" assets/ios/icon-87.png
# 60x60 (iPhone)
convert -size 60x60 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 60,60" -fill "#00ff00" -pointsize 12 -gravity center -annotate +0+0 "🦈" assets/ios/icon-60.png

# Android Icons
echo "Creating Android icons..."
mkdir -p assets/android
# 512x512 (Play Store)
convert -size 512x512 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 512,512" -fill "#00ff00" -pointsize 100 -gravity center -annotate +0+0 "🦈" assets/android/icon-512.png
# 192x192 (Android)
convert -size 192x192 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 192,192" -fill "#00ff00" -pointsize 40 -gravity center -annotate +0+0 "🦈" assets/android/icon-192.png
# 144x144 (Android)
convert -size 144x144 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 144,144" -fill "#00ff00" -pointsize 30 -gravity center -annotate +0+0 "🦈" assets/android/icon-144.png
# 96x96 (Android)
convert -size 96x96 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 96,96" -fill "#00ff00" -pointsize 20 -gravity center -annotate +0+0 "🦈" assets/android/icon-96.png
# 72x72 (Android)
convert -size 72x72 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 72,72" -fill "#00ff00" -pointsize 15 -gravity center -annotate +0+0 "🦈" assets/android/icon-72.png
# 48x48 (Android)
convert -size 48x48 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 48,48" -fill "#00ff00" -pointsize 10 -gravity center -annotate +0+0 "🦈" assets/android/icon-48.png

# PWA Icons
echo "Creating PWA icons..."
# 512x512 (PWA)
convert -size 512x512 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 512,512" -fill "#00ff00" -pointsize 100 -gravity center -annotate +0+0 "🦈" assets/pwa-512x512.png
# 192x192 (PWA)
convert -size 192x192 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 192,192" -fill "#00ff00" -pointsize 40 -gravity center -annotate +0+0 "🦈" assets/pwa-192x192.png

# Desktop Icons
echo "Creating desktop icons..."
# 256x256 (Desktop)
convert -size 256x256 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 256,256" -fill "#00ff00" -pointsize 50 -gravity center -annotate +0+0 "🦈" assets/icon.png
# 128x128 (Desktop)
convert -size 128x128 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 128,128" -fill "#00ff00" -pointsize 25 -gravity center -annotate +0+0 "🦈" assets/icon-128.png
# 64x64 (Desktop)
convert -size 64x64 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 64,64" -fill "#00ff00" -pointsize 12 -gravity center -annotate +0+0 "🦈" assets/icon-64.png
# 32x32 (Desktop)
convert -size 32x32 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 32,32" -fill "#00ff00" -pointsize 6 -gravity center -annotate +0+0 "🦈" assets/icon-32.png
# 16x16 (Desktop)
convert -size 16x16 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 16,16" -fill "#00ff00" -pointsize 3 -gravity center -annotate +0+0 "🦈" assets/icon-16.png

# Favicon
echo "Creating favicon..."
convert -size 32x32 xc:transparent -fill "#0b0b0b" -draw "rectangle 0,0 32,32" -fill "#00ff00" -pointsize 6 -gravity center -annotate +0+0 "🦈" assets/favicon.ico

echo "✅ All app icons created successfully!"
echo "📁 Icons saved to:"
echo "   - iOS: assets/ios/"
echo "   - Android: assets/android/"
echo "   - PWA: assets/"
echo "   - Desktop: assets/"
