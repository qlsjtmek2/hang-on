#!/usr/bin/env bash
set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔧 에뮬레이터 Offline 문제 해결 스크립트${NC}\n"

# ADB 경로
ADB="/mnt/c/Users/shinhuigon/AppData/Local/Android/Sdk/platform-tools/adb.exe"

# 1. 현재 에뮬레이터 상태 확인
echo -e "${YELLOW}1️⃣  현재 에뮬레이터 상태 확인...${NC}"
$ADB devices -l
echo ""

# 2. ADB 서버 재시작
echo -e "${YELLOW}2️⃣  ADB 서버 재시작...${NC}"
$ADB kill-server
sleep 2
$ADB start-server
echo -e "${GREEN}   ✓ ADB 서버 재시작 완료${NC}\n"

# 3. 30초 대기 (에뮬레이터 부팅 대기)
echo -e "${YELLOW}3️⃣  에뮬레이터 부팅 대기 중 (최대 60초)...${NC}"
for i in {1..60}; do
    sleep 1
    STATUS=$($ADB devices | grep -w "emulator-5554" | awk '{print $2}')
    if [ "$STATUS" = "device" ]; then
        echo -e "${GREEN}   ✓ 에뮬레이터 부팅 완료! (${i}초)${NC}\n"
        $ADB devices -l
        echo -e "\n${GREEN}✅ 문제 해결 완료!${NC}"
        exit 0
    fi
    if [ $((i % 10)) -eq 0 ]; then
        echo -e "${YELLOW}   ... ${i}초 경과 (현재 상태: ${STATUS:-없음})${NC}"
    fi
done

# 4. 여전히 offline인 경우
echo -e "\n${RED}⚠ 에뮬레이터가 여전히 offline 상태입니다.${NC}"
echo -e "${YELLOW}다음 해결책을 시도하세요:${NC}\n"
echo -e "  1. ${YELLOW}에뮬레이터 재시작 (권장)${NC}"
echo -e "     npm run emulator:stop"
echo -e "     npm run emulator:phone"
echo -e ""
echo -e "  2. ${YELLOW}Windows에서 에뮬레이터 GUI 확인${NC}"
echo -e "     - 에뮬레이터 창이 보이는지 확인"
echo -e "     - 부팅 진행 상태 확인"
echo -e "     - 에러 메시지가 있는지 확인"
echo -e ""
echo -e "  3. ${YELLOW}완전 재시작${NC}"
echo -e "     - 에뮬레이터 종료: npm run emulator:stop"
echo -e "     - ADB 서버 종료: adb kill-server"
echo -e "     - 에뮬레이터 재시작: npm run emulator:phone"
echo -e ""
