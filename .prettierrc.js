module.exports = {
  // 코드 스타일
  arrowParens: 'avoid', // 화살표 함수 매개변수 괄호 생략 (가능한 경우)
  singleQuote: true, // 작은따옴표 사용
  trailingComma: 'all', // 후행 콤마 항상 사용
  semi: true, // 세미콜론 사용
  tabWidth: 2, // 탭 너비 2칸
  printWidth: 100, // 한 줄 최대 길이 100자
  useTabs: false, // 탭 대신 스페이스 사용
  bracketSpacing: true, // 객체 괄호 안 공백 사용
  bracketSameLine: false, // JSX 마지막 > 새 줄에 배치
  jsxSingleQuote: false, // JSX에서 큰따옴표 사용
  endOfLine: 'lf', // 줄 끝 문자 (Linux/Mac 스타일)

  // React Native 특정 설정
  jsxBracketSameLine: false, // JSX 마지막 > 새 줄에 배치 (deprecated 호환성)
};
