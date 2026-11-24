/**
 * Design tokens for the cooking app, derived from the MVP prototype.
 * Monochrome UI with a single terracotta accent; light and dark palettes.
 */

export const Fonts = {
  regular: 'Geist_400Regular',
  medium: 'Geist_500Medium',
  semibold: 'Geist_600SemiBold',
  bold: 'Geist_700Bold',
  extrabold: 'Geist_800ExtraBold',
  mono: 'GeistMono_400Regular',
  monoMedium: 'GeistMono_500Medium',
} as const;

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const Radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  sheet: 24,
  pill: 999,
} as const;

/** Keeps the phone-first layout readable on tablets and web. */
export const MaxContentWidth = 560;

export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  placeholder: string;
  placeholderLine: string;
  fg: string;
  sub: string;
  line: string;
  primary: string;
  onPrimary: string;
  inverseBg: string;
  inverseFg: string;
  inverseSub: string;
  inverseSubtleBg: string;
  accent: string;
  scrim: string;
  toastBg: string;
  toastFg: string;
  toastAction: string;
};

export const Colors: Record<'light' | 'dark', Palette> = {
  light: {
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F2',
    placeholder: '#E2E2E2',
    placeholderLine: '#C8C8C8',
    fg: '#1A1A1A',
    sub: '#6B6B6B',
    line: '#D4D4D4',
    primary: '#2B2B2B',
    onPrimary: '#FFFFFF',
    inverseBg: '#2B2B2B',
    inverseFg: '#FFFFFF',
    inverseSub: '#CFCFCF',
    inverseSubtleBg: '#4A4A4A',
    accent: '#B4461E',
    scrim: 'rgba(0, 0, 0, 0.45)',
    toastBg: '#1C1C1A',
    toastFg: '#FFFFFF',
    toastAction: '#F2A27C',
  },
  dark: {
    bg: '#141413',
    surface: '#1E1E1C',
    surfaceAlt: '#262624',
    placeholder: '#2E2E2B',
    placeholderLine: '#3E3D39',
    fg: '#EDECE8',
    sub: '#A3A29B',
    line: '#34332F',
    primary: '#EDECE8',
    onPrimary: '#141413',
    inverseBg: '#EDECE8',
    inverseFg: '#141413',
    inverseSub: '#55544F',
    inverseSubtleBg: '#D3D2CC',
    accent: '#E07A4C',
    scrim: 'rgba(0, 0, 0, 0.62)',
    toastBg: '#EDECE8',
    toastFg: '#141413',
    toastAction: '#A8501F',
  },
};
