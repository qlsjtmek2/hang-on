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

## 추가 리소스

- 각 스킬의 상세 가이드: `.claude/skills/[skill-name]/SKILL.md`
- Hooks 시스템: `.claude/hooks/README.md`
- Skill 개발자 가이드: `.claude/skills/skill-developer/SKILL.md`

---

**마지막 업데이트**: 2025-11-08
**프로젝트 타입**: React Native + Supabase Mobile App
**Claude Code 버전**: Compatible with Claude Code skill system
