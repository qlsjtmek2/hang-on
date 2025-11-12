---
name: rn-supabase-project-planner
description: React Native + Supabase 앱 개발을 위한 완전한 todolist 자동 생성. 요구사항 분석, MVP Features 추출, Phase 분리, PROJECT_TODOLIST.md 생성. Use for todolist, checklist, project plan, development plan.
---

# React Native + Supabase Project Planner

## Purpose

사용자의 앱 요구사항을 받아서, 제시된 개발 Flow에 따라 완전한 개발 todolist를 자동 생성합니다. MVP Features를 자동으로 추출하고, 각 Feature를 독립 Phase로 분리하여 체계적인 개발 계획을 수립합니다.

## When to Use

Use this skill when:

- 새 React Native + Supabase 프로젝트 시작
- 앱 아이디어를 구체적인 개발 계획으로 변환
- MVP 기능 목록을 체크리스트로 정리
- 팀과 공유할 개발 로드맵 필요
- 개발 진행 상황 추적용 체크리스트 필요

## MCP Integration

**github**: GitHub Issues 연동 (선택적)

```
- create_issue: 각 Phase를 Issue로 생성 가능
- add_issue_comment: 진행 상황 업데이트
```

## Usage Flow

### 1. 요구사항 수집

사용자에게 다음 질문:

1. **앱 아이디어**: 무엇을 만들고 싶으신가요?
2. **핵심 기능**: 어떤 기능이 필요한가요? (3-10개)
3. **사용자 유형**: 누가 사용하나요? (일반 사용자, 관리자 등)
4. **인증 방식**: 로그인이 필요한가요?

### 2. MVP Features 추출

요구사항을 분석하여 MVP Features 자동 추출:

- 핵심 기능만 선별 (Nice-to-have 제외)
- 의존성에 따라 순서 결정
- 각 Feature를 독립 Phase로 분리

### 3. Todolist 생성

`PROJECT_TODOLIST.md` 파일 생성:

- 기본 Phases (1-4): 초기화, 환경, 공통 리소스, CI/CD
- Feature Phases (5-N): 각 MVP Feature
- 최종 Phases (N+1~N+3): 테스트, 배포 준비, 배포

## Requirements Analysis Process

### Step 1: 요구사항 분류

```
입력: "SNS 앱 만들고 싶어요. 로그인, 게시글 작성/수정/삭제, 좋아요, 댓글, 프로필 편집 기능 필요해요."

분석:
- 인증: 로그인 ✓
- CRUD: 게시글, 댓글
- 상호작용: 좋아요
- 프로필: 사용자 정보 관리
```

### Step 2: MVP 우선순위

```
Phase 5: 인증 시스템 (필수, 다른 기능의 전제조건)
Phase 6: 프로필 관리 (인증 의존)
Phase 7: 게시글 CRUD (핵심 기능)
Phase 8: 좋아요 기능 (게시글 의존)
Phase 9: 댓글 기능 (게시글 의존)
```

### Step 3: 기술 스택 결정

각 Feature에 필요한 기술:

- **인증**: Supabase Auth
- **게시글**: Supabase Database + RLS, React Native FlatList
- **좋아요**: Supabase Real-time (선택적)
- **댓글**: Nested data structure

## MVP Features Extraction

### 자동 추출 알고리즘

```typescript
function extractMVPFeatures(requirements: string[]): Feature[] {
  const features: Feature[] = [];

  // 1. 인증 감지
  if (hasAuth(requirements)) {
    features.push({ name: '인증 시스템', priority: 1 });
  }

  // 2. CRUD 감지
  const crudEntities = detectCRUD(requirements);
  crudEntities.forEach((entity, index) => {
    features.push({
      name: `${entity} CRUD`,
      priority: 2 + index,
      dependencies: hasAuth ? ['인증 시스템'] : [],
    });
  });

  // 3. 상호작용 기능
  const interactions = detectInteractions(requirements);
  interactions.forEach((interaction, index) => {
    features.push({
      name: interaction,
      priority: 2 + crudEntities.length + index,
      dependencies: [
        /* related CRUD */
      ],
    });
  });

  return sortByDependency(features);
}
```

### 예시 매핑

