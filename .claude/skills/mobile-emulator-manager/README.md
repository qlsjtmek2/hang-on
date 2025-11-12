# Mobile Emulator Manager Skill

WSL2 환경에서 Windows Android 에뮬레이터를 제어하고 관리하는 Claude Code 스킬입니다.

## 주요 기능

- 🚀 Windows Android 에뮬레이터를 WSL2에서 제어
- 📱 mobile-mcp MCP 서버와 완전 통합
- 🧪 모바일 앱 테스트 자동화
- 📸 스크린샷 및 화면 요소 분석
- 🔧 React Native 개발 워크플로우 지원

## 필요 사항

### Windows 환경
- Windows 10 버전 2004 이상
- Android Studio 설치
- Android SDK 설치
- AVD Manager 설정 완료

### WSL2 환경
- WSL2 Ubuntu
- mobile-mcp MCP 서버 설치

## 설치 방법

### 1. mobile-mcp MCP 서버 설치

#### Windows에서 설치 (권장)
```bash
# Windows PowerShell에서 실행
npm install -g @mobile-mcp/server

# MCP 서버 실행
mobile-mcp start
```

#### WSL2에서 설치 (선택사항)
```bash
# WSL2 터미널에서 실행
npm install -g @mobile-mcp/server

# Windows 에뮬레이터와 연결하려면 네트워크 설정 필요
mobile-mcp start --host 0.0.0.0
```

### 2. Claude Code MCP 설정

`.claude/mcp-settings.json` 파일에 추가:

```json
{
  "mcpServers": {
    "mobile-mcp": {
      "command": "mobile-mcp",
      "args": ["start"],
      "env": {
        "ANDROID_HOME": "C:\\Program Files\\Android\\Sdk"
      }
    }
  }
}
```

### 3. 환경 설정

#### emulator-config.json 수정
```json
{
  "android": {
    "avdPath": "C:\\Users\\YOUR_USERNAME\\.android\\avd"
  }
}
```

`YOUR_USERNAME`을 실제 Windows 사용자명으로 변경하세요.

## 사용 방법

### 기본 명령어

#### 에뮬레이터 실행
```
"에뮬레이터 실행해줘"
"Phone 에뮬레이터 켜줘"
"태블릿 모드로 실행"
```

#### 앱 관리
```
"APK 설치해줘"
"앱 실행해줘"
"설치된 앱 목록 보여줘"
```

#### 테스트
```
"화면 스크린샷 찍어줘"
"로그인 버튼 클릭"
"텍스트 입력해줘"
"아래로 스와이프"
```

### React Native 개발

#### Metro 번들러 연동
```bash
# WSL2에서 Metro 실행
npm start

# 앱 빌드 및 설치
npm run android
```

#### 디버깅
```
"Chrome DevTools 연결해줘"
"개발자 메뉴 열어줘"
"Hot Reload 활성화"
```

## 트러블슈팅

### 에뮬레이터가 실행되지 않을 때

1. **JAVA_HOME 경로 확인**
```bash
# Windows에서
echo %JAVA_HOME%
```

2. **AVD 목록 확인**
```bash
powershell.exe -Command "$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'; & 'C:\Program Files\Android\Sdk\cmdline-tools\latest\bin\avdmanager.bat' list avd"
```

3. **Windows Defender 예외 추가**
- Windows Defender에서 에뮬레이터 경로 예외 추가
- `C:\Program Files\Android\Sdk\emulator`

### 네트워크 연결 문제

1. **WSL2 IP 확인**
```bash
ip addr show eth0
```

2. **Windows 호스트 IP 확인**
```bash
cat /etc/resolv.conf | grep nameserver
```

3. **Metro 번들러 포트 포워딩**
```bash
# Windows PowerShell에서
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=localhost
```

### 앱이 설치되지 않을 때

1. **APK 경로 확인**
- WSL2 경로 사용 (`/home/user/...`)
- Windows 경로 변환 필요시 `/mnt/c/...` 사용

2. **에뮬레이터 저장 공간 확인**
```bash
adb shell df
```

3. **API 레벨 호환성**
- minSdkVersion 확인
- 에뮬레이터 API 레벨 확인

## 성능 최적화

### 에뮬레이터 설정
```json
{
  "performance": {
    "gpu": "host",        // GPU 가속 사용
    "ram": "4096",        // RAM 4GB 할당
    "vm_heap": "512",     // VM Heap 512MB
    "cache_partition_size": "1600M"  // 캐시 1.6GB
  }
}
```

### WSL2 메모리 설정
`.wslconfig` 파일 (Windows 사용자 홈):
```ini
[wsl2]
memory=8GB
processors=4
localhostForwarding=true
```

## 예제 워크플로우

### 신규 기능 테스트
```typescript
// 1. 에뮬레이터 실행
"Phone 에뮬레이터 실행"

// 2. 앱 빌드
"npm run android 실행"

// 3. 앱 실행 확인
"설치된 앱 목록"

// 4. 테스트 수행
"로그인 화면 스크린샷"
"이메일 필드에 'test@example.com' 입력"
"비밀번호 필드에 'password123' 입력"
"로그인 버튼 클릭"

// 5. 결과 확인
"현재 화면 분석"
```

### UI 자동화 테스트
```typescript
// 1. 테스트 준비
"에뮬레이터 초기화"

// 2. 앱 실행
"com.myapp 실행"

// 3. 네비게이션 테스트
"홈 버튼 클릭"
"설정 메뉴 열기"
"프로필 화면으로 이동"

// 4. 입력 테스트
"이름 필드 클릭"
"텍스트 모두 지우기"
"새 이름 입력"
"저장 버튼 클릭"

// 5. 검증
"성공 메시지 확인"
```

## 디렉토리 구조

```
.claude/skills/mobile-emulator-manager/
├── SKILL.md              # 스킬 메타데이터 및 상세 문서
├── emulator-config.json  # 에뮬레이터 설정 템플릿
└── README.md             # 이 파일
```

## 지원 버전

- React Native: 0.72+
- Android API: 21+ (Lollipop)
- Android Studio: 2023.1+
- WSL2: Windows 10 버전 2004+
- mobile-mcp: 최신 버전

## 관련 링크

- [mobile-mcp GitHub](https://github.com/mobile-next/mobile-mcp)
- [Android Emulator 문서](https://developer.android.com/studio/run/emulator)
- [React Native 디버깅](https://reactnative.dev/docs/debugging)
- [WSL2 네트워킹 가이드](https://docs.microsoft.com/en-us/windows/wsl/networking)

## 기여하기

이슈나 개선사항이 있다면 프로젝트 저장소에 이슈를 등록해주세요.

## 라이선스

이 스킬은 프로젝트 라이선스를 따릅니다.

---

**마지막 업데이트**: 2025-11-10
**버전**: 1.0.0
**작성자**: Claude Code with mobile-mcp integration