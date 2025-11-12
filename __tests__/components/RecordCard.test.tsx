import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RecordCard } from '@/components/RecordCard';

describe('RecordCard Component', () => {
  const mockRecord = {
    id: 'test-1',
    emotionLevel: 3 as const,
    content: '오늘은 날씨가 흐려서 기분도 약간 가라앉은 느낌이다. 하지만 따뜻한 차를 마시며 조금씩 기분이 나아지고 있다.',
    createdAt: new Date(),
    empathyCount: 5,
    messageCount: 3,
  };

  it('renders with correct emotion data', () => {
    const { getByText } = render(
      <RecordCard {...mockRecord} />
    );

    expect(getByText('☁️')).toBeTruthy();
    expect(getByText('흐림')).toBeTruthy();
  });

  it('displays content preview', () => {
    const { getByText } = render(
      <RecordCard {...mockRecord} />
    );

    expect(getByText(/오늘은 날씨가 흐려서/)).toBeTruthy();
  });

  it('truncates long content', () => {
    const longContent = 'a'.repeat(200);
    const { getByText } = render(
      <RecordCard
        {...mockRecord}
        content={longContent}
      />
    );

    // Check that content is truncated (should end with ...)
    const contentElement = getByText(/^a+/);
    expect(contentElement.props.children.endsWith('...')).toBe(true);
  });

  it('displays empathy and message counts', () => {
    const { getByText } = render(
      <RecordCard {...mockRecord} />
    );

    expect(getByText('5')).toBeTruthy(); // empathy count
    expect(getByText('3')).toBeTruthy(); // message count
  });

  it('hides counts when they are zero', () => {
    const { queryByText } = render(
      <RecordCard
        {...mockRecord}
        empathyCount={0}
        messageCount={0}
      />
    );

    // Should not display '0'
    expect(queryByText('0')).toBeNull();
  });

  it('calls onPress when card is pressed', () => {
    const onPress = jest.fn();
    const { getByRole } = render(
      <RecordCard {...mockRecord} onPress={onPress} />
    );

    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith('test-1');
  });

  it('calls onEmpathyPress when empathy button is pressed', () => {
    const onEmpathyPress = jest.fn();
    const { getByText } = render(
      <RecordCard {...mockRecord} onEmpathyPress={onEmpathyPress} />
    );

    fireEvent.press(getByText('💗'));
    expect(onEmpathyPress).toHaveBeenCalledWith('test-1');
  });

  it('calls onMessagePress when message button is pressed', () => {
    const onMessagePress = jest.fn();
    const { getByText } = render(
      <RecordCard {...mockRecord} onMessagePress={onMessagePress} />
    );

    fireEvent.press(getByText('💬'));
    expect(onMessagePress).toHaveBeenCalledWith('test-1');
  });

  it('shows shared badge when isShared is true', () => {
    const { getByText } = render(
      <RecordCard {...mockRecord} isShared={true} />
    );

    expect(getByText('공유됨')).toBeTruthy();
  });

  it('does not show shared badge when isShared is false', () => {
    const { queryByText } = render(
      <RecordCard {...mockRecord} isShared={false} />
    );

    expect(queryByText('공유됨')).toBeNull();
  });

  it('displays correct emotion for each level', () => {
    const levels = [1, 2, 3, 4, 5] as const;
    const expectedEmojis = ['⛈️', '🌧️', '☁️', '⛅', '☀️'];
    const expectedLabels = ['폭풍', '비', '흐림', '구름', '맑음'];

    levels.forEach((level, index) => {
      const { getByText } = render(
        <RecordCard {...mockRecord} emotionLevel={level} />
      );

      expect(getByText(expectedEmojis[index])).toBeTruthy();
      expect(getByText(expectedLabels[index])).toBeTruthy();
    });
  });

  it('uses custom time formatter when provided', () => {
    const customFormatter = jest.fn(() => '커스텀 시간');
    const { getByText } = render(
      <RecordCard {...mockRecord} formatTime={customFormatter} />
    );

    expect(customFormatter).toHaveBeenCalledWith(mockRecord.createdAt);
    expect(getByText('커스텀 시간')).toBeTruthy();
  });

  it('handles string date format', () => {
    const dateString = '2024-01-15T10:30:00Z';
    const { getByText } = render(
      <RecordCard {...mockRecord} createdAt={dateString} />
    );

    // Should display some time format (방금 전, X분 전, 2024.1.15, etc.)
    // The exact text depends on the current time
    // Accept various formats: "전" for relative times, "2024" for absolute dates, "월/일" for Korean dates
    expect(getByText(/전|2024|월|일/)).toBeTruthy();
  });

  it('has correct accessibility properties', () => {
    const { getByRole } = render(
      <RecordCard {...mockRecord} />
    );

    const card = getByRole('button');
    expect(card.props.accessibilityLabel).toBe('흐림 감정 기록');
    expect(card.props.accessibilityHint).toBe('탭하여 상세 내용 보기');
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByRole } = render(
      <RecordCard {...mockRecord} style={customStyle} />
    );

    const card = getByRole('button');
    expect(card.props.style).toContainEqual(customStyle);
  });
});