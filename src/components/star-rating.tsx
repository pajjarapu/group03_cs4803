import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
};

export function StarRating({ value, onChange, size = 32 }: StarRatingProps) {
  const { colors } = useTheme();

  return (
    <View
      style={styles.row}
      accessibilityRole={onChange ? 'adjustable' : undefined}
      accessibilityLabel={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        if (!onChange) {
          return (
            <AppText
              key={star}
              style={{
                fontSize: size,
                lineHeight: size * 1.15,
                color: filled ? colors.fg : colors.line,
              }}>
              ★
            </AppText>
          );
        }
        return (
          <Pressable
            key={star}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
            hitSlop={4}
            onPress={() => onChange(star)}>
            <AppText
              style={{
                fontSize: size,
                lineHeight: size * 1.15,
                color: filled ? colors.fg : colors.line,
              }}>
              ★
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
