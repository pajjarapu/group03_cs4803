import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

type IconCircleProps = {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  iconSize?: number;
  variant?: 'soft' | 'inverse' | 'surface';
  dashed?: boolean;
  color?: string;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function IconCircle({
  name,
  size = 36,
  iconSize = 18,
  variant = 'soft',
  dashed,
  color,
  onPress,
  accessibilityLabel,
}: IconCircleProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'inverse'
      ? colors.inverseSubtleBg
      : variant === 'surface'
        ? colors.surface
        : colors.placeholder;
  const iconColor =
    color ?? (variant === 'inverse' ? colors.inverseFg : variant === 'surface' ? colors.fg : colors.sub);

  const content = (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dashed ? 'transparent' : backgroundColor,
          borderWidth: dashed ? 1.5 : 0,
          borderColor: dashed ? colors.sub : undefined,
          borderStyle: dashed ? 'dashed' : undefined,
        },
      ]}>
      <Ionicons name={name} size={iconSize} color={iconColor} />
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
      {content}
    </Pressable>
  );
}

export function IconButton({
  name,
  onPress,
  size = 40,
  iconSize = 20,
  variant = 'surface',
  accessibilityLabel,
}: IconCircleProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: variant === 'surface' ? colors.surface : colors.surfaceAlt,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <Ionicons name={name} size={iconSize} color={colors.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
