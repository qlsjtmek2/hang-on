# Hang On - Frontend Development Todolist

**프로젝트**: Hang On (익명 감정 공유 플랫폼)
**버전**: 1.0.0 (Frontend Only)
**최종 업데이트**: 2025-12-06
**기술 스택**: React Native CLI + Mock Data (백엔드 미연동)

---

## 개발 방침

### Mock 데이터 전략
- **인증**: Mock Auth Store (테스트 계정으로 로그인)
- **기록 데이터**: Zustand Store에서 하드코딩된 샘플 데이터 관리
- **API 호출**: 없음 (모든 데이터는 로컬 상태에서 처리)

### 단계별 구현 순서
1. **P0 (MVP 필수)**: 핵심 화면 먼저 구현
2. **P1 (확장)**: 상세/수정/설정 화면
3. **P2 (나중)**: 폴리싱, 애니메이션 개선

---

## Phase 개요

| Phase | 카테고리           | 설명                                    | 우선순위 |
| ----- | ------------------ | --------------------------------------- | -------- |
| 1-4   | 기초 설정          | 프로젝트 초기화, 환경 구축, 공통 리소스 | P0       |
| 5     | Mock 인증          | 테스트 계정 로그인/로그아웃             | P0       |
| 6     | 털어놓기           | 감정 선택 + 글쓰기 + 공유 설정          | P0       |
| 7     | 목록/피드          | 내 기록 목록 + 피드 + 공감/메시지       | P0       |
| 8     | 추가 화면          | 기록 상세, 수정, 설정                   | P1       |
| 9     | 폴리싱             | 애니메이션, 접근성 개선                 | P2       |
| 10    | HCI 개선           | Toast, 스켈레톤, Draft, 접근성 강화     | P1       |

---

## Phase 1: 프로젝트 초기화 ✅ 완료

### 1.1 React Native 프로젝트 생성
- [x] React Native CLI 프로젝트 생성
- [x] TypeScript 설정 확인

### 1.2 필수 패키지 설치
- [x] React Navigation 설치
- [x] Zustand 설치
- [x] 환경 변수 관리 (react-native-config)

---

## Phase 2: 개발 환경 구축 ✅ 완료

### 2.1 에뮬레이터/개발 도구
- [x] Android 에뮬레이터 실행 확인
- [x] ESLint, Prettier, TypeScript 설정

### 2.2 디렉토리 구조
- [x] `src/` 디렉토리 구조 생성

---

## Phase 3: 공통 리소스 제작 ✅ 완료

### 3.1 테마 시스템
- [x] 컬러 팔레트 (`src/theme/colors.ts`)
- [x] 타이포그래피 (`src/theme/typography.ts`)
- [x] 간격 시스템 (`src/theme/spacing.ts`)

### 3.2 공통 컴포넌트
- [x] Button 컴포넌트
- [x] Input 컴포넌트
- [x] EmotionButton 컴포넌트
- [x] RecordCard 컴포넌트
- [x] BottomSheet 컴포넌트

### 3.3 유틸리티 함수
- [x] 날짜 포맷터 (`src/utils/dateFormatter.ts`)
- [x] 에러 핸들러 (`src/utils/errorHandler.ts`)
- [x] 유효성 검사 (`src/utils/validation.ts`)

---

## Phase 4: CI/CD 구축 ✅ 완료

- [x] GitHub Actions 워크플로우
- [x] Jest 테스트 환경 설정

---

## Phase 5: Mock 인증 시스템

### 5.1 Mock Auth Store
- [x] `src/store/mockAuthStore.ts` 생성
  - 테스트 계정: `test@example.com` / `password123`
  - 상태: `isAuthenticated`, `user`, `isLoading`
  - 액션: `mockSignIn()`, `mockSignUp()`, `mockSignOut()`
- [x] AsyncStorage로 세션 유지 (선택)

### 5.2 기존 화면 Mock 연동
- [x] LoginScreen → Mock 로그인 연동
  - 테스트 계정으로 로그인 시 성공
  - 다른 계정은 에러 표시
