import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { RootStackParamList } from '@/navigation/AuthNavigator';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, isLoading, error: authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  // 화면 진입 시 에러 초기화
  useEffect(() => {
    clearError();
    setServerError('');
  }, [clearError]);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError('이메일을 입력해주세요');
      return false;
    }
    if (!emailRegex.test(text)) {
      setEmailError('올바른 이메일 형식이 아닙니다');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (text: string) => {
    if (!text) {
      setPasswordError('비밀번호를 입력해주세요');
      return false;
    }
    if (text.length < 8) {
      setPasswordError('비밀번호는 8자 이상이어야 합니다');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    setServerError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const success = await signIn(email.toLowerCase().trim(), password);

    if (!success && authError) {
      setServerError(authError);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      validateEmail(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) {
      validatePassword(text);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('비밀번호 찾기', '비밀번호 재설정 기능은 준비 중입니다.', [{ text: '확인' }]);
  };

  const handleGoogleLogin = () => {
    Alert.alert('Google 로그인', 'Google 소셜 로그인은 준비 중입니다.', [{ text: '확인' }]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>Hang On</Text>
            <Text style={styles.subtitle}>감정을 나누고 함께 성장해요</Text>
          </View>

          {/* 입력 폼 */}
          <View style={styles.form}>
            <Input
              placeholder="이메일"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={() => validateEmail(email)}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
            />

            <Input
              placeholder="비밀번호"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
              containerStyle={{ marginTop: theme.spacing.xs }}
            />

            {/* 서버 에러 메시지 */}
            {serverError && <Text style={styles.errorText}>{serverError}</Text>}

            <Button
              title={isLoading ? '로그인 중...' : '로그인'}
              onPress={handleLogin}
              variant="primary"
              disabled={isLoading}
              style={{ marginTop: theme.spacing.sm }}
            />

            {isLoading && (
              <ActivityIndicator
                style={styles.loader}
                size="small"
                color={theme.colors.primary.main}
              />
            )}

            <Button
              title="비밀번호를 잊으셨나요?"
              onPress={handleForgotPassword}
              variant="ghost"
              disabled={isLoading}
              style={{ marginTop: theme.spacing.sm }}
            />
          </View>

          {/* 구분선 */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.divider} />
          </View>

          {/* 소셜 로그인 */}
          <View style={styles.socialSection}>
            <Button
              title="Google로 로그인"
              onPress={handleGoogleLogin}
              variant="secondary"
              disabled={isLoading}
              leftIcon={
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
              }
            />
          </View>

          {/* 회원가입 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
            <Button
              title="회원가입"
              onPress={() => navigation.navigate('SignUp')}
              variant="ghost"
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xxxl,
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  loader: {
    marginTop: theme.spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.neutral.gray300,
  },
  dividerText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.md,
  },
  socialSection: {
    marginBottom: theme.spacing.xl,
  },
  googleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
  },
  googleIconText: {
    ...theme.typography.button,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: theme.spacing.xl,
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.sm,
  },
});
