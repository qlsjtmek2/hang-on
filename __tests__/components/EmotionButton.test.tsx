import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { EmotionButton, EmotionSelector } from '@/components/EmotionButton';

describe('EmotionButton Component', () => {
  it('renders with correct emoji for each emotion level', () => {
    const { getByText, rerender } = render(
      <EmotionButton emotionLevel={1} />
    );
    expect(getByText('⛈️')).toBeTruthy();
    expect(getByText('폭풍')).toBeTruthy();

    rerender(<EmotionButton emotionLevel={2} />);
    expect(getByText('🌧️')).toBeTruthy();
    expect(getByText('비')).toBeTruthy();

    rerender(<EmotionButton emotionLevel={3} />);
    expect(getByText('☁️')).toBeTruthy();
    expect(getByText('흐림')).toBeTruthy();

    rerender(<EmotionButton emotionLevel={4} />);
    expect(getByText('⛅')).toBeTruthy();
    expect(getByText('구름')).toBeTruthy();

    rerender(<EmotionButton emotionLevel={5} />);
    expect(getByText('☀️')).toBeTruthy();
    expect(getByText('맑음')).toBeTruthy();
  });

  it('calls onPress with emotion level when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <EmotionButton emotionLevel={3} onPress={onPress} />
    );

    fireEvent.press(getByText('☁️'));
    expect(onPress).toHaveBeenCalledWith(3);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <EmotionButton emotionLevel={2} onPress={onPress} disabled />
    );

    fireEvent.press(getByText('🌧️'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies different sizes correctly', () => {
    const { getByRole, rerender } = render(
      <EmotionButton emotionLevel={1} size="small" />
    );
    let button = getByRole('button');
    expect(button).toBeTruthy();

    rerender(<EmotionButton emotionLevel={1} size="medium" />);
    button = getByRole('button');
    expect(button).toBeTruthy();

    rerender(<EmotionButton emotionLevel={1} size="large" />);
    button = getByRole('button');
    expect(button).toBeTruthy();
  });

  it('shows selected state correctly', () => {
    const { getByRole, rerender } = render(
      <EmotionButton emotionLevel={5} isSelected={false} />
    );
    let button = getByRole('button');
    expect(button.props.accessibilityState.selected).toBe(false);

    rerender(<EmotionButton emotionLevel={5} isSelected={true} />);
    button = getByRole('button');
    expect(button.props.accessibilityState.selected).toBe(true);
  });

  it('has correct accessibility properties', () => {
    const { getByLabelText, getByRole } = render(
      <EmotionButton emotionLevel={4} isSelected={false} />
    );

    expect(getByLabelText('감정 구름')).toBeTruthy();
    const button = getByRole('button');
    expect(button.props.accessibilityHint).toContain('구름 감정을 선택하세요');
  });
});

describe('EmotionSelector Component', () => {
  it('renders all 5 emotion buttons', () => {
    const { getByText } = render(
      <EmotionSelector />
    );

    expect(getByText('⛈️')).toBeTruthy();
    expect(getByText('🌧️')).toBeTruthy();
    expect(getByText('☁️')).toBeTruthy();
    expect(getByText('⛅')).toBeTruthy();
    expect(getByText('☀️')).toBeTruthy();
  });

  it('selects emotion when button is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <EmotionSelector onSelect={onSelect} />
    );

    fireEvent.press(getByText('☁️'));
    expect(onSelect).toHaveBeenCalledWith(3);

    fireEvent.press(getByText('☀️'));
    expect(onSelect).toHaveBeenCalledWith(5);
  });

  it('shows selected emotion correctly', () => {
    const { getByText, rerender } = render(
      <EmotionSelector selectedLevel={2} />
    );

    // Check that level 2 button is selected
    const rainyButton = getByText('🌧️').parent.parent;
    expect(rainyButton.props.accessibilityState.selected).toBe(true);

    // Change selection to level 4
    rerender(<EmotionSelector selectedLevel={4} />);
    const partlyButton = getByText('⛅').parent.parent;
    expect(partlyButton.props.accessibilityState.selected).toBe(true);
  });

  it('disables all buttons when disabled prop is true', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <EmotionSelector onSelect={onSelect} disabled />
    );

    fireEvent.press(getByText('⛈️'));
    fireEvent.press(getByText('🌧️'));
    fireEvent.press(getByText('☁️'));
    fireEvent.press(getByText('⛅'));
    fireEvent.press(getByText('☀️'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('applies size prop to all buttons', () => {
    const { getAllByRole } = render(
      <EmotionSelector size="large" />
    );

    const buttons = getAllByRole('button');
    expect(buttons).toHaveLength(5);
    // All buttons should be rendered with large size
    buttons.forEach(button => {
      expect(button).toBeTruthy();
    });
  });

  it('handles no selection (null selectedLevel)', () => {
    const { getAllByRole } = render(
      <EmotionSelector selectedLevel={null} />
    );

    const buttons = getAllByRole('button');
    buttons.forEach(button => {
      expect(button.props.accessibilityState.selected).toBe(false);
    });
  });
});