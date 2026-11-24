import { useColorScheme } from '@/hooks/use-color-scheme';

import { Colors, Fonts, Radius, Spacing } from './tokens';

export function useTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  return {
    scheme,
    colors: Colors[scheme],
    fonts: Fonts,
    radius: Radius,
    spacing: Spacing,
    isDark: scheme === 'dark',
  };
}

export type Theme = ReturnType<typeof useTheme>;
