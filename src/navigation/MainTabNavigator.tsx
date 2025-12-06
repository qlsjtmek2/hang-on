import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BookOpen, Heart, Settings } from 'lucide-react-native';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { FloatingActionButton } from '@/components/FloatingActionButton';
import { FeedScreen } from '@/screens/FeedScreen';
import { MyRecordsScreen } from '@/screens/MyRecordsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { theme } from '@/theme';

export type MainTabParamList = {
  MyRecords: undefined;
  Feed: undefined;
  Settings: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

const Tab = createBottomTabNavigator<MainTabParamList>();

type LucideIcon = typeof BookOpen;

// 탭 아이콘 렌더 함수 생성
const createTabIcon =
  (Icon: LucideIcon) =>
  ({ focused, color }: { focused: boolean; color: string }) => (
    <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
  );

const MyRecordsTabIcon = createTabIcon(BookOpen);
const FeedTabIcon = createTabIcon(Heart);
const SettingsTabIcon = createTabIcon(Settings);

/**
 * 메인 탭 네비게이터
 *
 * 인증된 사용자의 메인 화면
 * - 내 기록 탭: 사용자의 감정 기록 목록
 * - 누군가와 함께 탭: 다른 사용자들의 공개된 기록 피드
 * - 설정 탭: 계정 및 앱 설정
 *
 * 플로팅 액션 버튼: 우하단에 위치, 털어놓기 기능 트리거
 */
export const MainTabNavigator: React.FC = () => {
  const handleCreateRecord = () => {
    // TODO: 감정 선택 화면으로 이동 (Phase 6.2에서 구현)
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTitleStyle: {
            ...theme.typography.h3,
            color: theme.colors.text.primary,
          },
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
            paddingTop: 4,
            paddingBottom: 16,
            height: 66,
          },
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
          tabBarActiveTintColor: theme.colors.primary.main,
          tabBarInactiveTintColor: theme.colors.text.secondary,
        }}
      >
        <Tab.Screen
          name="MyRecords"
          component={MyRecordsScreen}
          options={{
            title: '내 기록',
            tabBarLabel: '내 기록',
            tabBarIcon: MyRecordsTabIcon,
          }}
        />
        <Tab.Screen
          name="Feed"
          component={FeedScreen}
          options={{
            title: '누군가와 함께',
            tabBarLabel: '함께',
            tabBarIcon: FeedTabIcon,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: '설정',
            tabBarLabel: '설정',
            tabBarIcon: SettingsTabIcon,
          }}
        />
      </Tab.Navigator>

      {/* 플로팅 액션 버튼 - 탭바 위에 배치 */}
      <FloatingActionButton
        onPress={handleCreateRecord}
        testID="fab-create-record"
        style={styles.fab}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    bottom: 82, // 탭바 높이(66) + 여백
  },
});
