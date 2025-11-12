---
name: react-native-dev
description: React Native CLI development guide including project setup, native module integration, navigation, state management, and architecture. Use for react native apps, native modules, linking native code, Swift/Kotlin integration, react navigation, project structure, mobile development, cross-platform apps, and reusing existing components/themes.
---

# React Native Development

## Purpose

Comprehensive guide for React Native CLI development covering project setup, native module integration, navigation, state management, and architecture patterns. Emphasizes reusing existing project resources (themes, typography, utilities) and following best practices.

## When to Use

Use this skill when:

- Setting up a new React Native CLI project
- Integrating native modules (Swift/Kotlin/Objective-C/Java)
- Configuring React Navigation
- Setting up state management
- Structuring React Native projects
- Working with native linking and bridging
- Reusing existing components, themes, or utilities
- Troubleshooting platform-specific issues

## MCP Integration

**context7**: Use for fetching latest React Native documentation

```
- React Native API documentation
- Platform-specific guides (iOS/Android)
- Native module documentation
- Third-party library documentation
```

## Project Structure

### Recommended Directory Layout

```
/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── services/         # API services, Supabase client
│   ├── store/            # State management (Context/Redux)
│   ├── theme/            # Centralized theme configuration
│   │   ├── colors.ts     # Color palette
│   │   ├── typography.ts # Font styles
│   │   ├── spacing.ts    # Spacing scale
│   │   └── index.ts      # Export all
│   ├── types/            # TypeScript types
│   └── App.tsx           # Root component
├── android/              # Android native code
├── ios/                  # iOS native code
├── __tests__/            # Test files
└── package.json
```

### Key Principles

1. **Centralize Theme Resources**: All colors, fonts, spacing in `src/theme/`
2. **Reusable Components**: Check existing components before creating new ones
3. **Type Safety**: Use TypeScript for all files
4. **Platform-Specific Code**: Use `.ios.tsx` / `.android.tsx` when needed

## Initial Setup

### Create New Project

```bash
# React Native CLI (NOT Expo)
npx react-native@latest init ProjectName --template react-native-template-typescript
cd ProjectName
```

### Essential Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# State Management (choose one)
npm install zustand  # Lightweight
# OR
npm install @reduxjs/toolkit react-redux  # Full-featured

# Supabase
npm install @supabase/supabase-js
npm install react-native-url-polyfill  # Required for Supabase

# Dev Dependencies
npm install --save-dev @types/react @types/react-native
```

### iOS Setup

```bash
cd ios
pod install
cd ..
```

## Theme System

### Centralized Theme (`src/theme/`)

**colors.ts**

```typescript
export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0051D5',
  primaryLight: '#4DA3FF',

  // Semantic colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5856D6',

  // Neutral colors
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  surface: '#FFFFFF',
  border: '#C6C6C8',

  // Text colors
  text: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',

  // Dark mode variants (optional)
  dark: {
    background: '#000000',
    backgroundSecondary: '#1C1C1E',
    surface: '#2C2C2E',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
  },
} as const;

