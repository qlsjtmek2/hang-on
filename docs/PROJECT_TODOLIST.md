# Hang On - Development Todolist

**프로젝트**: Hang On (익명 감정 공유 플랫폼)
**버전**: 1.0.0
**최종 업데이트**: 2025-11-09
**기술 스택**: React Native CLI + Supabase

---

## 📋 Phase 개요

| Phase | 카테고리 | 설명 | 우선순위 |
|-------|---------|------|---------|
| 1-4 | 기초 설정 | 프로젝트 초기화, 환경 구축, 공통 리소스, CI/CD | P0 |
| 5 | 인증 | 회원가입/로그인 시스템 | P0 |
| 6-8 | 털어놓기 | 감정 기록 작성 및 관리 | P0 |
| 9-11 | 누군가와 함께 | 감정 매칭 및 공감 시스템 | P0 |
| 12 | 모더레이션 | 신고 시스템 | P0 |
| 13-14 | 글로벌 | 다국어 지원 및 푸시 알림 | P0 |
| 15-17 | 배포 | 테스트, 배포 준비, 프로덕션 배포 | P0 |

---

## Phase 1: 프로젝트 초기화

### 1.1 React Native 프로젝트 생성
- [x] React Native CLI 프로젝트 생성 (`npx @react-native-community/cli@latest init HangOn`)
- [x] TypeScript 설정 확인 (`tsconfig.json`)

### 1.2 Supabase 프로젝트 생성
- [x] Supabase 프로젝트 생성 (MCP: `create_project`)
- [x] 프로젝트 URL 및 API 키 확인 (MCP: `get_project_url`, `get_anon_key`)
- [x] `.env` 파일 생성 및 환경 변수 설정
- [x] `.env.example` 파일 생성 (보안 참고용)

### 1.3 필수 패키지 설치
- [x] React Navigation 설치
  ```bash
  npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
  npm install react-native-screens react-native-safe-area-context
  ```
- [x] Zustand 설치 (`npm install zustand`)
- [x] Supabase 클라이언트 설치 (`npm install @supabase/supabase-js`)
- [x] 환경 변수 관리 (`npm install react-native-config`)
- [x] 의존성 호환성 체크 (`npm install`)

---

## Phase 2: 개발 환경 구축

### 2.1 에뮬레이터/시뮬레이터 설정
- [ ] Android 에뮬레이터 실행 확인 (`npx react-native run-android`)
- [ ] 실행 스크립트 확인 (`package.json`의 `scripts`)

### 2.2 개발 도구 설정
- [ ] ESLint 설정 (`.eslintrc.js`)
- [ ] Prettier 설정 (`.prettierrc`)
- [ ] TypeScript 컴파일 확인 (`npx tsc --noEmit`)

### 2.3 디렉토리 구조 설정
- [ ] `src/` 디렉토리 구조 생성
  ```
  src/
  ├── components/
  ├── screens/
  ├── navigation/
  ├── hooks/
  ├── utils/
  ├── services/
  ├── store/
  ├── theme/
  └── types/
  ```

---

## Phase 3: 공통 리소스 제작 (디자인 시스템)

### 3.1 테마 시스템
- [ ] 컬러 팔레트 정의 (`src/theme/colors.ts`)
  - 감정 날씨 5단계 색상 (최상/상/중/하/최하)
  - Primary/Secondary/Semantic 색상
  - Neutral 색상 (배경, 텍스트, 보더)
- [ ] 타이포그래피 정의 (`src/theme/typography.ts`)
  - 폰트 패밀리, 크기, 행간
  - h1, h2, h3, body, caption, button
- [ ] 간격 시스템 정의 (`src/theme/spacing.ts`)
  - 8pt Grid System (xs: 4pt ~ xxxl: 48pt)
- [ ] 통합 테마 export (`src/theme/index.ts`)

### 3.2 공통 컴포넌트
- [ ] Button 컴포넌트 (`src/components/Button.tsx`)
  - Primary, Secondary, Ghost 스타일
  - 접근성 라벨
  - 유닛 테스트
