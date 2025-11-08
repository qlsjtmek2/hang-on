# 스킬 (Skills)

React Native + Supabase 모바일 앱 개발을 위한 전문화된 스킬 컬렉션입니다. 컨텍스트에 따라 자동으로 활성화됩니다.

---

## 스킬이란?

스킬은 필요할 때 Claude가 로드하는 모듈화된 지식 베이스입니다:
- 도메인 특화 가이드라인
- 모범 사례
- 코드 예제
- 피해야 할 안티패턴

**문제:** 스킬은 기본적으로 자동 활성화되지 않습니다.

**해결책:** 이 프로젝트는 hooks + 설정을 통해 자동 활성화를 구현했습니다.

---

## 사용 가능한 스킬

### 1. react-native-dev (고우선순위)

**목적:** React Native 프로젝트 설정 및 아키텍처

**활성화 키워드:**
- 한글: 리액트 네이티브, 프로젝트 설정, 네이티브 모듈, 상태 관리, 네비게이션
- 영문: react native, project setup, native module, navigation

**다루는 내용:**
- React Native CLI 프로젝트 초기 설정
- 네이티브 모듈 연동 (Swift/Kotlin)
- React Navigation 구성
- 상태 관리 (Zustand, Context API)
- 중앙화된 테마 시스템 (colors, typography, spacing)

**활용 예시:**
- 프로젝트 초기화
- 네이티브 기능 통합
- 테마 및 스타일 시스템 설정

**[스킬 보기 →](react-native-dev/)**

---

### 2. react-native-components (고우선순위)

**목적:** UI 컴포넌트 개발 전문화

**활성화 키워드:**
- 한글: 컴포넌트, 버튼, 입력, 카드, 애니메이션, 스타일링
- 영문: component, button, input, card, animation

**다루는 내용:**
- 재사용 가능한 컴포넌트 설계
- Props 및 TypeScript 타입 정의
- 애니메이션 및 제스처 처리
- Accessibility 구현
- Magic MCP를 통한 UI 생성

**활용 예시:**
- 공통 컴포넌트 제작
- 애니메이션 추가
- 접근성 개선

**[스킬 보기 →](react-native-components/)**

---

### 3. supabase-backend (고우선순위)

**목적:** Supabase 백엔드 개발

**활성화 키워드:**
- 한글: 수파베이스, 데이터베이스, 인증, 로그인, 실시간
- 영문: supabase, database, auth, storage, realtime

**다루는 내용:**
- 데이터베이스 스키마 설계
- RLS (Row Level Security) 정책 구성
- Auth 및 Storage 설정
- Edge Functions 개발
- Real-time 구독 구현
- Supabase MCP 활용

**활용 예시:**
- 테이블 생성 및 RLS 설정
- 인증 시스템 구현
- 파일 업로드 기능

**[스킬 보기 →](supabase-backend/)**

---

### 4. rn-supabase-project-planner (고우선순위)

**목적:** 개발 Todolist 자동 생성

**활성화 키워드:**
- 한글: 투두리스트, 체크리스트, 프로젝트 계획, 개발 계획
- 영문: todolist, checklist, project plan, roadmap

**다루는 내용:**
- 요구사항 자동 분석
- MVP Features 자동 추출
- Phase별 체크리스트 생성
- PROJECT_TODOLIST.md 파일 생성
- 17단계 개발 Flow 적용

**활용 예시:**
- 새 프로젝트 계획 수립
- MVP 기능 정리
- 개발 로드맵 작성

**[스킬 보기 →](rn-supabase-project-planner/)**

---

### 5. requirements-analyst (고우선순위)

**목적:** 요구사항 분석 및 개선을 위한 대화형 스킬

**활성화 키워드:**
- 한글: 요구사항, 스펙, 사양, 분석, 검토, 개선, 애매, 모호, 부족
- 영문: requirements, specification, spec, analysis, review, refinement, ambiguous

**다루는 내용:**
- 요구사항의 완전성(Completeness) 분석
- 요구사항의 명확성(Clarity) 검토
- 불필요한 요소 식별
- 품질 개선 기회 발견
- AskUserQuestion을 통한 대화형 개선
- 개선된 요구사항 문서 생성

**활용 예시:**
- 프로젝트 시작 전 요구사항 검증
- 모호한 스펙 구체화
- 기능 요청서 개선
- MVP 범위 명확화

