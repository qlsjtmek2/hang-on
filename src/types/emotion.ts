/**
 * 감정 관련 타입 정의
 * @module types/emotion
 */

import type { LucideIcon } from 'lucide-react-native';

/**
 * 감정 수준 타입
 * 1: 폭풍 (매우 나쁨)
 * 2: 비 (나쁨)
 * 3: 흐림 (보통)
 * 4: 구름 (좋음)
 * 5: 맑음 (매우 좋음)
 */
export type EmotionLevel = 1 | 2 | 3 | 4 | 5;

/**
 * 감정 날씨 타입
 * 감정을 날씨로 표현할 때 사용하는 문자열 리터럴
 */
export type EmotionWeather =
  | 'storm' // 폭풍
  | 'rain' // 비
  | 'cloudy' // 흐림
  | 'partly_sunny' // 구름 조금
  | 'sunny'; // 맑음

/**
 * 감정 데이터 인터페이스
 * UI에서 감정을 표시할 때 사용하는 데이터 구조
 */
export interface EmotionData {
  /** 감정을 나타내는 Lucide 아이콘 */
  icon: LucideIcon;
  /** 감정의 한글 라벨 */
  label: string;
  /** 감정의 테마 색상 (Hex 코드) */
  color: string;
}

/**
 * 감정 레벨과 날씨 간의 매핑 타입
 * API 응답이나 다국어 처리에 사용
 */
export const EMOTION_LEVEL_TO_WEATHER: Record<EmotionLevel, EmotionWeather> = {
  1: 'storm',
  2: 'rain',
  3: 'cloudy',
  4: 'partly_sunny',
  5: 'sunny',
};

/**
 * 날씨와 감정 레벨 간의 역매핑 타입
 * 외부 API나 다국어 키에서 EmotionLevel로 변환할 때 사용
 */
export const WEATHER_TO_EMOTION_LEVEL: Record<EmotionWeather, EmotionLevel> = {
  storm: 1,
  rain: 2,
  cloudy: 3,
  partly_sunny: 4,
  sunny: 5,
};
