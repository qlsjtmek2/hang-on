#!/usr/bin/env bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧹 Legacy NAT Mode 환경 변수 제거 스크립트${NC}\n"

# 1. 현재 세션에서 환경 변수 제거
echo -e "${YELLOW}1️⃣  현재 세션에서 환경 변수 제거...${NC}"
unset ADB_SERVER_SOCKET
unset WSL_HOST
echo -e "${GREEN}   ✓ 현재 세션에서 제거 완료${NC}\n"

# 2. .bashrc에 unset 추가 (중복 방지)
BASHRC_FILE="$HOME/.bashrc"
MARKER="# WSL2 Mirrored Mode - Legacy NAT 환경 변수 제거"

if grep -q "$MARKER" "$BASHRC_FILE"; then
    echo -e "${YELLOW}2️⃣  .bashrc에 이미 unset 설정이 있습니다.${NC}"
else
    echo -e "${YELLOW}2️⃣  .bashrc에 unset 설정 추가...${NC}"
    cat >> "$BASHRC_FILE" << 'EOF'

# WSL2 Mirrored Mode - Legacy NAT 환경 변수 제거
# Mirrored Mode에서는 이 환경 변수들이 있으면 안됨
unset ADB_SERVER_SOCKET
unset WSL_HOST
EOF
    echo -e "${GREEN}   ✓ .bashrc 업데이트 완료${NC}\n"
fi

# 3. 모든 shell 설정 파일에서 관련 설정 검색
echo -e "${YELLOW}3️⃣  Shell 설정 파일 검색 중...${NC}"
FILES_TO_CHECK=(
    "$HOME/.bashrc"
    "$HOME/.bash_profile"
    "$HOME/.profile"
    "$HOME/.bash_aliases"
    "$HOME/.zshrc"
    "/etc/bash.bashrc"
    "/etc/profile"
)

FOUND=0
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        if grep -q "export.*ADB_SERVER_SOCKET\|export.*WSL_HOST" "$file"; then
            echo -e "${RED}   ⚠ 발견: $file${NC}"
            grep -n "ADB_SERVER_SOCKET\|WSL_HOST" "$file"
            FOUND=1
        fi
    fi
done

if [ $FOUND -eq 0 ]; then
    echo -e "${GREEN}   ✓ Shell 설정 파일에서 발견되지 않음${NC}\n"
else
    echo -e "\n${YELLOW}   ℹ 위 파일들을 수동으로 확인하여 해당 라인을 주석 처리하거나 삭제하세요.${NC}\n"
fi

# 4. 검증
echo -e "${YELLOW}4️⃣  새 shell 세션에서 검증...${NC}"
NEW_SHELL_CHECK=$(bash -c 'if [ -z "$ADB_SERVER_SOCKET" ] && [ -z "$WSL_HOST" ]; then echo "clean"; else echo "still_set"; fi')

if [ "$NEW_SHELL_CHECK" = "clean" ]; then
    echo -e "${GREEN}   ✓ 새 shell 세션에서 환경 변수 없음 확인됨${NC}\n"
else
    echo -e "${RED}   ✗ 새 shell 세션에서 여전히 환경 변수가 설정됨${NC}"
    echo -e "${YELLOW}   → 터미널을 완전히 닫고 다시 열어야 할 수 있습니다.${NC}\n"
fi

# 5. 완료 메시지
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ 정리 완료!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}다음 단계:${NC}"
echo -e "  1. 이 터미널 탭을 닫고 새 터미널을 열거나"
echo -e "  2. source ~/.bashrc 실행"
echo -e "\n${YELLOW}검증:${NC}"
echo -e "  echo \$ADB_SERVER_SOCKET    # 빈 값이어야 함"
echo -e "  echo \$WSL_HOST             # 빈 값이어야 함"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
