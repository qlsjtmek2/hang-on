---
name: mobile-emulator-manager
description: WSL2 환경에서 Windows Android 에뮬레이터를 제어하고 관리하는 스킬. ADB, Metro Bundler, React Native 빌드, WSL2 Mirrored Mode 네트워킹, Gradle installDebug, 에뮬레이터 실행, 앱 설치, 디버깅을 지원합니다. NAT 네트워크 문제 해결 및 Legacy Mode 폴백 전략 포함.
---

# WSL2 Android Emulator Manager

WSL2 환경에서 Windows Android 에뮬레이터를 효과적으로 관리하고, 네트워크 문제를 해결하며, React Native 앱을 빌드/디버깅하는 완전한 가이드입니다.

---

## 핵심 개념

### ADB (Android Debug Bridge)

Android 기기와 다른 OS 환경 사이의 통신 브리지입니다.

**구조**:

- **클라이언트** (WSL2): 명령어 실행
- **서버** (Windows/WSL2): 명령 중개
- **데몬** (Android 기기): 명령 수행

**중요**: WSL2와 Windows의 ADB 버전이 동일해야 합니다.

```bash
# ADB 버전 확인
adb --version
```

### Metro Bundler

React Native의 JavaScript 번들러입니다.

**역할**:

- JavaScript 코드 번들링
- 핫 리로드 (Hot Reload)
- 개발 서버 실행 (기본 포트: 8081)

**중요**: 에뮬레이터가 WSL2의 Metro 서버(8081 포트)에 접근 가능해야 합니다.

### SDK & JDK

- **SDK** (Software Development Kit): Android 앱 개발 도구 모음 (ADB, 에뮬레이터, API 등)
- **JDK** (Java Development Kit): Android 빌드에 필요한 Java 컴파일러 및 런타임

**WSL2 + Windows 전략**: 각 환경에 독립적으로 설치하되, 네트워크로 통신합니다.

### React Native 빌드 시점

앱을 다시 빌드해야 하는 경우:

- ✅ **네이티브 모듈** 의존성 변경
- ✅ **React Native 버전** 업그레이드
- ✅ **SDK/JDK 버전** 변경
- ✅ **초기 앱 설치 및 배포**
- ❌ JavaScript 코드 수정 (Metro만으로 핫 리로드 가능)

---

## 문제 상황: NAT 네트워크 분리

### WSL2 기본 네트워크 구조

```
Windows Network: 192.168.x.x
WSL2 Network:    172.x.x.x (별도 IP) ❌
```

WSL2는 NAT 네트워크를 사용하여 Windows와 분리된 네트워크를 갖습니다.

### 발생하는 문제

#### 1. Gradle installDebug 실패

```
WSL2 Gradle → Windows ADB 서버(127.0.0.1:5037) 연결 불가
DeviceMonitor가 다른 네트워크 대역의 ADB 서버를 찾지 못함
```

**증상**: 빌드는 성공하지만 APK 설치 실패

#### 2. Metro Bundler 연결 실패

```
에뮬레이터 → WSL2 Metro 서버(8081 포트) 연결 불가
JavaScript 번들 로딩 실패
```

**증상**: 앱이 설치되지만 "Could not connect to development server" 에러

---

## 해결책: Mirrored Mode 네트워킹

### 개념

WSL2와 Windows가 **같은 localhost**를 공유하도록 네트워크를 미러링합니다.

```
Before (NAT):
Windows: 192.168.1.100
WSL2:    172.29.36.1 ❌ 서로 다른 네트워크

After (Mirrored):
Windows: 192.168.1.100
WSL2:    192.168.1.100 ✅ 동일한 네트워크
```

### 장점

- ✅ WSL2 Gradle ↔ Windows ADB 직접 연결
- ✅ 에뮬레이터 ↔ WSL2 Metro 직접 연결
- ✅ socat 포트포워딩 불필요
- ✅ Windows에서 ADB 서버 수동 실행 불필요

---

## 환경 설정 (단계별)

### 1. Windows .wslconfig 설정

**파일 위치**: `C:\Users\[사용자명]\.wslconfig`

**내용**:

```ini
[wsl2]
networkingMode=mirrored
hostAddressLoopback=true
dnsTunneling=true
autoProxy=true
```

**적용**:

```powershell
wsl --shutdown
```

### 2. Windows 방화벽 규칙 추가

**방법**: Windows Defender 방화벽 → 고급 설정 → 인바운드 규칙 → 새 규칙