**[스킬 보기 →](requirements-analyst/)**

---

### 6. rn-unit-testing (중우선순위)

**목적:** Jest + React Native Testing Library 유닛 테스트

**활성화 키워드:**
- 한글: 유닛 테스트, 단위 테스트, jest, 컴포넌트 테스트
- 영문: unit test, jest, testing library, rntl

**다루는 내용:**
- 컴포넌트 테스트 작성
- 커스텀 훅 테스트
- Mock/Spy 패턴
- 스냅샷 테스트
- 테스트 커버리지 분석

**활용 예시:**
- 컴포넌트 동작 검증
- 비즈니스 로직 테스트
- 커버리지 개선

**[스킬 보기 →](rn-unit-testing/)**

---

### 7. rn-integration-testing (중우선순위)

**목적:** 통합 테스트 + pgTAP

**활성화 키워드:**
- 한글: 통합 테스트, API 테스트, 데이터베이스 테스트
- 영문: integration test, api test, pgtap

**다루는 내용:**
- 프론트엔드-백엔드 통합 테스트
- pgTAP 데이터베이스 테스트
- API 호출 테스트
- 데이터 일관성 검증
- RLS 정책 테스트

**활용 예시:**
- API 엔드포인트 검증
- 데이터베이스 스키마 테스트
- 전체 워크플로우 검증

**[스킬 보기 →](rn-integration-testing/)**

---

### 8. maestro-e2e-testing (중우선순위)

**목적:** Maestro E2E 테스트

**활성화 키워드:**
- 한글: E2E 테스트, 마에스트로, 사용자 여정, 자동화
- 영문: e2e test, maestro, user journey, automation

**다루는 내용:**
- Maestro Flow 작성
- UI 자동화 테스트
- 사용자 시나리오 검증
- 스크린샷 촬영
- CI/CD 통합

**활용 예시:**
- 주요 사용자 플로우 테스트
- 회귀 테스트 자동화
- 릴리스 전 검증

**[스킬 보기 →](maestro-e2e-testing/)**

---

### 9. github-actions-cicd (중우선순위)

**목적:** GitHub Actions CI/CD 파이프라인

**활성화 키워드:**
- 한글: CI/CD, 깃허브 액션, 배포, 자동화
- 영문: ci/cd, github actions, deployment, pipeline

**다루는 내용:**
- GitHub Actions 워크플로우 설정
- 자동화된 테스트 실행
- Android/iOS 빌드 자동화
- Google Play 배포
- 환경 변수 관리

**활용 예시:**
- 자동 테스트 파이프라인
- 빌드 자동화
- 배포 프로세스 구축

**[스킬 보기 →](github-actions-cicd/)**

---

### skill-developer (메타 스킬)

**목적:** Claude Code 스킬 생성 및 관리

**파일:** 7개 리소스 파일 (426줄)

**활용:**
- 새 스킬 생성
- 스킬 구조 이해
- skill-rules.json 작업
- 스킬 활성화 디버깅

**커스터마이징:** ✅ 그대로 복사 사용

**[스킬 보기 →](skill-developer/)**

---

### web-research (유틸리티 스킬)

**목적:** 웹 검색 및 정보 수집

**활용:**
- 최신 라이브러리 문서 검색
- 기술 트렌드 조사
- 에러 해결 방법 검색
- API 문서 찾기

**[스킬 보기 →](web-research/)**

---

## 프로젝트에 스킬 추가하기

### 빠른 통합

**Claude Code를 위한 안내:**
```
사용자: "backend-dev-guidelines 스킬을 내 프로젝트에 추가해줘"

Claude가 해야 할 일:
1. 프로젝트 구조 확인
2. 스킬 디렉토리 복사
3. skill-rules.json 업데이트 (경로 커스터마이징)
4. 통합 검증
```

### 수동 통합

**1단계: 스킬 디렉토리 복사**
```bash
cp -r source-project/.claude/skills/react-native-dev \
      your-project/.claude/skills/
```

**2단계: skill-rules.json 업데이트**

skill-rules.json이 없다면 생성:
```bash
cp source-project/.claude/skills/skill-rules.json \
   your-project/.claude/skills/
```

프로젝트에 맞게 커스터마이징:
```json
{
  "skills": {
    "react-native-dev": {
      "promptTriggers": {
        "keywords": ["react native", "리액트 네이티브"]
      }
    }
  }
}
```

