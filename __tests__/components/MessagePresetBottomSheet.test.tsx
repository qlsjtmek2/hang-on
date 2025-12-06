import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { MessagePresetBottomSheet } from '@/components/MessagePresetBottomSheet';
import { MESSAGE_PRESETS } from '@/store/feedStore';

// BottomSheet mock - require를 사용해서 jest.mock 내부에서 import
jest.mock('@/components/BottomSheet', () => {
  const { View, Text } = require('react-native');
  return {
    BottomSheet: ({
      visible,
      children,
      title,
    }: {
      visible: boolean;
      children: React.ReactNode;
      title?: string;
    }) =>
      visible ? (
        <View>
          {title && <Text>{title}</Text>}
          {children}
        </View>
      ) : null,
  };
});

describe('MessagePresetBottomSheet Component', () => {
  it('renders with title when visible', () => {
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={() => {}}
      />,
    );
    expect(getByText('따뜻한 말 건네기')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <MessagePresetBottomSheet
        visible={false}
        onClose={() => {}}
        onSelect={() => {}}
      />,
    );
    expect(queryByText('따뜻한 말 건네기')).toBeNull();
  });

  it('renders all preset options', () => {
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={() => {}}
      />,
    );

    MESSAGE_PRESETS.forEach(preset => {
      expect(getByText(preset.label)).toBeTruthy();
    });
  });

  it('calls onSelect when preset is pressed', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={onSelect}
      />,
    );

    fireEvent.press(getByText('힘내세요'));
    expect(onSelect).toHaveBeenCalledWith('cheer_up');
  });

  it('calls onClose when preset is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={onClose}
        onSelect={() => {}}
      />,
    );

    fireEvent.press(getByText('저도 그래요'));
    expect(onClose).toHaveBeenCalled();
  });

  it('shows sent message when hasSentMessage is true', () => {
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={() => {}}
        hasSentMessage={true}
      />,
    );

    expect(getByText('이미 따뜻한 말을 보냈어요')).toBeTruthy();
  });

  it('does not call onSelect when hasSentMessage is true', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={onSelect}
        hasSentMessage={true}
      />,
    );

    // 프리셋 버튼은 disabled 상태이므로 onPress가 호출되지 않음
    fireEvent.press(getByText('힘내세요'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows description when not sent', () => {
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={() => {}}
        hasSentMessage={false}
      />,
    );

    expect(getByText('어떤 말을 건네고 싶으신가요?')).toBeTruthy();
  });

  it('shows info text when not sent', () => {
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={() => {}}
        hasSentMessage={false}
      />,
    );

    expect(getByText('선택한 메시지가 익명으로 전달됩니다')).toBeTruthy();
  });

  it('renders each preset with correct emoji', () => {
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={() => {}}
      />,
    );

    MESSAGE_PRESETS.forEach(preset => {
      expect(getByText(preset.emoji)).toBeTruthy();
    });
  });

  it('calls correct preset type for each button', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <MessagePresetBottomSheet
        visible={true}
        onClose={() => {}}
        onSelect={onSelect}
      />,
    );

    fireEvent.press(getByText('괜찮을 거예요'));
    expect(onSelect).toHaveBeenCalledWith('will_be_ok');

    fireEvent.press(getByText('함께해요'));
    expect(onSelect).toHaveBeenCalledWith('together');
  });
});
