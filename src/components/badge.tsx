import { StyleSheet, View } from 'react-native';

import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type BadgeVariant = 'solid' | 'soft' | 'accent';

export function Badge({ label, variant = 'soft' }: { label: string; variant?: BadgeVariant }) {
  const { colors } = useTheme();

  const style =
    variant === 'solid'
      ? { backgroundColor: colors.primary, borderColor: colors.primary }
      : variant === 'accent'
        ? { backgroundColor: colors.bg, borderColor: colors.accent }
        : { backgroundColor: colors.surfaceAlt, borderColor: colors.surfaceAlt };

  const textColor =
    variant === 'solid' ? colors.onPrimary : variant === 'accent' ? colors.accent : colors.fg;

  return (
    <View style={[styles.badge, style]}>
      <AppText numberOfLines={1} style={{ fontFamily: Fonts.semibold, fontSize: 11, color: textColor }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
