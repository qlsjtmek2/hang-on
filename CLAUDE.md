# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

React Native CLI + Supabase 기반 모바일 애플리케이션 개발 프로젝트입니다.

### 기술 스택

**Frontend**:
- React Native CLI (TypeScript)
- React Navigation
- Zustand (상태 관리)

**Backend**:
- Supabase (Database, Auth, Storage, Edge Functions, Real-time)

**Testing**:
- Unit Test: Jest + React Native Testing Library (RNTL)
- Integration Test: Jest + RNTL + pgTAP
- E2E Test: Maestro

**CI/CD**:
- GitHub Actions

---

## MCP 서버 통합

### context7
**용도**: 최신 라이브러리 문서 검색

**사용 방법**:
```typescript
// React Native, Supabase, Jest 등 최신 문서 자동 검색
// 스킬에서 자동으로 활용됨
```

### magic
**용도**: UI 컴포넌트 생성

**사용 방법**:
```
"버튼 컴포넌트 만들어줘" (자동으로 magic MCP 사용)
```

### github
**용도**: GitHub 작업 자동화

**사용 방법**:
- Pull Request 생성
- Issue 관리
- 워크플로우 관리

### supabase
**용도**: Supabase 프로젝트 관리

**사용 방법**:
- 데이터베이스 마이그레이션
- TypeScript 타입 생성
- Edge Functions 배포

---

## 프로젝트 구조 가이드라인

### 권장 디렉토리 구조

```
/
├── src/
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   ├── screens/          # 화면 컴포넌트
│   ├── navigation/       # React Navigation 설정
│   ├── hooks/            # 커스텀 훅
│   ├── utils/            # 유틸리티 함수
│   ├── services/         # API 서비스, Supabase 클라이언트
│   ├── store/            # 상태 관리 (Zustand)
│   ├── theme/            # 중앙화된 테마 ✅ 구현 완료
│   │   ├── colors.ts     # 감정 날씨 5단계 색상 + Primary/Semantic/Neutral
│   │   ├── typography.ts # 7개 폰트 스케일 (h1-h3, body, caption, button)
│   │   ├── spacing.ts    # 8pt Grid System (xs: 4pt ~ xxxl: 48pt)
│   │   └── index.ts      # 통합 테마 export
│   ├── types/            # TypeScript 타입 정의
│   └── App.tsx
├── android/              # Android 네이티브 코드
├── ios/                  # iOS 네이티브 코드
├── __tests__/            # 테스트 파일
├── .maestro/             # Maestro E2E 테스트
└── .github/workflows/    # GitHub Actions
```

### 핵심 원칙

1. **중앙화된 테마 사용**
   - `src/theme/` 디렉토리의 colors, typography, spacing 활용 (✅ 구현 완료)
   - 절대 하드코딩하지 말 것
   - **사용 예시**:
   ```typescript
   import { theme } from '@/theme';

   // 색상 사용
   const style = { color: theme.colors.primary.main };

   // 타이포그래피 사용
   const textStyle = { ...theme.typography.h1 };

   // 간격 사용
   const spacing = { padding: theme.spacing.md };
   ```

2. **컴포넌트 재사용**
   - 새 컴포넌트 생성 전 `src/components/` 확인
   - 기존 컴포넌트 재활용 우선
   - **사용 가능한 컴포넌트** (✅ 구현 완료):
     - `Button`: Primary/Secondary/Ghost 스타일 버튼
     - `Input`: 글자 수 카운터, 에러 상태 지원 입력 필드
     - `EmotionButton`: 5단계 감정 날씨 선택기
     - `RecordCard`: 감정 기록 카드
     - `BottomSheet`: 하단 슬라이드 모달

