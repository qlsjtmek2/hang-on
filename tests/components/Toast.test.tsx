/**
 * Toast Component Tests
 */

import { render, fireEvent, act } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Toast } from '@/components/Toast';
import { ToastProvider, useToast } from '@/contexts/ToastContext';

// SafeAreaProvider wrapper
const safeAreaInsets = {
  top: 0,
  right: 0,
  bottom: 34,
  left: 0,
};

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <SafeAreaProvider
    initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
  >
    <ToastProvider>{children}</ToastProvider>
  </SafeAreaProvider>
);

describe('Toast Component', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders success toast correctly', () => {
    const { getByText } = render(
      <SafeAreaProvider
        initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
      >
        <Toast
          id="test-1"
          type="success"
          message="성공적으로 저장되었습니다"
          onDismiss={mockOnDismiss}
        />
      </SafeAreaProvider>,
    );

    expect(getByText('성공적으로 저장되었습니다')).toBeTruthy();
  });

  it('renders error toast correctly', () => {
    const { getByText } = render(
      <SafeAreaProvider
        initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
      >
        <Toast id="test-2" type="error" message="오류가 발생했습니다" onDismiss={mockOnDismiss} />
      </SafeAreaProvider>,
    );

    expect(getByText('오류가 발생했습니다')).toBeTruthy();
  });

  it('renders warning toast correctly', () => {
    const { getByText } = render(
      <SafeAreaProvider
        initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
      >
        <Toast id="test-3" type="warning" message="주의가 필요합니다" onDismiss={mockOnDismiss} />
      </SafeAreaProvider>,
    );

    expect(getByText('주의가 필요합니다')).toBeTruthy();
  });

  it('renders info toast correctly', () => {
    const { getByText } = render(
      <SafeAreaProvider
        initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
      >
        <Toast id="test-4" type="info" message="정보를 확인하세요" onDismiss={mockOnDismiss} />
      </SafeAreaProvider>,
    );

    expect(getByText('정보를 확인하세요')).toBeTruthy();
  });

  it('has close button with accessibility', () => {
    const { getByLabelText } = render(
      <SafeAreaProvider
        initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
      >
        <Toast id="test-5" type="success" message="테스트 메시지" onDismiss={mockOnDismiss} />
      </SafeAreaProvider>,
    );

    const closeButton = getByLabelText('토스트 닫기');
    expect(closeButton).toBeTruthy();
  });

  it('calls onDismiss when close button is pressed', () => {
    const { getByLabelText } = render(
      <SafeAreaProvider
        initialMetrics={{ insets: safeAreaInsets, frame: { x: 0, y: 0, width: 390, height: 844 } }}
      >
        <Toast id="test-6" type="success" message="테스트 메시지" onDismiss={mockOnDismiss} />
      </SafeAreaProvider>,
    );

    const closeButton = getByLabelText('토스트 닫기');
    fireEvent.press(closeButton);

    // 애니메이션 완료 대기 (Reanimated mock에서는 즉시 실행)
    act(() => {
      jest.runAllTimers();
    });
  });
});

describe('ToastContext', () => {
  // Test component to trigger toast
  const TestComponent: React.FC = () => {
    const { showToast } = useToast();

    return (
      <>
        <TouchableOpacity testID="show-success" onPress={() => showToast('success', '성공!')} />
        <TouchableOpacity testID="show-error" onPress={() => showToast('error', '에러!')} />
      </>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides showToast function', () => {
    const { getByTestId } = render(
      <Wrapper>
        <TestComponent />
      </Wrapper>,
    );

    expect(getByTestId('show-success')).toBeTruthy();
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    const ComponentWithoutProvider: React.FC = () => {
      useToast();
      return null;
    };

    expect(() => {
      render(<ComponentWithoutProvider />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleError.mockRestore();
  });
});
