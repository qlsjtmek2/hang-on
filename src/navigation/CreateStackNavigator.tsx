import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { EmotionSelectScreen } from '@/screens/EmotionSelectScreen';
import { WriteScreen } from '@/screens/WriteScreen';
import { theme } from '@/theme';
import type { EmotionLevel } from '@/types/emotion';

/**
 * 털어놓기(기록 생성) 스택 파라미터 타입
 */
export type CreateStackParamList = {
  EmotionSelect: undefined;
  Write: { emotionLevel: EmotionLevel };
};

const Stack = createNativeStackNavigator<CreateStackParamList>();

/**
 * 털어놓기 스택 네비게이터
 *
 * 감정 기록 생성 플로우
 * 1. EmotionSelect: 감정 선택 화면
 * 2. Write: 글쓰기 화면 (선택한 감정 전달)
 */
export const CreateStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="EmotionSelect" component={EmotionSelectScreen} />
      <Stack.Screen name="Write" component={WriteScreen} />
    </Stack.Navigator>
  );
};