3. **유틸리티 함수 사용**
   - **날짜 처리**: `src/utils/dateFormatter.ts` 사용 (✅ 구현 완료)
     ```typescript
     import { formatRelativeTime, formatSmartTime, formatDate } from '@/utils';

     // 상대적 시간 표시: "5분 전", "어제"
     const relativeTime = formatRelativeTime(date);

     // 스마트 포맷: 상황에 따라 최적 형식 자동 선택
     const smartTime = formatSmartTime(date);

     // 절대적 날짜: "2024년 1월 15일"
     const fullDate = formatDate(date);
     ```

   - **에러 처리**: `src/utils/errorHandler.ts` 사용 (✅ 구현 완료)
     ```typescript
     import { handleError, handleSupabaseError, logError } from '@/utils';

     try {
       // 작업 수행
     } catch (error) {
       // 표준화된 에러 처리
       const standardError = handleError(error);

       // Supabase 에러 처리
       if (supabaseError) {
         const supaError = handleSupabaseError(supabaseError);
       }

       // 개발 환경 로깅
       logError(standardError, 'ComponentName');
     }
     ```

4. **타입 안정성**
   - 모든 파일에 TypeScript 사용
   - Props, State, API 응답 타입 정의

5. **테스트 작성**
   - 모든 컴포넌트에 유닛 테스트
   - 핵심 기능에 통합 테스트
   - 주요 사용자 여정에 E2E 테스트

---

## 개발 워크플로우

### 1. 새 기능 개발

1. 관련 스킬 확인 (자동 활성화)
2. 기존 컴포넌트/유틸리티 재사용 확인
3. 개발
4. 유닛 테스트 작성
5. 통합 테스트 작성 (필요시)
6. E2E 테스트 작성 (필요시)

### 2. 코드 품질

**CI/CD가 자동으로 검증**:
- TypeScript 타입 체크
- ESLint
- 유닛 테스트
- 통합 테스트
- E2E 테스트

**로컬 개발 명령어**:
```bash
npm run lint          # ESLint 실행
npm run lint:fix      # ESLint 자동 수정
npm run format        # Prettier 포맷팅
npm run format:check  # Prettier 체크
npm run typecheck     # TypeScript 컴파일 체크
```

**로컬에서는**:
- 스킬 기반 개발 지원
- 빠른 개발 경험

### 3. Git 워크플로우

```bash
# 기능 브랜치 생성
git checkout -b feature/new-feature

# 개발 및 커밋
git add .
git commit -m "feat: 새 기능 추가"

# Push
git push origin feature/new-feature

# Pull Request 생성
# CI/CD 자동 검증 대기
```

---

## 환경 변수

### .env 파일 구조

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

**중요**: `.env` 파일은 절대 커밋하지 말 것. `.env.example`만 공유.

---

## 주의사항

### 하지 말아야 할 것

❌ 색상, 폰트 하드코딩 (항상 `src/theme/` 사용)
❌ 컴포넌트 중복 생성 (재사용 우선)
❌ 테스트 없이 코드 작성
❌ API 키, 비밀번호 커밋
❌ RLS 없이 테이블 생성

### 해야 할 것

✅ 중앙화된 테마 사용
✅ 기존 컴포넌트 재활용
✅ TypeScript 타입 정의
✅ 테스트 작성
✅ RLS 정책 설정
✅ 환경 변수 보안 관리

---

## 프로젝트 문서

### 요구사항 및 설계 문서

**위치**: `docs/`

**주요 문서**:

#### 요구사항 및 기획
- **[요구사항 명세서](docs/REQUIREMENTS.md)**
  - 프로젝트 개요 및 핵심 가치
  - 기능적/비기능적 요구사항
  - UI/UX 가이드라인 (감정 날씨, 메시지 프리셋)
  - 우선순위 및 로드맵 (Phase 0-3)
  - 성공 지표 및 위험 요소

- **[API 명세서](docs/API_SPEC.md)**
  - RESTful API 엔드포인트
  - 요청/응답 스키마
  - 에러 코드 정의
  - Supabase RPC 함수
  - Real-time Subscriptions
  - 푸시 알림 구조

#### UI/UX 설계
- **[사용자 시나리오](docs/USER_SCENARIOS.md)**
  - 5개 핵심 사용자 여정 (감정 털어놓기, 누군가와 함께, 공감 받기, 기록 관리, 온보딩)
  - 각 시나리오별 단계, 감정 변화, Touchpoint
  - 성공 지표 정의

