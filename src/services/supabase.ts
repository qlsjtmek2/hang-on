import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Config from 'react-native-config';

import { Database } from '@/types/database';

// Supabase URL과 Anon Key는 환경변수에서 가져옵니다
const supabaseUrl = Config.SUPABASE_URL || '';
const supabaseAnonKey = Config.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL 또는 Anon Key가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}

// Supabase 클라이언트 생성
// 주의: 세션 유효기간은 Supabase Dashboard > Authentication > Settings에서 설정
// - JWT Expiry: 7일 (604800초) 권장
// - Refresh Token Lifetime: 30일 권장
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 자동으로 토큰 갱신 (만료 전에 refresh token 사용)
    autoRefreshToken: true,
    // 세션을 로컬 스토리지에 저장 (앱 재시작 후에도 유지)
    persistSession: true,
    // URL에서 세션 감지 안 함 (React Native에서는 불필요)
    detectSessionInUrl: false,
    // AsyncStorage로 세션 영속성 확보
    storage: AsyncStorage,
  },
});

// 유틸리티 함수들
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'hangon://reset-password',
  });

  if (error) throw error;
};
