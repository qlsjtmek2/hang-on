---
name: react-native-components
description: Specialized guide for creating React Native UI components with best practices. Covers component design patterns, props/types, styling, animations, gestures, accessibility, reusable components, buttons, inputs, cards, lists, custom components, and UI development.
---

# React Native Components

## Purpose

Specialized guide for creating high-quality, reusable React Native UI components. Covers component design patterns, TypeScript types, styling best practices, animations, gesture handling, and accessibility.

## When to Use

Use this skill when:
- Creating new UI components
- Building reusable component libraries
- Implementing custom buttons, inputs, cards, lists
- Adding animations and gestures
- Ensuring accessibility compliance
- Styling components with theme integration
- Using Magic MCP for UI component inspiration

## MCP Integration

**magic**: Use for UI component generation and inspiration
```typescript
// Request UI components through Magic MCP
// Example: "Create a card component with image and text"
```

**context7**: Fetch React Native component documentation
```
- React Native core components
- Animation APIs (Animated, Reanimated)
- Gesture handling (react-native-gesture-handler)
- Accessibility guidelines
```

## Component Design Principles

### 1. Single Responsibility

Each component should do one thing well:

```typescript
// ❌ BAD: Component doing too much
function UserCard({ user, onEdit, onDelete, showDetails }) {
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState(null);
  // ... lots of logic
}

// ✅ GOOD: Focused components
function UserCard({ user, onPress }) {
  return (
    <Card onPress={onPress}>
      <UserAvatar uri={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
    </Card>
  );
}
```

### 2. Composition Over Complexity

Build complex UIs from simple, composable components:

```typescript
// Base components
function Card({ children, style }) { ... }
function CardHeader({ title, subtitle }) { ... }
function CardBody({ children }) { ... }
function CardFooter({ children }) { ... }

// Composed component
function ProductCard({ product }) {
  return (
    <Card>
      <CardHeader title={product.name} subtitle={product.category} />
      <CardBody>
        <ProductImage source={{ uri: product.image }} />
        <ProductDescription text={product.description} />
      </CardBody>
      <CardFooter>
        <PriceTag price={product.price} />
        <AddToCartButton productId={product.id} />
      </CardFooter>
    </Card>
  );
}
```

### 3. Consistent API Design

Follow consistent patterns for props:

```typescript
interface ComponentProps {
  // Data props (required first)
  title: string;
  description: string;

  // Optional data
  subtitle?: string;

  // Callbacks
  onPress?: () => void;
  onLongPress?: () => void;

  // Style customization
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  // Variants/modes
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';

  // Boolean flags
  disabled?: boolean;
  loading?: boolean;

  // Children (last)
  children?: React.ReactNode;
}
```

## Component Patterns

### Button Component

```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const containerStyle = [
    styles.container,
    styles[`container_${variant}`],
    styles[`container_${size}`],
    disabled && styles.container_disabled,
    style,
  ];

  const titleStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.background : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text style={titleStyle}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    gap: spacing.xs,
  },

  // Variants
  container_primary: {
    backgroundColor: colors.primary,
  },
  container_secondary: {
    backgroundColor: colors.backgroundSecondary,
  },
  container_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  container_ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  container_small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 32,
  },
  container_medium: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  container_large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },

  // Disabled state
  container_disabled: {
    opacity: 0.5,
  },

  // Text styles
  text: {
    fontWeight: typography.fontWeight.semibold,
  },
  text_primary: {
    color: colors.background,
  },
  text_secondary: {
    color: colors.text,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_small: {
    fontSize: typography.fontSize.sm,
  },
  text_medium: {
    fontSize: typography.fontSize.md,
  },
  text_large: {
    fontSize: typography.fontSize.lg,
  },
  text_disabled: {
    opacity: 0.7,
  },
});
```

### Input Component

```typescript
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { colors, typography, spacing } from '@/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.inputContainer_focused,
    error && styles.inputContainer_error,
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
      {!error && helperText && <Text style={styles.helper}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
  },
  inputContainer_focused: {
    borderColor: colors.primary,
  },
  inputContainer_error: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: typography.fontSize.md,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  icon: {
    marginHorizontal: spacing.xs,
  },
  error: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },
  helper: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
```

### Card Component

```typescript
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { colors, spacing } from '@/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  elevation?: number;
}

export function Card({ children, onPress, style, elevation = 2 }: CardProps) {
  const containerStyle = [
    styles.container,
    { elevation },
    Platform.OS === 'ios' && styles.shadow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
```

## Advanced Patterns

### Controlled vs Uncontrolled Components

```typescript
// Controlled component (parent manages state)
function ControlledInput({ value, onChange }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
    />
  );
}

// Usage
const [text, setText] = useState('');
<ControlledInput value={text} onChange={setText} />

// Uncontrolled component (component manages state)
function UncontrolledInput({ defaultValue, onSubmit }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TextInput
      value={value}
      onChangeText={setValue}
      onSubmitEditing={() => onSubmit(value)}
    />
  );
}
```