**설정**:

- 규칙 유형: 포트
- 프로토콜: TCP
- 포트: 5037 (ADB), 8081 (Metro)
- 작업: 연결 허용
- 프로필: 도메인, 프라이빗, 퍼블릭
- 원격 IP 주소: 172.16.0.0/12 (WSL2 IP 범위)

**자동화**: `scripts/setup-windows-firewall.ps1` 사용

### 3. WSL2 환경 변수 설정

**파일**: `~/.bashrc`

**추가 내용**:

```bash
# Android SDK
export ANDROID_HOME=/home/사용자명/Android/Sdk
export ANDROID_SDK_ROOT=/home/사용자명/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows ADB 사용 (중요!)
alias adb="/mnt/c/Users/사용자명/AppData/Local/Android/Sdk/platform-tools/adb.exe"
```

**적용**:

```bash
source ~/.bashrc
```

**⚠️ Legacy Mode 환경 변수 제거** (중요!):

```bash
unset ADB_SERVER_SOCKET WSL_HOST
```

**이유**: `ADB_SERVER_SOCKET` 환경 변수가 남아있으면 Mirrored Mode에서도 NAT 네트워크로 연결을 시도합니다.

### 4. 검증

```bash
# ADB alias 확인
which adb
# 출력: /mnt/c/Users/사용자명/AppData/Local/Android/Sdk/platform-tools/adb.exe

# Mirrored Mode 확인
wslinfo --networking-mode
# 출력: mirrored ✅

# 검증 스크립트 실행
./scripts/verify-wsl2-setup.sh
```

---

## 실전 빌드 워크플로우

### 개발 세션 시작

**자동화 스크립트**:

```bash
./scripts/start-dev-session.sh
```

**또는 수동**:

```bash
# 1. Windows에서 에뮬레이터 시작
npm run emulator:phone

# 2. WSL2에서 Metro 서버 시작
npm start

# 3. WSL2에서 앱 빌드 및 설치
npm run android
```

### 개발 중 (코드 수정 후)

**JavaScript 코드 수정 시**:

```bash
# Metro가 자동으로 핫 리로드
# 또는 수동 리로드
npm run debug:reload
```

**네이티브 코드 수정 시**:

```bash
# 다시 빌드 필요
npm run android
```

---

## 디버깅 도구

### 디버그 메뉴 열기

```bash
npm run debug:menu
# 또는
adb shell input keyevent 82
```

**사용 가능한 옵션**:

- Reload: JavaScript 번들 새로고침
- Debug: Chrome DevTools 연결
- Show Inspector: UI Inspector
- Show Perf Monitor: 성능 모니터

### 로그 확인

```bash
# React Native 로그만
npm run debug:logs

# 전체 로그 (네이티브 모듈 문제 시)
npm run debug:logs-all
```

### 수동 리로드

```bash
npm run debug:reload
# 또는
adb shell input keyevent 46 && adb shell input keyevent 46
```

### 디바이스 목록

```bash
adb devices
```

---

## package.json 스크립트

프로젝트의 `package.json`에 다음 스크립트를 추가하세요:

```json
{
  "scripts": {
    "android": "bash -c 'unset ADB_SERVER_SOCKET WSL_HOST && react-native run-android --deviceId=emulator-5554'",
    "android:legacy": "react-native run-android --deviceId=emulator-5554",
    "emulator:phone": "powershell.exe -Command \"& { \\$env:JAVA_HOME='C:\\Program Files\\Android\\Android Studio\\jbr'; & 'C:\\Users\\사용자명\\AppData\\Local\\Android\\Sdk\\emulator\\emulator.exe' -avd Phone_9_16 }\"",
    "emulator:list": "powershell.exe -Command \"\\$env:JAVA_HOME='C:\\Program Files\\Android\\Android Studio\\jbr'; & 'C:\\Program Files\\Android\\Sdk\\cmdline-tools\\latest\\bin\\avdmanager.bat' list avd\"",
    "emulator:devices": "adb devices",
    "emulator:stop": "adb emu kill",
    "debug:menu": "adb shell input keyevent 82",
    "debug:reload": "adb shell input keyevent 46 && adb shell input keyevent 46",
    "debug:logs": "adb logcat | grep ReactNative",
    "debug:logs-all": "adb logcat"
  }
}
```

**중요**: `android` 스크립트에서 `unset ADB_SERVER_SOCKET WSL_HOST`를 통해 Legacy Mode 환경 변수를 자동으로 제거합니다.

