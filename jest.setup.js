import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Manual Reanimated mock for Jest
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  return {
    default: {
      call: () => {},
      createAnimatedComponent: (component) => component,
      View,
    },
    View,
    Text: require('react-native').Text,
    Image: require('react-native').Image,
    ScrollView: require('react-native').ScrollView,
    FlatList: require('react-native').FlatList,
    // Hooks
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: (fn) => fn(),
    useDerivedValue: (fn) => ({ value: fn() }),
    useAnimatedProps: (fn) => fn(),
    useAnimatedGestureHandler: () => ({}),
    useAnimatedScrollHandler: () => ({}),
    // Animations
    withTiming: (value, config, callback) => {
      if (callback) callback(true);
      return value;
    },
    withSpring: (value, config, callback) => {
      if (callback) callback(true);
      return value;
    },
    withDelay: (delay, animation) => animation,
    withSequence: (...animations) => animations[0],
    withRepeat: (animation) => animation,
    cancelAnimation: () => {},
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
    // Easing
    Easing: {
      linear: (t) => t,
      ease: (t) => t,
      inOut: () => (t) => t,
      in: () => (t) => t,
      out: () => (t) => t,
    },
    // Layout animations
    Layout: {},
    FadeIn: {},
    FadeOut: {},
    SlideInDown: {},
    SlideOutDown: {},
    // Interpolate
    interpolate: (value, _inputRange, _outputRange) => value,
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const { View, TouchableOpacity, ScrollView, FlatList } = require('react-native');
  return {
    GestureHandlerRootView: View,
    GestureDetector: View,
    Gesture: {
      Pan: () => ({
        enabled: () => ({
          onUpdate: () => ({
            onEnd: () => ({}),
          }),
        }),
      }),
    },
    TouchableOpacity,
    TouchableWithoutFeedback: View,
    ScrollView,
    FlatList,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Set timezone to UTC+9 (KST) for consistent date testing
process.env.TZ = 'Asia/Seoul';

// Mock react-native-config
jest.mock('react-native-config', () => ({
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
  NODE_ENV: 'test',
}));

// Mock Supabase client
jest.mock('@/services/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null } })),
      getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      resetPasswordForEmail: jest.fn(),
    },
  },
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  resetPassword: jest.fn(),
}));

// Mock authService
jest.mock('@/services/authService', () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(() => Promise.resolve(null)),
  getCurrentUser: jest.fn(() => Promise.resolve(null)),
  refreshSession: jest.fn(() => Promise.resolve(null)),
  sendPasswordResetEmail: jest.fn(),
  updatePassword: jest.fn(),
  signInWithGoogle: jest.fn(),
  onAuthStateChange: jest.fn(_callback => {
    return () => {}; // unsubscribe function
  }),
}));
