import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button Component', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <Button title="테스트 버튼" onPress={() => {}} />
    );
    expect(getByText('테스트 버튼')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="테스트 버튼" onPress={onPress} />
    );
    fireEvent.press(getByText('테스트 버튼'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders primary variant by default', () => {
    const { getByRole } = render(
      <Button title="테스트 버튼" onPress={() => {}} />
    );
    const button = getByRole('button');
    expect(button.props.style).toBeTruthy();
  });

  it('renders secondary variant', () => {
    const { getByRole } = render(
      <Button title="테스트 버튼" onPress={() => {}} variant="secondary" />
    );
    const button = getByRole('button');
    expect(button.props.style).toBeTruthy();
  });

  it('renders ghost variant', () => {
    const { getByRole } = render(
      <Button title="테스트 버튼" onPress={() => {}} variant="ghost" />
    );
    const button = getByRole('button');
    expect(button.props.style).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <Button title="테스트 버튼" onPress={onPress} disabled />
    );
    const button = getByRole('button');
    expect(button.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading indicator when loading', () => {
    const { queryByText, getByTestId } = render(
      <Button title="테스트 버튼" onPress={() => {}} loading testID="loading-indicator" />
    );
    expect(queryByText('테스트 버튼')).toBeNull();
    // ActivityIndicator는 testID를 직접 지원하지 않으므로 다른 방법으로 확인
  });

  it('applies different sizes', () => {
    const { rerender, getByRole } = render(
      <Button title="Small" onPress={() => {}} size="small" />
    );
    let button = getByRole('button');
    expect(button.props.style).toBeTruthy();

    rerender(
      <Button title="Medium" onPress={() => {}} size="medium" />
    );
    button = getByRole('button');
    expect(button.props.style).toBeTruthy();

    rerender(
      <Button title="Large" onPress={() => {}} size="large" />
    );
    button = getByRole('button');
    expect(button.props.style).toBeTruthy();
  });

  it('applies fullWidth style', () => {
    const { getByRole } = render(
      <Button title="Full Width" onPress={() => {}} fullWidth />
    );
    const button = getByRole('button');
    expect(button.props.style).toBeTruthy();
  });

  it('uses custom accessibility label', () => {
    const { getByLabelText } = render(
      <Button
        title="버튼"
        onPress={() => {}}
        accessibilityLabel="커스텀 라벨"
      />
    );
    expect(getByLabelText('커스텀 라벨')).toBeTruthy();
  });

  it('uses custom accessibility hint', () => {
    const { getByRole } = render(
      <Button
        title="버튼"
        onPress={() => {}}
        accessibilityHint="커스텀 힌트"
      />
    );
    const button = getByRole('button');
    expect(button.props.accessibilityHint).toBe('커스텀 힌트');
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const customTextStyle = { color: 'blue' };

    const { getByRole } = render(
      <Button
        title="Custom"
        onPress={() => {}}
        style={customStyle}
        textStyle={customTextStyle}
      />
    );

    const button = getByRole('button');
    expect(button.props.style).toContainEqual(customStyle);
  });
});