- [x] SignUpScreen → Mock 회원가입
  - 바로 성공 처리 → 로그인 화면 이동
- [x] AuthConfirmScreen → 스킵 또는 제거

### 5.3 네비게이션 수정
- [x] Supabase 인증 리스너 제거
- [x] Mock 인증 상태 기반으로 화면 전환

---

## Phase 6: 메인 네비게이션 + 털어놓기

**우선순위: P0 (MVP 필수)**

### 6.1 탭 네비게이션 구축
- [x] `src/navigation/MainTabNavigator.tsx` 생성
  - 하단 탭: 내 기록 / 누군가와 함께 / 설정
  - 아이콘 설정 (react-native-vector-icons 또는 이모지)
- [x] `src/navigation/RootNavigator.tsx` 수정
  - 인증 여부에 따라 Auth Stack / Main Tab 전환
- [x] 플로팅 액션 버튼 (털어놓기)
  - 메인 화면 우하단에 배치
  - 탭 시 감정 선택 화면으로 이동
- [x] 아이콘 Lucide로 변경


### 6.2 감정 선택 화면
- [x] `src/screens/EmotionSelectScreen.tsx` 생성
  - EmotionSelector 컴포넌트 활용
  - 5단계 날씨 아이콘 원형/가로 배치
  - 선택 시 확대 + 색상 강조 애니메이션
  - "다음" 버튼 → 글쓰기 화면 이동
  - 유닛 테스트

### 6.3 글쓰기 화면
- [x] `src/screens/WriteScreen.tsx` 생성
  - 상단: 선택한 감정 표시 (읽기 전용, 수정 불가)
  - 텍스트 입력 (Input 컴포넌트 활용)
    - 플레이스홀더: "지금 느끼는 기분을 자유롭게 표현해보세요"
    - 최대 500자
  - 실시간 글자 수 카운터 (137/500)
  - 500자 초과 시 빨간색 표시 + 경고
  - "다 썼어요!" 버튼 → 공유 설정 바텀시트
  - 유닛 테스트

### 6.4 공유 설정 바텀시트
- [x] `src/components/ShareSettingsBottomSheet.tsx` 생성
  - 3가지 옵션:
    1. 혼자 간직하기 (비공개)
    2. 내일 나누기 (예약 공개)
    3. 지금 나누기 (즉시 공개)
  - 각 옵션 설명 표시
  - 선택 시 Mock 저장 → 메인 화면 이동
  - 유닛 테스트

### 6.5 Mock 기록 Store
- [x] `src/store/recordStore.ts` 생성
  ```typescript
  interface Record {
    id: string;
    emotionLevel: EmotionLevel;
    content: string;
    visibility: 'private' | 'scheduled' | 'public';
    heartsCount: number;
    messagesCount: number;
    createdAt: Date;
  }
  ```
  - 상태: `records`, `isLoading`
  - 액션: `addRecord()`, `updateRecord()`, `deleteRecord()`
  - 샘플 데이터 5-10개 포함

---

## Phase 7: 내 기록 목록 + 피드

**우선순위: P0 (MVP 필수)**

### 7.1 내 기록 목록 화면
- [ ] `src/screens/MyRecordsScreen.tsx` 생성
  - FlatList로 RecordCard 목록 표시
  - 시간순 정렬 (최신순)
  - Pull-to-refresh (Mock: 새로고침 애니메이션만)
  - Empty 상태: "아직 기록이 없어요. 첫 번째 감정을 털어놓아 보세요!"
  - 카드 탭 시 → 기록 상세 화면 (Phase 8)
  - 유닛 테스트

### 7.2 피드 화면 (누군가와 함께)
- [ ] `src/screens/EmpathyFeedScreen.tsx` 생성
  - Mock 다른 사람 기록 목록 (별도 샘플 데이터)
  - RecordCard 재사용 (작성자 정보 숨김)
  - 헤더: "오늘 남은 이야기: 15/20"
  - 20개 제한 도달 시: "오늘은 모두 읽었어요. 내일 다시 와주세요"
  - 유닛 테스트

