import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { AuthConfirmScreen } from '@/screens/AuthConfirmScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { LoginScreen } from '@/screens/LoginScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { useAuthStore } from '@/store/authStore';
import { theme } from '@/theme';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  AuthConfirm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep Linking 설정
const linking = {
  prefixes: ['hangon://'],
  config: {
    screens: {
      Login: 'login',
      SignUp: 'signup',
      Home: 'home',
      AuthConfirm: 'auth/confirm',
    },
  },
};

export const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    // 앱 시작 시 세션 초기화
    initialize();
  }, [initialize]);

  if (isLoading) {
    // 로딩 중일 때 표시
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text.primary,
          headerTitleStyle: {
            fontFamily: theme.typography.h3.fontFamily,
            fontSize: theme.typography.h3.fontSize,
            fontWeight: theme.typography.h3.fontWeight,
            color: theme.colors.text.primary,
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        {isAuthenticated ? (
          // 인증된 사용자용 스크린
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Hang On' }} />
        ) : (
          // 비인증 사용자용 스크린
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: '로그인',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: '회원가입',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="AuthConfirm"
              component={AuthConfirmScreen}
              options={{
                title: '이메일 인증',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
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
