import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { LoginScreen } from '@/screens/LoginScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

import { CreateStackNavigator } from './CreateStackNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { RecordStackNavigator } from './RecordStackNavigator';

// 인증 스택 타입
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

// 루트 스택 타입 (인증 + 메인 + 기록 생성 + 기록 상세)
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Create: undefined;
  Record: { recordId: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

// Deep Linking 설정
const linking = {
  prefixes: ['hangon://'],
  config: {
    screens: {
      Auth: 'auth',
      Main: 'main',
    },
  },
};

/**
 * 인증 스택 네비게이터
 *
 * 비인증 사용자용 화면들
 * - Login: 로그인 화면
 * - SignUp: 회원가입 화면
 */
const AuthStackNavigator: React.FC = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: theme.colors.background,
      },
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
  </AuthStack.Navigator>
);

/**
 * 루트 네비게이터
 *
 * 앱의 최상위 네비게이터
 * - 인증 상태에 따라 Auth 스택 또는 Main 탭을 표시
 * - Deep Link 처리 포함
 */
export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 세션 초기화
    initialize();
  }, [initialize]);

  // 초기 로딩 중 표시
  const LoadingFallback = (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
    </View>
  );

  // 세션 체크 중
  if (isLoading) {
    return LoadingFallback;
  }

  return (
    <NavigationContainer linking={linking} fallback={LoadingFallback}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="Main" component={MainTabNavigator} />
            <RootStack.Screen
              name="Create"
              component={CreateStackNavigator}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <RootStack.Screen
              name="Record"
              component={RecordStackNavigator}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
});