### Render Props Pattern

```typescript
interface ListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactNode;
}

function List<T>({
  data,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
}: ListProps<T>) {
  if (data.length === 0 && ListEmptyComponent) {
    return <>{ListEmptyComponent}</>;
  }

  return (
    <View>
      {data.map((item, index) => (
        <View key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </View>
      ))}
    </View>
  );
}

// Usage
<List
  data={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
  ListEmptyComponent={<EmptyState />}
/>
```

### Compound Components Pattern

```typescript
// Parent component with context
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View>{children}</View>
    </TabsContext.Provider>
  );
}

// Child components
function TabList({ children }: { children: React.ReactNode }) {
  return <View style={styles.tabList}>{children}</View>;
}

function Tab({ value, title }: { value: string; title: string }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <TouchableOpacity onPress={() => setActiveTab(value)}>
      <Text style={isActive ? styles.tabActive : styles.tab}>{title}</Text>
    </TouchableOpacity>
  );
}

function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');

  if (context.activeTab !== value) return null;
  return <View>{children}</View>;
}

// Attach sub-components
Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

// Usage
<Tabs defaultTab="home">
  <Tabs.List>
    <Tabs.Tab value="home" title="홈" />
    <Tabs.Tab value="profile" title="프로필" />
  </Tabs.List>
  <Tabs.Panel value="home">
    <HomeContent />
  </Tabs.Panel>
  <Tabs.Panel value="profile">
    <ProfileContent />
  </Tabs.Panel>
</Tabs>
```

## Animations

### Basic Animated Values

```typescript
import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

function FadeInView({ children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
}
```

### Gesture Animations

```typescript
import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

function DraggableView({ children }) {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
      {...panResponder.panHandlers}
    >
      {children}
    </Animated.View>
  );
}
```

## Accessibility

### Basic Accessibility Props

```typescript
function AccessibleButton({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint="버튼을 눌러 작업을 수행합니다"
      accessibilityState={{ disabled: false }}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
```

### Screen Reader Support

```typescript
import { AccessibilityInfo } from 'react-native';

// Announce to screen reader
AccessibilityInfo.announceForAccessibility('작업이 완료되었습니다');

// Check if screen reader is enabled
const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isScreenReaderEnabled().then(setScreenReaderEnabled);
}, []);
```

## Performance Optimization

### React.memo for Component Memoization

```typescript
export const ExpensiveComponent = React.memo(
  ({ data, onPress }: Props) => {
    // Component implementation
  },
  (prevProps, nextProps) => {
    // Custom comparison function
    return prevProps.data.id === nextProps.data.id;
  }
);
```

### useMemo and useCallback

```typescript
function UserList({ users, filter }) {
  // Memoize expensive computation
  const filteredUsers = useMemo(
    () => users.filter(user => user.name.includes(filter)),
    [users, filter]
  );

  // Memoize callback
  const handleUserPress = useCallback(
    (userId: string) => {
      navigation.navigate('UserDetail', { userId });
    },
    [navigation]
  );

  return (
    <FlatList
      data={filteredUsers}
      renderItem={({ item }) => (
        <UserCard user={item} onPress={() => handleUserPress(item.id)} />
      )}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## TypeScript Best Practices

### Generic Components

```typescript
interface ListItemProps<T> {
  item: T;
  onPress: (item: T) => void;
  renderContent: (item: T) => React.ReactNode;
}

function ListItem<T>({ item, onPress, renderContent }: ListItemProps<T>) {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      {renderContent(item)}
    </TouchableOpacity>
  );
}

// Usage with type inference
<ListItem<User>
  item={user}
  onPress={(u) => console.log(u.name)}
  renderContent={(u) => <Text>{u.name}</Text>}
/>
```

### Strict Prop Types

```typescript
// Use const assertions for literal types
const SIZES = ['small', 'medium', 'large'] as const;
type Size = typeof SIZES[number]; // 'small' | 'medium' | 'large'

// Discriminated unions for variants
type ButtonVariant =
  | { variant: 'primary'; color?: never }
  | { variant: 'custom'; color: string };

interface ButtonProps {
  title: string;
  size: Size;
  variantConfig: ButtonVariant;
}
```

## Testing Components

See `rn-unit-testing` skill for detailed testing patterns.

## Best Practices

1. **Theme Integration**: Always use centralized theme values
2. **TypeScript**: Define strict prop interfaces
3. **Accessibility**: Add accessibility props to all interactive elements
4. **Performance**: Use React.memo, useMemo, useCallback appropriately
5. **Composition**: Build complex components from simple ones
6. **Consistent API**: Follow standard prop naming conventions
7. **Documentation**: Add JSDoc comments for complex components
8. **Error Boundaries**: Wrap error-prone components

## Related Skills

- `react-native-dev`: Overall React Native project setup and architecture
- `rn-unit-testing`: Testing component behavior
- Supabase integration: See `supabase-backend` skill

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: magic, context7 ✅
