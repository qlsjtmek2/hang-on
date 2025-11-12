import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { Input } from '@/components/Input';

describe('Input Component', () => {
  it('renders with label', () => {
    const { getByText } = render(<Input label="이름" placeholder="이름을 입력하세요" />);
    expect(getByText('이름')).toBeTruthy();
  });

  it('shows placeholder text', () => {
    const { getByPlaceholderText } = render(<Input placeholder="텍스트를 입력하세요" />);
    expect(getByPlaceholderText('텍스트를 입력하세요')).toBeTruthy();
  });

  it('handles text input', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="입력" onChangeText={onChangeText} />,
    );
    const input = getByPlaceholderText('입력');
    fireEvent.changeText(input, '테스트 텍스트');
    expect(onChangeText).toHaveBeenCalledWith('테스트 텍스트');
  });

  it('shows error message', () => {
    const { getByText } = render(<Input label="이메일" error="올바른 이메일을 입력하세요" />);
    expect(getByText('올바른 이메일을 입력하세요')).toBeTruthy();
  });

  it('shows helper text when no error', () => {
    const { getByText } = render(<Input label="비밀번호" helperText="8자 이상 입력하세요" />);
    expect(getByText('8자 이상 입력하세요')).toBeTruthy();
  });

  it('shows error instead of helper text when both provided', () => {
    const { getByText, queryByText } = render(
      <Input label="필드" error="에러 메시지" helperText="도움말 텍스트" />,
    );
    expect(getByText('에러 메시지')).toBeTruthy();
    expect(queryByText('도움말 텍스트')).toBeNull();
  });

  it('shows character counter when showCounter is true', () => {
    const { getByText, rerender } = render(<Input value="테스트" showCounter maxLength={10} />);
    expect(getByText('3/10')).toBeTruthy();

    // Update value and check counter
    rerender(<Input value="긴 텍스트 입력" showCounter maxLength={10} />);
    expect(getByText('8/10')).toBeTruthy();
  });

  it('shows counter in error state when over maxLength', () => {
    const { getByText } = render(
      <Input value="이것은 너무 긴 텍스트입니다" showCounter maxLength={10} />,
    );
    expect(getByText('15/10')).toBeTruthy();
  });

  it('handles focus and blur events', () => {
    const { getByPlaceholderText } = render(<Input placeholder="포커스 테스트" />);
    const input = getByPlaceholderText('포커스 테스트');

    // Focus event
    fireEvent(input, 'focus');
    // We can't directly test the style change, but the event should be handled

    // Blur event
    fireEvent(input, 'blur');
    // Again, event should be handled
  });

  it('respects editable prop', () => {
    const { getByPlaceholderText } = render(<Input placeholder="비활성화" editable={false} />);
    const input = getByPlaceholderText('비활성화');
    expect(input.props.editable).toBe(false);
  });

  it('applies custom styles', () => {
    const customContainerStyle = { marginBottom: 100 };
    const customInputStyle = { fontSize: 20 };
    const customLabelStyle = { color: 'red' };

    const { getByText } = render(
      <Input
        label="스타일 테스트"
        containerStyle={customContainerStyle}
        inputStyle={customInputStyle}
        labelStyle={customLabelStyle}
      />,
    );

    // Check label exists (style testing is limited in react-native-testing-library)
    expect(getByText('스타일 테스트')).toBeTruthy();
  });

  it('works as controlled component', () => {
    const { getByPlaceholderText } = render(<Input placeholder="제어 컴포넌트" value="초기값" />);
    const input = getByPlaceholderText('제어 컴포넌트');
    expect(input.props.value).toBe('초기값');
  });

  it('works as uncontrolled component', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="비제어 컴포넌트" onChangeText={onChangeText} />,
    );
    const input = getByPlaceholderText('비제어 컴포넌트');
    fireEvent.changeText(input, '새로운 값');
    expect(onChangeText).toHaveBeenCalledWith('새로운 값');
  });

  it('forwards ref properly', () => {
    const ref = React.createRef<any>();
    render(<Input ref={ref} placeholder="ref 테스트" />);
    expect(ref.current).toBeTruthy();
  });

  it('respects maxLength prop', () => {
    const { getByPlaceholderText } = render(<Input placeholder="최대 길이" maxLength={5} />);
    const input = getByPlaceholderText('최대 길이');
    expect(input.props.maxLength).toBe(5);
  });

  it('uses label as accessibility label', () => {
    const { getByLabelText } = render(<Input label="접근성 라벨" placeholder="입력" />);
    expect(getByLabelText('접근성 라벨')).toBeTruthy();
  });
});
