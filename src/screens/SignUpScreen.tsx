import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
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
import {
  validateEmail as validateEmailUtil,
  validatePassword as validatePasswordUtil,
  validateConfirmPassword as validateConfirmPasswordUtil,
} from '@/utils/validation';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signUp, isLoading, error: authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (text: string) => {
    const result = validateEmailUtil(text);
    setEmailError(result.errorMessage || '');
    return result.isValid;
  };

  const validatePassword = (text: string) => {
    const result = validatePasswordUtil(text);
    setPasswordError(result.errorMessage || '');
    return result.isValid;
  };

  const validateConfirmPassword = (text: string) => {
    const result = validateConfirmPasswordUtil(password, text);
    setConfirmPasswordError(result.errorMessage || '');
    return result.isValid;
  };

  const handleSignUp = async () => {
    clearError();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    const success = await signUp(email.toLowerCase().trim(), password);

    if (success) {
      // 회원가입 성공 (이메일 확인 필요 또는 즉시 로그인)
      // 3초 후 로그인 화면으로 이동
      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
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
    // 비밀번호를 변경하면 확인 비밀번호도 재검증
    if (confirmPassword && confirmPasswordError) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    if (confirmPasswordError) {
      validateConfirmPassword(text);
    }
  };

  const handleGoogleSignUp = () => {
    Alert.alert('Google 회원가입', 'Google 소셜 회원가입은 준비 중입니다.', [{ text: '확인' }]);
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
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>Hang On과 함께 시작해보세요</Text>
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
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
              containerStyle={{ marginTop: theme.spacing.xs }}
            />

            <Input
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              error={confirmPasswordError}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
              containerStyle={{ marginTop: theme.spacing.xs }}
            />

            {/* 서버 에러 또는 안내 메시지 */}
            {authError && (
              <Text
                style={[
                  styles.messageText,
                  authError.includes('이메일을 확인해주세요')
                    ? styles.infoText
                    : styles.errorText,
                ]}
              >
                {authError}
              </Text>
            )}

            <Button
              title={isLoading ? '가입 중...' : '회원가입'}
              onPress={handleSignUp}
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
          </View>

          {/* 구분선 */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>또는</Text>
            <View style={styles.divider} />
          </View>

          {/* 소셜 회원가입 */}
          <View style={styles.socialSection}>
            <Button
              title="Google로 회원가입"
              onPress={handleGoogleSignUp}
              variant="secondary"
              disabled={isLoading}
              leftIcon={
                <View style={styles.googleIcon}>
                  <Text style={styles.googleIconText}>G</Text>
                </View>
              }
            />
          </View>

          {/* 로그인 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <Button
              title="로그인"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              disabled={isLoading}
            />
          </View>

          {/* 약관 동의 안내 */}
          <Text style={styles.termsText}>
            회원가입 시 서비스 이용약관 및{'\n'}개인정보처리방침에 동의하는 것으로 간주됩니다
          </Text>
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
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  messageText: {
    ...theme.typography.caption,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    color: theme.colors.semantic.error,
  },
  infoText: {
    color: theme.colors.primary.main,
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
  termsText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    lineHeight: 20,
  },
});
