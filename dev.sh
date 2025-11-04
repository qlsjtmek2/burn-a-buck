#!/bin/bash

# React Native Development Helper Script
# Burn a Buck 프로젝트 개발 헬퍼

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 Burn a Buck - Development Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Kill existing Metro bundler
echo "🛑 Stopping existing Metro bundler..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
lsof -ti:19000 | xargs kill -9 2>/dev/null || true
lsof -ti:19001 | xargs kill -9 2>/dev/null || true
echo "   ✓ Metro ports cleared"

# 2. Clean cache
echo ""
echo "🧹 Cleaning caches..."
watchman watch-del-all 2>/dev/null || echo "   (watchman not available, skipping)"
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/metro-* /tmp/react-* 2>/dev/null || true
echo "   ✓ Cache cleaned"

# 3. Check Android device
echo ""
echo "📱 Checking Android device..."
if adb devices | grep -q "device$"; then
    echo "   ✓ Android device connected"
else
    echo "   ⚠️  No Android device detected"
    echo "   Please connect a device or start an emulator"
fi

# 4. Start development server
echo ""
echo "🚀 Starting Expo development server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start --clear --android
