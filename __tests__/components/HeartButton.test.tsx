import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Animated } from 'react-native';

import { HeartButton } from '@/components/HeartButton';

// Mock Animated to avoid native driver issues in tests
jest.spyOn(Animated, 'sequence').mockReturnValue({
  start: jest.fn((callback?: (result: { finished: boolean }) => void) => {
    callback?.({ finished: true });
  }),
  stop: jest.fn(),
  reset: jest.fn(),
} as unknown as Animated.CompositeAnimation);

jest.spyOn(Animated, 'spring').mockReturnValue({
  start: jest.fn((callback?: (result: { finished: boolean }) => void) => {
    callback?.({ finished: true });
  }),
  stop: jest.fn(),
  reset: jest.fn(),
} as unknown as Animated.CompositeAnimation);

describe('HeartButton Component', () => {
  it('renders with empty heart when not empathized', () => {
    const { getByLabelText } = render(
      <HeartButton hasEmpathized={false} onPress={() => {}} />,
    );
    expect(getByLabelText('공감하기')).toBeTruthy();
  });

  it('renders with filled heart when empathized', () => {
    const { getByLabelText } = render(
      <HeartButton hasEmpathized={true} onPress={() => {}} />,
    );
    expect(getByLabelText('공감 취소하기')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={onPress} />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows count when count > 0 and showCount is true', () => {
    const { getByText } = render(
      <HeartButton hasEmpathized={true} count={5} onPress={() => {}} showCount={true} />,
    );
    expect(getByText('5')).toBeTruthy();
  });

  it('does not show count when count is 0', () => {
    const { queryByText } = render(
      <HeartButton hasEmpathized={false} count={0} onPress={() => {}} showCount={true} />,
    );
    expect(queryByText('0')).toBeNull();
  });

  it('does not show count when showCount is false', () => {
    const { queryByText } = render(
      <HeartButton hasEmpathized={true} count={10} onPress={() => {}} showCount={false} />,
    );
    expect(queryByText('10')).toBeNull();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={onPress} disabled />,
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('has correct accessibility state when disabled', () => {
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={() => {}} disabled />,
    );
    const button = getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('has correct accessibility state when selected (empathized)', () => {
    const { getByRole } = render(
      <HeartButton hasEmpathized={true} onPress={() => {}} />,
    );
    const button = getByRole('button');
    expect(button.props.accessibilityState.selected).toBe(true);
  });

  it('renders small size variant', () => {
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={() => {}} size="small" />,
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('renders medium size variant', () => {
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={() => {}} size="medium" />,
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('renders large size variant', () => {
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={() => {}} size="large" />,
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: 20 };
    const { getByRole } = render(
      <HeartButton hasEmpathized={false} onPress={() => {}} style={customStyle} />,
    );
    expect(getByRole('button')).toBeTruthy();
  });
});
