# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 프로젝트 개요

React Native CLI + Supabase 기반 **Hang On** - 감정 공유 플랫폼

### 기술 스택

**Frontend**: React Native CLI (TypeScript), React Navigation, Zustand
**Backend**: Supabase (Database, Auth, Storage, Edge Functions, Real-time)
**Testing**: Jest + RNTL (Unit), Jest + RNTL + pgTAP (Integration), Maestro (E2E)
**CI/CD**: GitHub Actions

---

## 핵심 개발 명령어

### 실행

```bash
npm run dev              # 🚀 통합 개발 세션 시작 (에뮬레이터 + Metro + 앱 빌드)

# 개별 명령어 (필요시)
npm run emulator:phone    # Android 에뮬레이터 시작
npm run emulator:phone-cold  # Cold Boot (스냅샷 문제 시)
npm start                 # Metro 서버 (--host 127.0.0.1)
npm run android          # 앱 빌드 및 설치
npm run ios              # iOS 앱 실행
```

### 개발 도구

```bash
npm run lint             # ESLint
npm run lint:fix         # ESLint 자동 수정
npm run format           # Prettier 포맷팅
npm run typecheck        # TypeScript 타입 체크
npm test                 # Jest 유닛 테스트
npm run test:coverage    # 커버리지 포함
npm run test:watch       # 감시 모드
```

### 디버깅

```bash
npm run debug:menu       # 디버그 메뉴 열기 (Cmd+M)
npm run debug:reload     # 수동 리로드
npm run debug:logs       # React Native 로그
npm run debug:logs-all   # 전체 로그
adb devices              # 연결된 디바이스 확인
```

---

## 프로젝트 구조

```
src/
├── components/       # 재사용 가능한 UI 컴포넌트 ✅
├── screens/          # 화면 컴포넌트
├── navigation/       # React Navigation 설정
├── hooks/            # 커스텀 훅
├── constants/        # 중앙화된 상수 (emotions, patterns) ✅
├── utils/            # 유틸리티 함수 (validation, dateFormatter, errorHandler) ✅
├── services/         # API 서비스, Supabase 클라이언트
├── store/            # Zustand 상태 관리
├── theme/            # 중앙화된 테마 (colors, typography, spacing) ✅
└── types/            # TypeScript 타입 정의
```

---

## 핵심 개발 원칙

### 1. 중앙화된 리소스 사용 (필수)

#### 테마
- **위치**: `src/theme/`
- **구성**: `colors.ts`, `typography.ts`, `spacing.ts`
- **사용**: `import { theme } from '@/theme'`
- ❌ 하드코딩 금지

#### 상수
- **위치**: `src/constants/`
- **구성**:
  - `emotions.ts` - 감정 데이터 (EmotionLevel, EMOTION_DATA)
  - `patterns.ts` - 정규식 패턴 (EMAIL_REGEX, PHONE_REGEX, NICKNAME_REGEX)
- **사용**: `import { EMOTION_DATA } from '@/constants/emotions'`
- ❌ 데이터 중복 정의 금지

### 2. 컴포넌트 재사용 우선

- **사용 가능한 컴포넌트**: Button, Input, EmotionButton, RecordCard, BottomSheet
- **위치**: `src/components/`
- 새 컴포넌트 생성 전 기존 확인

### 3. 유틸리티 함수 활용

- **날짜 처리**: `src/utils/dateFormatter.ts` - formatRelativeTime, formatSmartTime, formatDate
- **에러 처리**: `src/utils/errorHandler.ts` - handleError, handleSupabaseError, logError
- **유효성 검사**: `src/utils/validation.ts` - validateEmail, validatePassword, validateConfirmPassword, validateNickname
  - 모든 함수는 `{ isValid: boolean, errorMessage?: string }` 형식 반환
  - 예시: `const result = validateEmail(email); if (!result.isValid) setError(result.errorMessage);`

### 4. 타입 안정성

- 모든 파일 TypeScript 사용
- Props, State, API 응답 타입 정의

### 5. 테스트 작성

- 컴포넌트: 유닛 테스트 필수
- 핵심 기능: 통합 테스트
- 주요 여정: E2E 테스트

---

## 환경 변수

`.env` 파일 구조:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

⚠️ `.env` 파일 커밋 금지 - `.env.example`만 공유

---

## 주요 문서

### 요구사항 및 설계

- [요구사항 명세서](docs/REQUIREMENTS.md) - 기능 요구사항, 로드맵, 우선순위
- [API 명세서](docs/API_SPEC.md) - 엔드포인트, 스키마, 에러 코드
- [사용자 시나리오](docs/USER_SCENARIOS.md) - 5개 핵심 사용자 여정
- [화면 Flow](docs/SCREEN_FLOW.md) - Mermaid 다이어그램, 화면 구조
- [레이아웃 스케치](docs/LAYOUT_SKETCHES.md) - 8개 주요 화면 상세 레이아웃
- [디자인 시스템](docs/DESIGN_SYSTEM.md) - 컬러, 타이포, 간격, 컴포넌트 가이드

### 개발 환경

- [WSL2 Android 완전 가이드](docs/WSL2_ANDROID_COMPLETE_GUIDE.md) - 5분 설정, 트러블슈팅
- [Windows 설정](docs/WINDOWS_SETUP_GUIDE.md) - .wslconfig, 방화벽
- [WSL2 설정](docs/WSL2_SETUP_GUIDE.md) - ADB alias, Metro 설정

