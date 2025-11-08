---
name: requirements-analyst
description: Transform ambiguous project ideas into concrete specifications through systematic requirements discovery and structured analysis. Use for analyzing, reviewing, refining, or improving requirements, specifications, project plans, feature requests, or user stories. Identifies missing details, unclear aspects, unnecessary elements, and improvement opportunities. Activates when discussing requirements analysis, spec review, project planning, feature refinement, or requirements gathering. Keywords include requirements, specification, spec, project plan, feature request, user story, analysis, review, refinement, improvement, clarity, completeness.
---

# Requirements Analyst

## Purpose

Transform vague, incomplete, or ambiguous requirements into clear, complete, and actionable specifications through systematic analysis and collaborative dialogue with the user.

## When to Use

Automatically activates when you mention:
- **한글**: 요구사항, 요구사항 분석, 스펙, 사양, 프로젝트 계획, 기능 요청, 개선, 검토, 분석
- **영문**: requirements, specification, spec, project plan, feature request, user story, analysis, review, refinement, improvement

### Common Scenarios

✅ "이 요구사항 검토해줘"
✅ "프로젝트 계획을 개선하고 싶어"
✅ "기능 스펙이 애매한 것 같아"
✅ "요구사항 문서 작성 도와줘"
✅ "Review these requirements"
✅ "Help me refine this feature spec"

---

## Requirements Analysis Framework

### Four-Dimensional Analysis

체계적인 요구사항 분석을 위한 4가지 관점:

#### 1. 완전성 (Completeness)
**질문**: "무엇이 빠져있는가?"

부족한 요소 찾기:
- 기능적 요구사항 누락
- 비기능적 요구사항 누락 (성능, 보안, 확장성)
- 엣지 케이스 및 예외 상황
- 사용자 페르소나 및 시나리오
- 기술적 제약사항
- 의존성 및 전제조건

#### 2. 명확성 (Clarity)
**질문**: "무엇이 애매한가?"

디테일이 필요한 부분:
- 모호한 표현 ("빠르게", "사용자 친화적", "안전하게")
- 측정 불가능한 기준
- 불명확한 범위
- 정의되지 않은 용어
- 해석이 갈릴 수 있는 문장

#### 3. 간결성 (Conciseness)
**질문**: "무엇이 불필요한가?"

제거할 요소:
- 중복된 요구사항
- 구현 방법의 과도한 명시 (What이 아닌 How)
- 범위를 벗어난 기능
- 불필요한 제약사항
- MVP에 필수가 아닌 요소

#### 4. 품질 (Quality)
**질문**: "무엇을 개선할 수 있는가?"

개선 기회:
- 우선순위 부족
- 성공 지표 부재
- 테스트 가능성 부족
- 일관성 없는 표현
- 구조화되지 않은 형식
- 추적 가능성 부재

---

## Analysis Process

### Step 1: Initial Assessment

요구사항을 받으면 먼저 전체적인 평가를 수행합니다:

```
**전체 평가**:
- 완전성: [1-5점] - 이유
- 명확성: [1-5점] - 이유
- 간결성: [1-5점] - 이유
- 품질: [1-5점] - 이유

**즉각적인 관찰**:
- 가장 큰 문제 1-3가지
- 긍정적인 측면 1-2가지
```

### Step 2: Detailed Analysis

4가지 차원별로 구체적인 피드백을 제공합니다:

```
## 1. 완전성 분석

### 부족한 부분:
1. [구체적인 항목]
   - 영향: [왜 중요한가]
   - 제안: [어떻게 보완할 것인가]

## 2. 명확성 분석

### 애매한 부분:
1. "[인용된 표현]"
   - 문제: [왜 애매한가]
   - 질문: [구체화를 위한 질문]

## 3. 간결성 분석

### 불필요한 부분:
1. [구체적인 항목]
   - 이유: [왜 불필요한가]
   - 제안: [제거 또는 단순화 방법]

## 4. 품질 개선

### 개선 기회:
1. [구체적인 항목]
   - 현재 문제: [무엇이 문제인가]
   - 개선안: [어떻게 개선할 것인가]
```

### Step 3: Collaborative Refinement

구체적인 질문을 통해 요구사항을 발전시킵니다:

**AskUserQuestion 도구 활용**:
- 우선순위 결정 질문
- 범위 명확화 질문
- 기술적 제약사항 확인
- 사용자 경험 시나리오 구체화

### Step 4: Revised Requirements

개선된 요구사항을 제시합니다:

```
## 개선된 요구사항

### 기능적 요구사항
1. [명확하고 측정 가능한 요구사항]
   - 우선순위: [High/Medium/Low]
   - 성공 지표: [구체적인 측정 기준]

### 비기능적 요구사항
1. [성능, 보안, 확장성 등]
   - 측정 기준: [구체적인 수치]

### 제약사항
1. [기술적, 비즈니스적 제약]

### 가정사항
1. [명시적인 가정]
```

---

## Analysis Checklist

요구사항 분석 시 확인할 항목들:

### Functional Requirements
- [ ] 모든 주요 기능이 명시되었는가?
- [ ] 각 기능의 입력/출력이 정의되었는가?
- [ ] 사용자 플로우가 명확한가?
- [ ] 엣지 케이스가 고려되었는가?
- [ ] 에러 처리가 정의되었는가?

### Non-Functional Requirements
- [ ] 성능 기준이 구체적인가? (응답 시간, 처리량)
- [ ] 보안 요구사항이 명시되었는가?
- [ ] 확장성 고려사항이 있는가?
- [ ] 접근성(Accessibility) 요구사항이 있는가?
- [ ] 호환성 요구사항이 명확한가?

### Clarity & Completeness
- [ ] 모호한 표현이 없는가? ("빠르게", "쉽게", "안전하게")
- [ ] 측정 가능한 기준이 있는가?
- [ ] 용어가 일관되게 사용되었는가?
- [ ] 범위가 명확히 정의되었는가?
- [ ] 의존성이 문서화되었는가?

### Quality
- [ ] 우선순위가 명시되었는가?
- [ ] 성공 지표가 정의되었는가?
- [ ] 테스트 가능한가?
- [ ] 추적 가능한가? (요구사항 ID 등)
- [ ] 중복이 없는가?

### Feasibility
- [ ] 기술적으로 실현 가능한가?
- [ ] 일정이 현실적인가?
- [ ] 리소스가 충분한가?
- [ ] 제약사항이 명확한가?

---

## Question Templates

### 완전성 확인 질문

**기능적 완전성**:
- "이 기능이 실패하면 어떻게 되나요?"
- "사용자가 [X 상황]에 처하면 어떻게 해야 하나요?"
- "로그인하지 않은 사용자는 어떻게 처리하나요?"
- "데이터가 없을 때는 무엇을 보여주나요?"

**비기능적 완전성**:
- "얼마나 많은 동시 사용자를 지원해야 하나요?"
- "응답 시간은 얼마나 빨라야 하나요?"
- "데이터는 얼마나 오래 보관해야 하나요?"
- "모바일 지원이 필요한가요?"

### 명확성 확인 질문

**모호한 표현 구체화**:
- "'사용자 친화적'이란 구체적으로 무엇을 의미하나요?"
- "'빠르게'는 몇 초 이내를 말하나요?"
- "'안전하게'는 어떤 보안 수준을 의미하나요?"

**범위 명확화**:
- "이 기능은 [A 상황]도 포함하나요?"
- "[X 기능]은 MVP에 포함되나요, 아니면 추후 추가되나요?"

### 우선순위 결정 질문

- "이 기능이 없으면 서비스 런칭이 불가능한가요?"
- "이 요구사항의 비즈니스 가치는 무엇인가요?"
- "이 기능을 나중에 추가하면 안 되는 이유가 있나요?"

### 제약사항 확인 질문

- "기술 스택에 제약이 있나요?"
- "예산 또는 일정 제약이 있나요?"
- "레거시 시스템과의 호환성이 필요한가요?"
- "규정 준수 요구사항이 있나요?"

---

## Examples

### Example 1: Vague Requirements

**Original**:
```
"사용자가 쉽게 로그인할 수 있는 시스템을 만들어주세요.
빠르고 안전해야 합니다."
```

**Analysis**:

**전체 평가**:
- 완전성: 1/5 - 핵심 기능만 언급, 세부사항 전무
- 명확성: 1/5 - 모든 표현이 모호함
- 간결성: 5/5 - 불필요한 요소 없음
- 품질: 1/5 - 측정 기준, 우선순위, 성공 지표 부재

**1. 완전성 분석**:

부족한 부분:
1. 인증 방법 미명시
   - 영향: 구현 방향을 결정할 수 없음
   - 제안: 이메일/비밀번호, 소셜 로그인, OTP 등 구체화 필요

2. 비기능적 요구사항 누락
   - 영향: 시스템 설계 불가능
   - 제안: 동시 사용자 수, 응답 시간, 보안 수준 명시 필요

3. 엣지 케이스 미고려
   - 영향: 실제 운영 시 문제 발생 가능
   - 제안: 비밀번호 분실, 계정 잠금, 재시도 제한 등 정의 필요