- [ ] Input 컴포넌트 (`src/components/Input.tsx`)
  - 텍스트 입력, 글자 수 카운터
  - 에러 상태 표시
  - 유닛 테스트
- [ ] EmotionButton 컴포넌트 (`src/components/EmotionButton.tsx`)
  - 5단계 감정 날씨 아이콘
  - 선택 상태 애니메이션
  - 유닛 테스트
- [ ] RecordCard 컴포넌트 (`src/components/RecordCard.tsx`)
  - 감정, 시간, 글 미리보기, 공감/메시지 수
  - 유닛 테스트
- [ ] BottomSheet 컴포넌트 (`src/components/BottomSheet.tsx`)
  - 공유 설정용
  - 유닛 테스트

### 3.3 유틸리티 함수
- [ ] 날짜 포맷터 (`src/utils/dateFormatter.ts`)
  - "5분 전", "오늘 오전 10:30" 형식
- [ ] 에러 핸들러 (`src/utils/errorHandler.ts`)
  - Supabase 에러 처리

---

## Phase 4: CI/CD 구축

### 4.1 GitHub Actions 워크플로우
- [ ] 워크플로우 파일 생성 (`.github/workflows/ci.yml`)
- [ ] TypeScript 타입 체크 자동화
- [ ] ESLint 자동 실행
- [ ] 유닛 테스트 자동 실행 (Jest)
- [ ] Android 빌드 자동화 (선택적)

### 4.2 테스트 환경 설정
- [ ] Jest 설정 (`jest.config.js`)
- [ ] React Native Testing Library 설치
- [ ] 테스트 커버리지 목표 설정 (최소 70%)

---

## Phase 5: 인증 시스템

### 5.1 데이터베이스
- [ ] `profiles` 테이블 생성 (Supabase MCP: `apply_migration`)
  ```sql
  CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    language TEXT DEFAULT 'ko',
    push_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] RLS 정책 설정: 본인 프로필만 읽기/수정 가능
- [ ] pgTAP 통합 테스트 작성 (프로필 CRUD)
- [ ] pgTAP 테스트 실행 및 검증

### 5.2 프론트엔드
- [ ] 로그인 화면 (`src/screens/LoginScreen.tsx`)
  - 이메일/비밀번호 입력 폼
  - Google 소셜 로그인 버튼
  - 비밀번호 찾기 링크
  - 유닛 테스트
- [ ] 회원가입 화면 (`src/screens/SignUpScreen.tsx`)
  - 이메일/비밀번호 입력 폼
  - 이메일 형식 검증
  - 비밀번호 요구사항 표시 (8자 이상)
  - 유닛 테스트
- [ ] Auth 상태 관리 (Zustand: `src/store/authStore.ts`)
  - 로그인 상태, 사용자 정보
  - 로그인/로그아웃 액션
- [ ] 네비게이션 가드 (`src/navigation/AuthNavigator.tsx`)
  - 인증 여부에 따라 화면 라우팅

### 5.3 통합
- [ ] Supabase Auth 연동 (`src/services/authService.ts`)
  - 이메일/비밀번호 로그인
  - Google OAuth
  - 세션 관리 (7일 유효기간)
  - 자동 로그인
- [ ] 에러 핸들링
  - 5회 로그인 실패 시 15분 잠금
  - 네트워크 오류 처리
- [ ] 통합 테스트: 회원가입 → 로그인 플로우

---

## Phase 6: 감정 상태 선택 (디자인 시스템 기반)

### 6.1 감정 데이터 구조
- [ ] 감정 타입 정의 (`src/types/emotion.ts`)
  ```typescript
  type EmotionLevel = 1 | 2 | 3 | 4 | 5;
  type EmotionWeather = 'storm' | 'rain' | 'cloudy' | 'partly_sunny' | 'sunny';
  ```
- [ ] 감정-날씨 매핑 상수 (`src/constants/emotions.ts`)

### 6.2 프론트엔드
- [ ] 감정 선택 화면 (`src/screens/EmotionSelectScreen.tsx`)
  - 5단계 날씨 아이콘 원형 배치
  - 선택 시 확대 + 색상 강조 애니메이션
  - 유닛 테스트
- [ ] EmotionButton 컴포넌트 개선
  - 각 감정별 색상 적용 (테마 사용)
  - 접근성 라벨 (스크린 리더)
  - 유닛 테스트

### 6.3 상태 관리
- [ ] 감정 기록 상태 관리 (Zustand: `src/store/recordStore.ts`)
  - 현재 선택된 감정 레벨
  - 임시 저장 (네트워크 오류 대비)

---

## Phase 7: 털어놓기 - 글쓰기 및 공유 설정

### 7.1 데이터베이스
- [ ] `records` 테이블 생성 (Supabase MCP: `apply_migration`)
  ```sql
  CREATE TABLE records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    emotion_level INTEGER NOT NULL CHECK (emotion_level BETWEEN 1 AND 5),
    content TEXT CHECK (char_length(content) <= 500),
    visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'scheduled', 'public')),
    scheduled_at TIMESTAMPTZ,
    hearts_count INTEGER DEFAULT 0,
    messages_count INTEGER DEFAULT 0,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] 인덱스 추가: `emotion_level`, `created_at`, `visibility`, `user_id`