### 7.3 Mock 피드 데이터
- [ ] `src/store/feedStore.ts` 생성
  - 다른 사람 기록 샘플 데이터 10-20개
  - 일일 조회 수 상태 관리
  - 조회 시 카운트 감소

### 7.4 공감 버튼 컴포넌트
- [ ] `src/components/HeartButton.tsx` 생성
  - 하트 아이콘
  - 탭 시 펄스 애니메이션
  - 공감 후 비활성화 (이미 공감한 기록)
  - 로컬 상태로 공감 수 증가
  - 유닛 테스트

### 7.5 메시지 프리셋 바텀시트
- [ ] `src/components/MessagePresetBottomSheet.tsx` 생성
  - 4가지 프리셋:
    1. 힘내세요 💪
    2. 저도 그래요 🫂
    3. 괜찮을 거예요 🌈
    4. 함께해요 ✨
  - 선택 시 로컬 상태 업데이트
  - 이미 보낸 경우 비활성화
  - 유닛 테스트

---

## Phase 8: 추가 화면 (상세, 수정, 설정) ✅ 완료

**우선순위: P1 (확장)**

### 8.1 기록 상세 화면
- [x] `src/screens/RecordDetailScreen.tsx` 생성
  - 전체 내용 표시
  - 감정 아이콘 + 작성 시간
  - 받은 공감/메시지 목록 (Mock 데이터)
  - 더보기 메뉴: 수정 / 삭제 / 공유 설정 변경
  - 유닛 테스트

### 8.2 기록 수정 화면
- [x] `src/screens/EditRecordScreen.tsx` 생성
  - 기존 내용 불러오기
  - WriteScreen과 유사한 UI
  - 저장 시 recordStore 업데이트
  - 유닛 테스트

### 8.3 설정 화면
- [x] `src/screens/SettingsScreen.tsx` 완성
  - 언어 선택 드롭다운 (UI만, 실제 변경 X)
  - 푸시 알림 토글 (UI만)
  - 로그아웃 버튼 → 로그인 화면
  - 계정 삭제 → 확인 다이얼로그 → 로그인 화면
  - 개인정보 처리방침 링크 (더미 URL)
  - 이용약관 링크 (더미 URL)
  - 개발자에게 문의 (mailto:)
  - 유닛 테스트

### 8.4 확인 다이얼로그
- [x] `src/components/ConfirmDialog.tsx` 생성
  - 제목, 메시지, 확인/취소 버튼
  - 삭제 확인: "이 기록을 삭제할까요?"
  - 로그아웃 확인: "정말 로그아웃할까요?"
  - 계정 삭제 경고: "모든 기록이 삭제됩니다. 정말 삭제할까요?"
  - 유닛 테스트

### 8.5 신고 바텀시트
- [x] `src/components/ReportBottomSheet.tsx` 생성
  - 5가지 신고 사유:
    1. 욕설/혐오 표현
    2. 스팸/광고
    3. 자해/자살 암시
    4. 개인정보 노출
    5. 기타 (직접 입력)
  - 제출 버튼 → 완료 메시지 (Mock)
  - 유닛 테스트

---

## Phase 9: 폴리싱 및 개선

**우선순위: P2 (나중)** → ✅ 완료

### 9.1 애니메이션 개선
- [x] `react-native-reanimated` + `react-native-gesture-handler` 도입
- [x] 6개 컴포넌트 Reanimated 마이그레이션
  - HeartButton, FloatingActionButton, EmotionButton
  - ConfirmDialog, BottomSheet, FeedCard (신규 분리)
- [x] GestureHandler 통합: BottomSheet 스와이프 제스처
- [x] babel.config.js, jest.setup.js, App.tsx 설정

### 9.2 접근성
- [x] accessibilityHint 추가 (6개 컴포넌트)
- [x] hitSlop 추가: RecordCard 액션 버튼
- [x] 색상 대비 개선: HeartButton gray400 → gray500 (WCAG AA)