**2. 명확성 분석**:

애매한 부분:
1. "쉽게 로그인"
   - 문제: 측정 불가능, 주관적
   - 질문: "몇 번의 클릭으로 완료되어야 하나요? OAuth 자동 로그인을 의미하나요?"

2. "빠르고"
   - 문제: 구체적 기준 부재
   - 질문: "로그인 응답 시간이 몇 초 이내여야 하나요?"

3. "안전해야"
   - 문제: 보안 수준 불명확
   - 질문: "2FA가 필요한가요? 어떤 암호화 수준을 원하시나요?"

**3. 간결성 분석**:
- 불필요한 부분 없음 (오히려 너무 간결함)

**4. 품질 개선**:

개선 기회:
1. 우선순위 부재
   - 현재 문제: 어떤 기능이 MVP에 필수인지 불명확
   - 개선안: 소셜 로그인 vs 이메일 로그인 우선순위 결정

2. 성공 지표 부재
   - 현재 문제: 성공 여부 판단 불가능
   - 개선안: "로그인 성공률 95% 이상", "평균 응답 시간 2초 이하" 등 명시

**Clarification Questions** (AskUserQuestion 활용):

```typescript
// Question 1: 인증 방법
{
  question: "어떤 로그인 방법을 지원해야 하나요?",
  header: "인증 방법",
  multiSelect: true,
  options: [
    { label: "이메일/비밀번호", description: "전통적인 방식, 구현 간단" },
    { label: "소셜 로그인 (Google, Apple)", description: "사용자 편의성 높음" },
    { label: "전화번호 OTP", description: "보안 강화, 추가 구현 필요" },
    { label: "생체 인증", description: "모바일 전용, 최고 편의성" }
  ]
}

// Question 2: 성능 기준
{
  question: "로그인 응답 시간 기준은 어느 정도인가요?",
  header: "성능 기준",
  multiSelect: false,
  options: [
    { label: "1초 이내", description: "최고 성능, 복잡한 최적화 필요" },
    { label: "2-3초 이내", description: "일반적인 기준, 균형 잡힌 선택" },
    { label: "5초 이내", description: "최소 기준, 구현 용이" }
  ]
}

// Question 3: 보안 수준
{
  question: "보안 수준은 어느 정도로 설정할까요?",
  header: "보안 수준",
  multiSelect: false,
  options: [
    { label: "기본 (비밀번호만)", description: "빠른 구현, 낮은 보안" },
    { label: "중급 (2FA 선택)", description: "균형 잡힌 보안" },
    { label: "고급 (2FA 필수)", description: "최고 보안, 사용자 불편 증가" }
  ]
}
```

**Revised Requirements**:

```markdown
## 개선된 요구사항: 사용자 인증 시스템

### 1. 기능적 요구사항

#### 1.1 로그인 방법
- **우선순위**: High
- **요구사항**:
  - 이메일/비밀번호 로그인 (MVP 필수)
  - Google 소셜 로그인 (Phase 2)
  - Apple 소셜 로그인 (Phase 2, iOS 필수)
- **성공 지표**: 로그인 성공률 95% 이상

#### 1.2 비밀번호 관리
- **우선순위**: High
- **요구사항**:
  - 비밀번호 재설정 (이메일 링크)
  - 비밀번호 최소 요구사항: 8자 이상, 숫자+문자 조합
  - 비밀번호 변경 (로그인 후)
- **성공 지표**: 비밀번호 재설정 완료율 90% 이상

#### 1.3 보안 기능
- **우선순위**: Medium
- **요구사항**:
  - 5회 연속 실패 시 계정 임시 잠금 (15분)
  - 2FA (이메일 OTP, 선택 사항)
  - 로그인 세션 관리 (7일 자동 로그아웃)

### 2. 비기능적 요구사항

#### 2.1 성능
- 로그인 API 응답 시간: 평균 2초 이내
- 동시 접속 지원: 1,000명
- 토큰 발급 시간: 500ms 이내

#### 2.2 보안
- 비밀번호 암호화: bcrypt (cost 12)
- JWT 토큰 유효기간: 7일
- HTTPS 필수
- OWASP Top 10 준수

#### 2.3 사용자 경험
- 로그인 화면 로딩 시간: 1초 이내
- 에러 메시지 명확성: "이메일 또는 비밀번호가 올바르지 않습니다"
- 접근성: WCAG 2.1 AA 준수

### 3. 제약사항
- React Native + Supabase 기술 스택 사용
- 기존 Supabase Auth 시스템 활용
- iOS/Android 모두 지원

### 4. 가정사항
- 사용자는 유효한 이메일 주소를 가지고 있음
- 이메일 서비스는 안정적으로 작동함
- 사용자는 모바일 기기를 사용함

### 5. 제외 사항 (Out of Scope)
- 기업용 SSO 연동
- 생체 인증 (Phase 3로 연기)
- 다중 디바이스 로그인 관리
```

