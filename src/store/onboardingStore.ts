import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const ONBOARDING_STORAGE_KEY = 'hangon-onboarding';

interface OnboardingStore {
  // 상태
  hasCompletedOnboarding: boolean;
  isLoading: boolean;

  // 액션
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setLoading: (loading: boolean) => void;
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      // 초기 상태
      hasCompletedOnboarding: false,
      isLoading: true,

      // 온보딩 완료
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      // 온보딩 리셋 (개발/테스트용)
      resetOnboarding: () => {
        set({ hasCompletedOnboarding: false });
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // 복원 완료 후 로딩 상태 해제
        state?.setLoading(false);
      },
    },
  ),
);
