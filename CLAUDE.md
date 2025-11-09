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

## 프로젝트 문서

### 요구사항 및 설계 문서

**위치**: `docs/`

**주요 문서**:
- **요구사항 명세서** (`docs/REQUIREMENTS.md`)
  - 프로젝트 개요 및 핵심 가치
  - 기능적/비기능적 요구사항
  - UI/UX 가이드라인 (감정 날씨, 메시지 프리셋)
  - 우선순위 및 로드맵 (Phase 0-3)
  - 성공 지표 및 위험 요소

- **API 명세서** (`docs/API_SPEC.md`)
  - RESTful API 엔드포인트
  - 요청/응답 스키마
  - 에러 코드 정의
  - Supabase RPC 함수
  - Real-time Subscriptions
  - 푸시 알림 구조

**사용 시기**:
- 새 기능 개발 전: 요구사항 확인
- API 연동 시: API 명세서 참조
- 우선순위 결정 시: 로드맵 확인

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

## 추가 리소스

- 각 스킬의 상세 가이드: `.claude/skills/[skill-name]/SKILL.md`
- Hooks 시스템: `.claude/hooks/README.md`
- Skill 개발자 가이드: `.claude/skills/skill-developer/SKILL.md`

---

**마지막 업데이트**: 2025-11-09
**프로젝트 타입**: React Native + Supabase Mobile App (Hang On - 감정 공유 플랫폼)
**Claude Code 버전**: Compatible with Claude Code skill system