- **[화면 Flow 다이어그램](docs/SCREEN_FLOW.md)**
  - Mermaid 다이어그램으로 앱 구조 시각화
  - 인증, 털어놓기, 피드, 기록 관리, 설정 Flow
  - 30개 이상 화면/상태 정의
  - Dialog vs Screen vs Bottom Sheet 선택 기준

- **[레이아웃 스케치](docs/LAYOUT_SKETCHES.md)**
  - 8개 주요 화면 상세 레이아웃 (ASCII 아트)
  - 8pt Grid System 적용
  - 재사용 가능한 컴포넌트 명세
  - 반응형 고려사항

- **[디자인 시스템](docs/DESIGN_SYSTEM.md)**
  - **컬러 팔레트**: 감정 날씨 5단계 색상 + Primary/Semantic/Neutral
  - **타이포그래피**: 7개 폰트 스케일 (h1-h3, body, caption, button)
  - **간격 시스템**: 8pt Grid (xs: 4pt ~ xxxl: 48pt)
  - **컴포넌트 라이브러리**: Button, RecordCard, EmotionButton, BottomSheet, Dialog
  - **인터랙션 패턴**: Dialog vs Screen vs Bottom Sheet 사용 기준
  - **애니메이션**: Fade, Scale, Slide, Pulse (200-300ms)
  - **접근성**: WCAG 2.1 AA 준수

**사용 시기**:
- 새 기능 개발 전: [요구사항 명세서](docs/REQUIREMENTS.md) 확인
- UI 구현 전: [디자인 시스템](docs/DESIGN_SYSTEM.md), [레이아웃 스케치](docs/LAYOUT_SKETCHES.md) 참조
- 사용자 경험 설계: [사용자 시나리오](docs/USER_SCENARIOS.md), [화면 Flow](docs/SCREEN_FLOW.md) 참조
- API 연동 시: [API 명세서](docs/API_SPEC.md) 참조
- 우선순위 결정 시: [요구사항 명세서](docs/REQUIREMENTS.md) 로드맵 확인

---

## 스킬 시스템

### 사용 가능한 스킬

프로젝트에는 자동 활성화되는 도메인 스킬들이 포함되어 있습니다:

#### 1. UI/UX 설계 스킬

**ui-ux-design-architect**
- **용도**: 사용자 시나리오 기반 화면 Flow 설계 및 디자인 시스템 수립
- **자동 활성화**: 디자인 시스템, 사용자 시나리오, 화면 플로우, 레이아웃 설계 관련 작업 시
- **제공 기능**:
  - 요구사항 분석 → 사용자 시나리오 도출
  - 화면 Flow 다이어그램 작성
  - 레이아웃 설계 가이드
  - 디자인 시스템 수립 (컬러, 타이포, 간격, 컴포넌트)
  - 인터랙션 패턴 정의 (Dialog vs Screen vs Bottom Sheet)
  - 포인트 디자인 사용 기준

#### 2. 개발 스킬

**react-native-dev**
- React Native 프로젝트 설정, 네이티브 모듈 연동, 네비게이션 설정

**react-native-components**
- UI 컴포넌트 생성, 애니메이션, 제스처, 접근성 구현

**supabase-backend**
- 데이터베이스 설계, RLS 정책, 인증, 저장소, Edge Functions, Real-time

#### 3. 테스팅 스킬

**rn-unit-testing**
- Jest + RNTL을 이용한 유닛 테스트 작성

**rn-integration-testing**
- 프론트엔드-백엔드 통합 테스트, pgTAP 데이터베이스 테스트

**maestro-e2e-testing**
- Maestro를 이용한 E2E 테스트 Flow 작성

#### 4. 기획 스킬

**requirements-analyst**
- 요구사항 분석, 검토, 개선, 명확화

**rn-supabase-project-planner**
- 프로젝트 계획 및 todolist 자동 생성

#### 5. CI/CD 스킬

