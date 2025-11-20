# 이메일 커스터마이징 가이드

Supabase Auth 이메일을 커스터마이징하는 방법을 안내합니다.

---

## 1. SMTP 서버 설정 (Resend 사용)

### 1.1 Resend 가입 및 API Key 생성

1. **Resend 가입**: https://resend.com 에서 계정 생성
2. **API Key 생성**: Dashboard > API Keys > Create API Key
3. **API Key 복사**: `re_xxxxxxxxx` 형식의 키 저장

### 1.2 (선택) 도메인 인증

커스텀 도메인 이메일을 사용하려면:

1. Resend Dashboard > Domains > Add Domain
2. DNS 레코드 추가 (MX, TXT, DKIM)
3. 인증 완료 대기 (보통 몇 분 소요)

> **참고**: 도메인 없이도 `onboarding@resend.dev`로 테스트 가능

---

## 2. Supabase Dashboard 설정

### 2.1 SMTP 설정

**위치**: [Project Settings > Auth](https://supabase.com/dashboard/project/gaahzvbalabwklkqiykc/settings/auth)

스크롤하여 **SMTP Settings** 섹션에서:

| 항목 | 값 |
|------|-----|
| Enable Custom SMTP | ✅ 활성화 |
| Sender email | `no-reply@hangon.app` (또는 도메인) |
| Sender name | `Hang On` |
| Host | `smtp.resend.com` |
| Port number | `465` |
| Minimum interval | `60` (선택) |
| Username | `resend` |
| Password | `re_xxxxxxxxx` (API Key) |

**Save** 클릭

### 2.2 URL Configuration

**위치**: [Authentication > URL Configuration](https://supabase.com/dashboard/project/gaahzvbalabwklkqiykc/auth/url-configuration)

| 항목 | 값 |
|------|-----|
| Site URL | `hangon://` |
| Redirect URLs | `hangon://auth/confirm`<br>`hangon://reset-password` |

### 2.3 이메일 템플릿 설정

**위치**: [Authentication > Email Templates](https://supabase.com/dashboard/project/gaahzvbalabwklkqiykc/auth/templates)

각 템플릿에서:

1. **Subject** 수정 (제목)
2. **Body** 수정 (HTML 내용)

#### Confirm signup

**Subject**: `Hang On 이메일 인증`

**Body**: `docs/email-templates/confirm-signup.html` 내용 복사

#### Reset Password

**Subject**: `Hang On 비밀번호 재설정`

**Body**: `docs/email-templates/reset-password.html` 내용 복사

#### Magic Link

**Subject**: `Hang On 로그인 링크`

**Body**: `docs/email-templates/magic-link.html` 내용 복사

---

## 3. 테스트

1. **회원가입 테스트**: 새 계정 생성 후 이메일 확인
2. **비밀번호 재설정 테스트**: 비밀번호 찾기 기능 테스트
3. **링크 동작 확인**: Deep link가 앱으로 정상 연결되는지 확인

---

## 4. 사용 가능한 템플릿 변수

| 변수 | 설명 |
|------|------|
| `{{ .ConfirmationURL }}` | 인증 링크 URL |
| `{{ .Token }}` | 6자리 OTP 코드 |
| `{{ .TokenHash }}` | 토큰 해시 값 |
| `{{ .SiteURL }}` | Site URL (hangon://) |
| `{{ .RedirectTo }}` | 리다이렉트 URL |
| `{{ .Email }}` | 사용자 이메일 |
| `{{ .NewEmail }}` | 새 이메일 (이메일 변경 시) |

---

## 5. 트러블슈팅

### 이메일이 발송되지 않음

1. SMTP 설정 확인 (특히 API Key)
2. Resend Dashboard에서 발송 로그 확인
3. Rate limit 확인 (무료: 100개/일)

### 링크가 localhost로 감

- URL Configuration에서 **Site URL**과 **Redirect URLs** 확인
- `hangon://auth/confirm`이 Redirect URLs에 등록되어 있어야 함

### 발신자 이름이 여전히 "Supabase Auth"

- SMTP Settings에서 **Sender name**이 설정되어 있는지 확인
- Custom SMTP가 활성화되어 있는지 확인

---

## 6. 참고 문서

- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Resend SMTP Guide](https://resend.com/docs/send-with-supabase-smtp)

---

**마지막 업데이트**: 2024-11-20
