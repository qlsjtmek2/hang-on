#!/usr/bin/env bash
set -e

# Legacy NAT Mode 환경 변수 제거 (Mirrored Mode와 충돌)
unset ADB_SERVER_SOCKET
unset WSL_HOST

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Hang On 개발 세션 시작...${NC}\n"

# 1. 에뮬레이터 상태 확인 및 시작
EMULATOR_STATUS=$(adb devices | grep -w "emulator-5554" | awk '{print $2}')

if [ "$EMULATOR_STATUS" = "device" ]; then
    echo -e "${GREEN}✓ 에뮬레이터가 이미 실행 중입니다.${NC}\n"
elif [ "$EMULATOR_STATUS" = "offline" ]; then
    echo -e "${YELLOW}⏳ 에뮬레이터가 부팅 중입니다. 완료 대기...${NC}"
    # offline → device 전환 대기 (최대 90초)
    for i in {1..90}; do
        sleep 1
        STATUS=$(adb devices | grep -w "emulator-5554" | awk '{print $2}')
        if [ "$STATUS" = "device" ]; then
            echo -e "${GREEN}✓ 에뮬레이터 부팅 완료 (${i}초)${NC}\n"
            break
        fi
        # 5초마다 진행 상황 표시
        if [ $((i % 5)) -eq 0 ]; then
            echo -e "${YELLOW}   대기 중... ${i}/90초 (현재 상태: ${STATUS:-없음})${NC}"
        fi
        if [ $i -eq 90 ]; then
            echo -e "${RED}✗ 에뮬레이터 부팅 시간 초과 (offline 상태 유지)${NC}"
            echo -e "${YELLOW}힌트: 에뮬레이터를 재시작해보세요: npm run emulator:stop${NC}"
            exit 1
        fi
    done
else
    echo -e "${YELLOW}1️⃣  Android 에뮬레이터 시작 중...${NC}"
    npm run emulator:phone > /dev/null 2>&1 &

    # 에뮬레이터 부팅 대기 (최대 90초)
    echo -e "${YELLOW}   에뮬레이터 부팅 대기 중...${NC}"
    for i in {1..90}; do
        sleep 1
        STATUS=$(adb devices | grep -w "emulator-5554" | awk '{print $2}')
        if [ "$STATUS" = "device" ]; then
            echo -e "${GREEN}   ✓ 에뮬레이터 부팅 완료 (${i}초)${NC}\n"
            break
        fi
        # 5초마다 진행 상황 표시
        if [ $((i % 5)) -eq 0 ]; then
            echo -e "${YELLOW}      대기 중... ${i}/90초 (현재 상태: ${STATUS:-없음})${NC}"
        fi
        if [ $i -eq 90 ]; then
            echo -e "${RED}   ✗ 에뮬레이터 부팅 시간 초과${NC}"
            exit 1
        fi
    done
fi

# 2. Metro 서버 시작 (백그라운드)
echo -e "${YELLOW}2️⃣  Metro 서버 시작 중...${NC}"
npm start > metro.log 2>&1 &
METRO_PID=$!
echo -e "${GREEN}   ✓ Metro 서버 시작됨 (PID: $METRO_PID)${NC}\n"

# Metro 서버가 준비될 때까지 대기
echo -e "${YELLOW}   Metro 서버 준비 대기 중...${NC}"
for i in {1..30}; do
    sleep 1
    if curl -s http://127.0.0.1:8081/status > /dev/null 2>&1; then
        echo -e "${GREEN}   ✓ Metro 서버 준비 완료 (${i}초)${NC}\n"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}   ✗ Metro 서버 시작 시간 초과${NC}"
        kill $METRO_PID 2>/dev/null || true
        exit 1
    fi
done

# 3. 앱 빌드 및 설치
echo -e "${YELLOW}3️⃣  앱 빌드 및 설치 중...${NC}"
if npm run android; then
    echo -e "\n${GREEN}✅ 개발 세션 시작 완료!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Metro 로그:${NC} tail -f metro.log"
    echo -e "${YELLOW}중지하기:${NC} npm run emulator:stop && kill $METRO_PID"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
else
    echo -e "\n${RED}✗ 앱 빌드 실패${NC}"
    kill $METRO_PID 2>/dev/null || true
    exit 1
fi