---

## 트러블슈팅

### Gradle installDebug 실패

**증상**: 빌드 성공, APK 설치 실패

**원인**:

1. Mirrored Mode가 활성화되지 않음
2. Legacy Mode 환경 변수가 남아있음
3. Windows ADB alias 미설정

**해결**:

```bash
# 1. Mirrored Mode 확인
wslinfo --networking-mode  # 출력: mirrored

# 2. Legacy Mode 환경 변수 제거
unset ADB_SERVER_SOCKET WSL_HOST

# 3. ~/.bashrc에서 해당 환경 변수 주석 처리
# export WSL_HOST=$(ip route | grep default | awk '{print $3}')  # 주석
# export ADB_SERVER_SOCKET=tcp:$WSL_HOST:5037                    # 주석

# 4. Windows ADB alias 확인
which adb  # /mnt/c/Users/.../adb.exe 출력되어야 함

# 5. 검증 스크립트 실행
./scripts/verify-wsl2-setup.sh

# 6. Legacy Mode로 폴백
npm run android:legacy
```

### Metro Bundler 연결 실패

**증상**: "Could not connect to development server"

**원인**:

1. Metro 서버가 IPv6로만 바인딩됨
2. 방화벽 규칙 누락

**해결**:

```bash
# Metro를 127.0.0.1에 명시적으로 바인딩
npm start -- --host 127.0.0.1

# 방화벽 규칙 확인
# Windows Defender 방화벽에서 TCP 8081 포트 허용 확인
```

### 에뮬레이터 실행 실패

**증상**: AVD 실행 안됨

**원인**:

1. JAVA_HOME 미설정
2. Hyper-V/WHPX 비활성화

**해결**:

```bash
# Windows에서 확인
# 1. Android Studio → AVD Manager → GPU: Hardware - GLES 2.0
# 2. RAM: 2GB 이상
# 3. Hyper-V 활성화 확인
```

### ADB 디바이스 연결 안됨

**증상**: `adb devices` 빈 목록

**원인**:

1. 에뮬레이터 미실행
2. ADB 서버 문제

**해결**:

```bash
# ADB 서버 재시작
adb kill-server
adb start-server
adb devices
```

---

## 자동화 스크립트

### 검증 스크립트

**위치**: `scripts/verify-wsl2-setup.sh`

**기능**:

- Networking Mode 확인 (mirrored)
- Windows ADB alias 설정 확인
- ADB 디바이스 연결 확인
- Metro Bundler 설정 확인
- Android 환경 변수 확인

**실행**:

```bash
./scripts/verify-wsl2-setup.sh
```

### 개발 세션 시작 스크립트

**위치**: `scripts/start-dev-session.sh`

**기능**:

- 에뮬레이터 자동 시작
- Metro 서버 자동 시작
- 앱 빌드 및 설치

**실행**:

```bash
./scripts/start-dev-session.sh
```

### Windows 방화벽 스크립트

**위치**: `scripts/setup-windows-firewall.ps1`

**기능**:

- ADB (5037) 및 Metro (8081) 포트 방화벽 규칙 자동 생성

**실행** (관리자 권한 PowerShell):

```powershell
.\scripts\setup-windows-firewall.ps1
```

---

## 주요 포트

| 포트 | 용도           | 프로토콜 |
| ---- | -------------- | -------- |
| 5037 | ADB Server     | TCP      |
| 8081 | Metro Bundler  | TCP      |
| 8097 | React DevTools | TCP      |

---

## 체크리스트

개발 환경 설정 시 확인사항:

- [ ] `.wslconfig`에 `networkingMode=mirrored` 설정
- [ ] Windows 방화벽 규칙 추가 (5037, 8081)
- [ ] `~/.bashrc`에 Windows ADB alias 추가
- [ ] Legacy Mode 환경 변수 제거 (`ADB_SERVER_SOCKET`, `WSL_HOST`)
- [ ] `wslinfo --networking-mode` 출력: `mirrored`
- [ ] `which adb` 출력: `/mnt/c/Users/.../adb.exe`
- [ ] `adb devices` 에뮬레이터 표시
- [ ] `npm run android` 성공 (빌드 + 설치 + 실행)
- [ ] Metro 핫 리로드 작동

---

**마지막 업데이트**: 2025-11-12
**프로젝트**: React Native + Supabase Mobile App
**환경**: WSL2 Ubuntu + Windows 11
**React Native 버전**: 0.82+
