import '@testing-library/jest-native/extend-expect';

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
