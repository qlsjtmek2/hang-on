/**
 * 유효성 검사를 위한 정규 표현식 패턴 모음
 */

/**
 * 이메일 형식 검증 정규식
 * 기본적인 이메일 형식을 검증 (local@domain.tld)
 *
 * @example
 * EMAIL_REGEX.test('user@example.com') // true
 * EMAIL_REGEX.test('invalid-email') // false
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 비밀번호 강도 검증 정규식 (선택적)
 * 최소 8자, 하나 이상의 문자, 숫자, 특수문자 포함
 *
 * @example
 * STRONG_PASSWORD_REGEX.test('Pass123!') // true
 * STRONG_PASSWORD_REGEX.test('weak') // false
 */
export const STRONG_PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

/**
 * 전화번호 형식 검증 정규식 (한국 형식)
 * 010-1234-5678 또는 01012345678 형식
 *
 * @example
 * PHONE_REGEX.test('010-1234-5678') // true
 * PHONE_REGEX.test('01012345678') // true
 */
export const PHONE_REGEX = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;

/**
 * 닉네임 검증 정규식
 * 한글, 영문, 숫자 조합, 2-10자
 *
 * @example
 * NICKNAME_REGEX.test('홍길동') // true
 * NICKNAME_REGEX.test('user123') // true
 * NICKNAME_REGEX.test('a') // false (너무 짧음)
 */
export const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/;
