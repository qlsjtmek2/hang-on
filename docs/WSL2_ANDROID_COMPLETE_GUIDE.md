# WSL2 + Windows Android 개발 환경 완전 가이드

> **최종 업데이트**: 2025-11-12
> **검증 완료**: React Native 0.82 + WSL2 Mirrored Mode
> **작성 기반**: 실전 구축 및 트러블슈팅 경험

---

## 📋 목차

- [빠른 시작 (5분)](#-빠른-시작-5분)
- [왜 이 설정이 필요한가?](#-왜-이-설정이-필요한가)
- [단계별 상세 가이드](#-단계별-상세-가이드)
- [검증 및 테스트](#-검증-및-테스트)
- [트러블슈팅](#-트러블슈팅)
- [실전 교훈 및 함정](#-실전-교훈-및-함정)
- [FAQ](#-faq)

---

## ⚡ 빠른 시작 (5분)

### 전제 조건

- Windows 11 22H2 이상 (Mirrored Mode 지원)
- WSL2 Ubuntu 설치됨
- Windows에 Android Studio 설치됨
- 에뮬레이터 1개 이상 생성됨

### 3단계 설정

#### 1. Windows 설정 (30초)

`C:\Users\[사용자명]\.wslconfig` 파일 생성/수정:

```ini
[wsl2]
networkingMode=mirrored
hostAddressLoopback=true
dnsTunneling=true
autoProxy=true
```

PowerShell에서 WSL2 재시작:
```powershell
wsl --shutdown
```

#### 2. WSL2 설정 (1분)

`~/.bashrc` 파일 끝에 추가:

```bash
# Android SDK
export ANDROID_HOME=/home/사용자명/Android/Sdk
export ANDROID_SDK_ROOT=/home/사용자명/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows ADB 사용 (중요!)
alias adb="/mnt/c/Users/사용자명/AppData/Local/Android/Sdk/platform-tools/adb.exe"
```

**⚠️ 중요**: Legacy Mode 설정이 있다면 **반드시 주석 처리**:
```bash
# export WSL_HOST=$(ip route | grep default | awk '{print $3}')  # 주석 처리
# export ADB_SERVER_SOCKET=tcp:$WSL_HOST:5037                    # 주석 처리
```

적용:
```bash
source ~/.bashrc
```

#### 3. 검증 (1분)

```bash
# 1. Networking Mode 확인
wslinfo --networking-mode
# 출력: mirrored ✅

# 2. 전체 환경 검증
./scripts/verify-wsl2-setup.sh
```

### 완료!

이제 다음 명령어로 개발 시작:

```bash
# 터미널 1: 에뮬레이터 실행
npm run emulator:phone

# 터미널 2: Metro 서버
npm start

# 터미널 3: 앱 실행
npm run android
```

---

## 🤔 왜 이 설정이 필요한가?

### 문제의 본질

WSL2는 기본적으로 **NAT 네트워크**를 사용합니다:

```
Windows Network: 192.168.x.x
WSL2 Network:    172.x.x.x (별도 IP)
```

이로 인해 발생하는 문제:

1. **Gradle installDebug 실패**
   - WSL2의 Gradle → Windows ADB 서버(127.0.0.1:5037) 연결 불가
   - DeviceMonitor가 다른 네트워크 대역의 ADB 서버를 찾지 못함

2. **Metro Bundler 연결 실패**
   - 에뮬레이터 → WSL2 Metro 서버(8081 포트) 연결 불가
   - JavaScript 번들 로딩 실패

### Mirrored Mode 해결 방식

**네트워크를 미러링**하여 WSL2와 Windows가 **같은 localhost 공유**:

```
Before (NAT):
Windows: 192.168.1.100
WSL2:    172.29.36.1 ❌ 서로 다른 네트워크

After (Mirrored):
Windows: 192.168.1.100
WSL2:    192.168.1.100 ✅ 동일한 네트워크
localhost 공유 ✅
```

결과:
- ✅ WSL2 Gradle → Windows ADB (127.0.0.1:5037) 직접 연결
- ✅ 에뮬레이터 → WSL2 Metro (127.0.0.1:8081) 직접 연결
- ✅ 포트 포워딩 불필요
- ✅ 환경 변수 설정 최소화

---

## 📖 단계별 상세 가이드

### Step 1: Windows 설정

#### 1-1. Mirrored Mode 활성화

**위치**: `C:\Users\[사용자명]\.wslconfig`

**내용**:
```ini
[wsl2]
networkingMode=mirrored
hostAddressLoopback=true
dnsTunneling=true
autoProxy=true
```

**각 옵션 설명**:
- `networkingMode=mirrored`: WSL2 네트워크를 Windows와 미러링
- `hostAddressLoopback=true`: WSL2에서 Windows의 127.0.0.1 접근 허용
- `dnsTunneling=true`: DNS 쿼리 터널링
- `autoProxy=true`: Windows 프록시 설정 자동 사용

**적용**:
```powershell
wsl --shutdown
# 모든 WSL2 인스턴스 종료 후 재시작
```

#### 1-2. 방화벽 규칙 (선택사항)

**자동 설정 (권장)**:
```powershell
# 관리자 권한 PowerShell
cd 프로젝트경로
.\scripts\setup-windows-firewall.ps1
```

**수동 설정**:
Windows Defender 방화벽 → 고급 설정 → 인바운드 규칙 → 새 규칙

- 포트: TCP 5037 (ADB), 8081 (Metro)
- 작업: 연결 허용
- 프로필: 도메인, 프라이빗, 퍼블릭
- 원격 IP: 172.16.0.0/12 (WSL2 IP 범위)

### Step 2: WSL2 설정

#### 2-1. Android SDK 환경 변수

`~/.bashrc` 파일에 추가:

```bash
# Android SDK 경로
export ANDROID_HOME=/home/사용자명/Android/Sdk
export ANDROID_SDK_ROOT=/home/사용자명/Android/Sdk

# PATH 추가
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**경로 확인**:
```bash
ls ~/Android/Sdk
# 출력: build-tools  cmdline-tools  emulator  licenses  patcher  platform-tools  platforms
```

#### 2-2. Windows ADB Alias 설정 (핵심!)

`~/.bashrc` 파일에 추가:

```bash
# Windows ADB 사용 (Mirrored Mode에서 필수)
alias adb="/mnt/c/Users/사용자명/AppData/Local/Android/Sdk/platform-tools/adb.exe"
```

**❌ 환경 변수 방식 (사용 안 함)**:
```bash
# ❌ 이 방식은 사용하지 마세요
export ADB_SERVER_SOCKET=tcp:172.x.x.x:5037
```

**이유**:
- Mirrored Mode는 localhost를 공유하므로 환경 변수 불필요
- `ADB_SERVER_SOCKET`이 설정되어 있으면 Mirrored Mode에서도 NAT 방식으로 연결 시도
- Windows ADB alias만으로 충분

#### 2-3. Legacy Mode 설정 제거 (중요!)

**기존 Legacy Mode 설정이 있다면 반드시 주석 처리**:

```bash
# ❌ 주석 처리하세요
# export WSL_HOST=$(ip route | grep default | awk '{print $3}')
# export ADB_SERVER_SOCKET=tcp:$WSL_HOST:5037
```

**왜 문제가 되나?**
- React Native CLI는 환경 변수를 우선 사용
- `ADB_SERVER_SOCKET`이 설정되어 있으면 Mirrored Mode를 무시하고 NAT 연결 시도
- 결과: Mirrored Mode임에도 연결 실패

#### 2-4. 설정 적용

```bash
source ~/.bashrc

# 환경 변수 확인
echo $ANDROID_HOME
echo $ADB_SERVER_SOCKET  # 출력 없어야 정상

# ADB 확인
which adb
# 출력: /mnt/c/Users/사용자명/AppData/Local/Android/Sdk/platform-tools/adb.exe
```

### Step 3: React Native 프로젝트 설정

#### 3-1. Metro Bundler IPv4 바인딩

`package.json`:

```json
{
  "scripts": {
    "start": "react-native start --host 127.0.0.1",
    "android": "react-native run-android --deviceId=emulator-5554"
  }
}
```

**왜 `--host 127.0.0.1`?**
- Metro가 기본적으로 IPv6(::)에 바인딩될 수 있음
- 일부 에뮬레이터는 IPv6를 지원하지 않음
- IPv4로 명시하여 호환성 보장

#### 3-2. 에뮬레이터 관리 스크립트

`package.json`:

```json
{
  "scripts": {
    "emulator:phone": "powershell.exe -Command \"& { \\$env:JAVA_HOME='C:\\Program Files\\Android\\Android Studio\\jbr'; & 'C:\\Users\\사용자명\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe' -avd Phone_9_16 }\"",
    "emulator:list": "powershell.exe -Command \"& { \\$env:JAVA_HOME='C:\\Program Files\\Android\\Android Studio\\jbr'; & 'C:\\Users\\사용자명\\AppData\\Local\\Android\\Sdk\\cmdline-tools\\latest\\bin\\avdmanager.bat' list avd }\"",
    "emulator:devices": "adb devices",
    "emulator:stop": "adb emu kill"
  }
}
```

---

## ✅ 검증 및 테스트

### 자동 검증 스크립트

```bash
./scripts/verify-wsl2-setup.sh
```

**검증 항목 (7가지)**:
1. ✅ WSL2 Networking Mode: mirrored
2. ✅ Windows ADB alias 설정
3. ✅ ADB 버전 확인
4. ✅ ADB 디바이스 연결
5. ✅ Metro Bundler 설정 (--host 127.0.0.1)
6. ✅ Android 환경 변수 (ANDROID_HOME, ANDROID_SDK_ROOT)
7. ✅ Legacy Mode 설정 없음 (ADB_SERVER_SOCKET 미설정)

**출력 예시**:
```
========================================
WSL2 Android 개발 환경 검증
========================================

[1/7] WSL2 Networking Mode 확인
✓ Networking Mode: mirrored ✅

[2/7] Windows ADB Alias 확인
✓ Windows ADB alias 설정됨: /mnt/c/Users/.../adb.exe

...

========================================
검증 결과 요약
========================================
통과: 7
실패: 0
경고: 0

✅ 모든 필수 검증 통과!
```

### 수동 검증

#### 1. Networking Mode 확인
```bash
wslinfo --networking-mode
# 출력: mirrored ✅
```

#### 2. 환경 변수 확인
```bash
env | grep ADB
# ADB_SERVER_SOCKET이 출력되면 안 됨 ❌
# 출력 없으면 정상 ✅
```

#### 3. ADB 연결 확인
```bash
# 에뮬레이터 실행 후
adb devices
# 출력:
# List of devices attached
# emulator-5554   device
```

#### 4. 전체 워크플로우 테스트

**터미널 1**:
```bash
npm run emulator:phone
# 에뮬레이터 시작 대기 (30-60초)
```

**터미널 2**:
```bash
npm start
# Metro Bundler 시작
# 출력: Metro is now listening on 127.0.0.1:8081
```

**터미널 3**:
```bash
npm run android
# 예상 결과:
# - Gradle 빌드 성공
# - APK 설치 성공 (Installing APK 'app-debug.apk')
# - 앱 실행 성공 (Starting: Intent...)
```

**성공 기준**:
- ✅ 빌드 시간: 30-60초 (초기), 10-20초 (증분)
- ✅ 에러 없이 APK 설치
- ✅ 에뮬레이터에 앱 표시

---

## 🔧 트러블슈팅

### 문제 1: ADB 연결 실패

**증상**:
```
adb: failed to check server version: cannot connect to daemon at tcp:172.x.x.x:5037
```

**원인**:
`ADB_SERVER_SOCKET` 환경 변수가 Legacy Mode(NAT)로 설정됨

**해결**:
```bash
# 1. ~/.bashrc 확인
grep ADB_SERVER_SOCKET ~/.bashrc
# Legacy Mode 설정이 있다면 주석 처리

# 2. 현재 셸에서 제거
unset ADB_SERVER_SOCKET
unset WSL_HOST

# 3. 새 셸 시작
exec bash

# 4. 확인
env | grep ADB
# 출력 없어야 함 ✅
```

### 문제 2: Gradle installDebug 실패

**증상**:
```
> Task :app:installDebug FAILED
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: No connected devices!
```

**원인**:
Mirrored Mode가 활성화되지 않음

**해결**:
```bash
# 1. Networking Mode 확인
wslinfo --networking-mode
# 출력이 "nat"이면 Mirrored Mode 설정 필요

# 2. .wslconfig 확인
cat /mnt/c/Users/사용자명/.wslconfig
# networkingMode=mirrored 있는지 확인

# 3. WSL2 재시작
wsl --shutdown
# 모든 터미널 종료 후 재시작

# 4. 재확인
wslinfo --networking-mode
# 출력: mirrored ✅
```

### 문제 3: Metro Bundler 연결 실패

**증상**:
앱이 설치되지만 화면이 빨간색 에러:
```
Unable to load script. Make sure you're running Metro bundler.
```

**원인**:
Metro가 IPv6나 다른 호스트에 바인딩됨

**해결**:
```bash
# 1. package.json 확인
grep "\"start\"" package.json
# "start": "react-native start --host 127.0.0.1" 있어야 함

# 2. Metro 재시작
npm start

# 3. Metro 로그 확인
# 출력: "Metro is now listening on 127.0.0.1:8081" ✅
```

### 문제 4: 검증 스크립트가 중간에 멈춤

**증상**:
`./scripts/verify-wsl2-setup.sh`가 첫 번째 실패 후 종료

**원인**:
스크립트에 `set -e`가 있어서 첫 에러에서 종료

**해결**:
스크립트는 이미 수정되었으므로 최신 버전 사용:
```bash
# Git에서 최신 버전 받기
git pull origin main

# 또는 직접 확인
head -10 scripts/verify-wsl2-setup.sh
# "set -e"가 없어야 함 ✅
```

### 문제 5: 에뮬레이터가 디바이스 목록에 없음

**증상**:
```bash
adb devices
# List of devices attached
# (비어있음)
```

**해결**:
```bash
# 1. 에뮬레이터 실행 확인 (Windows에서)
adb devices  # Windows PowerShell에서

# 2. WSL2에서 Windows ADB 사용 확인
which adb
# 출력: /mnt/c/.../adb.exe ✅

# 3. ADB 서버 재시작
adb kill-server
adb start-server
adb devices
```

---

## 💡 실전 교훈 및 함정

### 교훈 1: 환경 변수가 모든 것을 망칠 수 있다

**실패 사례**:
```bash
# ~/.bashrc가 올바르게 설정됨
# Mirrored Mode도 활성화됨
# 하지만 npm run android 실패 ❌

# 원인: 현재 셸에 Legacy Mode 환경 변수가 남아있음
echo $ADB_SERVER_SOCKET
# tcp:172.29.36.1:5037 ← 이게 문제!
```

**교훈**:
- ✅ `~/.bashrc`를 수정해도 **현재 실행 중인 셸은 영향 받지 않음**
- ✅ 설정 변경 후 반드시 `source ~/.bashrc` 또는 새 터미널
- ✅ 검증 스크립트로 환경 변수 확인 필수

### 교훈 2: Mirrored Mode에서 환경 변수는 독

**잘못된 접근**:
```bash
# Mirrored Mode인데도 불구하고
export ADB_SERVER_SOCKET=tcp:172.x.x.x:5037  # ❌ 틀렸음!
```

**올바른 접근**:
```bash
# Mirrored Mode는 localhost 공유
# 환경 변수 설정 불필요
alias adb="/mnt/c/.../adb.exe"  # ✅ 이것만으로 충분
```

**이유**:
- Mirrored Mode는 WSL2와 Windows가 같은 127.0.0.1 공유
- `ADB_SERVER_SOCKET`을 설정하면 React Native CLI가 이를 우선 사용
- 결과: Mirrored Mode를 무시하고 NAT 방식으로 연결 시도 → 실패

### 교훈 3: package.json에 방어 코드는 불필요

**초기 시도**:
```json
{
  "scripts": {
    "android": "bash -c 'unset ADB_SERVER_SOCKET WSL_HOST && react-native run-android'"
  }
}
```

**개선**:
```json
{
  "scripts": {
    "android": "react-native run-android"
  }
}
```

**이유**:
- `~/.bashrc`가 올바르게 설정되면 환경 변수가 애초에 없음
- 매번 `unset`은 과도한 방어 코딩
- 근본 원인(~/.bashrc)을 수정하는 게 올바른 접근

### 교훈 4: 검증 스크립트는 실패를 계속 보고해야 함

**잘못된 스크립트**:
```bash
#!/bin/bash
set -e  # ❌ 첫 실패에서 종료

check_networking_mode
check_adb_alias  # 여기서 실패하면 아래는 실행 안 됨
check_environment
...
```

**올바른 스크립트**:
```bash
#!/bin/bash
# set -e 없음 ✅

check_networking_mode  # 실패해도 계속
check_adb_alias        # 실패해도 계속
check_environment      # 실패해도 계속
...

# 마지막에 결과 요약
echo "통과: $PASSED"
echo "실패: $FAILED"
```

**이유**:
- 검증 스크립트는 **모든 문제를 찾아야** 함
- 첫 문제만 보고하면 나머지 문제를 놓침
- 전체 상황 파악이 트러블슈팅의 핵심

### 함정 1: Windows ADB vs WSL2 ADB

**문제**:
```bash
# WSL2에 ADB 설치
sudo apt install adb

# 하지만 에뮬레이터는 Windows ADB 서버에 연결됨
# 결과: WSL2 ADB와 Windows ADB가 충돌 ❌
```

**해결**:
```bash
# WSL2 ADB 제거 (선택사항)
sudo apt remove adb

# Windows ADB만 사용
alias adb="/mnt/c/.../adb.exe"  # ✅
```

### 함정 2: 에뮬레이터 이름의 공백

**문제**:
```bash
npm run emulator:phone
# 에뮬레이터 이름: "Pixel 5 API 33"
# PowerShell에서 파싱 오류 ❌
```

**해결**:
```bash
# AVD 이름에 공백 제거
# "Pixel 5 API 33" → "Pixel_5_API_33" ✅

# 또는 package.json에서 이스케이프
"emulator:phone": "... -avd 'Pixel 5 API 33'"
```

### 함정 3: Java Home 경로 오류

**문제**:
```bash
npm run emulator:phone
# Error: JAVA_HOME is not set
```

**해결**:
```json
{
  "scripts": {
    "emulator:phone": "powershell.exe -Command \"& { \\$env:JAVA_HOME='C:\\Program Files\\Android\\Android Studio\\jbr'; & 'C:\\...' }\""
  }
}
```

---

## ❓ FAQ

### Q1: Mirrored Mode vs Legacy Mode, 어떤 게 나을까?

**A**: **Mirrored Mode 강력 권장**

| 항목 | Mirrored Mode | Legacy Mode |
|------|---------------|-------------|
| 설정 복잡도 | ⭐⭐ (간단) | ⭐⭐⭐⭐⭐ (복잡) |
| 성공률 | 70-80% | 100% |
| 유지보수 | 쉬움 | 어려움 |
| 미래성 | Microsoft 공식 | 해킹적 방법 |
| 환경 변수 | 최소 | 다수 |
| socat 필요 | ❌ | ✅ |

**Mirrored Mode 실패 시에만** Legacy Mode 고려

### Q2: ~/.bashrc vs /etc/environment, 어디에 설정?

**A**: **~/.bashrc 권장**

이유:
- 사용자별 설정 가능
- 수정이 쉬움
- root 권한 불필요
- alias 사용 가능 (`/etc/environment`는 alias 불가)

### Q3: Windows ADB vs WSL2 ADB, 꼭 Windows 것을 써야 하나?

**A**: **Mirrored Mode에서는 Windows ADB 필수**

이유:
- 에뮬레이터가 Windows ADB 서버(127.0.0.1:5037)에 연결됨
- WSL2 ADB는 별도 서버 시작 → 충돌
- Windows ADB alias로 같은 서버 공유

### Q4: 환경 변수 설정 후 반드시 재부팅?

**A**: **아니요, `source ~/.bashrc`면 충분**

```bash
# 1. ~/.bashrc 수정

# 2. 현재 셸에 적용
source ~/.bashrc

# 3. 확인
echo $ANDROID_HOME
```

단, **Mirrored Mode 활성화는 WSL2 재시작 필요**:
```powershell
wsl --shutdown
```

### Q5: 검증 스크립트 경고는 무시해도 되나?

**A**: **대부분 무시 가능, 하지만 확인은 필수**

**무시 가능한 경고**:
- ⚠️ ADB 경로가 Windows ADB가 아님 → alias가 우선순위 높으므로 OK
- ⚠️ 연결된 디바이스 없음 → 에뮬레이터 실행 전이면 정상

**무시하면 안 되는 경고**:
- ⚠️ ADB_SERVER_SOCKET 설정됨 → **반드시 제거**
- ⚠️ Metro 설정 --host 누락 → **추가 필요**

### Q6: package.json의 deviceId는 꼭 필요?

**A**: **선택사항, 하지만 권장**

```json
{
  "scripts": {
    "android": "react-native run-android --deviceId=emulator-5554"
  }
}
```

**장점**:
- 여러 디바이스 연결 시 특정 디바이스 지정
- 빌드 시간 단축 (디바이스 자동 감지 생략)

**단점**:
- 에뮬레이터 포트가 다르면 수정 필요

**확인**:
```bash
adb devices
# emulator-5554   device ← 이 번호 사용
```

### Q7: npm run android가 계속 실패하면?

**A**: **체크리스트 순서대로 확인**

```bash
# 1. Networking Mode
wslinfo --networking-mode
# mirrored ✅

# 2. 환경 변수
env | grep ADB
# 출력 없음 ✅

# 3. ADB 연결
adb devices
# emulator-5554   device ✅

# 4. Metro 서버
npm start
# listening on 127.0.0.1:8081 ✅

# 5. 전체 검증
./scripts/verify-wsl2-setup.sh
# 통과: 7, 실패: 0 ✅

# 6. Legacy Mode 폴백
npm run android:legacy
```

### Q8: Claude Code 프로세스의 환경 변수는?

**A**: **새 터미널 사용 또는 무시**

Claude Code의 bash 프로세스가 Legacy Mode 환경 변수를 가지고 있어도:
- ✅ `~/.bashrc`가 올바르게 설정되어 있으면 OK
- ✅ 새 터미널을 열면 깨끗한 환경
- ✅ package.json의 npm 스크립트는 자식 프로세스 → ~/.bashrc 상속

**굳이 신경 쓸 필요 없음**, 하지만 깔끔하게 하려면:
```bash
exec bash  # 현재 셸 재시작
```

---

## 📚 참고 자료

- [bergmannjg - React Native on WSL2](https://gist.github.com/bergmannjg/461958db03c6ae41a66d264ae6504ade)
- [Microsoft WSL Mirrored Mode Docs](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking)
- [React Native Debugging](https://reactnative.dev/docs/debugging)
- [Android ADB](https://developer.android.com/tools/adb)

---

## 🎯 요약

### 핵심 3가지

1. **Windows .wslconfig에 Mirrored Mode 설정**
   ```ini
   [wsl2]
   networkingMode=mirrored
   ```

2. **~/.bashrc에 Windows ADB alias**
   ```bash
   alias adb="/mnt/c/Users/사용자명/AppData/Local/Android/Sdk/platform-tools/adb.exe"
   ```

3. **Legacy Mode 환경 변수 제거**
   ```bash
   # ❌ 이런 설정 있으면 주석 처리
   # export ADB_SERVER_SOCKET=tcp:...
   ```

### 검증

```bash
./scripts/verify-wsl2-setup.sh
# 통과: 7, 실패: 0 ✅
```

### 개발 시작

```bash
npm run emulator:phone  # 에뮬레이터
npm start               # Metro
npm run android         # 앱 실행
```

---

**작성자**: Claude Code 기반 실전 구축
**라이선스**: MIT
**기여**: Issues 및 PR 환영
