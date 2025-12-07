import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Cloud, CloudRain, CloudLightning, CloudSun, Sun, Heart, Users } from 'lucide-react-native';

import { useOnboardingStore } from '@/store/onboardingStore';
import { theme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  iconType: 'emotions' | 'write' | 'together';
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: '감정을 날씨로 표현해요',
    description: '폭풍부터 맑음까지,\n오늘의 기분을 직관적으로 기록하세요',
    backgroundColor: '#F0F4FF',
    iconType: 'emotions',
  },
  {
    id: '2',
    title: '마음을 털어놓으세요',
    description: '500자 안에 오늘의 감정을 담아\n가볍게 또는 진솔하게 기록해요',
    backgroundColor: '#F5F5F5',
    iconType: 'write',
  },
  {
    id: '3',
    title: '누군가와 함께해요',
    description: '익명으로 서로의 마음에 공감하고\n따뜻한 메시지를 나눠요',
    backgroundColor: '#FFF5F5',
    iconType: 'together',
  },
];

// 슬라이드별 아이콘 렌더링 컴포넌트
const SlideIcon: React.FC<{ type: OnboardingSlide['iconType'] }> = ({ type }) => {
  switch (type) {
    case 'emotions':
      return (
        <View style={styles.iconRow}>
          <CloudLightning size={40} color={theme.colors.emotion.stormy} />
          <CloudRain size={40} color={theme.colors.emotion.rainy} />
          <Cloud size={40} color={theme.colors.emotion.cloudy} />
          <CloudSun size={40} color={theme.colors.emotion.partly} />
          <Sun size={40} color={theme.colors.emotion.sunny} />
        </View>
      );
    case 'write':
      return (
        <View style={styles.iconContainer}>
          <View style={styles.writeIconBg}>
            <Cloud size={64} color={theme.colors.emotion.cloudy} />
          </View>
        </View>
      );
    case 'together':
      return (
        <View style={styles.iconContainer}>
          <View style={styles.togetherIcons}>
            <Heart size={48} color={theme.colors.primary.main} fill={theme.colors.primary.main} />
            <Users size={56} color={theme.colors.neutral.gray600} style={styles.usersIcon} />
          </View>
        </View>
      );
  }
};

export const OnboardingScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  // 애니메이션 값
  const buttonScale = useSharedValue(1);
  const buttonOpacity = useSharedValue(1);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  // 슬라이드 변경 감지
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // 다음/시작하기 버튼 핸들러
  const handleNext = useCallback(() => {
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });

    if (isLastSlide) {
      buttonOpacity.value = withTiming(0, { duration: 200 });
      completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex, isLastSlide, completeOnboarding, buttonScale, buttonOpacity]);

  // 건너뛰기 핸들러
  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // 버튼 애니메이션 스타일
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    opacity: buttonOpacity.value,
  }));

  // 슬라이드 렌더링
  const renderSlide = useCallback(({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.slideContent}>
        <View style={styles.iconWrapper}>
          <SlideIcon type={item.iconType} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  ), []);

  // 페이지 인디케이터 렌더링
  const renderPagination = () => (
    <View style={styles.pagination}>
      {SLIDES.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentIndex && styles.paginationDotActive,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 건너뛰기 버튼 */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="온보딩 건너뛰기"
        accessibilityRole="button"
      >
        <Text style={styles.skipText}>건너뛰기</Text>
      </TouchableOpacity>

      {/* 슬라이드 */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* 하단 영역 */}
      <View style={styles.bottomContainer}>
        {renderPagination()}

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
            accessibilityLabel={isLastSlide ? '시작하기' : '다음'}
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>
              {isLastSlide ? '시작하기' : '다음'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: theme.colors.neutral.gray500,
    fontWeight: '500',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconWrapper: {
    marginBottom: 48,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  togetherIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersIcon: {
    marginLeft: -8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    backgroundColor: theme.colors.background,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral.gray300,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary.main,
    width: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  nextButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: theme.colors.neutral.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