**github-actions-cicd**
- GitHub Actions 워크플로우 설정, 자동 테스트, 빌드, 배포

### 스킬 활용 예시

```
사용자: "사용자 시나리오를 기반으로 화면 플로우와 디자인 기준을 만들어줘"
→ ui-ux-design-architect 스킬 자동 활성화

사용자: "감정 선택 버튼 컴포넌트를 만들어줘"
→ react-native-components 스킬 자동 활성화

사용자: "데이터베이스 테이블과 RLS 정책을 설계해줘"
→ supabase-backend 스킬 자동 활성화
```

---

## 배운 내용 및 트러블슈팅

### 개발 도구 설정

#### ESLint 설정
- TypeScript ESLint 플러그인 설치 및 설정 완료
- React Hooks 규칙 적용
- Import 순서 자동 정렬 규칙 추가
- 설치 패키지:
  - `@typescript-eslint/eslint-plugin`
  - `@typescript-eslint/parser`
  - `eslint-plugin-react-hooks`
  - `eslint-plugin-import`
  - `eslint-import-resolver-typescript`

#### Prettier 설정
- 코드 포맷팅 규칙 통일
- 100자 줄 길이 제한
- 후행 콤마 사용 (trailingComma: 'all')
- `.prettierignore` 파일로 제외 경로 관리

