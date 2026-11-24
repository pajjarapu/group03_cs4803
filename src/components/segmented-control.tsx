import { Pressable, StyleSheet, View } from 'react-native';

import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type Option<T extends string> = { label: string; value: T };

type SegmentedControlProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'md' | 'sm';
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const height = size === 'md' ? 38 : 28;

  return (
    <View
      accessibilityRole="tablist"
      style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              { height },
              selected && {
                backgroundColor: colors.surface,
                borderColor: colors.line,
                borderWidth: 1,
              },
            ]}>
            <AppText
              numberOfLines={1}
              style={{
                fontFamily: selected ? Fonts.semibold : Fonts.regular,
                fontSize: size === 'md' ? 14 : 12,
                color: selected ? colors.fg : colors.sub,
              }}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 3,
  },
  option: {
    flex: 1,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
