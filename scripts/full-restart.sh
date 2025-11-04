#!/bin/bash

# 완전한 Metro/Expo 재시작 스크립트
# 사용법: bash scripts/full-restart.sh

echo "🧹 전체 캐시 정리 시작..."

# 1. 모든 프로세스 종료
echo "1️⃣ Metro/Expo 프로세스 종료 중..."
pkill -f "expo start" 2>/dev/null || true
pkill -f "metro" 2>/dev/null || true
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 2

# 2. 캐시 디렉토리 삭제
echo "2️⃣ 캐시 디렉토리 삭제 중..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/react-*
rm -rf $HOME/.metro

# 3. Watchman 캐시 정리 (설치되어 있다면)
if command -v watchman &> /dev/null; then
    echo "3️⃣ Watchman 캐시 정리 중..."
    watchman watch-del-all 2>/dev/null || true
else
    echo "3️⃣ Watchman이 설치되어 있지 않습니다 (선택사항)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 캐시 정리 완료!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "이제 다음 명령어로 앱을 시작하세요:"
echo ""
echo "  npx expo start --clear --tunnel"
echo ""
echo "또는 웹만 실행:"
echo ""
echo "  npx expo start --clear --web"
echo ""