- [ ] RLS 정책 설정
  - 본인 기록: 읽기/쓰기/수정/삭제 가능
  - 공개 기록: 모든 사용자 읽기 가능 (단, user_id 제외)
- [ ] pgTAP 통합 테스트 (기록 CRUD, RLS 정책)

### 7.2 프론트엔드
- [ ] 글쓰기 화면 (`src/screens/WriteScreen.tsx`)
  - 감정 레벨 표시 (읽기 전용)
  - 텍스트 입력 (최대 500자)
  - 실시간 글자 수 카운터 (137/500)
  - 500자 초과 시 빨간색 표시 + 툴팁
  - 유닛 테스트
- [ ] 공유 설정 바텀시트 (`src/components/ShareSettingsBottomSheet.tsx`)
  - 3가지 옵션: 혼자 간직하기, 내일 나누기, 지금 나누기
  - 각 옵션 설명 표시
  - 유닛 테스트
- [ ] "다 썼어요! 💙" 버튼 (WriteScreen)
  - 탭 시 공유 설정 바텀시트 표시

### 7.3 통합
- [ ] 기록 API 서비스 (`src/services/recordService.ts`)
  - 기록 생성 (POST)
  - 임시 저장 (로컬 스토리지)
  - 네트워크 오류 시 복구
- [ ] 에러 핸들링
  - 500자 초과 방지
  - 네트워크 오류 → 로컬 임시 저장 → 재접속 시 복구 팝업
- [ ] 통합 테스트: 감정 선택 → 글쓰기 → 공유 설정 → DB 저장

### 7.4 자동화 작업
- [ ] 크론잡 설정 (Supabase Edge Function 또는 GitHub Actions)
  - 매일 자정 00:00: `scheduled` → `public` 자동 전환
  - 테스트: 내일 나누기 → 다음 날 자동 공개 확인

---

## Phase 8: 내 기록 관리 (조회/수정/삭제)

### 8.1 프론트엔드
- [ ] 메인 화면 - 내 기록 목록 (`src/screens/MyRecordsScreen.tsx`)
  - FlatList로 기록 카드 목록 표시
  - 시간순 정렬 (최신순)
  - Pull-to-refresh
  - 무한 스크롤 (페이지네이션)
  - 유닛 테스트
- [ ] RecordCard 컴포넌트 개선
  - 감정 날씨 아이콘
  - 작성 시간 (상대적 시간)
  - 글 내용 미리보기 (2줄, 말줄임표)
  - 받은 공감 수, 메시지 수
  - 더보기 메뉴 (수정/삭제)
  - 유닛 테스트
- [ ] 기록 상세 화면 (`src/screens/RecordDetailScreen.tsx`)
  - 전체 내용 표시
  - 받은 공감/메시지 목록
  - 수정/삭제 버튼
  - 유닛 테스트
- [ ] 기록 수정 화면 (`src/screens/EditRecordScreen.tsx`)
  - 기존 내용 불러오기
  - 수정 후 저장
  - 유닛 테스트

