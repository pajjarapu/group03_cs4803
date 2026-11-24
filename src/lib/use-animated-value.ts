import { useState } from 'react';
import { Animated } from 'react-native';

/**
 * Stable `Animated.Value` without touching a ref during render.
 * (`react-native-web` does not export RN's `useAnimatedValue`.)
 */
export function useAnimatedValue(initial: number): Animated.Value {
  const [value] = useState(() => new Animated.Value(initial));
  return value;
}