| 키워드                 | 추출 Feature |
| ---------------------- | ------------ |
| 로그인, 회원가입, 인증 | 인증 시스템  |
| 게시글, 포스트, 피드   | 게시글 CRUD  |
| 댓글, 리플             | 댓글 기능    |
| 좋아요, 하트           | 좋아요 기능  |
| 프로필, 마이페이지     | 프로필 관리  |
| 검색, 필터             | 검색 기능    |
| 알림, 푸시             | 알림 시스템  |

## Todolist Generation Algorithm

### Phase 구조

```markdown
# [프로젝트 이름] Development Todolist

## Phase 1: 프로젝트 초기화

- [ ] React Native 프로젝트 생성 (`npx @react-native-community/cli@latest init`)
- [ ] Supabase 프로젝트 생성 (MCP: create_project)
- [ ] 필요한 기술 스택 설치 (Navigation, Zustand 등)

## Phase 2: 개발 환경 구축

- [ ] 테스트 에뮬레이터 환경 구축 (Android/iOS)
- [ ] 필요한 의존성 패키지 모두 설치
- [ ] 의존성 패키지 호환성 체크 (`npm install`)

## Phase 3: 공통 리소스 제작

- [ ] 디자인 가이드라인에 맞춘 컬러 중앙 스크립트 (`src/theme/colors.ts`)
- [ ] 타이포그래피 중앙 스크립트 (`src/theme/typography.ts`)
- [ ] 스페이싱 중앙 스크립트 (`src/theme/spacing.ts`)
- [ ] 필요할 것 같은 공통 컴포넌트 제작 (Button, Input, Card 등)

## Phase 4: CI/CD 구축

- [ ] GitHub Actions 워크플로우 설정 (`.github/workflows/`)
- [ ] 유닛 테스트 자동 실행 설정
- [ ] TypeScript 타입 체크 자동화
- [ ] 빌드 자동화 (Android/iOS)

## Phase N: [Feature 이름]

### 데이터베이스

- [ ] 테이블 설계 및 생성 (Supabase MCP: apply_migration)
- [ ] RLS 정책 설정 (읽기/쓰기 권한)
- [ ] pgTAP 통합 테스트 작성 및 실행

### 프론트엔드

- [ ] UI 컴포넌트 개발 (`src/screens/`, `src/components/`)
- [ ] 상태 관리 설정 (Zustand store)
- [ ] 유닛 테스트 작성 (Jest + RNTL)

### 통합

- [ ] Supabase API 연동 (`src/services/`)
- [ ] Frontend-Backend 통합 테스트
- [ ] 에러 핸들링 및 로딩 상태 처리

## Phase N+1: E2E 테스트

- [ ] Maestro 플로우 작성 (`.maestro/`)
- [ ] 주요 사용자 여정 테스트 (로그인 → 핵심 기능)
- [ ] 개발용 빌드 후 테스트 실행
- [ ] 스크린샷 촬영 및 검토

## Phase N+2: 배포 준비

- [ ] 앱 아이콘 제작 및 적용
- [ ] 앱 설명 작성 (스토어용)
- [ ] 그래픽 이미지 제작 (스크린샷, 배너)
- [ ] 개인정보 처리방침 작성 및 호스팅
- [ ] Google Play Console 등록
- [ ] CI/CD 자동 배포 설정

## Phase N+3: 배포

- [ ] 프로덕션 빌드 생성
- [ ] 내부 테스트 (Closed Testing)
- [ ] 베타 테스트 (Open Testing)
- [ ] 프로덕션 배포 (Google Play Store)
```

## Complete Example

### 입력 요구사항

```
사용자: "할 일 관리 앱 만들고 싶어요.
- 로그인 기능
- 할 일 추가/수정/삭제
- 카테고리별 분류
- 완료 표시
- 통계 보기"
```

### 생성된 Todolist

