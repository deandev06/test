// components/themed.tsx
import React from 'react';
import {
  Text as RNText,
  View as RNView,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  ScrollView as RNScrollView,
  TextStyle,
  ViewStyle,
  TextInputProps,
  TouchableOpacityProps,
  ScrollViewProps
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';

// Text component with theme
export function Text(props: React.ComponentProps<typeof RNText>) {
  const { theme } = useTheme();
  return (
    <RNText
      {...props}
      style={[
        { color: theme.text, fontFamily: 'Poppins-Regular' },
        props.style
      ]}
    />
  );
}

// Heading text variants
export function Heading(props: React.ComponentProps<typeof RNText> & { level?: 1 | 2 | 3 | 4 }) {
  const { theme } = useTheme();
  const { level = 1, ...restProps } = props;

  let fontSize: number;
  let fontFamily: string;

  switch (level) {
    case 1:
      fontSize = 24;
      fontFamily = 'Poppins-Bold';
      break;
    case 2:
      fontSize = 20;
      fontFamily = 'Poppins-SemiBold';
      break;
    case 3:
      fontSize = 18;
      fontFamily = 'Poppins-Medium';
      break;
    case 4:
      fontSize = 16;
      fontFamily = 'Poppins-Medium';
      break;
  }

  return (
    <RNText
      {...restProps}
      style={[
        { color: theme.text, fontSize, fontFamily },
        props.style
      ]}
    />
  );
}

// View component with theme
export function View(props: React.ComponentProps<typeof RNView>) {
  const { theme } = useTheme();
  return (
    <RNView
      {...props}
      style={[
        { backgroundColor: theme.background },
        props.style
      ]}
    />
  );
}

// Card component
export function Card(props: React.ComponentProps<typeof RNView>) {
  const { theme } = useTheme();
  return (
    <RNView
      {...props}
      style={[
        {
          backgroundColor: theme.card,
          borderRadius: 8,
          padding: 16,
          shadowColor: theme.text,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
        props.style
      ]}
    />
  );
}

// TextInput component with theme
export function TextInput(props: TextInputProps) {
  const { theme } = useTheme();
  return (
    <RNTextInput
      placeholderTextColor={theme.secondaryText}
      {...props}
      style={[
        {
          backgroundColor: theme.inputBackground,
          color: theme.text,
          borderRadius: 8,
          padding: 12,
          fontFamily: 'Poppins-Regular',
        },
        props.style
      ]}
    />
  );
}

// Button component with theme
export function Button(props: TouchableOpacityProps & {
  variant?: 'primary' | 'secondary' | 'outline',
  title: string
}) {
  const { theme } = useTheme();
  const { variant = 'primary', title, ...restProps } = props;

  let buttonStyle: ViewStyle;
  let textStyle: TextStyle;

  switch (variant) {
    case 'primary':
      buttonStyle = {
        backgroundColor: theme.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
      };
      textStyle = {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
      };
      break;
    case 'secondary':
      buttonStyle = {
        backgroundColor: theme.secondary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
      };
      textStyle = {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
      };
      break;
    case 'outline':
      buttonStyle = {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.primary,
      };
      textStyle = {
        color: theme.primary,
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
      };
      break;
  }

  return (
    <RNTouchableOpacity
      {...restProps}
      style={[buttonStyle, props.style]}
    >
      <RNText style={textStyle}>{title}</RNText>
    </RNTouchableOpacity>
  );
}

// Themed ScrollView
export function ScrollView(props: ScrollViewProps) {
  const { theme } = useTheme();
  return (
    <RNScrollView
      {...props}
      style={[
        { backgroundColor: theme.background },
        props.style
      ]}
    />
  );
}