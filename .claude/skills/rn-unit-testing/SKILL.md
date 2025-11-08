---
name: rn-unit-testing
description: Jest and React Native Testing Library (RNTL) unit testing guide. Covers component testing, hooks testing, mocking, snapshots, test coverage, and best practices. Use for unit test, jest, testing library, component test, mock, spy, test coverage, snapshot test.
---

# React Native Unit Testing

## Purpose

Comprehensive guide for unit testing React Native applications using Jest and React Native Testing Library (RNTL). Covers component testing, hooks testing, mocking strategies, and achieving high test coverage.

## When to Use

Use this skill when:
- Writing unit tests for React Native components
- Testing custom hooks
- Mocking dependencies (APIs, navigation, native modules)
- Creating snapshot tests
- Measuring and improving test coverage
- Debugging failing tests
- Setting up Jest configuration

## MCP Integration

**context7**: Fetch testing documentation
```
- Jest API documentation
- React Native Testing Library guides
- Testing best practices
- Mocking patterns
```

## Setup

### Install Dependencies

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev @types/jest
```

### Jest Configuration

**jest.config.js**
```javascript
module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@supabase)/)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

**jest.setup.js**
```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
```

**package.json**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Component Testing

### Basic Component Test

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Click Me" onPress={jest.fn()} />);

    expect(screen.getByText('Click Me')).toBeOnTheScreen();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(<Button title="Click Me" onPress={onPressMock} />);

    const button = screen.getByText('Click Me');
    fireEvent.press(button);

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button title="Click Me" onPress={jest.fn()} disabled />);

    const button = screen.getByText('Click Me').parent;
    expect(button).toBeDisabled();
  });

  it('shows loading indicator when loading', () => {
    render(<Button title="Click Me" onPress={jest.fn()} loading />);

    expect(screen.getByTestId('loading-indicator')).toBeOnTheScreen();
    expect(screen.queryByText('Click Me')).not.toBeOnTheScreen();
  });
});
```

### Testing User Input

```typescript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '@/components/Input';

describe('Input', () => {
  it('updates value on text change', () => {
    const onChangeTextMock = jest.fn();
    render(
      <Input
        label="Email"
        value=""
        onChangeText={onChangeTextMock}
      />
    );

    const input = screen.getByLabelText('Email');
    fireEvent.changeText(input, 'test@example.com');

    expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
  });

  it('displays error message', () => {
    render(
      <Input
        label="Email"
        value="invalid"
        onChangeText={jest.fn()}
        error="Invalid email format"
      />
    );

    expect(screen.getByText('Invalid email format')).toBeOnTheScreen();
  });
});
```

### Testing Lists

```typescript
import { render, screen } from '@testing-library/react-native';
import { UserList } from '@/components/UserList';

const mockUsers = [
  { id: '1', name: 'John', email: 'john@example.com' },
  { id: '2', name: 'Jane', email: 'jane@example.com' },
];

describe('UserList', () => {
  it('renders all users', () => {
    render(<UserList users={mockUsers} />);

    expect(screen.getByText('John')).toBeOnTheScreen();
    expect(screen.getByText('Jane')).toBeOnTheScreen();
  });

  it('renders empty state when no users', () => {
    render(<UserList users={[]} />);

    expect(screen.getByText('No users found')).toBeOnTheScreen();
  });

  it('calls onUserPress when user is pressed', () => {
    const onUserPressMock = jest.fn();
    render(<UserList users={mockUsers} onUserPress={onUserPressMock} />);

    fireEvent.press(screen.getByText('John'));

    expect(onUserPressMock).toHaveBeenCalledWith(mockUsers[0]);
  });
});
```

## Testing Hooks

### Custom Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('resets count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

### Testing Async Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { useUserProfile } from '@/hooks/useUserProfile';

// Mock the API
jest.mock('@/services/api', () => ({
  fetchUserProfile: jest.fn(),
}));

import { fetchUserProfile } from '@/services/api';

describe('useUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches user profile successfully', async () => {
    const mockProfile = { id: '1', name: 'John', email: 'john@example.com' };
    (fetchUserProfile as jest.Mock).mockResolvedValue(mockProfile);

    const { result } = renderHook(() => useUserProfile('1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    const mockError = new Error('Network error');
    (fetchUserProfile as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useUserProfile('1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.profile).toBeNull();
    expect(result.current.error).toEqual(mockError);
  });
});
```

