#!/bin/bash

# WSL2 Android 개발 환경 검증 스크립트
# 작성일: 2025-11-12
# 용도: Mirrored Mode 및 ADB 연결 확인

echo "========================================"
echo "WSL2 Android 개발 환경 검증"
echo "========================================"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 검증 카운터
PASSED=0
FAILED=0
WARNINGS=0

# 검증 함수
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

# 1. WSL2 Networking Mode 확인
echo -e "${CYAN}[1/7] WSL2 Networking Mode 확인${NC}"
if command -v wslinfo &> /dev/null; then
    NETWORKING_MODE=$(wslinfo --networking-mode 2>/dev/null || echo "unknown")
    if [ "$NETWORKING_MODE" = "mirrored" ]; then
        check_pass "Networking Mode: mirrored ✅"
    elif [ "$NETWORKING_MODE" = "nat" ]; then
        check_fail "Networking Mode: nat (mirrored 필요)"
        echo "  → Windows .wslconfig 파일 설정 필요 (docs/WINDOWS_SETUP_GUIDE.md 참조)"
    else
        check_warn "Networking Mode: 확인 불가 (wslinfo 사용 불가)"
    fi
else
    check_warn "wslinfo 명령어 없음 (WSL 버전 확인 필요)"
fi
echo ""

# 2. Windows ADB Alias 확인
echo -e "${CYAN}[2/7] Windows ADB Alias 확인${NC}"
if command -v adb &> /dev/null; then
    ADB_PATH=$(which adb 2>/dev/null || echo "")
    if [[ "$ADB_PATH" == *"/mnt/c/"* ]]; then
        check_pass "Windows ADB alias 설정됨: $ADB_PATH"
    elif [ -n "$ADB_PATH" ]; then
        check_warn "ADB 경로: $ADB_PATH (Windows ADB가 아님)"
        echo "  → ~/.bashrc에 Windows ADB alias 추가 권장"
    else
        check_fail "ADB 명령어 없음"
        echo "  → ~/.bashrc에 Windows ADB alias 추가 필요 (docs/WSL2_SETUP_GUIDE.md 참조)"
    fi
else
    check_fail "ADB alias/명령어 없음"
    echo "  → ~/.bashrc에 alias 추가: alias adb=\"/mnt/c/Users/shinhuigon/AppData/Local/Android/Sdk/platform-tools/adb.exe\""
fi
echo ""

# 3. ADB 버전 확인
echo -e "${CYAN}[3/7] ADB 버전 확인${NC}"
if command -v adb &> /dev/null; then
    ADB_VERSION=$(adb version 2>/dev/null | head -1 || echo "")
    if [ -n "$ADB_VERSION" ]; then
        check_pass "ADB 버전: $ADB_VERSION"
    else
        check_fail "ADB 버전 확인 실패"
    fi
else
    check_fail "ADB 명령어 없음"
fi
echo ""

# 4. ADB 서버 연결 확인
echo -e "${CYAN}[4/7] ADB 디바이스 연결 확인${NC}"
if command -v adb &> /dev/null; then
    DEVICES=$(adb devices 2>/dev/null | grep -v "List of devices" | grep -v "^$" || echo "")
    if [ -n "$DEVICES" ]; then
        check_pass "ADB 디바이스 연결됨:"
        echo "$DEVICES" | while read line; do
            echo "     $line"
        done
    else
        check_warn "연결된 ADB 디바이스 없음"
        echo "  → Windows에서 에뮬레이터 실행: npm run emulator:phone"
    fi
else
    check_fail "ADB 명령어 없음"
fi
echo ""

# 5. Metro Bundler 설정 확인
echo -e "${CYAN}[5/7] Metro Bundler 설정 확인${NC}"
if [ -f "package.json" ]; then
    START_SCRIPT=$(grep '"start"' package.json | grep -o '"react-native start.*"' || echo "")
    if [[ "$START_SCRIPT" == *"--host 127.0.0.1"* ]]; then
        check_pass "Metro 설정: --host 127.0.0.1 포함 ✅"
    else
        check_warn "Metro 설정: --host 127.0.0.1 누락"
        echo "  → package.json 수정 필요: \"start\": \"react-native start --host 127.0.0.1\""
    fi
else
    check_fail "package.json 파일 없음"
fi
echo ""

# 6. Android 환경 변수 확인
echo -e "${CYAN}[6/7] Android 환경 변수 확인${NC}"
if [ -n "$ANDROID_HOME" ] && [ -n "$ANDROID_SDK_ROOT" ]; then
    check_pass "ANDROID_HOME: $ANDROID_HOME"
    check_pass "ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
else
    check_fail "Android 환경 변수 미설정"
    echo "  → ~/.bashrc에 환경 변수 추가 필요"
fi
echo ""

# 7. Legacy Mode 설정 확인 (비활성화 권장)
echo -e "${CYAN}[7/7] Legacy Mode 설정 확인${NC}"
if [ -n "$ADB_SERVER_SOCKET" ]; then
    check_warn "ADB_SERVER_SOCKET 설정됨: $ADB_SERVER_SOCKET"
    echo "  → Mirrored Mode 사용 시 비활성화 권장 (주석 처리)"
else
    check_pass "ADB_SERVER_SOCKET 미설정 (Mirrored Mode에 적합)"
fi
echo ""

# 결과 요약
echo "========================================"
echo -e "${CYAN}검증 결과 요약${NC}"
echo "========================================"
echo -e "${GREEN}통과: $PASSED${NC}"
echo -e "${RED}실패: $FAILED${NC}"
echo -e "${YELLOW}경고: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ 모든 필수 검증 통과!${NC}"
    echo ""
    echo "다음 단계:"
    echo "1. Windows에서 에뮬레이터 실행: npm run emulator:phone"
    echo "2. Metro 서버 시작: npm start"
    echo "3. 앱 빌드 및 실행: npm run android"
else
    echo -e "${RED}❌ 일부 검증 실패${NC}"
    echo ""
    echo "문제 해결:"
    echo "1. docs/WINDOWS_SETUP_GUIDE.md - Windows 설정"
    echo "2. docs/WSL2_SETUP_GUIDE.md - WSL2 설정"
    echo "3. 설정 완료 후 다시 검증: ./scripts/verify-wsl2-setup.sh"
fi

echo ""
exit $([ $FAILED -eq 0 ] && echo 0 || echo 1)
