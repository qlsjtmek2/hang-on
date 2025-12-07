import React, { useState, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Platform,
} from 'react-native';

import { theme } from '@/theme';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  showCounter?: boolean;
  maxLength?: number;
  /** 입력창 스타일 변형: outlined (테두리) | filled (배경색) */
  variant?: 'outlined' | 'filled';
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      helperText,
      showCounter = false,
      maxLength,
      variant = 'outlined',
      value = '',
      onChangeText,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      helperStyle,
      editable = true,
      ...textInputProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value);

    // Use internal value if value prop is not provided
    const displayValue = value !== undefined ? value : internalValue;
    const charCount = String(displayValue).length;

    const handleChangeText = (text: string) => {
      if (value === undefined) {
        setInternalValue(text);
      }
      onChangeText?.(text);
    };

    const inputContainerStyle = [
      styles.inputContainer,
      variant === 'filled' && styles.inputContainer_filled,
      isFocused && (variant === 'filled' ? styles.inputContainer_filled_focused : styles.inputContainer_focused),
      error && styles.inputContainer_error,
      !editable && styles.inputContainer_disabled,
    ];

    const textInputStyle = [styles.input, !editable && styles.input_disabled, inputStyle];

    return (
      <View style={[styles.container, containerStyle]}>
        {/* Label */}
        {label && (
          <Text style={[styles.label, error && styles.label_error, labelStyle]}>{label}</Text>
        )}

        {/* Input Container */}
        <View style={inputContainerStyle}>
          <TextInput
            ref={ref}
            style={textInputStyle}
            value={displayValue}
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={theme.colors.neutral.gray400}
            maxLength={maxLength}
            editable={editable}
            accessible={true}
            accessibilityLabel={label}
            accessibilityHint={helperText}
            accessibilityState={{
              disabled: !editable,
            }}
            {...textInputProps}
          />
        </View>

        {/* Helper Row */}
        <View style={styles.helperRow}>
          {/* Error or Helper Text */}
          <View style={styles.helperTextContainer}>
            {error ? (
              <Text style={[styles.error, errorStyle]}>{error}</Text>
            ) : helperText ? (
              <Text style={[styles.helperText, helperStyle]}>{helperText}</Text>
            ) : null}
          </View>

          {/* Character Counter */}
          {showCounter && maxLength && (
            <Text style={[styles.counter, charCount > maxLength && styles.counter_error]}>
              {charCount}/{maxLength}
            </Text>
          )}
        </View>
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },

  label: {
    ...theme.typography.body,
    fontWeight: '500',
    color: theme.colors.neutral.gray900,
    marginBottom: theme.spacing.xs,
  },
  label_error: {
    color: theme.colors.semantic.error,
  },

  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray300,
    borderRadius: 12,
    backgroundColor: theme.colors.neutral.white,
    paddingHorizontal: theme.spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  inputContainer_filled: {
    borderWidth: 0,
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 56,
  },
  inputContainer_focused: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  inputContainer_filled_focused: {
    backgroundColor: '#EEEEF0',
  },
  inputContainer_error: {
    borderColor: theme.colors.semantic.error,
    borderWidth: 1,
  },
  inputContainer_disabled: {
    backgroundColor: theme.colors.neutral.gray100,
    borderColor: theme.colors.neutral.gray200,
  },

  input: {
    ...theme.typography.body,
    color: theme.colors.neutral.gray900,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.sm : theme.spacing.xs,
    margin: 0,
    padding: 0,
    textAlignVertical: 'center',
  },
  input_disabled: {
    color: theme.colors.neutral.gray400,
  },

  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: theme.spacing.xs,
    minHeight: 20,
  },

  helperTextContainer: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },

  error: {
    ...theme.typography.caption,
    color: theme.colors.semantic.error,
  },

  helperText: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray600,
  },

  counter: {
    ...theme.typography.caption,
    color: theme.colors.neutral.gray600,
  },
  counter_error: {
    color: theme.colors.semantic.error,
  },
});

export default Input;
