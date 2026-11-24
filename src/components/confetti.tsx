import { useEffect, useState } from 'react';
import { Animated, Easing, useWindowDimensions, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';
import { useAnimatedValue } from '@/lib/use-animated-value';

type Piece = {
  left: number;
  drift: number;
  rotate: number;
  delay: number;
  color: string;
};

/** Lightweight falling-confetti effect for the achievement modal. */
export function Confetti({ count = 44 }: { count?: number }) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const progress = useAnimatedValue(0);

  const [pieces] = useState<Piece[]>(() => {
    const palette = [colors.fg, colors.accent, colors.sub, colors.line, colors.placeholderLine];
    return Array.from({ length: count }, (_, index) => ({
      left: Math.random() * width,
      drift: Math.random() * 120 - 60,
      rotate: Math.random() * 1080 - 540,
      delay: Math.random() * 400,
      color: palette[index % palette.length],
    }));
  });

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 2600,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
      {pieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: -16,
            left: piece.left,
            width: 7,
            height: 11,
            borderRadius: 1,
            backgroundColor: piece.color,
            opacity: progress.interpolate({
              inputRange: [0, 0.8, 1],
              outputRange: [1, 1, 0],
            }),
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-16, height * 0.95],
                }),
              },
              {
                translateX: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, piece.drift],
                }),
              },
              {
                rotate: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', `${piece.rotate}deg`],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}
