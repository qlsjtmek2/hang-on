import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Heart,
  Sun,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useOnboardingStore } from '@/store/onboardingStore';
import { theme } from '@/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  backgroundColor: string;
  iconType: 'emotional' | 'trust';
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: '오늘, 마음이 어떠세요?',
    subtitle: '혼자 삼키지 않아도 괜찮아요',
    backgroundColor: theme.colors.background,
    iconType: 'emotional',
  },
  {
    id: '2',
    title: '익명으로 나누고,\n함께 견뎌요',
    subtitle: '당신의 이야기는 안전하게 보호됩니다',
    backgroundColor: theme.colors.background,
    iconType: 'trust',
  },
];

// 날씨 아이콘 색상
const WEATHER_COLORS = [
  theme.colors.emotion.stormy,
  theme.colors.emotion.rainy,
  theme.colors.emotion.cloudy,
  theme.colors.emotion.partly,
  theme.colors.emotion.sunny,
];

// 슬라이드 1: 날씨 전환 애니메이션
const WeatherTransitionIcon: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);

  // JS 스레드에서 state 업데이트하는 함수
  const updateWeather = useCallback(() => {
    setCurrentWeather((prev) => (prev + 1) % 5);
  }, []);

  // Float 애니메이션
  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [floatY]);

  // 날씨 전환 애니메이션 (폭풍 → 맑음)
  useEffect(() => {
    const interval = setInterval(() => {
      // 페이드 아웃
      opacity.value = withTiming(0, { duration: 400 }, () => {
        // 다음 날씨로 전환 (runOnJS로 JS 스레드에서 실행)
        runOnJS(updateWeather)();
        // 페이드 인 (스프링 없이 부드럽게)
        opacity.value = withTiming(1, { duration: 400 });
        scale.value = withSequence(
          withTiming(0.95, { duration: 0 }),
          withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
        );
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [opacity, scale, updateWeather]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: floatY.value }],
  }));

  const renderWeatherIcon = () => {
    const size = 80;
    const color = WEATHER_COLORS[currentWeather];

    switch (currentWeather) {
      case 0:
        return <CloudLightning size={size} color={color} />;
      case 1:
        return <CloudRain size={size} color={color} />;
      case 2:
        return <Cloud size={size} color={color} />;
      case 3:
        return <CloudSun size={size} color={color} />;
      case 4:
        return <Sun size={size} color={color} />;
      default:
        return <Cloud size={size} color={color} />;
    }
  };

  return (
    <View style={styles.weatherContainer}>
      <Animated.View style={animatedStyle}>
        {renderWeatherIcon()}
      </Animated.View>
      {/* 날씨 인디케이터 */}
      <View style={styles.weatherIndicator}>
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.weatherDot,
              currentWeather === index && styles.weatherDotActive,
              { backgroundColor: WEATHER_COLORS[index] },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// 슬라이드 2: 하트 아이콘 (첫 번째 슬라이드와 일관된 스타일)
const HeartIcon: React.FC = () => {
  const floatY = useSharedValue(0);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    // Float 애니메이션 (첫 번째 슬라이드와 동일)
    floatY.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    // 하트 펄스 애니메이션
    heartScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
      true,
    );
  }, [floatY, heartScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: heartScale.value },
      { translateY: floatY.value },
    ],
  }));

  return (
    <View style={styles.heartContainer}>
      <Animated.View style={animatedStyle}>
        <Heart size={80} color={theme.colors.semantic.error} fill={theme.colors.semantic.error} />
      </Animated.View>
    </View>
  );
};

// 애니메이션 텍스트 컴포넌트
const AnimatedText: React.FC<{
  text: string;
  style: object;
  delay?: number;
}> = ({ text, style, delay = 0 }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    // 부드럽게 아래에서 위로 올라오는 애니메이션
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }),
    );
  }, [delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Text style={[style, animatedStyle]}>
      {text}
    </Animated.Text>
  );
};

export const OnboardingScreen: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);

  // 버튼 애니메이션
  const buttonScale = useSharedValue(1);

  const isLastSlide = currentIndex === SLIDES.length - 1;

  // 슬라이드 변경 감지
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // 다음/시작하기 버튼 핸들러
  const handleNext = useCallback(() => {
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1),
    );

    if (isLastSlide) {
      completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  }, [currentIndex, isLastSlide, completeOnboarding, buttonScale]);

  // 건너뛰기 핸들러
  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  // 버튼 애니메이션 스타일
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // 슬라이드 렌더링
  const renderSlide = useCallback(
    ({ item, index }: { item: OnboardingSlide; index: number }) => (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.slideContent}>
          {/* 아이콘 영역 */}
          <View style={styles.iconWrapper}>
            {item.iconType === 'emotional' ? <WeatherTransitionIcon /> : <HeartIcon />}
          </View>

          {/* 텍스트 영역 */}
          <View style={styles.textContainer}>
            <AnimatedText
              text={item.title}
              style={styles.title}
              delay={index === currentIndex ? 200 : 0}
            />
            <AnimatedText
              text={item.subtitle}
              style={styles.subtitle}
              delay={index === currentIndex ? 400 : 0}
            />
          </View>
        </View>
      </View>
    ),
    [currentIndex],
  );

  // 페이지 인디케이터
  const renderPagination = () => (
    <View style={styles.pagination}>
      {SLIDES.map((_, index) => {
        const isActive = index === currentIndex;
        return (
          <View
            key={index}
            style={[styles.paginationDot, isActive && styles.paginationDotActive]}
          />
        );
      })}
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
    paddingHorizontal: 32,
  },
  iconWrapper: {
    marginBottom: 48,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
  },

  // Weather transition styles
  weatherContainer: {
    alignItems: 'center',
  },
  weatherIndicator: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  weatherDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  weatherDotActive: {
    opacity: 1,
    transform: [{ scale: 1.3 }],
  },

  // Heart icon styles
  heartContainer: {
    alignItems: 'center',
  },

  // Bottom area
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    backgroundColor: 'transparent',
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
