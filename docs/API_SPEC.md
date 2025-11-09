# API 명세서

**프로젝트명**: Hang On
**버전**: 1.0.0
**최종 업데이트**: 2025-11-09
**Base URL**: `https://[your-project].supabase.co`

---

## 📋 목차

1. [인증](#인증)
2. [털어놓기 (Journal Entries)](#털어놓기-journal-entries)
3. [누군가와 함께 (Empathy Feed)](#누군가와-함께-empathy-feed)
4. [공감 및 메시지](#공감-및-메시지)
5. [신고](#신고)
6. [에러 코드](#에러-코드)

---

## 개요

### 기술 스택

**Backend**: Supabase (Postgres + Row Level Security)

**API 타입**: RESTful API (Supabase 자동 생성)

**인증**: JWT 토큰 (Bearer Token)

---

### 공통 헤더

모든 인증 필요 API는 다음 헤더를 포함해야 합니다:

```http
Authorization: Bearer <JWT_TOKEN>
apikey: <SUPABASE_ANON_KEY>
Content-Type: application/json
```

---

### 응답 형식

**성공 응답**:
```json
{
  "data": [...],
  "error": null,
  "count": 10,
  "status": 200,
  "statusText": "OK"
}
```

**에러 응답**:
```json
{
  "data": null,
  "error": {
    "message": "Error description",
    "details": "Additional details",
    "hint": "Suggestion",
    "code": "ERROR_CODE"
  },
  "status": 400,
  "statusText": "Bad Request"
}
```

---

## 인증

### 1. 회원가입 (이메일/비밀번호)

**Endpoint**: `POST /auth/v1/signup`

**요청**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 604800,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2025-11-09T12:00:00Z"
  }
}
```

---

### 2. 로그인 (이메일/비밀번호)

**Endpoint**: `POST /auth/v1/token?grant_type=password`

**요청**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답**: 회원가입과 동일

---

### 3. Google 소셜 로그인

**Endpoint**: `POST /auth/v1/token?grant_type=id_token`

**요청**:
```json
{
  "provider": "google",
  "id_token": "google_id_token_here"
}
```

**응답**: 회원가입과 동일

---

### 4. 로그아웃

**Endpoint**: `POST /auth/v1/logout`

**헤더**: `Authorization: Bearer <JWT_TOKEN>`

**응답**:
```json
{
  "message": "Successfully logged out"
}
```

---

### 5. 비밀번호 재설정

**Endpoint**: `POST /auth/v1/recover`

**요청**:
```json
{
  "email": "user@example.com"
}
```

**응답**:
```json
{
  "message": "Password recovery email sent"
}
```

---

## 털어놓기 (Journal Entries)

### 1. 기록 생성

**Endpoint**: `POST /rest/v1/journal_entries`

**헤더**: 인증 필요

**요청**:
```json
{
  "emotion_level": 3,
  "content": "오늘은 힘든 하루였어요",
  "visibility": "public",
  "scheduled_at": null
}
```

**필드 설명**:
- `emotion_level`: 1-5 (1: 최하, 5: 최상)
- `content`: 최대 500자 (null 가능)
- `visibility`: `"private"` | `"public"` | `"scheduled"`
- `scheduled_at`: ISO 8601 형식 (visibility가 "scheduled"일 때 필수)

**응답**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "emotion_level": 3,
  "content": "오늘은 힘든 하루였어요",
  "visibility": "public",
  "scheduled_at": null,
  "created_at": "2025-11-09T12:00:00Z",
  "updated_at": "2025-11-09T12:00:00Z",
  "deleted_at": null
}
```

---

### 2. 내 기록 목록 조회

**Endpoint**: `GET /rest/v1/journal_entries`

**헤더**: 인증 필요

**쿼리 파라미터**:
- `select`: `id,emotion_level,content,visibility,created_at,updated_at`
- `order`: `created_at.desc` (최신순)
- `limit`: `20`
- `offset`: `0` (페이지네이션)

**예시**:
```
GET /rest/v1/journal_entries?select=id,emotion_level,content,visibility,created_at,updated_at&order=created_at.desc&limit=20&offset=0
```

**응답**:
```json
[
  {
    "id": "uuid",
    "emotion_level": 3,
    "content": "오늘은 힘든 하루였어요",
    "visibility": "public",
    "created_at": "2025-11-09T12:00:00Z",
    "updated_at": "2025-11-09T12:00:00Z"
  }
]
```

---

### 3. 기록 상세 조회

**Endpoint**: `GET /rest/v1/journal_entries?id=eq.{entry_id}`

**헤더**: 인증 필요

**쿼리 파라미터**:
- `select`: `*,empathies(count),messages(count)`

**예시**:
```
GET /rest/v1/journal_entries?id=eq.uuid&select=*,empathies(count),messages(count)
```

**응답**:
```json
[
  {
    "id": "uuid",
    "emotion_level": 3,
    "content": "오늘은 힘든 하루였어요",
    "visibility": "public",
    "created_at": "2025-11-09T12:00:00Z",
    "updated_at": "2025-11-09T12:00:00Z",
    "empathies": [{ "count": 5 }],
    "messages": [{ "count": 2 }]
  }
]
```

---

### 4. 기록 수정

**Endpoint**: `PATCH /rest/v1/journal_entries?id=eq.{entry_id}`

**헤더**: 인증 필요

**요청**:
```json
{
  "content": "수정된 내용",
  "emotion_level": 4
}
```

**응답**:
```json
{
  "id": "uuid",
  "emotion_level": 4,
  "content": "수정된 내용",
  "updated_at": "2025-11-09T13:00:00Z"
}
```

---

### 5. 공개 설정 변경

**Endpoint**: `PATCH /rest/v1/journal_entries?id=eq.{entry_id}`

**헤더**: 인증 필요

**요청** (공개 → 비공개):
```json
{
  "visibility": "private"
}
```

**요청** (비공개 → 내일 공개):
```json
{
  "visibility": "scheduled",
  "scheduled_at": "2025-11-10T00:00:00Z"
}
```

---

### 6. 기록 삭제 (Soft Delete)

**Endpoint**: `PATCH /rest/v1/journal_entries?id=eq.{entry_id}`

**헤더**: 인증 필요

**요청**:
```json
{
  "deleted_at": "2025-11-09T14:00:00Z"
}
```

**응답**:
```json
{
  "id": "uuid",
  "deleted_at": "2025-11-09T14:00:00Z"
}
```

---

## 누군가와 함께 (Empathy Feed)

### 1. 감정 유사도 기반 매칭

**Endpoint**: `POST /rest/v1/rpc/match_entries_by_emotion`

**헤더**: 인증 필요

**요청**:
```json
{
  "user_id": "uuid",
  "limit_count": 20
}
```

**응답**:
```json
[
  {
    "id": "uuid",
    "emotion_level": 3,
    "content": "저도 오늘 힘들었어요",
    "created_at": "2025-11-09T11:00:00Z"
  }
]
```

**참고**:
- `user_id` 필드는 응답에 포함되지 않음 (익명성 보장)
- RPC 함수 내부에서 매칭 알고리즘 실행

---

### 2. 조회 제한 확인

**Endpoint**: `GET /rest/v1/daily_view_limits?user_id=eq.{user_id}&date=eq.{date}`

**헤더**: 인증 필요

**쿼리 파라미터**:
- `date`: `YYYY-MM-DD` 형식

**예시**:
```
GET /rest/v1/daily_view_limits?user_id=eq.uuid&date=eq.2025-11-09
```

**응답**:
```json
[
  {
    "user_id": "uuid",
    "date": "2025-11-09",
    "viewed_count": 15,
    "viewed_entry_ids": ["uuid1", "uuid2", ...]
  }
]
```

---

### 3. 조회 기록 업데이트

**Endpoint**: `POST /rest/v1/rpc/record_entry_view`

**헤더**: 인증 필요

**요청**:
```json
{
  "entry_id": "uuid",
  "user_id": "uuid"
}
```

**응답**:
```json
{
  "success": true,
  "remaining_views": 5
}
```

---

## 공감 및 메시지

### 1. 공감 보내기

**Endpoint**: `POST /rest/v1/empathies`

**헤더**: 인증 필요

**요청**:
```json
{
  "entry_id": "uuid",
  "from_user_id": "uuid"
}
```

**응답**:
```json
{
  "id": "uuid",
  "entry_id": "uuid",
  "from_user_id": "uuid",
  "created_at": "2025-11-09T12:00:00Z"
}
```

**에러** (중복 공감 시도):
```json
{
  "error": {
    "message": "duplicate key value violates unique constraint",
    "code": "23505"
  }
}
```

---

### 2. 메시지 보내기

**Endpoint**: `POST /rest/v1/messages`

**헤더**: 인증 필요

**요청**:
```json
{
  "entry_id": "uuid",
  "from_user_id": "uuid",
  "preset_key": "cheer_up"
}
```

**필드 설명**:
- `preset_key`: `"cheer_up"` | `"me_too"` | `"be_okay"` | `"together"`

**응답**:
```json
{
  "id": "uuid",
  "entry_id": "uuid",
  "from_user_id": "uuid",
  "preset_key": "cheer_up",
  "created_at": "2025-11-09T12:00:00Z"
}
```

---

### 3. 받은 공감 조회

**Endpoint**: `GET /rest/v1/empathies?entry_id=eq.{entry_id}`

**헤더**: 인증 필요

**쿼리 파라미터**:
- `select`: `id,created_at`

**응답**:
```json
[
  {
    "id": "uuid",
    "created_at": "2025-11-09T12:00:00Z"
  }
]
```

**참고**: `from_user_id`는 익명성을 위해 조회하지 않음

---

### 4. 받은 메시지 조회

**Endpoint**: `GET /rest/v1/messages?entry_id=eq.{entry_id}`

**헤더**: 인증 필요

**쿼리 파라미터**:
- `select`: `id,preset_key,created_at`

**응답**:
```json
[
  {
    "id": "uuid",
    "preset_key": "cheer_up",
    "created_at": "2025-11-09T12:00:00Z"
  }
]
```

---

## 신고

### 1. 기록 신고

**Endpoint**: `POST /rest/v1/reports`

**헤더**: 인증 필요

**요청**:
```json
{
  "entry_id": "uuid",
  "reporter_id": "uuid",
  "reason": "욕설/혐오 표현",
  "status": "pending"
}
```

**필드 설명**:
- `reason`: 신고 사유 (자유 텍스트 또는 사전 정의된 카테고리)
- `status`: `"pending"` (기본값)

**응답**:
```json
{
  "id": "uuid",
  "entry_id": "uuid",
  "reporter_id": "uuid",
  "reason": "욕설/혐오 표현",
  "status": "pending",
  "created_at": "2025-11-09T12:00:00Z"
}
```

---

### 2. 신고 현황 조회 (관리자 전용)

**Endpoint**: `GET /rest/v1/reports?status=eq.pending`

**헤더**: 관리자 인증 필요

**응답**:
```json
[
  {
    "id": "uuid",
    "entry_id": "uuid",
    "reporter_id": "uuid",
    "reason": "욕설/혐오 표현",
    "status": "pending",
    "created_at": "2025-11-09T12:00:00Z"
  }
]
```

---

## 에러 코드

### 인증 에러

| 코드 | 메시지 | 설명 |
|------|--------|------|
| `401` | Unauthorized | 인증 토큰이 없거나 유효하지 않음 |
| `403` | Forbidden | 권한이 없음 (RLS 정책 위반) |
| `400` | Invalid credentials | 잘못된 이메일/비밀번호 |

---

### 데이터 검증 에러

| 코드 | 메시지 | 설명 |
|------|--------|------|
| `422` | Unprocessable Entity | 필수 필드 누락 또는 데이터 형식 오류 |
| `23505` | Duplicate key | 고유 제약 조건 위반 (중복 공감/메시지) |
| `23503` | Foreign key violation | 존재하지 않는 참조 (예: 삭제된 기록에 공감) |

---

### 비즈니스 로직 에러

| 코드 | 메시지 | 설명 |
|------|--------|------|
| `429` | Too Many Requests | 일일 조회 제한 초과 (20개) |
| `400` | Content too long | 글자 수 제한 초과 (500자) |
| `400` | Invalid emotion level | emotion_level이 1-5 범위 밖 |

---

### 서버 에러

| 코드 | 메시지 | 설명 |
|------|--------|------|
| `500` | Internal Server Error | 서버 내부 오류 |
| `503` | Service Unavailable | 서비스 일시 중단 |

---

## RPC 함수 (Edge Functions)

### 1. match_entries_by_emotion

**설명**: 사용자의 최근 감정 레벨을 분석하여 유사한 기록 반환

**파라미터**:
- `user_id` (UUID): 사용자 ID
- `limit_count` (INT): 반환할 기록 수 (기본값: 20)

**로직**:
1. 사용자의 최근 3개 기록 감정 레벨 평균 계산
2. ±1 범위 내 공개 기록 필터링
3. 자신의 기록 제외
4. 오늘 이미 본 기록 제외 (daily_view_limits 테이블 참조)
5. 감정 유사도순 + 무작위 정렬
6. limit_count만큼 반환

**반환**: JournalEntry[] (user_id 제외)

---

### 2. record_entry_view

**설명**: 기록 조회 시 daily_view_limits 업데이트

**파라미터**:
- `entry_id` (UUID): 조회한 기록 ID
- `user_id` (UUID): 사용자 ID

**로직**:
1. 오늘 날짜의 daily_view_limits 레코드 조회
2. viewed_count 증가
3. viewed_entry_ids에 entry_id 추가
4. viewed_count가 20 초과 시 에러 반환

**반환**:
```json
{
  "success": true,
  "remaining_views": 5
}
```

---

### 3. cleanup_daily_view_limits

**설명**: 매일 자정 실행되는 크론잡 (Edge Function)

**로직**:
1. 어제 날짜 이전의 모든 daily_view_limits 레코드 삭제

**실행 주기**: 매일 00:05 (UTC)

---

### 4. publish_scheduled_entries

**설명**: 매일 자정 실행되는 크론잡 (Edge Function)

**로직**:
1. scheduled_at <= NOW()인 모든 기록 조회
2. visibility를 "public"으로 변경
3. scheduled_at를 null로 변경

**실행 주기**: 매일 00:10 (UTC)

---

## WebSocket (Real-time Subscriptions)

### 1. 실시간 공감 수신

**채널**: `public:empathies`

**필터**: `entry_id=eq.{entry_id}`

**예시** (JavaScript):
```javascript
const channel = supabase
  .channel('empathies')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'empathies',
      filter: `entry_id=eq.${entryId}`
    },
    (payload) => {
      console.log('New empathy received:', payload.new);
      // UI 업데이트
    }
  )
  .subscribe();
```

---

### 2. 실시간 메시지 수신

**채널**: `public:messages`

**필터**: `entry_id=eq.{entry_id}`

**예시** (JavaScript):
```javascript
const channel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `entry_id=eq.${entryId}`
    },
    (payload) => {
      console.log('New message received:', payload.new);
      // 푸시 알림 트리거
    }
  )
  .subscribe();
```

---

## 푸시 알림 (Firebase Cloud Messaging)

### 1. 알림 구독

**플랫폼**: Firebase Cloud Messaging

**디바이스 토큰 저장**:
```typescript
// 디바이스 토큰 획득 후 users 테이블에 저장
await supabase
  .from('users')
  .update({ fcm_token: deviceToken })
  .eq('id', userId);
```

---

### 2. 알림 트리거

**이벤트**: 공감/메시지 수신

**페이로드**:
```json
{
  "to": "device_token_here",
  "notification": {
    "title": "누군가 당신의 마음에 공감했어요 💙",
    "body": "받은 공감을 확인해보세요",
    "sound": "default"
  },
  "data": {
    "type": "empathy",
    "entry_id": "uuid"
  }
}
```

---

## 보안 및 제한

### Rate Limiting

| 엔드포인트 | 제한 | 단위 |
|-----------|------|------|
| POST /auth/v1/signup | 10 | 시간 |
| POST /auth/v1/token | 20 | 시간 |
| POST /rest/v1/journal_entries | 100 | 일 |
| POST /rest/v1/empathies | 500 | 일 |
| POST /rest/v1/messages | 500 | 일 |
| POST /rest/v1/reports | 20 | 일 |

---

### Row Level Security (RLS)

**journal_entries**:
- 사용자는 자신의 모든 기록 조회 가능
- 공개 기록(`visibility='public'`)은 모든 사용자가 조회 가능 (user_id 제외)
- 삭제된 기록(`deleted_at IS NOT NULL`)은 조회 불가

**empathies/messages**:
- 작성자와 공감/메시지를 보낸 사람만 조회 가능
- 익명성 유지를 위해 `from_user_id`는 기록 작성자에게 노출 안 됨

**reports**:
- 신고자 본인과 관리자만 조회 가능

---

## 다국어 API

### 메시지 프리셋 번역

**Endpoint**: `GET /rest/v1/rpc/get_message_preset`

**요청**:
```json
{
  "preset_key": "cheer_up",
  "language": "ko"
}
```

**응답**:
```json
{
  "text": "힘내세요 💪"
}
```

**지원 언어**: `ko`, `en`, `ja`, `es`, `pt`, `fr`

---

## 부록

### A. Supabase SDK 사용 예시

**기록 생성**:
```typescript
const { data, error } = await supabase
  .from('journal_entries')
  .insert({
    emotion_level: 3,
    content: '오늘은 힘든 하루였어요',
    visibility: 'public'
  })
  .select()
  .single();
```

**공감 보내기**:
```typescript
const { data, error } = await supabase
  .from('empathies')
  .insert({
    entry_id: entryId,
    from_user_id: userId
  });
```

---

### B. 관련 문서

- **요구사항 명세서**: `docs/REQUIREMENTS.md`
- **프로젝트 가이드**: `CLAUDE.md`

---

**문서 버전**: 1.0.0
**최종 업데이트**: 2025-11-09
**다음 리뷰**: 데이터베이스 설계 완료 후