```markdown
# Todo Manager App Development Todolist

## Phase 1: 프로젝트 초기화

- [ ] React Native 프로젝트 생성
- [ ] Supabase 프로젝트 생성
- [ ] 기술 스택 설치 (React Navigation, Zustand)

## Phase 2: 개발 환경 구축

- [ ] Android 에뮬레이터 설정
- [ ] iOS 시뮬레이터 설정
- [ ] 의존성 설치 및 호환성 체크

## Phase 3: 공통 리소스 제작

- [ ] 컬러 팔레트 정의 (`src/theme/colors.ts`)
- [ ] 타이포그래피 정의 (`src/theme/typography.ts`)
- [ ] 공통 컴포넌트: Button, Input, Card, Checkbox

## Phase 4: CI/CD 구축

- [ ] GitHub Actions 워크플로우
- [ ] 자동 테스트 실행
- [ ] 빌드 자동화

## Phase 5: 인증 시스템

### 데이터베이스

- [ ] users 테이블 (Supabase Auth 기본)
- [ ] profiles 테이블 생성
- [ ] RLS 정책: 본인만 프로필 수정 가능
- [ ] pgTAP 테스트: 프로필 CRUD

### 프론트엔드

- [ ] 로그인 화면 (`src/screens/LoginScreen.tsx`)
- [ ] 회원가입 화면 (`src/screens/SignUpScreen.tsx`)
- [ ] Auth 상태 관리 (Zustand)
- [ ] 유닛 테스트: 로그인/회원가입 폼

### 통합

- [ ] Supabase Auth 연동
- [ ] 세션 관리
- [ ] 통합 테스트: 회원가입 → 로그인 플로우

## Phase 6: 할 일 CRUD

### 데이터베이스

- [ ] todos 테이블 (id, user_id, title, description, completed, created_at)
- [ ] RLS 정책: 본인 할 일만 읽기/쓰기
- [ ] pgTAP 테스트: todos CRUD

### 프론트엔드

- [ ] 할 일 목록 화면 (`src/screens/TodoListScreen.tsx`)
- [ ] 할 일 추가 폼 (`src/components/AddTodoForm.tsx`)
- [ ] 할 일 편집 폼 (`src/components/EditTodoForm.tsx`)
- [ ] 유닛 테스트: TodoItem, AddTodoForm

### 통합

- [ ] Supabase API 연동 (`src/services/todoService.ts`)
- [ ] CRUD 로직 구현
- [ ] 통합 테스트: 할 일 생성 → DB 저장 확인

## Phase 7: 카테고리 기능

### 데이터베이스

- [ ] categories 테이블 (id, user_id, name, color)
- [ ] todos 테이블에 category_id 컬럼 추가
- [ ] RLS 정책: 본인 카테고리만 관리
- [ ] pgTAP 테스트: 카테고리 CRUD

### 프론트엔드

- [ ] 카테고리 선택 컴포넌트
- [ ] 카테고리 관리 화면
- [ ] 카테고리별 필터링 UI
- [ ] 유닛 테스트: CategoryPicker

### 통합

- [ ] 카테고리 API 연동
- [ ] 할 일과 카테고리 연결
- [ ] 통합 테스트: 카테고리 생성 → 할 일 분류

## Phase 8: 완료 표시 기능

### 데이터베이스

- [ ] todos.completed 필드 업데이트 로직
- [ ] pgTAP 테스트: 완료 토글

### 프론트엔드

- [ ] 체크박스 컴포넌트
- [ ] 완료된 할 일 스타일 (취소선)
- [ ] 유닛 테스트: TodoItem 완료 토글

### 통합

- [ ] 완료 상태 업데이트 API
- [ ] Real-time 구독 (선택적)
- [ ] 통합 테스트: 완료 토글 → DB 반영

## Phase 9: 통계 기능

### 데이터베이스

- [ ] 통계 쿼리 (총 할 일, 완료율 등)
- [ ] pgTAP 테스트: 통계 계산

### 프론트엔드

- [ ] 통계 화면 (`src/screens/StatsScreen.tsx`)
- [ ] 차트 컴포넌트 (Victory Native 또는 React Native Chart Kit)
- [ ] 유닛 테스트: 통계 계산 로직

### 통합

- [ ] 통계 API 연동
- [ ] 통합 테스트: 할 일 변경 → 통계 업데이트

## Phase 10: E2E 테스트

- [ ] Maestro 플로우: 회원가입 → 로그인
- [ ] Maestro 플로우: 할 일 추가 → 완료 표시
- [ ] Maestro 플로우: 카테고리 생성 → 할 일 분류
- [ ] 스크린샷 촬영

## Phase 11: 배포 준비

- [ ] 앱 아이콘 제작
- [ ] 스토어 스크린샷 촬영
- [ ] 앱 설명 작성
- [ ] 개인정보 처리방침
- [ ] Google Play Console 등록
- [ ] CI/CD 배포 자동화

## Phase 12: 배포

- [ ] 프로덕션 빌드
- [ ] 내부 테스트
- [ ] 베타 테스트
- [ ] 프로덕션 배포
```

