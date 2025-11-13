import { Session, User, AuthError } from '@supabase/supabase-js';

import { supabase } from './supabase';

/**
 * 인증 서비스
 *
 * Supabase Auth를 사용한 인증 관련 기능을 제공합니다.
 * - 이메일/비밀번호 로그인
 * - 회원가입
 * - 로그아웃
 * - 세션 관리 (7일 유효기간)
 * - Google OAuth (준비 중)
 */

// ===== 타입 정의 =====

export interface SignUpParams {
  email: string;
  password: string;
  metadata?: {
    username?: string;
    full_name?: string;
  };
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

// ===== 이메일/비밀번호 인증 =====

/**
 * 이메일과 비밀번호로 회원가입
 *
 * @param params - 회원가입 정보 (email, password, metadata)
 * @returns 사용자 정보 및 세션
 *
 * @example
 * const result = await signUp({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   metadata: { username: 'johndoe' }
 * });
 */
export const signUp = async (params: SignUpParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: params.metadata,
    },
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
};

/**
 * 이메일과 비밀번호로 로그인
 *
 * @param params - 로그인 정보 (email, password)
 * @returns 사용자 정보 및 세션
 *
 * @example
 * const result = await signIn({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 */
export const signIn = async (params: SignInParams): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: params.email,
    password: params.password,
  });

  return {
    user: data.user,
    session: data.session,
    error,
  };
};

/**
 * 로그아웃
 *
 * @returns 에러 정보 (성공 시 null)
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// ===== 세션 관리 =====

/**
 * 현재 세션 가져오기
 *
 * @returns 현재 활성 세션 또는 null
 */
export const getSession = async (): Promise<Session | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

/**
 * 현재 사용자 정보 가져오기
 *
 * @returns 현재 로그인한 사용자 또는 null
 */
export const getCurrentUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

/**
 * 세션 새로고침
 *
 * 만료된 세션을 refresh token으로 갱신합니다.
 *
 * @returns 새로운 세션
 */
export const refreshSession = async (): Promise<Session | null> => {
  const {
    data: { session },
  } = await supabase.auth.refreshSession();
  return session;
};

// ===== 비밀번호 관리 =====

/**
 * 비밀번호 재설정 이메일 전송
 *
 * @param email - 비밀번호를 재설정할 이메일
 * @returns 에러 정보 (성공 시 null)
 */
export const sendPasswordResetEmail = async (
  email: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'hangon://reset-password',
  });
  return { error };
};

/**
 * 비밀번호 업데이트
 *
 * @param newPassword - 새 비밀번호
 * @returns 사용자 정보 및 에러
 */
export const updatePassword = async (
  newPassword: string
): Promise<{ user: User | null; error: AuthError | null }> => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return {
    user: data.user,
    error,
  };
};

// ===== OAuth (소셜 로그인) =====

/**
 * Google OAuth 로그인 (준비 중)
 *
 * Google Cloud Console 설정 및 @react-native-google-signin 패키지 설치 후 사용 가능합니다.
 *
 * @throws Error - 아직 구현되지 않음
 *
 * TODO: Google OAuth 구현
 * 1. Google Cloud Console에서 OAuth 2.0 클라이언트 ID 생성
 * 2. @react-native-google-signin/google-signin 패키지 설치
 * 3. Android: AndroidManifest.xml, build.gradle 수정
 * 4. iOS: GoogleService-Info.plist 추가
 * 5. Deep linking 구성
 */
export const signInWithGoogle = async (): Promise<AuthResponse> => {
  throw new Error(
    'Google OAuth는 아직 구현되지 않았습니다. ' +
      'Google Cloud Console 설정 및 패키지 설치가 필요합니다.'
  );
};

// ===== 인증 상태 리스너 =====

/**
 * 인증 상태 변경 이벤트 구독
 *
 * @param callback - 인증 상태 변경 시 호출될 콜백 함수
 * @returns 구독 해제 함수
 *
 * @example
 * const unsubscribe = onAuthStateChange((event, session) => {
 *   console.log('Auth state changed:', event, session);
 * });
 *
 * // 나중에 구독 해제
 * unsubscribe();
 */
export const onAuthStateChange = (
  callback: (
    event: string,
    session: Session | null
  ) => void | Promise<void>
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);

  return () => {
    subscription.unsubscribe();
  };
};
