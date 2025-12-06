/**
 * SkeletonLoader Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import {
  Skeleton,
  RecordCardSkeleton,
  RecordCardSkeletonList,
  FeedCardSkeleton,
} from '@/components/SkeletonLoader';

describe('Skeleton', () => {
  it('renders with default props', () => {
    const { getByLabelText } = render(<Skeleton />);
    expect(getByLabelText('로딩 중')).toBeTruthy();
  });

  it('renders with custom dimensions', () => {
    const { getByLabelText } = render(
      <Skeleton width={100} height={20} borderRadius={8} />
    );
    const skeleton = getByLabelText('로딩 중');
    expect(skeleton).toBeTruthy();
    expect(skeleton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: 100,
          height: 20,
          borderRadius: 8,
        }),
      ])
    );
  });

  it('renders with percentage width', () => {
    const { getByLabelText } = render(<Skeleton width="80%" height={16} />);
    const skeleton = getByLabelText('로딩 중');
    expect(skeleton).toBeTruthy();
    expect(skeleton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          width: '80%',
        }),
      ])
    );
  });

  it('has correct accessibility role', () => {
    const { getByLabelText } = render(<Skeleton />);
    const skeleton = getByLabelText('로딩 중');
    expect(skeleton.props.accessibilityRole).toBe('progressbar');
  });
});

describe('RecordCardSkeleton', () => {
  it('renders correctly', () => {
    const { getByLabelText } = render(<RecordCardSkeleton />);
    expect(getByLabelText('기록 로딩 중')).toBeTruthy();
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(<RecordCardSkeleton />);
    const container = getByLabelText('기록 로딩 중');
    expect(container.props.accessible).toBe(true);
  });
});

describe('RecordCardSkeletonList', () => {
  it('renders default count of 3 skeletons', () => {
    const { getAllByLabelText } = render(<RecordCardSkeletonList />);
    const skeletons = getAllByLabelText('기록 로딩 중');
    expect(skeletons).toHaveLength(3);
  });

  it('renders custom count of skeletons', () => {
    const { getAllByLabelText } = render(<RecordCardSkeletonList count={5} />);
    const skeletons = getAllByLabelText('기록 로딩 중');
    expect(skeletons).toHaveLength(5);
  });

  it('renders single skeleton when count is 1', () => {
    const { getAllByLabelText } = render(<RecordCardSkeletonList count={1} />);
    const skeletons = getAllByLabelText('기록 로딩 중');
    expect(skeletons).toHaveLength(1);
  });
});

describe('FeedCardSkeleton', () => {
  it('renders correctly', () => {
    const { getByLabelText } = render(<FeedCardSkeleton cardHeight={600} />);
    expect(getByLabelText('피드 로딩 중')).toBeTruthy();
  });

  it('applies correct card height', () => {
    const testHeight = 750;
    const { getByLabelText } = render(
      <FeedCardSkeleton cardHeight={testHeight} />
    );
    const container = getByLabelText('피드 로딩 중');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          height: testHeight,
        }),
      ])
    );
  });

  it('has correct accessibility label', () => {
    const { getByLabelText } = render(<FeedCardSkeleton cardHeight={600} />);
    const container = getByLabelText('피드 로딩 중');
    expect(container.props.accessible).toBe(true);
  });
});
