import { RouteProp, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { EditRecordScreen } from '@/screens/EditRecordScreen';
import { RecordDetailScreen } from '@/screens/RecordDetailScreen';
import { theme } from '@/theme';

import type { RootStackParamList } from './RootNavigator';

/**
 * 기록 상세/수정 스택 타입
 */
export type RecordStackParamList = {
  RecordDetail: { recordId: string };
  EditRecord: { recordId: string };
};

const Stack = createNativeStackNavigator<RecordStackParamList>();

type RecordStackRouteProp = RouteProp<RootStackParamList, 'Record'>;

/**
 * 기록 스택 네비게이터
 *
 * 기록 상세 및 수정 화면을 관리
 * - RecordDetail: 기록 상세 보기
 * - EditRecord: 기록 수정
 *
 * RootNavigator에서 전달받은 recordId를 첫 화면에 전달
 */
export const RecordStackNavigator: React.FC = () => {
  const route = useRoute<RecordStackRouteProp>();
  const { recordId } = route.params;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    >
      <Stack.Screen
        name="RecordDetail"
        component={RecordDetailScreen}
        initialParams={{ recordId }}
      />
      <Stack.Screen name="EditRecord" component={EditRecordScreen} />
    </Stack.Navigator>
  );
};