---

### Example 2: Over-Specified Requirements

**Original**:
```
"React Native에서 Redux Toolkit을 사용해서 사용자 상태를 관리하고,
Redux Persist로 AsyncStorage에 저장하며,
Redux Saga로 비동기 로직을 처리하고,
Reselect로 메모이제이션을 구현해야 합니다.
사용자 정보는 users 슬라이스에, 인증 정보는 auth 슬라이스에 분리하고,
각 슬라이스마다 actions, reducers, selectors 폴더를 만들어야 합니다."
```

**Analysis**:

**전체 평가**:
- 완전성: 3/5 - 구현 방법은 상세하나, 실제 요구사항 부족
- 명확성: 4/5 - 구현은 명확하나, '왜'가 부족
- 간결성: 1/5 - 구현 세부사항 과도하게 명시
- 품질: 2/5 - What이 아닌 How에 집중

**1. 완전성 분석**:

부족한 부분:
1. 실제 요구사항 부재
   - 영향: 왜 이런 구조가 필요한지 불명확
   - 제안: "어떤 상태를 관리해야 하는가?"부터 시작

2. 비즈니스 요구사항 누락
   - 영향: 기술 선택의 근거가 없음
   - 제안: 왜 Redux가 필요한가? Context API로 충분하지 않은가?

**2. 명확성 분석**:

애매한 부분:
1. 기술 선택의 이유 불명확
   - 문제: Redux Saga vs Redux Thunk 선택 근거 부재
   - 질문: "왜 Redux Saga가 필요한가? 복잡한 비동기 로직이 있는가?"

**3. 간결성 분석**:

불필요한 부분:
1. 과도한 구현 세부사항
   - 이유: What이 아닌 How를 명시 (YAGNI 위반)
   - 제안: "사용자 상태를 영구 저장해야 한다"로 충분

2. 폴더 구조 강제
   - 이유: 프로젝트 규모에 따라 달라질 수 있음
   - 제안: 아키텍처는 필요에 따라 결정

3. 불필요한 기술 스택
   - 이유: Redux Saga와 Reselect는 복잡한 앱에만 필요
   - 제안: 먼저 간단한 방법(Zustand, Context API) 고려

**4. 품질 개선**:

개선 기회:
1. 요구사항 중심으로 재작성
   - 현재 문제: 기술 선택이 먼저, 요구사항이 나중
   - 개선안: 요구사항 → 기술 선택 순서로 전환

**Revised Requirements**:

```markdown
## 개선된 요구사항: 상태 관리

### 1. 기능적 요구사항

#### 1.1 상태 관리
- **요구사항**: 사용자 정보(이름, 이메일, 프로필 이미지)를 앱 전체에서 접근 가능해야 함
- **우선순위**: High
- **성공 지표**: 모든 화면에서 사용자 정보 일관성 유지

#### 1.2 상태 영속성
- **요구사항**: 앱 재시작 시에도 사용자 정보가 유지되어야 함
- **우선순위**: High
- **성공 지표**: 앱 재시작 후 자동 로그인 성공률 100%

#### 1.3 상태 동기화
- **요구사항**: 사용자 정보 변경 시 모든 화면에 즉시 반영되어야 함
- **우선순위**: Medium
- **성공 지표**: 상태 변경 후 UI 업데이트 지연 < 100ms

### 2. 비기능적 요구사항

#### 2.1 성능
- 상태 읽기 성능: < 10ms
- 상태 쓰기 성능: < 50ms
- 메모리 사용량: < 5MB

#### 2.2 확장성
- 향후 10개 이상의 화면에서 사용 가능해야 함
- 새로운 상태 추가 시 기존 코드 최소 변경

### 3. 제약사항
- React Native CLI 환경
- iOS/Android 모두 지원
- 오프라인 우선 (Offline-first) 아키텍처

### 4. 구현 가이드 (권장사항)

**기술 스택 선택은 개발팀 판단에 따름**:
- 간단한 상태 (< 5개 화면): Context API
- 중간 복잡도 (5-15개 화면): Zustand
- 복잡한 상태 (15개+ 화면, 복잡한 비동기): Redux Toolkit

**현재 프로젝트는 Zustand 권장**:
- 이유: 보일러플레이트 적고, 학습 곡선 낮음
- Redux는 필요할 때 마이그레이션 가능
```

