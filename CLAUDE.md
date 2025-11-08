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

## 사용 가능한 스킬

이 프로젝트에는 8개의 전문화된 스킬이 설정되어 있습니다. 각 스킬은 한글 및 영문 키워드로 자동 활성화됩니다.

### 1. react-native-dev (고우선순위)

**용도**: React Native 프로젝트 설정 및 아키텍처

**활성화 키워드**:
- 한글: 리액트 네이티브, 프로젝트 설정, 네이티브 모듈, 상태 관리, 네비게이션
- 영문: react native, project setup, native module, navigation, state management

**주요 기능**:
- React Native CLI 프로젝트 초기 설정
- 네이티브 모듈 연동 (Swift/Kotlin)
- React Navigation 구성
- 상태 관리 (Context API, Zustand)
- 중앙화된 테마 시스템 (colors, typography, spacing)

**사용 예시**:
```
"리액트 네이티브 프로젝트 초기화해줘"
"네이티브 모듈 연동 방법 알려줘"
"테마 시스템 설정해줘"
```

### 2. react-native-components (고우선순위)

**용도**: UI 컴포넌트 개발 전문화

**활성화 키워드**:
- 한글: 컴포넌트, 버튼, 입력, 카드, 애니메이션, 스타일링
- 영문: component, button, input, card, animation, styling

**주요 기능**:
- 재사용 가능한 컴포넌트 설계
- Props 및 타입 정의
- 애니메이션 및 제스처 처리
- Accessibility 구현
- Magic MCP를 통한 UI 컴포넌트 생성

**사용 예시**:
```
"버튼 컴포넌트 만들어줘"
"애니메이션 추가해줘"
"카드 컴포넌트 스타일링해줘"
```

### 3. supabase-backend (고우선순위)

**용도**: Supabase 백엔드 개발

**활성화 키워드**:
- 한글: 수파베이스, 데이터베이스, 인증, 로그인, 저장소, 실시간
- 영문: supabase, database, auth, storage, edge function, real-time

**주요 기능**:
- 데이터베이스 스키마 설계
- RLS (Row Level Security) 정책 구성
- Auth 및 Storage 설정
- Edge Functions 개발
- Real-time 구독 구현
- Supabase MCP 활용

**사용 예시**:
```
"데이터베이스 테이블 생성해줘"
"RLS 정책 설정해줘"
"로그인 기능 구현해줘"
```

### 4. rn-unit-testing (중우선순위)

**용도**: Jest + RNTL 유닛 테스트

**활성화 키워드**:
- 한글: 유닛 테스트, 단위 테스트, 컴포넌트 테스트, 모킹
- 영문: unit test, jest, testing library, component test, mock

**주요 기능**:
- 컴포넌트 테스트 작성
- 커스텀 훅 테스트
- Mock/Spy 패턴
- 테스트 커버리지 분석

**사용 예시**:
```
"이 컴포넌트 테스트 작성해줘"
"테스트 커버리지 확인해줘"
```

### 5. rn-integration-testing (중우선순위)

**용도**: 통합 테스트 + pgTAP

**활성화 키워드**:
- 한글: 통합 테스트, API 테스트, 데이터베이스 테스트
- 영문: integration test, api test, database test, pgtap

**주요 기능**:
- 프론트엔드-백엔드 통합 테스트
- pgTAP 데이터베이스 테스트
- API 호출 테스트
- 데이터 일관성 검증

**사용 예시**:
```
"통합 테스트 작성해줘"
"데이터베이스 테스트 만들어줘"
```

### 6. maestro-e2e-testing (중우선순위)

**용도**: Maestro E2E 테스트

**활성화 키워드**:
- 한글: E2E 테스트, 마에스트로, 사용자 여정, 자동화
- 영문: e2e test, maestro, user journey, automation

**주요 기능**:
- Maestro Flow 작성
- UI 자동화 테스트
- 사용자 시나리오 검증

**사용 예시**:
```
"E2E 테스트 작성해줘"
"로그인 플로우 테스트해줘"
```

### 7. github-actions-cicd (중우선순위)

**용도**: GitHub Actions CI/CD 파이프라인

**활성화 키워드**:
- 한글: CI/CD, 깃허브 액션, 배포, 자동화
- 영문: ci/cd, github actions, deployment, pipeline

**주요 기능**:
- GitHub Actions 워크플로우 설정
- 자동화된 테스트 실행
- 빌드 및 배포 자동화
- 환경 변수 관리

**사용 예시**:
```
"CI/CD 파이프라인 설정해줘"
"배포 자동화 구성해줘"
```

### 8. rn-supabase-project-planner (고우선순위)

**용도**: 개발 Todolist 자동 생성

**활성화 키워드**:
- 한글: 투두리스트, 체크리스트, 프로젝트 계획, 개발 계획, 로드맵
- 영문: todolist, checklist, project plan, development plan, roadmap

**주요 기능**:
- 요구사항 자동 분석
- MVP Features 자동 추출
- Phase별 체크리스트 생성
- PROJECT_TODOLIST.md 파일 생성

**사용 예시**:
```
"SNS 앱 todolist 만들어줘"
"프로젝트 계획 세워줘"
"개발 체크리스트 생성해줘"
```

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
│   ├── theme/            # 중앙화된 테마 (colors, typography, spacing)
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
   - `src/theme/` 디렉토리의 colors, typography, spacing 활용
   - 절대 하드코딩하지 말 것

2. **컴포넌트 재사용**
   - 새 컴포넌트 생성 전 `src/components/` 확인
   - 기존 컴포넌트 재활용 우선

3. **타입 안정성**
   - 모든 파일에 TypeScript 사용
   - Props, State, API 응답 타입 정의

4. **테스트 작성**
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

## 스킬 활성화 예시

### 프로젝트 초기화
```
"리액트 네이티브 프로젝트 초기화해줘"
→ react-native-dev 스킬 자동 활성화
```

### UI 개발
```
"로그인 화면 만들어줘"
→ react-native-components 스킬 자동 활성화
```

### 백엔드 개발
```
"사용자 테이블 생성하고 RLS 설정해줘"
→ supabase-backend 스킬 자동 활성화
```

### 테스트 작성
```
"로그인 컴포넌트 테스트 작성해줘"
→ rn-unit-testing 스킬 자동 활성화
```

### 배포 설정
```
"GitHub Actions로 자동 배포 설정해줘"
→ github-actions-cicd 스킬 자동 활성화
```

### 프로젝트 계획
```
"SNS 앱 todolist 만들어줘"
→ rn-supabase-project-planner 스킬 자동 활성화
```

---

## 추가 리소스

- 각 스킬의 상세 가이드: `.claude/skills/[skill-name]/SKILL.md`
- Hooks 시스템: `.claude/hooks/README.md`
- Skill 개발자 가이드: `.claude/skills/skill-developer/SKILL.md`

---

**마지막 업데이트**: 2025-11-08
**프로젝트 타입**: React Native + Supabase Mobile App
**Claude Code 버전**: Compatible with Claude Code skill system
