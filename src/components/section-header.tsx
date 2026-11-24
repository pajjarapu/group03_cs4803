import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

import { AppText } from './app-text';

type SectionHeaderProps = {
  title: string;
  right?: ReactNode;
  size?: 'section' | 'card';
};

export function SectionHeader({ title, right, size = 'card' }: SectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <AppText variant={size === 'section' ? 'section' : 'cardTitle'} style={{ color: colors.fg }}>
        {title}
      </AppText>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