**3단계: 테스트**
- 관련 파일 편집
- 스킬이 자동으로 활성화되는지 확인

---

## skill-rules.json 설정

### 역할

다음 조건에 따라 스킬이 언제 활성화될지 정의:
- **키워드** (프롬프트에 "react native", "database" 등)
- **Intent 패턴** (사용자 의도를 매칭하는 정규식)
- **파일 경로 패턴** (특정 파일 편집 시)
- **콘텐츠 패턴** (코드에 특정 import 포함 시)

### 설정 형식

```json
{
  "skill-name": {
    "type": "domain" | "guardrail",
    "enforcement": "suggest" | "block",
    "priority": "high" | "medium" | "low",
    "promptTriggers": {
      "keywords": ["키워드", "목록"],
      "intentPatterns": ["정규식 패턴"]
    },
    "fileTriggers": {
      "pathPatterns": ["path/to/files/**/*.ts"],
      "contentPatterns": ["import.*Supabase"]
    }
  }
}
```

### Enforcement 레벨

- **suggest**: 제안으로 표시, 차단하지 않음
- **block**: 진행 전 스킬 사용 필수 (가드레일)

**"block" 사용 시기:**
- 중대한 변경 방지 (예: 호환성 문제)
- 중요 데이터베이스 작업
- 보안에 민감한 코드

**"suggest" 사용 시기:**
- 일반 모범 사례
- 도메인 가이드
- 코드 구조화

---

## 스킬 직접 만들기

**skill-developer** 스킬에서 전체 가이드 확인:
- 스킬 YAML frontmatter 구조
- 리소스 파일 구성
- 트리거 패턴 설계
- 스킬 활성화 테스트

**빠른 템플릿:**
```markdown
---
name: my-skill
description: 이 스킬이 하는 일
---

# 스킬 제목

## 목적
[스킬 존재 이유]

## 활용 시기
[자동 활성화 시나리오]

## 빠른 참조
[핵심 패턴 및 예제]

## 리소스 파일
- [topic-1.md](resources/topic-1.md)
- [topic-2.md](resources/topic-2.md)
```

---

## 문제 해결

### 스킬이 활성화되지 않음

**확인 사항:**
1. `.claude/skills/`에 스킬 디렉토리가 있는가?
2. `skill-rules.json`에 스킬이 등록되어 있는가?
3. `pathPatterns`이 파일과 매칭되는가?
4. Hooks가 설치되고 작동하는가?
5. settings.json이 올바르게 설정되었는가?

**디버그:**
```bash
# 스킬 존재 확인
ls -la .claude/skills/

# skill-rules.json 검증
cat .claude/skills/skill-rules.json | jq .

# Hooks 실행 권한 확인
ls -la .claude/hooks/*.sh

# Hook 수동 테스트
./.claude/hooks/skill-activation-prompt.sh
```

### 스킬이 너무 자주 활성화됨

skill-rules.json 업데이트:
- 키워드를 더 구체적으로
- `pathPatterns` 범위 축소
- `intentPatterns` 정확도 향상

### 스킬이 전혀 활성화되지 않음

skill-rules.json 업데이트:
- 키워드 추가
- `pathPatterns` 범위 확대
- `intentPatterns` 추가

---

## Claude Code를 위한 안내

**사용자를 위해 스킬을 통합할 때:**

1. 프로젝트 구조 확인
2. 필요한 스킬 파일 복사
3. skill-rules.json의 `pathPatterns` 커스터마이징
4. 스킬 파일에 하드코딩된 경로가 없는지 확인
5. 통합 후 활성화 테스트

**흔한 실수:**
- 예시 경로를 그대로 유지 (src/api/, frontend/)
- 모노레포 vs 단일 앱 구조 확인 안 함
- skill-rules.json을 커스터마이징 없이 복사

---

## 다음 단계

1. **간단하게 시작:** 작업에 맞는 스킬 하나 추가
2. **활성화 확인:** 관련 파일 편집, 스킬이 제안되는지 확인
3. **더 추가:** 첫 스킬이 작동하면 다른 스킬 추가
4. **커스터마이징:** 워크플로우에 맞게 트리거 조정

**질문이 있으신가요?** [CLAUDE.md](../../CLAUDE.md)에서 프로젝트 전체 가이드를 확인하세요.
