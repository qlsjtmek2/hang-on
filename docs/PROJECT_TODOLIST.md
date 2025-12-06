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
- [ ] `src/navigation/MainTabNavigator.tsx` 생성
  - 하단 탭: 내 기록 / 누군가와 함께 / 설정
  - 아이콘 설정 (react-native-vector-icons 또는 이모지)
- [ ] `src/navigation/RootNavigator.tsx` 수정
  - 인증 여부에 따라 Auth Stack / Main Tab 전환
- [ ] 플로팅 액션 버튼 (털어놓기)
  - 메인 화면 우하단에 배치
  - 탭 시 감정 선택 화면으로 이동

### 6.2 감정 선택 화면
- [ ] `src/screens/EmotionSelectScreen.tsx` 생성
  - EmotionSelector 컴포넌트 활용
  - 5단계 날씨 아이콘 원형/가로 배치
  - 선택 시 확대 + 색상 강조 애니메이션
  - "다음" 버튼 → 글쓰기 화면 이동
  - 유닛 테스트

### 6.3 글쓰기 화면
- [ ] `src/screens/WriteScreen.tsx` 생성
  - 상단: 선택한 감정 표시 (읽기 전용, 수정 불가)
  - 텍스트 입력 (Input 컴포넌트 활용)
    - 플레이스홀더: "지금 느끼는 기분을 자유롭게 표현해보세요"
    - 최대 500자
  - 실시간 글자 수 카운터 (137/500)
  - 500자 초과 시 빨간색 표시 + 경고
  - "다 썼어요!" 버튼 → 공유 설정 바텀시트
  - 유닛 테스트

### 6.4 공유 설정 바텀시트
- [ ] `src/components/ShareSettingsBottomSheet.tsx` 생성
  - 3가지 옵션:
    1. 혼자 간직하기 (비공개)
    2. 내일 나누기 (예약 공개)
    3. 지금 나누기 (즉시 공개)
  - 각 옵션 설명 표시
  - 선택 시 Mock 저장 → 메인 화면 이동
  - 유닛 테스트

### 6.5 Mock 기록 Store
- [ ] `src/store/recordStore.ts` 생성
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

## Phase 8: 추가 화면 (상세, 수정, 설정)

**우선순위: P1 (확장)**

### 8.1 기록 상세 화면
- [ ] `src/screens/RecordDetailScreen.tsx` 생성
  - 전체 내용 표시
  - 감정 아이콘 + 작성 시간
  - 받은 공감/메시지 목록 (Mock 데이터)
  - 더보기 메뉴: 수정 / 삭제 / 공유 설정 변경
  - 유닛 테스트

### 8.2 기록 수정 화면
- [ ] `src/screens/EditRecordScreen.tsx` 생성
  - 기존 내용 불러오기
  - WriteScreen과 유사한 UI
  - 저장 시 recordStore 업데이트
  - 유닛 테스트

### 8.3 설정 화면
- [ ] `src/screens/SettingsScreen.tsx` 생성
  - 언어 선택 드롭다운 (UI만, 실제 변경 X)
  - 푸시 알림 토글 (UI만)
  - 로그아웃 버튼 → 로그인 화면
  - 계정 삭제 → 확인 다이얼로그 → 로그인 화면
  - 개인정보 처리방침 링크 (더미 URL)
  - 이용약관 링크 (더미 URL)
  - 개발자에게 문의 (mailto:)
  - 유닛 테스트

### 8.4 확인 다이얼로그
- [ ] `src/components/ConfirmDialog.tsx` 생성
  - 제목, 메시지, 확인/취소 버튼
  - 삭제 확인: "이 기록을 삭제할까요?"
  - 로그아웃 확인: "정말 로그아웃할까요?"
  - 계정 삭제 경고: "모든 기록이 삭제됩니다. 정말 삭제할까요?"
  - 유닛 테스트

### 8.5 신고 바텀시트
- [ ] `src/components/ReportBottomSheet.tsx` 생성
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

**우선순위: P2 (나중)**

### 9.1 애니메이션 개선
- [ ] 화면 전환 애니메이션
- [ ] 감정 선택 애니메이션 개선
- [ ] 공감 버튼 펄스 효과 개선

### 9.2 접근성
- [ ] 모든 터치 타겟 44x44pt 이상 확인
- [ ] 스크린 리더 테스트
- [ ] 색상 대비 검증

### 9.3 성능 최적화
- [ ] FlatList 최적화 (getItemLayout, keyExtractor)
- [ ] 불필요한 리렌더링 방지 (React.memo)

### 9.4 다크모드 (선택)
- [ ] 다크모드 테마 정의
- [ ] 시스템 설정 연동

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
| 5     | ⬜ 대기       | -          | Mock 인증 시스템              |
| 6     | ⬜ 대기       | -          | 메인 네비게이션 + 털어놓기    |
| 7     | ⬜ 대기       | -          | 내 기록 목록 + 피드           |
| 8     | ⬜ 대기       | -          | 추가 화면 (상세, 수정, 설정)  |
| 9     | ⬜ 대기       | -          | 폴리싱 및 개선                |

---

## 참고 문서

- [요구사항 명세서](docs/REQUIREMENTS.md)
- [화면 Flow](docs/SCREEN_FLOW.md)
- [레이아웃 스케치](docs/LAYOUT_SKETCHES.md)
- [디자인 시스템](docs/DESIGN_SYSTEM.md)
- [프로젝트 가이드](CLAUDE.md)

---

**생성일**: 2025-11-09
**수정일**: 2025-12-06 (프론트엔드 전용으로 변경)
**총 Phase 수**: 9개 (백엔드 미포함)