### 9.3 성능 최적화
- [x] React.memo 적용: FeedCard, RecordCard
- [x] useCallback 적용: FeedScreen, MyRecordsScreen 핸들러
- [x] FlatList 최적화: MyRecordsScreen
  - initialNumToRender, maxToRenderPerBatch, windowSize, removeClippedSubviews

---

## Phase 10: HCI 개선

**우선순위: P1 (2주)**
**목표**: HCI 이론 기반 사용자 경험 개선

### 10.1 Toast/Snackbar 시스템 ✅ 완료
- [x] `src/components/Toast.tsx` 생성
  - 성공/에러/경고/정보 4가지 타입
  - 자동 사라짐 (3초) + 수동 닫기
  - 하단 고정 위치 (탭바 위)
  - Reanimated 애니메이션
- [x] `src/contexts/ToastContext.tsx` 생성
  - useToast() 훅 제공
  - showToast(type, message) API
- [x] `App.tsx` ToastProvider 래핑
- [x] 유닛 테스트 (8개 통과)

### 10.2 스켈레톤 UI ✅ 완료
- [x] `src/components/SkeletonLoader.tsx` 생성
  - RecordCard 스켈레톤
  - FeedCard 스켈레톤
  - Reanimated shimmer 애니메이션
- [x] MyRecordsScreen, FeedScreen에 적용
  - 초기 로딩 시 스켈레톤 표시
- [x] 유닛 테스트 (12개 통과)

### 10.3 진행 상황 인디케이터 ✅ 완료
- [x] `src/components/StepIndicator.tsx` 생성
  - 털어놓기 플로우: 3단계 표시
  - 감정 선택 (1/3) → 글쓰기 (2/3) → 공유 설정 (3/3)
  - dot/bar 2가지 variant 지원
  - Reanimated 애니메이션
- [x] EmotionSelectScreen, WriteScreen에 적용
- [x] 유닛 테스트 (13개 통과)

### 10.4 자동 임시 저장 (Draft) ✅ 완료
- [x] `src/store/draftStore.ts` 생성
  - Zustand + AsyncStorage persist
  - 5초 간격 자동 저장
- [x] `src/hooks/useDraft.ts` 생성
  - WriteScreen 연동
  - 저장 완료 시 draft 삭제
  - "자동 저장됨" 인디케이터
- [x] WriteScreen 수정: Draft 연동
- [x] 유닛 테스트 (12개 통과)

### 10.5 접근성 개선 (WCAG AA) ✅ 완료
- [x] `src/theme/colors.ts` 수정
  - Primary #4A90E2 → #3565C0 (대비 3.5:1 → 5.2:1)
- [x] `src/screens/LoginScreen.tsx` 수정
  - Input에 accessibilityLabel 추가
  - 에러 메시지 accessibilityLiveRegion 설정
- [x] `src/components/BottomSheet.tsx` 수정
  - ActionSheet 버튼에 accessibilityRole="button" 추가
  - destructive 액션에 accessibilityHint 추가

### 10.6 스크린 개선
- [x] 내 기록 스크린
지금 내 기록 탭을 개선할거야. 현재 문제점이 뭐냐면 흐림, 맑음, 비,
 구름, 폭풍마다 색깔이 너무 다채로워서 글씨가 잘 안보여. 글씨 색은 
통일해야 해. 그리고 밑에 좋아요, 댓글과 내용을 구분하는 구분선이 꼭 
필요할까? 그리고 댓글과 좋아요가 없을 때랑, 좋아요와 댓글이 있을 
떄랑 그 하트와댓글 아이콘의 간격이 일정하지가 않아. 이걸 어떻게 
해결하면 좋을까? 그리고 내 기록에서 중요한 정보는 뭘까? 그 기록을 
언제 썼는지 알 수 있어야 해. 방금 전, 1시간 전으로 써두면 언제 
썼는지 모를거야. 그리고 중요한 정보가 강조되고, 그렇지 않은 정보는 
강조하지 않는 그런 계층화가 안되어있어. 중요한 정보란 무엇일까? 
그리고 카드가 너무 복잡해. 공유됨 이란것도 좀 짜치고 파랑색과 
검은색을 쓰니까 글씨가 잘 보이지도 않고 사이 여백도 너무 타이트해.

