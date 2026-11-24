import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function PrimaryButton({ label, onPress, disabled, icon, style, testID }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.primary,
        {
          backgroundColor: colors.primary,
          opacity: disabled ? 0.4 : pressed ? 0.82 : 1,
        },
        style,
      ]}>
      {icon}
      <AppText
        style={{ fontFamily: Fonts.semibold, fontSize: 16, color: colors.onPrimary }}
        variant="body">
        {label}
      </AppText>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, disabled, style }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.outline,
        {
          borderColor: colors.fg,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}>
      <AppText
        variant="body"
        style={{ fontFamily: Fonts.semibold, fontSize: 15, color: colors.fg }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function PillButton({ label, onPress, style }: ButtonProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
        style,
      ]}>
      <AppText
        variant="badge"
        style={{ fontFamily: Fonts.semibold, fontSize: 13, color: colors.onPrimary }}>
        {label}
      </AppText>
    </Pressable>
  );
}

type TextLinkProps = {
  label: string;
  onPress?: () => void;
  color?: string;
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function TextLink({ label, onPress, color, muted, style }: TextLinkProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, style]}>
      <AppText
        variant="label"
        style={{
          fontFamily: Fonts.semibold,
          color: color ?? (muted ? colors.sub : colors.fg),
        }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primary: {
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  outline: {
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  pill: {
    height: 30,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
