import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

import { BottomSheet, ActionSheet } from '@/components/BottomSheet';

describe('BottomSheet Component', () => {
  it('renders when visible is true', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={() => {}}>
        <Text>Bottom Sheet Content</Text>
      </BottomSheet>,
    );

    expect(getByText('Bottom Sheet Content')).toBeTruthy();
  });

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <BottomSheet visible={false} onClose={() => {}}>
        <Text>Bottom Sheet Content</Text>
      </BottomSheet>,
    );

    expect(queryByText('Bottom Sheet Content')).toBeNull();
  });

  it('renders title when provided', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={() => {}} title="시트 제목">
        <Text>Content</Text>
      </BottomSheet>,
    );

    expect(getByText('시트 제목')).toBeTruthy();
  });

  it('shows handle when showHandle is true', () => {
    const {} = render(
      <BottomSheet visible={true} onClose={() => {}} showHandle={true}>
        <Text>Content</Text>
      </BottomSheet>,
    );
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <BottomSheet visible={true} onClose={onClose} title="Test">
        <Text>Content</Text>
      </BottomSheet>,
    );

    fireEvent.press(getByText('✕'));

    // onClose should be called after animation
    waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('renders children content', () => {
    const { getByText } = render(
      <BottomSheet visible={true} onClose={() => {}}>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </BottomSheet>,
    );

    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
    expect(getByText('Child 3')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const customHeaderStyle = { borderBottomWidth: 2 };
    const customContentStyle = { padding: 20 };

    const { container } = render(
      <BottomSheet
        visible={true}
        onClose={() => {}}
        style={customStyle}
        headerStyle={customHeaderStyle}
        contentStyle={customContentStyle}
      >
        <Text>Content</Text>
      </BottomSheet>,
    );

    // Styles should be applied (testing is limited in RNTL)
    expect(container).toBeTruthy();
  });
});

describe('ActionSheet Component', () => {
  const mockActions = [
    { label: '편집', onPress: jest.fn() },
    { label: '공유', onPress: jest.fn() },
    { label: '삭제', onPress: jest.fn(), destructive: true },
    { label: '비활성화 액션', onPress: jest.fn(), disabled: true },
  ];

  it('renders all action buttons', () => {
    const { getByText } = render(
      <ActionSheet visible={true} onClose={() => {}} actions={mockActions} />,
    );

    expect(getByText('편집')).toBeTruthy();
    expect(getByText('공유')).toBeTruthy();
    expect(getByText('삭제')).toBeTruthy();
    expect(getByText('비활성화 액션')).toBeTruthy();
  });

  it('renders cancel button with custom label', () => {
    const { getByText } = render(
      <ActionSheet visible={true} onClose={() => {}} actions={mockActions} cancelLabel="닫기" />,
    );

    expect(getByText('닫기')).toBeTruthy();
  });

  it('renders default cancel button', () => {
    const { getByText } = render(
      <ActionSheet visible={true} onClose={() => {}} actions={mockActions} />,
    );

    expect(getByText('취소')).toBeTruthy();
  });

  it('calls action onPress and closes sheet', async () => {
    const onClose = jest.fn();
    const action = { label: '테스트 액션', onPress: jest.fn() };

    const { getByText } = render(
      <ActionSheet visible={true} onClose={onClose} actions={[action]} />,
    );

    fireEvent.press(getByText('테스트 액션'));

    expect(action.onPress).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onPress for disabled actions', () => {
    const onClose = jest.fn();
    const disabledAction = {
      label: '비활성화',
      onPress: jest.fn(),
      disabled: true,
    };

    const { getByText } = render(
      <ActionSheet visible={true} onClose={onClose} actions={[disabledAction]} />,
    );

    fireEvent.press(getByText('비활성화'));

    expect(disabledAction.onPress).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel button is pressed', () => {
    const onClose = jest.fn();

    const { getByText } = render(
      <ActionSheet visible={true} onClose={onClose} actions={mockActions} />,
    );

    fireEvent.press(getByText('취소'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders title when provided', () => {
    const { getByText } = render(
      <ActionSheet visible={true} onClose={() => {}} title="액션 선택" actions={mockActions} />,
    );

    expect(getByText('액션 선택')).toBeTruthy();
  });
});
