import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Hand } from 'lucide-react-native';
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
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { AuthStackParamList } from '@/navigation/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';
import {
  validateEmail as validateEmailUtil,
  validatePassword as validatePasswordUtil,
  validateConfirmPassword as validateConfirmPasswordUtil,
} from '@/utils/validation';

type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

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

    await signUp(email.toLowerCase().trim(), password);
    // 회원가입 성공 시 자동 로그인 → Home 화면으로 자동 전환
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
              variant="filled"
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
              variant="filled"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
              containerStyle={{ marginTop: theme.spacing.sm }}
            />

            <Input
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              onBlur={() => validateConfirmPassword(confirmPassword)}
              error={confirmPasswordError}
              variant="filled"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              editable={!isLoading}
              containerStyle={{ marginTop: theme.spacing.sm }}
            />

            {/* 서버 에러 또는 안내 메시지 */}
            {authError && (
              <Text
                style={[
                  styles.messageText,
                  authError.includes('이메일을 확인해주세요') ? styles.infoText : styles.errorText,
                ]}
              >
                {authError}
              </Text>
            )}

            <Button
              title={isLoading ? '가입 중...' : '회원가입'}
              onPress={handleSignUp}
              variant="primary"
              size="large"
              disabled={isLoading}
              fullWidth
              style={{ marginTop: theme.spacing.lg }}
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
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignUp}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.googleIconText}>G</Text>
            <Text style={styles.googleButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>

          {/* 로그인 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <TouchableOpacity
              onPress={() => {
                clearError();
                navigation.navigate('Login');
              }}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>로그인</Text>
            </TouchableOpacity>
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
    marginBottom: 32,
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
    color: theme.colors.text.primary,
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
    marginBottom: theme.spacing.lg,
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
    paddingVertical: theme.spacing.md,
  },
  footerText: {
    ...theme.typography.body,
    color: '#666666',
  },
  loginText: {
    ...theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.xs,
  },

  // 약관 안내
  termsText: {
    ...theme.typography.caption,
    color: '#999999',
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 20,
  },
});