export type ColorKey = keyof typeof colors;
```

**typography.ts**

```typescript
export const typography = {
  // Font families
  fontFamily: {
    regular: 'System', // Platform default
    medium: 'System',
    bold: 'System',
    // Add custom fonts here
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;
```

**spacing.ts**

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;
```

**index.ts**

```typescript
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
} as const;

export type Theme = typeof theme;
```

### Using Theme

```typescript
import { colors, typography, spacing } from '@/theme';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.sm,
  },
});
```

## Navigation Setup

### Basic Navigator Configuration

**src/navigation/RootNavigator.tsx**

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Import screens
import HomeScreen from '@/screens/HomeScreen';
import DetailsScreen from '@/screens/DetailsScreen';

// Define route params
export type RootStackParamList = {
  Home: undefined;
  Details: { id: string; title: string };
};

// Helper type for screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Using Navigation in Screens

```typescript
import { RootStackScreenProps } from '@/navigation/RootNavigator';

type Props = RootStackScreenProps<'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const handleNavigate = () => {
    navigation.navigate('Details', { id: '123', title: '상세 페이지' });
  };

  return (
    <View>
      <Button title="상세 보기" onPress={handleNavigate} />
    </View>
  );
}
```

## Native Module Integration

### When to Use Native Modules

- Accessing platform-specific APIs not available in React Native
- Integrating existing native libraries
- Performance-critical operations
- Platform-specific features (biometrics, NFC, etc.)

### Creating a Native Module (iOS - Swift)

**ios/YourApp/MyNativeModule.swift**

```swift
import Foundation

@objc(MyNativeModule)
class MyNativeModule: NSObject {

  @objc
  func constantsToExport() -> [String: Any]! {
    return ["EXAMPLE_CONSTANT": "value"]
  }

  @objc
  func multiply(_ a: Double, b: Double, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let result = a * b
    resolver(result)
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
```

**ios/YourApp/MyNativeModule.m (Bridge)**

```objc
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(MyNativeModule, NSObject)

RCT_EXTERN_METHOD(multiply:(double)a
                  b:(double)b
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end
```

### Creating a Native Module (Android - Kotlin)

**android/app/src/main/java/.../MyNativeModule.kt**

```kotlin
package com.yourapp

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class MyNativeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "MyNativeModule"

    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("EXAMPLE_CONSTANT" to "value")
    }

    @ReactMethod
    fun multiply(a: Double, b: Double, promise: Promise) {
        try {
            val result = a * b
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", e.message, e)
        }
    }
}
```

**android/app/src/main/java/.../MyNativePackage.kt**

```kotlin
package com.yourapp

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class MyNativePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext):
        List<NativeModule> {
        return listOf(MyNativeModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext):
        List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

**Register in MainApplication.kt**

```kotlin
override fun getPackages(): List<ReactPackage> {
    return PackageList(this).packages.apply {
        add(MyNativePackage())
    }
}
```

### Using Native Module in React Native

**src/modules/MyNativeModule.ts**

```typescript
import { NativeModules } from 'react-native';

interface MyNativeModuleInterface {
  EXAMPLE_CONSTANT: string;
  multiply(a: number, b: number): Promise<number>;
}

const { MyNativeModule } = NativeModules;

export default MyNativeModule as MyNativeModuleInterface;
```

**Usage**

```typescript
import MyNativeModule from '@/modules/MyNativeModule';

const result = await MyNativeModule.multiply(5, 10);
console.log(result); // 50
console.log(MyNativeModule.EXAMPLE_CONSTANT); // "value"
```

## State Management

### Option 1: Context API (Simple Apps)

**src/store/AppContext.tsx**

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AppContextType extends AppState {
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

### Option 2: Zustand (Recommended)

**src/store/useAuthStore.ts**

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isAuthenticated: false,
  setUser: user => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

**Usage**

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function ProfileScreen() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <View>
      <Text>{user?.name}</Text>
      <Button title="로그아웃" onPress={logout} />
    </View>
  );
}
```

## Reusing Existing Resources

### Before Creating New Components

**Always check existing resources first:**

1. **Components**: Look in `src/components/` for reusable UI components
2. **Hooks**: Check `src/hooks/` for custom hooks
3. **Utils**: Review `src/utils/` for utility functions
4. **Theme**: Use `src/theme/` for colors, typography, spacing
5. **Types**: Check `src/types/` for existing TypeScript types

### Example: Using Existing Button Component

```typescript
// ❌ DON'T create a new button component
const MyButton = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

// ✅ DO use existing component
import { Button } from '@/components/Button';
import { colors } from '@/theme';

<Button
  title="클릭"
  onPress={handlePress}
  variant="primary"
  // Existing component already has theme integration
/>;
```

## Common Patterns

### Safe Area Handling

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Screen() {
  return <SafeAreaView style={styles.container}>{/* Content */}</SafeAreaView>;
}
```

### Platform-Specific Code

```typescript
import { Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.select({
      ios: 16,
      android: 12,
    }),
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1 },
      android: { elevation: 2 },
    }),
  },
});
```

### Absolute Imports

**tsconfig.json**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**babel.config.js**

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
```

## Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache
npx react-native start --reset-cache

# Clean build (iOS)
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..

# Clean build (Android)
cd android && ./gradlew clean && cd ..
```

### Native Module Not Found

1. **iOS**: Rebuild after adding native module

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

2. **Android**: Clean and rebuild

```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### Type Errors with Navigation

Ensure you're using the correct type helpers:

```typescript
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ScreenName'>;
```

## Best Practices

1. **Use TypeScript**: Type all props, state, and API responses
2. **Centralize Theme**: Never hardcode colors or fonts
3. **Reuse Components**: Check existing components first
4. **Test on Both Platforms**: iOS and Android may behave differently
5. **Handle Errors Gracefully**: Use try-catch for async operations
6. **Optimize Performance**: Use React.memo, useMemo, useCallback
7. **Follow Naming Conventions**: PascalCase for components, camelCase for functions
8. **Document Native Modules**: Add JSDoc comments for clarity

## Related Files

- Navigation types: `src/navigation/RootNavigator.tsx`
- Theme configuration: `src/theme/`
- Custom hooks: `src/hooks/`
- Utility functions: `src/utils/`
- Service layer: `src/services/`

---

**Skill Status**: COMPLETE ✅
**Line Count**: < 500 ✅
**MCP Integration**: context7 ✅
