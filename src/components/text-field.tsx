import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  right?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  error,
  icon,
  right,
  containerStyle,
  onFocus,
  onBlur,
  style,
  ...props
}: TextFieldProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const emphasized = error || focused;

  return (
    <View style={containerStyle}>
      {label && (
        <AppText
          variant="meta"
          style={{ fontFamily: Fonts.medium, color: colors.sub, marginBottom: 8 }}>
          {label}
        </AppText>
      )}
      <View
        style={{
          height: 50,
          borderRadius: Radius.md,
          borderWidth: emphasized ? 1.5 : 1,
          borderColor: error ? colors.accent : focused ? colors.fg : colors.line,
          backgroundColor: colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          gap: 10,
        }}>
        {icon && <Ionicons name={icon} size={18} color={colors.sub} />}
        <TextInput
          accessibilityLabel={label ?? props.placeholder}
          {...props}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          placeholderTextColor={colors.sub}
          selectionColor={colors.accent}
          cursorColor={colors.fg}
          style={[
            {
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: colors.fg,
              paddingVertical: 0,
            },
            style,
          ]}
        />
        {right}
      </View>
    </View>
  );
}