### 8.2 통합
- [ ] 기록 API 서비스 확장 (`src/services/recordService.ts`)
  - 내 기록 목록 조회 (GET, 페이지네이션)
  - 기록 수정 (PATCH)
  - 기록 삭제 (Soft Delete)
- [ ] Soft Delete 처리
  - `deleted_at` 필드 업데이트
  - 삭제된 기록 필터링 (RLS 정책)
  - 30일 후 영구 삭제 (크론잡)
- [ ] 통합 테스트: 기록 조회 → 수정 → 삭제

### 8.3 삭제 확인 다이얼로그
- [ ] 삭제 확인 Dialog 컴포넌트
  - "이 기록을 삭제할까요? 받은 공감과 메시지도 함께 사라져요."
  - 취소/삭제 버튼

---

## Phase 9: 감정 유사도 매칭 시스템

### 9.1 데이터베이스
- [ ] 매칭 알고리즘 SQL 함수 작성
  ```sql
  CREATE OR REPLACE FUNCTION get_matched_records(
    user_id UUID,
    limit_count INTEGER DEFAULT 20
  )
  RETURNS TABLE(...) AS $$
  -- 사용자의 최근 3개 기록 감정 레벨 평균 계산
  -- ±1 범위 내 공개 기록 우선 매칭
  -- 자신의 기록 제외, 이미 본 기록 제외
  $$ LANGUAGE plpgsql;
  ```
- [ ] 조회 기록 테이블 (`viewed_records`)
  ```sql
  CREATE TABLE viewed_records (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    record_id UUID NOT NULL REFERENCES records(id),
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, record_id)
  );
  ```
- [ ] RLS 정책: 본인 조회 기록만 읽기/쓰기
- [ ] pgTAP 테스트: 매칭 알고리즘 검증

### 9.2 프론트엔드
- [ ] 누군가와 함께 화면 (`src/screens/EmpathyFeedScreen.tsx`)
  - 매칭된 기록 목록 표시
  - RecordCard 컴포넌트 재사용
  - 새로고침 버튼
  - 유닛 테스트
- [ ] 빈 상태 UI
  - "아직 오늘의 이야기가 도착하지 않았어요. 잠시 후 다시 와주세요."
  - 새로고침 버튼

### 9.3 통합
- [ ] 매칭 API 서비스 (`src/services/matchingService.ts`)
  - 매칭된 기록 조회
  - 조회 기록 저장
- [ ] 통합 테스트: 매칭 알고리즘 → 기록 조회

---

## Phase 10: 공감 및 메시지 프리셋

### 10.1 데이터베이스
- [ ] `hearts` 테이블 생성
  ```sql
  CREATE TABLE hearts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    record_id UUID NOT NULL REFERENCES records(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, record_id)
  );
  ```
- [ ] `messages` 테이블 생성
  ```sql
  CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    record_id UUID NOT NULL REFERENCES records(id),
    preset_key TEXT NOT NULL CHECK (preset_key IN ('cheer_up', 'me_too', 'be_okay', 'together')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, record_id)
  );
  ```
- [ ] RLS 정책: 공감/메시지는 모두 읽기 가능, 작성은 본인만
- [ ] 트리거: 공감/메시지 추가 시 `records.hearts_count`, `records.messages_count` 자동 증가
- [ ] pgTAP 테스트: 공감/메시지 CRUD, 카운트 업데이트

### 10.2 프론트엔드
- [ ] 공감 버튼 컴포넌트 (`src/components/HeartButton.tsx`)
  - 하트 아이콘
  - 탭 시 공감 전송 + 펄스 애니메이션
  - 이미 공감한 경우 비활성화
  - 유닛 테스트
- [ ] 메시지 프리셋 바텀시트 (`src/components/MessagePresetBottomSheet.tsx`)
  - 4가지 프리셋 버튼
  - 선택 시 메시지 전송
  - 이미 보낸 경우 비활성화
  - 유닛 테스트
- [ ] RecordCard에 공감/메시지 버튼 추가
  - 하트 버튼
  - 메시지 버튼 (탭 시 바텀시트 열림)

