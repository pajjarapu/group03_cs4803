import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type PageProps = {
  children: ReactNode;
  scroll?: boolean;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra top padding under the status bar. */
  topPadding?: number;
  noHorizontalPadding?: boolean;
};

export function Page({
  children,
  scroll = false,
  footer,
  contentStyle,
  topPadding = 12,
  noHorizontalPadding = false,
}: PageProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const contentWidth: ViewStyle = {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  };

  const padding: ViewStyle = {
    paddingHorizontal: noHorizontalPadding ? 0 : 24,
    paddingTop: insets.top + topPadding,
    paddingBottom: 28,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[padding, contentWidth, contentStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, padding, contentWidth, contentStyle]}>{children}</View>
      )}

      {footer && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 16),
            borderTopWidth: 1,
            borderTopColor: colors.line,
            backgroundColor: colors.bg,
          }}>
          <View style={contentWidth}>{footer}</View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
