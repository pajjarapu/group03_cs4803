import { Pressable, StyleSheet, View } from 'react-native';

import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.bg,
          borderColor: selected ? colors.primary : colors.line,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <AppText
        style={{
          fontFamily: Fonts.medium,
          fontSize: 13,
          color: selected ? colors.onPrimary : colors.fg,
        }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
