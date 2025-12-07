import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hand } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { AuthStackParamList } from '@/navigation/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import {
  validateEmail as validateEmailUtil,
  validatePassword as validatePasswordUtil,
} from '@/utils/validation';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { signIn, isLoading, error: authError, clearError } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // 디버깅: authError 변경 감지
  useEffect(() => {
    console.log('[LoginScreen] authError 변경됨:', authError);
  }, [authError]);

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

  const handleLogin = async () => {
    console.log('[LoginScreen.handleLogin] 로그인 시작');
    clearError();

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      console.log('[LoginScreen.handleLogin] 유효성 검사 실패');
      return;
    }

    console.log('[LoginScreen.handleLogin] signIn 호출');
    const success = await signIn(email.toLowerCase().trim(), password);
    console.log('[LoginScreen.handleLogin] signIn 완료');

    if (success) {
      showToast('success', '로그인되었어요', 2000);
    } else {
      // 로그인 실패 시 비밀번호만 초기화 (이메일은 유지)
      setPassword('');
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
    showToast('info', '준비 중인 기능이에요');
  };

  const handleGoogleLogin = async () => {
    // 개발 모드: Mock Google 로그인 (즉시 로그인)
    if (__DEV__) {
      const success = await signIn('google-dev@example.com', 'google-dev-password');
      if (success) {
        showToast('success', '로그인되었어요', 2000);
      }
      return;
    }
    showToast('info', '준비 중인 기능이에요');
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
          {/* 헤더 - 로고 심볼 + 브랜드명 */}
          <View style={styles.header}>
            <View style={styles.logoOuterCircle}>
              <View style={styles.logoInnerCircle}>
                <Hand
                  size={40}
                  color={theme.colors.primary.main}
                  strokeWidth={1.5}
                />
              </View>
            </View>
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
              variant="filled"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!isLoading}
              accessibilityLabel="이메일 입력"
              accessibilityHint="로그인에 사용할 이메일 주소를 입력하세요"
            />

            <Input
              placeholder="비밀번호"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              error={passwordError}
              variant="filled"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              editable={!isLoading}
              containerStyle={{ marginTop: theme.spacing.sm }}
              accessibilityLabel="비밀번호 입력"
              accessibilityHint="로그인에 사용할 비밀번호를 입력하세요"
            />

            {/* 비밀번호 찾기 링크 */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>

            {/* 서버 에러 메시지 */}
            {authError && (
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                {authError}
              </Text>
            )}

            <Button
              title={isLoading ? '로그인 중...' : '로그인'}
              onPress={handleLogin}
              variant="primary"
              size="large"
              disabled={isLoading}
              fullWidth
              style={{ marginTop: theme.spacing.md }}
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

          {/* 소셜 로그인 */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.googleIconText}>G</Text>
            <Text style={styles.googleButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>

          {/* 회원가입 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
            <TouchableOpacity
              onPress={() => {
                clearError();
                navigation.navigate('SignUp');
              }}
              disabled={isLoading}
            >
              <Text style={styles.signUpText}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: theme.spacing.xl,
  },

  // 헤더 (로고 + 브랜드명)
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoOuterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${theme.colors.primary.main}15`, // 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoInnerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: `${theme.colors.primary.main}25`, // 20% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: '#666666',
  },

  // 폼 섹션
  form: {
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  forgotPasswordText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.primary.main,
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

  // 구분선
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    ...theme.typography.caption,
    color: '#999999',
    marginHorizontal: theme.spacing.md,
  },

  // Google 버튼 (커스텀 스타일)
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: theme.spacing.xl,
  },
  googleIconText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DB4437',
    marginRight: theme.spacing.sm,
  },
  googleButtonText: {
    ...theme.typography.button,
    color: '#333333',
  },

  // 하단 링크
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  footerText: {
    ...theme.typography.body,
    color: '#666666',
  },
  signUpText: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.xs,
  },
});