## Mocking

### Mocking React Navigation

```typescript
// __mocks__/@react-navigation/native.ts
export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
});

export const useRoute = () => ({
  params: {},
});

export const NavigationContainer = ({ children }: any) => children;
```

**Test usage:**
```typescript
import { useNavigation } from '@react-navigation/native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '@/screens/HomeScreen';

jest.mock('@react-navigation/native');

describe('HomeScreen', () => {
  it('navigates to details on button press', () => {
    const navigateMock = jest.fn();
    (useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateMock,
    });

    render(<HomeScreen />);

    fireEvent.press(screen.getByText('View Details'));

    expect(navigateMock).toHaveBeenCalledWith('Details', { id: '123' });
  });
});
```

### Mocking Supabase

```typescript
// __mocks__/@/services/supabase.ts
export const supabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
  auth: {
    signIn: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
  },
};
```

**Test usage:**
```typescript
import { supabase } from '@/services/supabase';

jest.mock('@/services/supabase');

describe('UserService', () => {
  it('fetches user by id', async () => {
    const mockUser = { id: '1', name: 'John' };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
    });

    const user = await getUserById('1');

    expect(user).toEqual(mockUser);
    expect(supabase.from).toHaveBeenCalledWith('profiles');
  });
});
```

### Mocking Native Modules

```typescript
// Mock native module
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock specific native module
jest.mock('@/modules/MyNativeModule', () => ({
  multiply: jest.fn((a, b) => Promise.resolve(a * b)),
  EXAMPLE_CONSTANT: 'mocked_value',
}));
```

### Mocking AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

beforeEach(() => {
  AsyncStorage.clear();
});