## Feature Phase Template

각 Feature Phase는 다음 템플릿을 따름:

```markdown
## Phase N: [Feature 이름]

### 데이터베이스

- [ ] 테이블 설계 (ERD 작성)
- [ ] 마이그레이션 파일 작성
- [ ] 테이블 생성 (Supabase MCP: apply_migration)
- [ ] RLS 정책 설정
- [ ] 인덱스 추가 (성능 최적화)
- [ ] pgTAP 통합 테스트 작성
- [ ] pgTAP 테스트 실행 및 검증

### 프론트엔드

- [ ] 화면 컴포넌트 개발 (`src/screens/`)
- [ ] 재사용 컴포넌트 개발 (`src/components/`)
- [ ] 상태 관리 설정 (Zustand store)
- [ ] 네비게이션 연결 (React Navigation)
- [ ] 유닛 테스트 작성 (Jest + RNTL)
- [ ] 유닛 테스트 실행 및 커버리지 확인

### 통합

- [ ] API 서비스 작성 (`src/services/`)
- [ ] Frontend-Backend 연동
- [ ] 에러 핸들링
- [ ] 로딩 상태 처리
- [ ] 통합 테스트 작성
- [ ] 통합 테스트 실행 및 검증
```

## Best Practices

### 1. Feature 분리 기준

**Good**: 독립적으로 개발 및 테스트 가능

```
Phase 5: 인증 시스템
Phase 6: 게시글 CRUD
Phase 7: 댓글 기능
```

**Bad**: 한 Phase에 너무 많은 기능

```
Phase 5: 인증 + 게시글 + 댓글 + 좋아요 (너무 큼)
```

### 2. 통합 테스트 배치

**Good**: 각 Feature마다 통합 테스트

```
Phase 6: 게시글 CRUD
  → 통합 테스트: 게시글 생성 → DB 저장 → 조회
```

**Bad**: 모든 Feature 개발 후 한 번에 테스트

```
Phase 10: 통합 테스트 (모든 기능) ← 디버깅 어려움
```

### 3. CI/CD 조기 구축

**Good**: Phase 4에 CI/CD 구축

```
Phase 4: CI/CD 구축
Phase 5~N: Feature 개발 (CI/CD 자동 검증)
```

**Bad**: 배포 직전에 CI/CD 구축

```
Phase N+2: CI/CD 구축 ← 너무 늦음
```

### 4. 의존성 순서

**Good**: 의존 관계 고려

```
Phase 5: 인증 시스템
Phase 6: 프로필 관리 (인증 의존)
Phase 7: 게시글 CRUD (프로필 의존)
```

**Bad**: 의존성 무시

```
Phase 5: 댓글 기능 (게시글 없음 ← 에러)
Phase 6: 게시글 CRUD
```

## Troubleshooting

### 너무 많은 Features

**문제**: 요구사항에 20개 기능
**해결**:

```typescript
// MVP만 추출
const mvpFeatures = features.filter(f => f.priority === 'high');
// 나머지는 v2로 이동
const v2Features = features.filter(f => f.priority !== 'high');
```

### Feature 순서 모호

**문제**: A와 B 중 어느 것을 먼저?
**해결**:

1. 의존성 확인: B가 A 의존 → A 먼저
2. 복잡도 확인: A가 단순 → A 먼저 (빠른 성공 경험)
3. 사용자 가치: A가 더 중요 → A 먼저

### 통합 테스트 실패

**문제**: 통합 테스트가 계속 실패
**해결**:

1. 유닛 테스트 먼저 통과 확인
2. API 연동 확인 (Supabase URL, Key)
3. RLS 정책 확인 (권한 문제)
4. 에러 로그 확인

## Related Skills

- `react-native-dev`: 프로젝트 초기화 (Phase 1-3)
- `supabase-backend`: 데이터베이스 설계 (각 Feature Phase)
- `react-native-components`: UI 개발 (각 Feature Phase)
- `rn-unit-testing`: 유닛 테스트 (각 Feature Phase)
- `rn-integration-testing`: 통합 테스트 (각 Feature Phase)
- `maestro-e2e-testing`: E2E 테스트 (Phase N+1)
- `github-actions-cicd`: CI/CD 구축 (Phase 4)

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**Output**: PROJECT_TODOLIST.md file ✅
