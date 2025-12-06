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
└── types/            # TypeScript 타입 정의 (emotion.ts) ✅
```

---

## 핵심 개발 원칙

### 1. 중앙화된 리소스 사용 (필수)

#### 테마

- **위치**: `src/theme/`
- **구성**: `colors.ts`, `typography.ts`, `spacing.ts`
- **사용**: `import { theme } from '@/theme'`
- ❌ 하드코딩 금지

#### 타입

- **위치**: `src/types/`
- **구성**: `emotion.ts` - 감정 관련 타입 (EmotionLevel, EmotionWeather, EmotionData)
- **사용**: `import type { EmotionLevel } from '@/types/emotion'`
- ✅ 타입 중앙화: 모든 감정 관련 타입을 단일 소스에서 관리

#### 상수

- **위치**: `src/constants/`
- **구성**:
  - `emotions.ts` - 감정 데이터 상수 (EMOTION_DATA), 타입 re-export
  - `patterns.ts` - 정규식 패턴 (EMAIL_REGEX, PHONE_REGEX, NICKNAME_REGEX)
- **사용**: `import { EMOTION_DATA } from '@/constants/emotions'`
- ❌ 데이터 중복 정의 금지
- 💡 타입과 상수를 함께 사용할 때는 `@/constants/emotions`에서 import (타입이 re-export됨)

#### 아이콘

- **라이브러리**: `lucide-react-native`
- **사용**: `import { Home, Settings, Plus } from 'lucide-react-native'`
- ❌ 다른 아이콘 라이브러리 사용 금지 (react-native-vector-icons 등)
- ❌ 이모지 문자(😀, ⚙️ 등) 직접 사용 금지
- 💡 일관된 아이콘 스타일 유지를 위해 Lucide로 통일

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
❌ Lucide 이외의 아이콘/이모지 사용 (항상 `lucide-react-native` 사용)
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
- ✅ Phase 5: 인증 플로우 구현
- ✅ Phase 6: 메인 네비게이션 + 털어놓기
  - ✅ 6.1 탭 네비게이션 구축 (MainTabNavigator, FloatingActionButton)
  - ✅ 6.2 감정 선택 화면 (EmotionSelectScreen)
  - ✅ 6.3 글쓰기 화면 (WriteScreen)
  - ✅ 6.4 공유 설정 바텀시트 (ShareSettingsBottomSheet)
  - ✅ 6.5 Mock 기록 Store (recordStore)
- ✅ Phase 7: 내 기록 목록 + 피드
  - ✅ 7.1 내 기록 목록 화면 - Pull-to-refresh
  - ✅ 7.2 피드 화면 - 일일 20개 제한, 카운터 헤더
  - ✅ 7.3 Mock 피드 데이터 (feedStore.ts)
  - ✅ 7.4 공감 버튼 컴포넌트 (HeartButton.tsx)
  - ✅ 7.5 메시지 프리셋 바텀시트 (MessagePresetBottomSheet.tsx)
- ✅ Phase 8: 추가 화면 (상세, 수정, 설정)
  - ✅ 8.1 기록 상세 화면 (RecordDetailScreen)
  - ✅ 8.2 기록 수정 화면 (EditRecordScreen)
  - ✅ 8.3 설정 화면 완성 (SettingsScreen)
  - ✅ 8.4 확인 다이얼로그 (ConfirmDialog)
  - ✅ 8.5 신고 바텀시트 (ReportBottomSheet)
- ✅ Phase 9: 폴리싱 및 개선
  - ✅ 9.1 애니메이션 개선 (Reanimated + GestureHandler 도입)
  - ✅ 9.2 접근성 개선 (accessibilityHint, hitSlop, 색상 대비)
  - ✅ 9.3 성능 최적화 (React.memo, FlatList 옵션, useCallback)

---

## 리팩토링 이력

### 2025-12-06: Phase 9 폴리싱 및 개선 구현

**9.1 애니메이션 라이브러리 마이그레이션**
- ✅ `react-native-reanimated` + `react-native-gesture-handler` 설치
- ✅ `babel.config.js` 수정: reanimated/plugin 추가
- ✅ `jest.setup.js` 수정: Reanimated mock 추가
- ✅ `App.tsx` 수정: GestureHandlerRootView 래퍼 추가
- ✅ 6개 컴포넌트 Reanimated 마이그레이션:
  - `HeartButton.tsx`: withSequence + withSpring 펄스 애니메이션
  - `FloatingActionButton.tsx`: withSpring scale 애니메이션
  - `EmotionButton.tsx`: scale, rotation, opacity 애니메이션
  - `ConfirmDialog.tsx`: withTiming + withSpring 모달 애니메이션
  - `BottomSheet.tsx`: Gesture.Pan() + 스와이프 제스처
  - `FeedCard.tsx` (신규): 분리된 컴포넌트 + fade/slide 애니메이션

**9.2 접근성 개선**
- ✅ `accessibilityHint` 추가: HeartButton, FloatingActionButton, ConfirmDialog, BottomSheet, FeedCard, RecordCard
- ✅ `hitSlop` 추가: RecordCard 액션 버튼 (top: 12, bottom: 12, left: 8, right: 8)
- ✅ 색상 대비 개선: HeartButton 비활성 상태 gray400 → gray500 (WCAG AA 충족)

**9.3 성능 최적화**
- ✅ `React.memo` 적용: FeedCard, RecordCard
- ✅ `useCallback` 적용: FeedScreen (handleEmpathyPress, handleMessagePress, handleMorePress), MyRecordsScreen (핸들러 3개)
- ✅ `FlatList` 최적화: MyRecordsScreen (initialNumToRender, maxToRenderPerBatch, windowSize, removeClippedSubviews)

📊 결과: 60fps 애니메이션, 스크린 리더 호환성 향상, 메모리 사용량 감소

### 2025-12-06: Phase 8 추가 화면 (상세, 수정, 설정) 구현

- ✅ `src/components/ConfirmDialog.tsx` 생성: 확인 다이얼로그 컴포넌트
  - 삭제/로그아웃/계정삭제 확인용 모달
  - default/danger variant 지원
  - 애니메이션 및 로딩 상태 지원
- ✅ `src/components/ReportBottomSheet.tsx` 생성: 신고 바텀시트 컴포넌트
  - 5가지 신고 사유 (욕설/혐오, 스팸, 자해/자살 암시, 개인정보 노출, 기타)
  - 기타 선택 시 직접 입력 기능
  - 제출 완료 후 확인 화면
- ✅ `src/screens/RecordDetailScreen.tsx` 생성: 기록 상세 화면
  - 전체 내용 표시, 감정 아이콘 + 작성 시간
  - 받은 공감/메시지 목록 (Mock 데이터)
  - 더보기 메뉴: 수정 / 삭제 / 공유 설정 변경
- ✅ `src/screens/EditRecordScreen.tsx` 생성: 기록 수정 화면
  - WriteScreen과 유사한 UI
  - 기존 내용 불러오기 + 변경사항 감지
  - 취소 시 변경사항 확인 다이얼로그
- ✅ `src/screens/SettingsScreen.tsx` 완성: 설정 화면
  - 언어 선택 바텀시트 (UI만)
  - 푸시 알림 토글 (UI만)
  - 로그아웃/계정 삭제 + ConfirmDialog 연결
  - 개인정보 처리방침/이용약관/문의 링크
- ✅ `src/navigation/RecordStackNavigator.tsx` 생성: 기록 상세/수정 스택
- ✅ `RootNavigator.tsx` 수정: Record 스택 추가
- ✅ `MyRecordsScreen.tsx` 수정: 기록 탭 → 상세 화면 이동 연결
- 📊 결과: 기록 CRUD 전체 플로우 완성 (목록 → 상세 → 수정/삭제)

### 2025-12-06: Phase 7 내 기록 목록 + 피드 구현

- ✅ `src/store/feedStore.ts` 생성: Mock 피드 Store (Zustand)
  - FeedItem 인터페이스: 다른 사람의 기록 (hasEmpathized, hasSentMessage 추가)
  - 일일 조회 20개 제한, 자동 날짜 변경 감지
  - 액션: viewFeedItem, addEmpathy, removeEmpathy, sendMessage
  - 샘플 데이터 20개 포함
- ✅ `src/components/HeartButton.tsx` 생성: 공감 버튼 컴포넌트
  - 펄스 애니메이션
  - 공감 상태에 따른 스타일 변경
  - 3가지 크기 지원 (small, medium, large)
- ✅ `src/components/MessagePresetBottomSheet.tsx` 생성: 메시지 프리셋 바텀시트
  - 4가지 프리셋 메시지 (힘내세요, 저도 그래요, 괜찮을 거예요, 함께해요)
  - 익명 전송 안내
  - 이미 보낸 경우 비활성화 상태 표시
- ✅ `src/screens/MyRecordsScreen.tsx` 업데이트: Pull-to-refresh 추가
- ✅ `src/screens/FeedScreen.tsx` 업데이트: 일일 제한 + 카운터 헤더
  - 헤더에 "오늘 남은 이야기: X/20" 표시
  - 20개 제한 도달 시 별도 화면 표시
  - HeartButton, MessagePresetBottomSheet 통합
- ✅ 유닛 테스트: feedStore, HeartButton, MessagePresetBottomSheet
- 📊 결과: 피드 전체 플로우 완성 (조회 → 공감 → 메시지 전송)

### 2025-12-06: Phase 6.2~6.5 털어놓기 플로우 구현

- ✅ `src/store/recordStore.ts` 생성: Mock 기록 Store (Zustand)
  - Record 인터페이스: id, emotionLevel, content, visibility, heartsCount, messagesCount, createdAt
  - 액션: addRecord, updateRecord, deleteRecord, getMyRecords, getPublicRecords
  - 샘플 데이터 7개 포함
- ✅ `src/screens/EmotionSelectScreen.tsx` 생성: 감정 선택 화면
  - EmotionSelector 컴포넌트 활용 (5단계 날씨 아이콘)
  - 선택 시 확대 + 색상 강조 애니메이션
  - 감정별 설명 텍스트 표시
- ✅ `src/screens/WriteScreen.tsx` 생성: 글쓰기 화면
  - 상단 선택된 감정 표시 (읽기 전용)
  - 텍스트 입력 (최대 500자, 실시간 카운터)
  - 500자 초과 시 빨간색 경고
- ✅ `src/components/ShareSettingsBottomSheet.tsx` 생성: 공유 설정 바텀시트
  - 3가지 옵션: 혼자 간직하기, 내일 나누기, 지금 나누기
  - BottomSheet 컴포넌트 활용
- ✅ `src/navigation/CreateStackNavigator.tsx` 생성: 털어놓기 스택
  - EmotionSelect → Write 플로우
  - 모달 프레젠테이션으로 표시
- ✅ `RootNavigator.tsx`, `MainTabNavigator.tsx` 수정: 네비게이션 연결
- 📊 결과: 털어놓기 전체 플로우 완성 (FAB → 감정 선택 → 글쓰기 → 공유 설정 → 저장)

### 2025-12-06: Phase 6.1 탭 네비게이션 구축

- ✅ `RootNavigator.tsx` 생성: 인증 상태에 따른 Auth/Main 스택 분기
- ✅ `MainTabNavigator.tsx` 생성: 하단 탭 네비게이션 (내 기록, 누군가와 함께, 설정)
- ✅ `FloatingActionButton.tsx` 생성: 털어놓기 플로팅 버튼 (우하단, 애니메이션 포함)
- ✅ 탭 화면 스텁 생성: `MyRecordsScreen`, `FeedScreen`, `SettingsScreen`
- ✅ 미사용 파일 정리: `AuthNavigator.tsx`, `HomeScreen.tsx` 삭제
- 📊 결과: 탭 네비게이션 완성, 인증 플로우와 메인 화면 분리

### 2025-11-13 (2차): 감정 데이터 구조 개선

- ✅ 타입 파일 분리: `src/types/emotion.ts` 생성
- ✅ `EmotionWeather` 타입 추가 (storm, rain, cloudy, partly_sunny, sunny)
- ✅ 감정 레벨 ↔ 날씨 매핑 상수 추가 (`EMOTION_LEVEL_TO_WEATHER`, `WEATHER_TO_EMOTION_LEVEL`)
- ✅ 타입 중복 제거: `EmotionLevel` 단일 소스 관리
- ✅ 레벨 4 이모지 통일: ⛅ → 🌤️ (문서와 일치)
- ✅ Re-export 패턴 적용: 타입은 `@/types/emotion`, 편의성을 위해 `@/constants/emotions`에서도 re-export
- 📊 결과: 타입 안전성 향상, 문서-코드 일치, 다국어 지원 준비 완료

### 2025-11-13 (1차): 코드베이스 전체 개선

- ✅ 중복 코드 제거 (감정 데이터, 정규식 패턴 중앙화)
- ✅ 유효성 검사 로직 중앙화 (`src/utils/validation.ts`)
- ✅ 타입 안정성 개선 (any 타입 4곳 제거 → unknown/명시적 타입)
- ✅ 상수 디렉토리 생성 (`src/constants/emotions.ts`, `src/constants/patterns.ts`)
- 📊 결과: 약 120줄 감소, 중복 코드 50% 제거, 타입 안전성 향상

---

**마지막 업데이트**: 2025-12-06 (Phase 9 완료)
**프로젝트**: React Native + Supabase Mobile App (Hang On - 감정 공유 플랫폼)
**환경**: WSL2 Ubuntu + Windows 11, React Native 0.82+