it('stores user preferences', async () => {
  await AsyncStorage.setItem('theme', 'dark');

  const theme = await AsyncStorage.getItem('theme');
  expect(theme).toBe('dark');
});
```

## Snapshot Testing

### Creating Snapshots

```typescript
import { render } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button snapshots', () => {
  it('matches snapshot for primary variant', () => {
    const { toJSON } = render(
      <Button title="Click Me" onPress={jest.fn()} variant="primary" />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('matches snapshot for disabled state', () => {
    const { toJSON } = render(
      <Button title="Click Me" onPress={jest.fn()} disabled />
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
```

### Updating Snapshots

```bash
# Update all snapshots
npm test -- -u

# Update snapshots for specific file
npm test Button.test.tsx -- -u
```

## Test Organization

### File Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── __tests__/
│   │       ├── Button.test.tsx
│   │       └── __snapshots__/
│   │           └── Button.test.tsx.snap
│   └── Input/
│       ├── Input.tsx
│       └── __tests__/
│           └── Input.test.tsx
├── hooks/
│   ├── useCounter.ts
│   └── __tests__/
│       └── useCounter.test.ts
└── utils/
    ├── formatters.ts
    └── __tests__/
        └── formatters.test.ts
```

### Test Naming Conventions

```typescript
// ✅ Good: Descriptive test names
describe('Button', () => {
  it('renders with title', () => { ... });
  it('calls onPress when pressed', () => { ... });
  it('is disabled when disabled prop is true', () => { ... });
});

// ❌ Bad: Vague test names
describe('Button', () => {
  it('works', () => { ... });
  it('test 1', () => { ... });
});
```

## Testing Patterns

### Arrange-Act-Assert (AAA)

```typescript
it('increments count when button is pressed', () => {
  // Arrange
  render(<Counter initialCount={0} />);
  const button = screen.getByText('Increment');

  // Act
  fireEvent.press(button);

  // Assert
  expect(screen.getByText('Count: 1')).toBeOnTheScreen();
});
```

### Test Data Builders

```typescript
// test-utils/builders.ts
export const buildUser = (overrides?: Partial<User>): User => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  ...overrides,
});

// Usage
const user = buildUser({ name: 'Jane' });
```

### Custom Render Function

```typescript
// test-utils/render.tsx
import { render as rtlRender } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(
    <NavigationContainer>
      {ui}
    </NavigationContainer>,
    options
  );
}

export * from '@testing-library/react-native';
export { render };
```

## Coverage Analysis

### View Coverage Report

```bash
npm run test:coverage
```

### Coverage Output

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.23 |    78.45 |   82.11 |   85.67 |
 components/        |   92.15 |    85.32 |   90.45 |   92.34 |
  Button.tsx        |   95.12 |    88.23 |   94.56 |   95.43 |
  Input.tsx         |   89.34 |    82.45 |   86.78 |   89.67 |
 hooks/             |   78.56 |    71.23 |   74.89 |   79.12 |
  useCounter.ts     |   82.34 |    75.67 |   79.45 |   83.12 |
--------------------|---------|----------|---------|---------|
```

### Improving Coverage

Focus on:
1. **Branches**: Test all conditional paths (if/else, switch)
2. **Functions**: Test all exported functions
3. **Lines**: Ensure all code lines are executed
4. **Statements**: Cover all JavaScript statements

## Common Testing Scenarios

### Testing Forms

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginForm } from '@/components/LoginForm';

describe('LoginForm', () => {
  it('validates email format', async () => {
    const onSubmitMock = jest.fn();
    render(<LoginForm onSubmit={onSubmitMock} />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'invalid-email');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeOnTheScreen();
    });

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('submits valid form', async () => {
    const onSubmitMock = jest.fn();
    render(<LoginForm onSubmit={onSubmitMock} />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

### Testing Conditional Rendering

```typescript
it('renders loading state', () => {
  render(<UserProfile userId="1" loading />);

  expect(screen.getByTestId('loading-spinner')).toBeOnTheScreen();
  expect(screen.queryByTestId('user-info')).not.toBeOnTheScreen();
});

it('renders error state', () => {
  render(<UserProfile userId="1" error="Failed to load" />);

  expect(screen.getByText('Failed to load')).toBeOnTheScreen();
  expect(screen.queryByTestId('user-info')).not.toBeOnTheScreen();
});

it('renders user data', () => {
  const user = { name: 'John', email: 'john@example.com' };
  render(<UserProfile userId="1" user={user} />);

  expect(screen.getByText('John')).toBeOnTheScreen();
  expect(screen.getByText('john@example.com')).toBeOnTheScreen();
});
```

## Debugging Tests

### Focus on Specific Tests

```typescript
// Run only this test
it.only('should work', () => { ... });

// Skip this test
it.skip('should work', () => { ... });

// Run only this describe block
describe.only('Component', () => { ... });
```

### Debug Output

```typescript
import { screen, debug } from '@testing-library/react-native';

it('debugs component tree', () => {
  render(<MyComponent />);

  // Print component tree
  debug();

  // Print specific element
  debug(screen.getByText('Hello'));
});
```

## Best Practices

1. **Test User Behavior**: Test what users see and do, not implementation details
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Avoid Testing Implementation**: Don't test internal state or props directly
4. **Keep Tests Independent**: Each test should run in isolation
5. **Mock External Dependencies**: Mock APIs, navigation, native modules
6. **Use Descriptive Names**: Test names should clearly describe what's being tested
7. **Follow AAA Pattern**: Arrange, Act, Assert structure
8. **Test Edge Cases**: Empty states, error states, loading states
9. **Maintain High Coverage**: Aim for 70%+ coverage threshold
10. **Keep Tests Fast**: Unit tests should be fast (<1s each)

## Common Pitfalls

❌ **Don't test implementation details**
```typescript
// Bad
expect(component.state.count).toBe(5);

// Good
expect(screen.getByText('Count: 5')).toBeOnTheScreen();
```

❌ **Don't use delays**
```typescript
// Bad
await new Promise(resolve => setTimeout(resolve, 1000));

// Good
await waitFor(() => expect(screen.getByText('Done')).toBeOnTheScreen());
```

❌ **Don't test third-party libraries**
```typescript
// Bad: Testing React Navigation itself
expect(navigation.navigate).toBeDefined();

// Good: Testing your component's usage of navigation
expect(navigation.navigate).toHaveBeenCalledWith('Details');
```

## Related Skills

- `react-native-components`: Components to be tested
- `rn-integration-testing`: Integration testing patterns
- `github-actions-cicd`: Running tests in CI/CD

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: context7 ✅
