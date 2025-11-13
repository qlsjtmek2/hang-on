import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import { RootStackParamList } from '@/navigation/AuthNavigator';
import { supabase } from '@/services/supabase';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

type AuthConfirmScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AuthConfirm'>;

export const AuthConfirmScreen: React.FC = () => {
  const navigation = useNavigation<AuthConfirmScreenNavigationProp>();
  const { setSession } = useAuthStore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Deep link URL에서 token과 type 파라미터 추출
        // URL 형식: hangon://auth/confirm?token=...&type=signup
        const url = await supabase.auth.getSession();

        // URL 파라미터에서 token과 type 추출
        // React Navigation은 자동으로 URL 파라미터를 처리하지만,
        // Supabase의 이메일 링크는 특별한 처리가 필요합니다.

        // 현재 세션 확인 (이미 인증된 경우)
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          // 이미 인증된 경우
          setSession(sessionData.session);
          setStatus('success');

          // 3초 후 홈 화면으로 이동
          setTimeout(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          }, 2000);
        } else {
          // 세션이 없는 경우 - 에러 처리
          setStatus('error');
          setErrorMessage('이메일 인증 링크가 만료되었거나 유효하지 않습니다.');

          // 5초 후 로그인 화면으로 이동
          setTimeout(() => {
            navigation.navigate('Login');
          }, 5000);
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setErrorMessage('이메일 인증 중 오류가 발생했습니다. 다시 시도해주세요.');

        // 5초 후 로그인 화면으로 이동
        setTimeout(() => {
          navigation.navigate('Login');
        }, 5000);
      }
    };

    confirmEmail();
  }, [navigation, setSession]);

  return (
    <View style={styles.container}>
      {status === 'loading' && (
        <>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.message}>이메일 인증을 처리하고 있습니다...</Text>
        </>
      )}

      {status === 'success' && (
        <>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successMessage}>이메일 인증이 완료되었습니다!</Text>
          <Text style={styles.subMessage}>잠시 후 홈 화면으로 이동합니다.</Text>
        </>
      )}

      {status === 'error' && (
        <>
          <Text style={styles.errorIcon}>✗</Text>
          <Text style={styles.errorMessage}>인증 실패</Text>
          <Text style={styles.subMessage}>{errorMessage}</Text>
          <Text style={styles.subMessage}>잠시 후 로그인 화면으로 이동합니다.</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  message: {
    marginTop: theme.spacing.lg,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  successIcon: {
    fontSize: 64,
    color: theme.colors.success,
    marginBottom: theme.spacing.lg,
  },
  successMessage: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.success,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 64,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },
  errorMessage: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subMessage: {
    fontSize: theme.typography.body2.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