### 10.3 통합
- [ ] 공감/메시지 API 서비스 (`src/services/empathyService.ts`)
  - 공감 전송 (POST)
  - 메시지 전송 (POST)
  - 받은 공감/메시지 조회 (GET)
- [ ] 실시간 카운트 업데이트 (Supabase Real-time 선택적)
- [ ] 통합 테스트: 공감 전송 → DB 저장 → 카운트 증가

### 10.4 메시지 프리셋 다국어
- [ ] 프리셋 번역 상수 (`src/constants/messagePresets.ts`)
  - 6개 언어 매핑 (ko, en, ja, es, pt, fr)

---

## Phase 11: 일일 조회 제한

### 11.1 데이터베이스
- [ ] `daily_views` 테이블 생성
  ```sql
  CREATE TABLE daily_views (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    view_date DATE NOT NULL DEFAULT CURRENT_DATE,
    view_count INTEGER DEFAULT 0,
    PRIMARY KEY (user_id, view_date)
  );
  ```
- [ ] RLS 정책: 본인 조회 수만 읽기/쓰기
- [ ] 크론잡: 매일 자정 조회 수 리셋 (실제로는 새로운 날짜 레코드 생성)
- [ ] pgTAP 테스트: 일일 조회 제한 로직

### 11.2 프론트엔드
- [ ] 남은 조회 수 헤더 (`src/components/DailyViewHeader.tsx`)
  - "오늘 남은 이야기: 15/20"
  - 유닛 테스트
- [ ] 제한 도달 UI
  - "오늘은 모두 읽었어요. 내일 다시 와주세요 💙"
  - 빈 상태 일러스트 (선택적)

### 11.3 통합
- [ ] 조회 수 API 서비스 (`src/services/viewLimitService.ts`)
  - 오늘의 조회 수 조회
  - 조회 수 증가
- [ ] EmpathyFeedScreen에 조회 제한 로직 통합
  - 20개 도달 시 더 이상 로딩 안 함
- [ ] 통합 테스트: 20개 조회 → 제한 도달 확인

---

## Phase 12: 콘텐츠 모더레이션 (신고 시스템)

### 12.1 데이터베이스
- [ ] `reports` 테이블 생성
  ```sql
  CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id),
    record_id UUID NOT NULL REFERENCES records(id),
    reason TEXT NOT NULL CHECK (reason IN ('abuse', 'spam', 'self_harm', 'privacy', 'other')),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```
- [ ] RLS 정책: 본인 신고 내역만 조회, 관리자는 모두 조회
- [ ] 트리거: 신고 3회 이상 시 `records`에 `flagged` 필드 업데이트
- [ ] pgTAP 테스트: 신고 로직

### 12.2 프론트엔드
- [ ] 신고 바텀시트 (`src/components/ReportBottomSheet.tsx`)
  - 신고 사유 선택 (욕설/스팸/자해/개인정보/기타)
  - 기타 선택 시 직접 입력
  - 제출 버튼
  - 유닛 테스트
- [ ] RecordCard에 더보기 메뉴 추가
  - "신고하기" 옵션

### 12.3 통합
- [ ] 신고 API 서비스 (`src/services/reportService.ts`)
  - 신고 제출 (POST)
- [ ] 신고 후 해당 기록 자동 숨김 (신고자에게만)
- [ ] 통합 테스트: 신고 제출 → DB 저장

### 12.4 관리자 대시보드 (Phase 2 고려)
- [ ] ❌ MVP에서 제외, 간단한 Supabase 대시보드 사용

---

## Phase 13: 다국어 지원

### 13.1 i18n 설정
- [ ] i18n 라이브러리 설치 (`npm install i18next react-i18next`)
- [ ] 번역 파일 생성 (`src/locales/`)
  ```
  src/locales/
  ├── ko.json
  ├── en.json
  ├── ja.json
  ├── es.json
  ├── pt.json
  └── fr.json
  ```
- [ ] i18n 초기화 (`src/locales/i18n.ts`)
  - 디바이스 언어 자동 감지
  - 폴백 언어: 영어