---

## Best Practices

### Do's ✅

1. **체계적 분석**: 4가지 차원(완전성, 명확성, 간결성, 품질) 모두 검토
2. **구체적 피드백**: "애매합니다" X → "어떤 부분이 왜 애매한지" ✓
3. **질문 활용**: AskUserQuestion 도구로 능동적 대화
4. **개선안 제시**: 문제만 지적 X → 해결 방안도 제시 ✓
5. **우선순위 제안**: 모든 문제를 동시에 해결하려 하지 말고, 중요한 것부터
6. **예시 제공**: 개선된 요구사항 샘플 작성

### Don'ts ❌

1. **일방적 비판 금지**: 협력적 대화로 개선
2. **완벽주의 지양**: MVP 관점에서 필수 요소 우선
3. **기술 강요 금지**: What에 집중, How는 유연하게
4. **모호한 피드백 금지**: "더 구체적으로" X → "어떤 부분을 어떻게 구체화" ✓
5. **과도한 분석 지양**: 실용적 수준에서 타협점 찾기

---

## Output Format

요구사항 분석 결과는 다음 형식으로 제시:

```markdown
# 요구사항 분석 결과

## 전체 평가
- 완전성: [1-5점] - 이유
- 명확성: [1-5점] - 이유
- 간결성: [1-5점] - 이유
- 품질: [1-5점] - 이유

**주요 발견사항**:
- 🔴 [가장 중요한 문제 1-3개]
- 🟢 [긍정적인 측면 1-2개]

---

## 1. 완전성 분석 (부족한 부분)

### [범주명]
1. **[구체적 항목]**
   - 영향: [왜 중요한가]
   - 제안: [어떻게 보완할 것인가]

---

## 2. 명확성 분석 (디테일 필요)

### [범주명]
1. **"[인용된 표현]"**
   - 문제: [왜 애매한가]
   - 질문: [구체화를 위한 질문]

---

## 3. 간결성 분석 (불필요한 부분)

### [범주명]
1. **[구체적 항목]**
   - 이유: [왜 불필요한가]
   - 제안: [제거 또는 단순화 방법]

---

## 4. 품질 개선 (개선 기회)

### [범주명]
1. **[구체적 항목]**
   - 현재 문제: [무엇이 문제인가]
   - 개선안: [어떻게 개선할 것인가]

---

## 다음 단계

[사용자에게 구체적으로 어떤 정보가 필요한지 질문]
또는
[AskUserQuestion 도구를 사용하여 우선순위/범위/제약사항 확인]
```

---

## Integration with Other Skills

### Complementary Skills

이 스킬은 다음 스킬들과 함께 사용하면 효과적:

1. **rn-supabase-project-planner**
   - 요구사항 분석 → 프로젝트 계획 생성
   - 개선된 요구사항을 바탕으로 todolist 자동 생성

2. **frontend-dev-guidelines / backend-dev-guidelines**
   - 요구사항 분석 → 기술적 구현 가이드
   - 명확해진 요구사항을 실제 코드로 구현

3. **skill-developer**
   - 새로운 스킬 요구사항 분석
   - 스킬 설계 전 요구사항 명확화

### Workflow Example

```
1. [requirements-analyst] 요구사항 분석 및 개선
   ↓
2. [AskUserQuestion] 사용자와 대화하여 명확화
   ↓
3. [rn-supabase-project-planner] 개선된 요구사항으로 계획 생성
   ↓
4. [frontend/backend-dev-guidelines] 실제 구현
```

---

## Tips for Effective Analysis

### 1. 사용자 의도 파악

표면적 요청 너머의 진짜 니즈를 찾으세요:
- "빠른 로그인" → 실제로는 "사용자 이탈 방지"
- "안전한 시스템" → 실제로는 "개인정보 보호 규정 준수"

### 2. 맥락 이해

프로젝트 단계에 따라 분석 수준 조절:
- **MVP 단계**: 간결성과 실현 가능성 중시
- **성장 단계**: 확장성과 품질 중시
- **성숙 단계**: 최적화와 세부사항 중시

### 3. 균형 잡힌 피드백

- 긍정적 측면도 언급 (동기 부여)
- 비판적이되 건설적으로
- 실현 가능한 개선안 제시

### 4. 반복적 개선

- 한 번에 모든 것을 완벽하게 하려 하지 말기
- 우선순위가 높은 것부터 개선
- 점진적으로 요구사항 발전시키기

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 (following 500-line rule) ✅
**Progressive Disclosure**: Self-contained, no external references needed ✅
