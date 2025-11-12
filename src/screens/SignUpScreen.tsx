import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import { RootStackParamList } from '@/navigation/AuthNavigator';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

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

  const validateConfirmPassword = (text: string) => {
    if (!text) {
      setConfirmPasswordError('비밀번호 확인을 입력해주세요');
      return false;
    }
    if (text !== password) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다');
      return false;
    }
    setConfirmPasswordError('');
    return true;
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
      if (error) {
        // 이메일 확인이 필요한 경우
        Alert.alert(
          '회원가입 완료',
          '이메일을 확인하여 계정을 활성화해주세요.',
          [
            {
              text: '확인',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      } else {
        Alert.alert(
          '회원가입 성공',
          '회원가입이 완료되었습니다.',
          [{ text: '확인' }],
        );
      }
    } else if (error) {
      let errorMessage = error;

      // Supabase 에러 메시지 한글화
      if (error.includes('already registered')) {
        errorMessage = '이미 등록된 이메일입니다';
      } else if (error.includes('email')) {
        errorMessage = '이메일 형식이 올바르지 않습니다';
      } else if (error.includes('password')) {
        errorMessage = '비밀번호가 보안 요구사항을 충족하지 않습니다';
      }

      Alert.alert('회원가입 실패', errorMessage);
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
    Alert.alert(
      'Google 회원가입',
      'Google 소셜 회원가입은 준비 중입니다.',
      [{ text: '확인' }],
    );
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
              style={{ marginTop: theme.spacing.md }}
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
              style={{ marginTop: theme.spacing.md }}
            />

            {/* 비밀번호 요구사항 */}
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementTitle}>비밀번호 요구사항:</Text>
              <Text style={[
                styles.requirement,
                password.length >= 8 && styles.requirementMet
              ]}>
                • 최소 8자 이상
              </Text>
            </View>

            <Button
              label={isLoading ? '가입 중...' : '회원가입'}
              onPress={handleSignUp}
              variant="primary"
              disabled={isLoading}
              style={{ marginTop: theme.spacing.xl }}
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
              label="Google로 회원가입"
              onPress={handleGoogleSignUp}
              variant="secondary"
              disabled={isLoading}
            />
          </View>

          {/* 로그인 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <Button
              label="로그인"
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
  requirementsContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
  },
  requirementTitle: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  requirement: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  requirementMet: {
    color: theme.colors.semantic.success,
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