### 13.2 UI 텍스트 번역
- [ ] 모든 UI 텍스트를 번역 키로 변경
  - 버튼, 레이블, 플레이스홀더, 에러 메시지 등
- [ ] 6개 언어 번역 작성 (ko, en, ja, es, pt, fr)

### 13.3 설정 화면
- [ ] 설정 화면 (`src/screens/SettingsScreen.tsx`)
  - 언어 선택 드롭다운
  - 푸시 알림 On/Off 토글
  - 로그아웃 버튼
  - 계정 삭제 버튼
  - 개인정보 처리방침 링크
  - 이용약관 링크
  - 개발자에게 문의 (mailto)
  - 유닛 테스트

### 13.4 계정 삭제 로직
- [ ] 계정 삭제 확인 다이얼로그
  - "모든 기록과 공감이 영구 삭제됩니다. 정말 삭제할까요?"
- [ ] 계정 삭제 API (`src/services/authService.ts`)
  - 모든 데이터 영구 삭제 (GDPR 준수)
  - `auth.users` 삭제 → Cascade로 관련 데이터 삭제

---

## Phase 14: 푸시 알림

### 14.1 푸시 알림 설정
- [ ] Firebase Cloud Messaging (FCM) 설정
  - Firebase 프로젝트 생성
  - `google-services.json` (Android) 및 `GoogleService-Info.plist` (iOS) 추가
- [ ] React Native Firebase 설치 (`@react-native-firebase/app`, `@react-native-firebase/messaging`)
- [ ] 푸시 토큰 등록 로직 (`src/services/pushService.ts`)

### 14.2 데이터베이스
- [ ] `push_tokens` 테이블 생성
  ```sql
  CREATE TABLE push_tokens (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    token TEXT NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('ios', 'android')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, token)
  );
  ```
- [ ] RLS 정책: 본인 토큰만 읽기/쓰기

### 14.3 알림 트리거
- [ ] Supabase Edge Function: 공감/메시지 수신 시 푸시 알림 전송
  - 함수 작성 (`supabase/functions/send-push-notification/index.ts`)
  - FCM API 호출
  - 배포 (Supabase MCP: `deploy_edge_function`)
- [ ] Database Trigger: `hearts`, `messages` 테이블 INSERT 시 Edge Function 호출

### 14.4 프론트엔드
- [ ] 푸시 알림 권한 요청 (앱 실행 시)
- [ ] 알림 수신 핸들러 (포그라운드/백그라운드)
- [ ] 알림 탭 시 기록 상세 화면으로 이동

---

## Phase 15: E2E 테스트

### 15.1 Maestro 설정
- [ ] Maestro 설치 (`curl -Ls https://get.maestro.mobile.dev | bash`)
- [ ] `.maestro/` 디렉토리 생성

### 15.2 E2E 플로우 작성
- [ ] 회원가입 → 로그인 플로우 (`.maestro/auth.yaml`)
- [ ] 감정 선택 → 글쓰기 → 공유 플로우 (`.maestro/write-record.yaml`)
- [ ] 누군가와 함께 → 공감 전송 플로우 (`.maestro/empathy-feed.yaml`)
- [ ] 내 기록 수정/삭제 플로우 (`.maestro/manage-record.yaml`)
- [ ] 설정 변경 플로우 (`.maestro/settings.yaml`)

### 15.3 테스트 실행
- [ ] 개발 빌드 생성 (`npx react-native run-android --variant=release`)
- [ ] Maestro 테스트 실행 (`maestro test .maestro/`)
- [ ] 스크린샷 촬영 및 검토

---

## Phase 16: 배포 준비

### 16.1 앱 아이콘 및 스플래시 스크린
- [ ] 앱 아이콘 제작 (1024x1024)
- [ ] Android 아이콘 생성 (`android/app/src/main/res/mipmap-*`)
- [ ] iOS 아이콘 생성 (`ios/HangOn/Images.xcassets/AppIcon.appiconset/`)
- [ ] 스플래시 스크린 제작 (선택적)

### 16.2 스토어 자료
- [ ] Google Play Store 스크린샷 촬영 (5-8장)
  - 다양한 화면 크기 (Phone, Tablet)
