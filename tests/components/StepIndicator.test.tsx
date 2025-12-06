/**
 * StepIndicator Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { StepIndicator } from '@/components/StepIndicator';

describe('StepIndicator', () => {
  const defaultLabels = ['감정 선택', '글쓰기', '공유 설정'];

  describe('Dot Variant (default)', () => {
    it('renders correctly with required props', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={1} totalSteps={3} />
      );
      expect(getByLabelText('3단계 중 1단계')).toBeTruthy();
    });

    it('renders correct accessibility value', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={2} totalSteps={3} />
      );
      const indicator = getByLabelText('3단계 중 2단계');
      expect(indicator.props.accessibilityRole).toBe('progressbar');
      expect(indicator.props.accessibilityValue).toEqual({
        min: 1,
        max: 3,
        now: 2,
      });
    });

    it('renders with labels when showLabels is true', () => {
      const { getByText } = render(
        <StepIndicator
          currentStep={1}
          totalSteps={3}
          labels={defaultLabels}
          showLabels
        />
      );
      expect(getByText('감정 선택')).toBeTruthy();
    });

    it('does not render labels when showLabels is false', () => {
      const { queryByText } = render(
        <StepIndicator
          currentStep={1}
          totalSteps={3}
          labels={defaultLabels}
          showLabels={false}
        />
      );
      expect(queryByText('감정 선택')).toBeNull();
    });

    it('updates accessibility label when step changes', () => {
      const { rerender, getByLabelText } = render(
        <StepIndicator currentStep={1} totalSteps={3} />
      );
      expect(getByLabelText('3단계 중 1단계')).toBeTruthy();

      rerender(<StepIndicator currentStep={2} totalSteps={3} />);
      expect(getByLabelText('3단계 중 2단계')).toBeTruthy();

      rerender(<StepIndicator currentStep={3} totalSteps={3} />);
      expect(getByLabelText('3단계 중 3단계')).toBeTruthy();
    });
  });

  describe('Bar Variant', () => {
    it('renders bar variant correctly', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={2} totalSteps={3} variant="bar" />
      );
      expect(getByLabelText('3단계 중 2단계')).toBeTruthy();
    });

    it('renders all labels in bar variant when showLabels is true', () => {
      const { getByText } = render(
        <StepIndicator
          currentStep={2}
          totalSteps={3}
          variant="bar"
          labels={defaultLabels}
          showLabels
        />
      );
      expect(getByText('감정 선택')).toBeTruthy();
      expect(getByText('글쓰기')).toBeTruthy();
      expect(getByText('공유 설정')).toBeTruthy();
    });

    it('has correct accessibility role', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={1} totalSteps={3} variant="bar" />
      );
      const indicator = getByLabelText('3단계 중 1단계');
      expect(indicator.props.accessibilityRole).toBe('progressbar');
    });
  });

  describe('Different total steps', () => {
    it('renders correctly with 2 steps', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={1} totalSteps={2} />
      );
      expect(getByLabelText('2단계 중 1단계')).toBeTruthy();
    });

    it('renders correctly with 5 steps', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={3} totalSteps={5} />
      );
      const indicator = getByLabelText('5단계 중 3단계');
      expect(indicator.props.accessibilityValue).toEqual({
        min: 1,
        max: 5,
        now: 3,
      });
    });
  });

  describe('Edge cases', () => {
    it('renders first step correctly', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={1} totalSteps={3} />
      );
      expect(getByLabelText('3단계 중 1단계')).toBeTruthy();
    });

    it('renders last step correctly', () => {
      const { getByLabelText } = render(
        <StepIndicator currentStep={3} totalSteps={3} />
      );
      expect(getByLabelText('3단계 중 3단계')).toBeTruthy();
    });

    it('applies custom style', () => {
      const customStyle = { marginTop: 20 };
      const { getByLabelText } = render(
        <StepIndicator
          currentStep={1}
          totalSteps={3}
          style={customStyle}
        />
      );
      const indicator = getByLabelText('3단계 중 1단계');
      expect(indicator.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining(customStyle)])
      );
    });
  });
});