---

## 스킬 시스템

프로젝트에 자동 활성화되는 도메인 스킬:

**UI/UX**: ui-ux-design-architect (디자인 시스템, 화면 플로우)
**개발**: react-native-dev, react-native-components, supabase-backend
**테스팅**: rn-unit-testing, rn-integration-testing, maestro-e2e-testing
**기획**: requirements-analyst, rn-supabase-project-planner
**CI/CD**: github-actions-cicd
**환경**: mobile-emulator-manager (WSL2 Android 설정)

상세 가이드: `.claude/skills/[skill-name]/SKILL.md`

---

## WSL2 Android 개발 환경

### 핵심 설정 (Mirrored Mode)

**Windows**: `.wslconfig`에 `networkingMode=mirrored` 추가 → `wsl --shutdown`
**방화벽**: TCP 5037 (ADB), 8081 (Metro) 허용 - `scripts/setup-windows-firewall.ps1`
**WSL2**: `~/.bashrc`에 Windows ADB alias 추가
**검증**: `./scripts/verify-wsl2-setup.sh`

### 개발 세션 시작

**통합 명령어**: `npm run dev` (권장)
**개별 실행**: `npm run emulator:phone` → `npm start` → `npm run android`

`npm run dev` 명령어는 다음을 자동으로 수행합니다:
1. Android 에뮬레이터 시작 및 부팅 대기
2. Metro 서버 시작 및 준비 대기
3. 앱 빌드 및 설치

### 주요 트러블슈팅

**Gradle installDebug 실패**:

- `wslinfo --networking-mode` 확인 (출력: mirrored)
- Windows ADB alias 확인: `which adb` (출력: `/mnt/c/Users/.../adb.exe`)
- Legacy Mode 환경 변수 자동 제거됨 (`npm run dev`, `npm run android`에서 자동 처리)
- 수동 정리: `./scripts/clean-legacy-env.sh` 실행

**Metro 연결 실패**:

- Metro를 127.0.0.1에 바인딩: `npm start` (package.json에 이미 설정됨)
- 방화벽 규칙 확인

**에뮬레이터 offline 상태 지속**:

- 증상: `adb devices`에서 `emulator-5554 offline`이 오래 지속됨
- 원인: 에뮬레이터 스냅샷 로딩 문제
- 해결: Cold Boot로 재시작 `npm run emulator:phone-cold`
- 참고: Cold Boot는 스냅샷 없이 처음부터 부팅 (느리지만 안정적)

**중요 - Legacy NAT 환경 변수**:
- `ADB_SERVER_SOCKET`, `WSL_HOST` 환경 변수는 Mirrored Mode와 충돌
- `.bashrc`에 자동 unset 추가됨 (새 터미널 세션에서 자동 제거)
- `npm run dev`, `npm run android` 명령어는 실행 시 자동으로 환경 변수 제거
- 완전 정리: `./scripts/clean-legacy-env.sh` 실행 후 터미널 재시작

---

## 라이브러리 호환성

### react-native-config

- **사용 버전**: 1.5.5
- **이유**: v1.5.9는 React Native 0.82와 CMake 호환성 문제
- **참고**: [GitHub Issue #848](https://github.com/lugg/react-native-config/issues/848)

### 빌드 캐시

- Android 에러 시: `cd android && ./gradlew clean && cd ..` → 재빌드
- 네이티브 모듈 변경 후 필수

---

## 금지 사항

❌ 색상, 폰트 하드코딩 (항상 `src/theme/` 사용)
❌ 감정 데이터, 정규식 패턴 중복 정의 (항상 `src/constants/` 사용)
❌ 유효성 검사 로직 중복 작성 (항상 `src/utils/validation.ts` 사용)
❌ 컴포넌트 중복 생성
❌ 테스트 없이 코드 작성
❌ API 키, 비밀번호 커밋
❌ RLS 없이 Supabase 테이블 생성
❌ any 타입 사용 (unknown 또는 명시적 타입 사용)

---

## 현재 진행 상황

- ✅ Phase 1: 프로젝트 초기화
- ✅ Phase 2: 개발 환경 구축 (ESLint, Prettier, TypeScript, 테마, WSL2 Android Mirrored Mode)
- ✅ Phase 3: 공통 리소스 제작 (테마, 컴포넌트, 유틸리티)
- 🔄 Phase 4: Supabase 백엔드 연동
- 🔄 Phase 5: 인증 플로우 구현
- 🔄 Phase 6: 감정 털어놓기 화면 개발

---

---

## 리팩토링 이력

### 2025-11-13: 코드베이스 전체 개선
- ✅ 중복 코드 제거 (감정 데이터, 정규식 패턴 중앙화)
- ✅ 유효성 검사 로직 중앙화 (`src/utils/validation.ts`)
- ✅ 타입 안정성 개선 (any 타입 4곳 제거 → unknown/명시적 타입)
- ✅ 상수 디렉토리 생성 (`src/constants/emotions.ts`, `src/constants/patterns.ts`)
- 📊 결과: 약 120줄 감소, 중복 코드 50% 제거, 타입 안전성 향상

---

**마지막 업데이트**: 2025-11-13
**프로젝트**: React Native + Supabase Mobile App (Hang On - 감정 공유 플랫폼)
**환경**: WSL2 Ubuntu + Windows 11, React Native 0.82+