- [ ] 앱 설명 작성 (한국어, 영어)
  - 짧은 설명 (80자)
  - 전체 설명 (4000자)
- [ ] 기능 그래픽 제작 (1024x500)
- [ ] 개인정보 처리방침 작성 및 호스팅
  - GitHub Pages 또는 Netlify 사용
- [ ] 이용약관 작성 및 호스팅

### 16.3 Google Play Console 설정
- [ ] Google Play Console 계정 등록
- [ ] 앱 등록
- [ ] 스토어 등록정보 입력 (아이콘, 스크린샷, 설명 등)
- [ ] 콘텐츠 등급 설정
- [ ] 개인정보 처리방침 URL 등록

### 16.4 CI/CD 자동 배포 설정
- [ ] GitHub Actions 배포 워크플로우 (`.github/workflows/deploy.yml`)
  - Android 릴리스 빌드
  - Google Play 내부 테스트 트랙 업로드
- [ ] Fastlane 설정 (선택적)

---

## Phase 17: 배포

### 17.1 프로덕션 빌드
- [ ] Android 프로덕션 빌드 생성
  ```bash
  cd android
  ./gradlew bundleRelease
  ```
- [ ] APK/AAB 서명 확인
- [ ] 빌드 크기 최적화 (ProGuard/R8)

### 17.2 내부 테스트
- [ ] Google Play 내부 테스트 트랙 업로드
- [ ] 5-10명 내부 테스터 초대
- [ ] 주요 기능 테스트 (체크리스트)
- [ ] 버그 수정 및 재배포

### 17.3 베타 테스트
- [ ] Google Play 오픈 베타 트랙 업로드
- [ ] 100-500명 베타 테스터 모집
- [ ] 피드백 수집 (Google Play Console 리뷰)
- [ ] 성능 모니터링 (Firebase Crashlytics 선택적)

### 17.4 프로덕션 배포
- [ ] Google Play 프로덕션 트랙 업로드
- [ ] 단계별 출시 (10% → 50% → 100%)
- [ ] 모니터링 (크래시, 리뷰, 성공 지표)

---

## 📊 진행 상황 추적

| Phase | 상태 | 완료일 | 비고 |
|-------|------|--------|------|
| 1 | ⬜ Pending | - | 프로젝트 초기화 |
| 2 | ⬜ Pending | - | 개발 환경 구축 |
| 3 | ⬜ Pending | - | 공통 리소스 제작 |
| 4 | ⬜ Pending | - | CI/CD 구축 |
| 5 | ⬜ Pending | - | 인증 시스템 |
| 6 | ⬜ Pending | - | 감정 상태 선택 |
| 7 | ⬜ Pending | - | 글쓰기 및 공유 설정 |
| 8 | ⬜ Pending | - | 내 기록 관리 |
| 9 | ⬜ Pending | - | 감정 유사도 매칭 |
| 10 | ⬜ Pending | - | 공감 및 메시지 프리셋 |
| 11 | ⬜ Pending | - | 일일 조회 제한 |
| 12 | ⬜ Pending | - | 신고 시스템 |
| 13 | ⬜ Pending | - | 다국어 지원 |
| 14 | ⬜ Pending | - | 푸시 알림 |
| 15 | ⬜ Pending | - | E2E 테스트 |
| 16 | ⬜ Pending | - | 배포 준비 |
| 17 | ⬜ Pending | - | 프로덕션 배포 |

---

## 📝 참고 문서

- [요구사항 명세서](docs/REQUIREMENTS.md)
- [API 명세서](docs/API_SPEC.md)
- [사용자 시나리오](docs/USER_SCENARIOS.md)
- [화면 Flow](docs/SCREEN_FLOW.md)
- [레이아웃 스케치](docs/LAYOUT_SKETCHES.md)
- [디자인 시스템](docs/DESIGN_SYSTEM.md)
- [프로젝트 가이드](CLAUDE.md)

---

**생성일**: 2025-11-09
**예상 완료**: Phase 0 (MVP) - 2개월
**총 Phase 수**: 17개