아이콘이 직관적이지 않고 색이 좀 흐릿해서 잘 안보임
카드에 그림자가 있는건가 그림자 뺴자

- [x] 기록 상세 스크린
- [x] 기록 관리도 헤더 구분선 밑에 불필요한 여백이 있는거같은데

- [x] 바텀 네비게이션 탭 아이콘 선택하면 Fill 선택안하면 Line 아이콘으로. 그리고 크기는 유지하되 아이콘과 글씨를 살짝 위로 더 올리기.

- [x] 로그인/회원가입

- [x] 날씨 선택창
이건 날씨(날씨는 감정을 비유함)을 선택하는 창이야. 이걸 직관적으로 보여주도록 하는게 이 스크린에 목표야.

- [x] 글 작성창
- [x] 함께해요
- [x] 설정 창

- [ ] 그리고 오른쪽 위에 알람 아이콘이 있고, 코멘트나 공감을 받으면 알림을 뜨도록. (접속 유도)
- [ ] 온보딩

- [ ] 토스트 메세지


### 구현 순서

**Week 1: 피드백 + 접근성** ✅ 완료
1. ✅ Toast 시스템 (10.1)
2. ✅ 색상 대비 개선 (10.5)
3. ✅ LoginScreen 접근성 (10.5)
4. ✅ ActionSheet 접근성 (10.5)

**Week 2: 사용자 경험 강화** ✅ 완료
5. ✅ 스켈레톤 UI (10.2)
6. ✅ 진행 상황 인디케이터 (10.3)
7. ✅ 자동 임시 저장 (10.4)

---

## 미구현 (백엔드 연동 시 추가)

> 프론트엔드 완료 후, 백엔드 연동 시 아래 항목 구현 예정

- ❌ Supabase 인증 연동
- ❌ 데이터베이스 테이블 생성 (records, hearts, messages)
- ❌ RLS 정책 설정
- ❌ 실시간 동기화 (Supabase Real-time)
- ❌ 감정 유사도 매칭 알고리즘
- ❌ 푸시 알림 (FCM)
- ❌ 다국어 지원 (i18n)
- ❌ E2E 테스트 (Maestro)
- ❌ 스토어 배포 준비

---

## 진행 상황 추적

| Phase | 상태          | 완료일     | 비고                          |
| ----- | ------------- | ---------- | ----------------------------- |
| 1     | ✅ 완료       | 2025-11-09 | 프로젝트 초기화               |
| 2     | ✅ 완료       | 2025-11-09 | 개발 환경 구축                |
| 3     | ✅ 완료       | 2025-11-10 | 공통 리소스 제작              |
| 4     | ✅ 완료       | 2025-11-10 | CI/CD 구축                    |
| 5     | ✅ 완료       | 2025-12-06 | Mock 인증 시스템              |
| 6     | ✅ 완료       | 2025-12-06 | 메인 네비게이션 + 털어놓기    |
| 7     | ✅ 완료       | 2025-12-06 | 내 기록 목록 + 피드           |
| 8     | ✅ 완료       | 2025-12-06 | 추가 화면 (상세, 수정, 설정)  |
| 9     | ✅ 완료       | 2025-12-06 | 폴리싱 및 개선 (Reanimated)   |
| 10    | 🔄 진행 예정  | -          | HCI 개선 (Toast, 스켈레톤 등) |

---

## 참고 문서

- [요구사항 명세서](docs/REQUIREMENTS.md)
- [화면 Flow](docs/SCREEN_FLOW.md)
- [레이아웃 스케치](docs/LAYOUT_SKETCHES.md)
- [디자인 시스템](docs/DESIGN_SYSTEM.md)
- [프로젝트 가이드](CLAUDE.md)

---

**생성일**: 2025-11-09
**수정일**: 2025-12-06 (HCI 개선 Phase 추가)
**총 Phase 수**: 10개 (백엔드 미포함)
