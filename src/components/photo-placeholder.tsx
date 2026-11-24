import { useState, type ReactNode } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/use-theme';

type PhotoPlaceholderProps = {
  width?: number;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/**
 * Gray placeholder with a faint diagonal cross, matching the prototype's
 * "no photo yet" treatment for recipes and meals.
 */
export function PhotoPlaceholder({
  width,
  height,
  radius = 8,
  style,
  children,
}: PhotoPlaceholderProps) {
  const { colors } = useTheme();
  const [measured, setMeasured] = useState<{ width: number; height: number } | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: nextWidth, height: nextHeight } = event.nativeEvent.layout;
    setMeasured((prev) =>
      prev && prev.width === nextWidth && prev.height === nextHeight
        ? prev
        : { width: nextWidth, height: nextHeight },
    );
  };

  const boxWidth = width ?? measured?.width ?? 0;
  const boxHeight = height ?? measured?.height ?? 0;
  const diagonal = Math.hypot(boxWidth, boxHeight);
  const angle = Math.atan2(boxHeight, boxWidth);

  return (
    <View
      onLayout={onLayout}
      style={[
        { backgroundColor: colors.placeholder, borderRadius: radius, overflow: 'hidden' },
        width !== undefined ? { width } : null,
        height !== undefined ? { height } : null,
        style,
      ]}>
      {diagonal > 0 && (
        <>
          <View
            style={{
              position: 'absolute',
              width: diagonal,
              height: 1,
              backgroundColor: colors.placeholderLine,
              left: (boxWidth - diagonal) / 2,
              top: boxHeight / 2,
              transform: [{ rotate: `${angle}rad` }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: diagonal,
              height: 1,
              backgroundColor: colors.placeholderLine,
              left: (boxWidth - diagonal) / 2,
              top: boxHeight / 2,
              transform: [{ rotate: `${-angle}rad` }],
            }}
          />
        </>
      )}
      {children}
    </View>
  );
}
