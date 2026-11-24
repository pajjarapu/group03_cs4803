import { Text, type TextProps, type TextStyle } from 'react-native';

import { Fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

const VARIANTS = {
  display: { fontFamily: Fonts.bold, fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  title: { fontFamily: Fonts.bold, fontSize: 26, lineHeight: 32, letterSpacing: -0.4 },
  heading: { fontFamily: Fonts.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.3 },
  subheading: { fontFamily: Fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.2 },
  section: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24 },
  cardTitle: { fontFamily: Fonts.semibold, fontSize: 15, lineHeight: 20 },
  item: { fontFamily: Fonts.medium, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22 },
  sub: { fontFamily: Fonts.regular, fontSize: 14, lineHeight: 20 },
  meta: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 16 },
  label: { fontFamily: Fonts.medium, fontSize: 13, lineHeight: 18 },
  badge: { fontFamily: Fonts.semibold, fontSize: 11, lineHeight: 14 },
  eyebrow: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof VARIANTS;

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof Fonts;
  align?: TextStyle['textAlign'];
};

export function AppText({
  variant = 'body',
  color,
  weight,
  align,
  style,
  ...props
}: AppTextProps) {
  const { colors } = useTheme();

  return (
    <Text
      {...props}
      style={[
        VARIANTS[variant],
        { color: color ?? colors.fg },
        weight ? { fontFamily: Fonts[weight] } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
    />
  );
}