#### TypeScript 설정
- 엄격한 타입 체크 모드 활성화 (strict: true)
- 경로 별칭 설정 (@/* → src/*)
- 사용하지 않는 변수/매개변수 오류 설정

### 테마 시스템 구현 완료
- `src/theme/colors.ts`: 감정 날씨 5단계 색상, Primary/Semantic/Neutral 색상 정의
- `src/theme/typography.ts`: 7개 폰트 스케일 정의 (h1-h3, body, caption, button)
- `src/theme/spacing.ts`: 8pt Grid System 구현 (xs: 4pt ~ xxxl: 48pt)
- `src/theme/index.ts`: 통합 테마 export

### 라이브러리 호환성

#### react-native-config 버전 관리
- **문제**: `react-native-config` v1.5.9에서 React Native 0.82와 CMake 호환성 문제 발생
  - 에러: `add_subdirectory given source "codegen/jni/" which is not an existing directory`
  - 근본 원인: v1.5.8, v1.5.9에서 Android 빌드 수정 시도 중 autolinking 문제 발생
- **해결**: v1.5.5로 다운그레이드
  - `npm install react-native-config@1.5.5`
  - v1.5.5는 React Native 0.78-0.82와 안정적으로 호환됨
- **참고**: [GitHub Issue #848](https://github.com/lugg/react-native-config/issues/848)
- **교훈**: React Native 프로젝트에서 native 모듈 업데이트 시 항상 GitHub Issues 확인 필요

### 빌드 캐시 관리
- Android 빌드 에러 발생 시 `./gradlew clean` 실행 후 재빌드 권장
- 특히 native 모듈 버전 변경 후 필수

### Android 에뮬레이터 (WSL2 통합)

#### 설치 정보
- **Windows Android SDK**: `C:\Users\shinhuigon\AppData\Local\Android\Sdk`
- **Java Home**: `C:\Program Files\Android\Android Studio\jbr`
- **사용 가능한 AVD**: Phone_9_16 (1080x1920)

#### 에뮬레이터 명령어
```bash
# 에뮬레이터 실행
npm run emulator:phone     # Phone_9_16 에뮬레이터 실행

# AVD 관리
npm run emulator:list      # 사용 가능한 AVD 목록 확인
npm run emulator:devices   # 연결된 디바이스 확인
npm run emulator:stop      # 에뮬레이터 종료

# 앱 실행 (Mirrored Mode)
npm run android            # React Native 앱 빌드 및 실행 ✅
npm run android:legacy     # Legacy Mode (Windows Gradle 직접 실행)

# ADB 명령어 (WSL2에서 Windows ADB 사용)
adb devices               # 연결된 디바이스 목록
adb install [APK 경로]    # APK 설치
adb logcat                # 로그 확인
```

#### 개발 환경 설정 (WSL2 Mirrored Mode)

**📘 완전한 통합 가이드**: [docs/WSL2_ANDROID_COMPLETE_GUIDE.md](docs/WSL2_ANDROID_COMPLETE_GUIDE.md)
- 빠른 시작 (5분 설정)
- 왜 필요한지 상세 설명
- 단계별 가이드
- 검증 및 테스트
- 실전 교훈 및 함정
- 완전한 FAQ

**상세 개별 가이드**:
- [Windows 설정](docs/WINDOWS_SETUP_GUIDE.md)
- [WSL2 설정](docs/WSL2_SETUP_GUIDE.md)
- [기술 배경](docs/WSL2_ANDROID_SETUP.md)

**빠른 설정**:
1. **Windows 설정** ([WINDOWS_SETUP_GUIDE.md](docs/WINDOWS_SETUP_GUIDE.md)):
   - `.wslconfig`에 `networkingMode=mirrored` 추가
   - 방화벽 규칙 추가: `scripts/setup-windows-firewall.ps1`

2. **WSL2 설정** ([WSL2_SETUP_GUIDE.md](docs/WSL2_SETUP_GUIDE.md)):
   - `~/.bashrc`에 Windows ADB alias 추가
   - Legacy Mode 환경 변수 비활성화

3. **검증**:
   ```bash
   ./scripts/verify-wsl2-setup.sh
   ```

**개발 세션 시작**:
```bash
# 자동화 스크립트 사용
./scripts/start-dev-session.sh

# 또는 수동
npm run emulator:phone    # 1. 에뮬레이터 시작
npm start                 # 2. Metro 서버
npm run android           # 3. 앱 빌드 및 실행
```

#### 트러블슈팅

**에뮬레이터가 실행되지 않을 때**:
1. Windows에서 Hyper-V/WHPX 활성화 확인
2. AVD Manager에서 RAM 2GB 이상 설정
3. Graphics를 Hardware - GLES 2.0으로 설정

**Gradle installDebug 실패 시**:
```bash
# Mirrored Mode 확인
wslinfo --networking-mode  # 출력: mirrored

# 환경 검증
./scripts/verify-wsl2-setup.sh

# Legacy Mode 환경 변수가 남아있는 경우
# ~/.bashrc 확인 및 주석 처리
# export WSL_HOST=$(ip route | grep default | awk '{print $3}')  # 주석 처리
# export ADB_SERVER_SOCKET=tcp:$WSL_HOST:5037                    # 주석 처리

# Windows ADB alias 추가
alias adb="/mnt/c/Users/shinhuigon/AppData/Local/Android/Sdk/platform-tools/adb.exe"

# 새 셸 시작 또는 source ~/.bashrc 실행

# Legacy Mode로 폴백
npm run android:legacy
```

**중요한 트러블슈팅 교훈**:
- **문제**: ADB_SERVER_SOCKET 환경 변수가 Legacy Mode(tcp:172.x.x.x:5037)로 설정되어 있으면 Mirrored Mode에서도 실패함
- **원인**: React Native CLI가 환경 변수를 우선 사용하여 NAT 네트워크로 연결 시도
- **해결**: ~/.bashrc에서 Legacy Mode 환경 변수를 완전히 제거하고 Windows ADB alias 사용
- **검증**: `./scripts/verify-wsl2-setup.sh`로 7가지 항목 확인
- **자동화**: package.json의 android 스크립트가 자동으로 환경 변수 제거 (`bash -c 'unset ADB_SERVER_SOCKET WSL_HOST && ...'`)

#### 상세 문서

**완전한 가이드 및 트러블슈팅**: [docs/WSL2_ANDROID_SETUP.md](docs/WSL2_ANDROID_SETUP.md)

이 문서에서 다루는 내용:
- Mirrored Mode vs Legacy Mode 비교
- 단계별 설정 가이드 (Windows + WSL2)
- Gradle `installDebug` 실패 원인 및 해결
- 네트워크 격리 문제 심층 분석
- 완전한 트러블슈팅 가이드
- 자동화 스크립트 사용법

#### 설정 검증

```bash
# Mirrored Mode 환경 전체 검증
./scripts/verify-wsl2-setup.sh
```

이 스크립트는 다음을 확인합니다:
- Networking Mode (mirrored 여부)
- Windows ADB alias 설정
- ADB 디바이스 연결
- Metro Bundler 설정
- Android 환경 변수

#### 관련 파일

**설정 가이드**:
- [docs/WINDOWS_SETUP_GUIDE.md](docs/WINDOWS_SETUP_GUIDE.md) - Windows wslconfig 및 방화벽 설정
- [docs/WSL2_SETUP_GUIDE.md](docs/WSL2_SETUP_GUIDE.md) - WSL2 ADB alias 및 Metro 설정
- [docs/WSL2_ANDROID_SETUP.md](docs/WSL2_ANDROID_SETUP.md) - 완전한 통합 가이드

**스크립트**:
- `scripts/setup-windows-firewall.ps1` - Windows 방화벽 규칙 자동 생성
- `scripts/verify-wsl2-setup.sh` - 환경 검증
- `scripts/start-dev-session.sh` - 개발 세션 자동 시작

---

## 추가 리소스

- 각 스킬의 상세 가이드: `.claude/skills/[skill-name]/SKILL.md`
- Hooks 시스템: `.claude/hooks/README.md`
- Skill 개발자 가이드: `.claude/skills/skill-developer/SKILL.md`

---

**마지막 업데이트**: 2025-11-12 (WSL2 Mirrored Mode 개발 환경 구축 및 검증 완료, Legacy Mode 환경 변수 문제 해결)
**프로젝트 타입**: React Native + Supabase Mobile App (Hang On - 감정 공유 플랫폼)
**Claude Code 버전**: Compatible with Claude Code skill system

### 현재 진행 상황
- Phase 1: 프로젝트 초기화 ✅ 완료
- Phase 2: 개발 환경 구축 ✅ 완료
  - ESLint, Prettier, TypeScript 설정 완료
  - 테마 시스템 (colors, typography, spacing) 구현 완료
  - **Android 에뮬레이터 WSL2 통합 (Mirrored Mode)** ✅ 완료 및 검증 완료
    - Windows .wslconfig Mirrored Networking 설정
    - Windows 방화벽 규칙 자동화 (`setup-windows-firewall.ps1`)
    - WSL2 Windows ADB alias 설정
    - Metro Bundler IPv4 바인딩 (`--host 127.0.0.1`)
    - 환경 검증 스크립트 (`verify-wsl2-setup.sh`) - `set -e` 제거로 전체 검증 가능
    - 개발 세션 자동 시작 스크립트 (`start-dev-session.sh`)
    - 완전한 가이드 문서 3종 (WINDOWS_SETUP_GUIDE, WSL2_SETUP_GUIDE, WSL2_ANDROID_SETUP)
    - Legacy Mode 폴백 지원 (`npm run android:legacy`)
    - Legacy Mode 환경 변수 자동 제거 (`package.json` android 스크립트)
    - mobile-mcp MCP 서버 통합
    - **실전 테스트**: `npm run android` 성공 (39초 빌드, APK 설치, 앱 실행)
- Phase 3: 공통 리소스 제작 ✅ 완료
  - 테마 시스템 ✅ 완료
  - 공통 컴포넌트 ✅ 완료
    - Button, Input, EmotionButton, RecordCard, BottomSheet
    - 모든 컴포넌트 유닛 테스트 작성 완료
  - 유틸리티 함수 ✅ 완료
    - dateFormatter: 날짜 포맷팅 (상대/절대/스마트)
    - errorHandler: Supabase 및 일반 에러 처리

### 다음 단계
- [x] Mirrored Mode 설정 테스트 및 검증 ✅ 완료
- [ ] Supabase 백엔드 연동
- [ ] 인증 플로우 구현
- [ ] 감정 털어놓기 화면 개발
