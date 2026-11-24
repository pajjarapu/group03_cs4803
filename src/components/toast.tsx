import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { useAnimatedValue } from '@/lib/use-animated-value';

import { AppText } from './app-text';

type ToastOptions = {
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
};

type ToastData = ToastOptions & { message: string; id: number };

const ToastContext = createContext<{ showToast: (message: string, options?: ToastOptions) => void } | null>(
  null,
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastData | null>(null);
  const progress = useAnimatedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const hide = useCallback(() => {
    clearTimer();
    Animated.timing(progress, {
      toValue: 0,
      duration: 160,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [progress]);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      clearTimer();
      setToast({ message, id: Date.now(), ...options });
      Animated.timing(progress, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      timer.current = setTimeout(hide, options?.duration ?? (options?.onAction ? 4000 : 2200));
    },
    [hide, progress],
  );

  useEffect(() => clearTimer, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <View style={styles.fill}>
        {children}
        {toast && (
          <Animated.View
            pointerEvents="box-none"
            style={[
              styles.host,
              {
                bottom: insets.bottom + 96,
                opacity: progress,
                transform: [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [12, 0],
                    }),
                  },
                ],
              },
            ]}>
            <View
              accessibilityRole="alert"
              style={[styles.toast, { backgroundColor: colors.toastBg }]}>
              <AppText
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  lineHeight: 17,
                  color: colors.toastFg,
                  flexShrink: 1,
                }}>
                {toast.message}
              </AppText>
              {toast.actionLabel && toast.onAction && (
                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => {
                    toast.onAction?.();
                    hide();
                  }}>
                  <AppText
                    style={{
                      fontFamily: Fonts.semibold,
                      fontSize: 13,
                      color: colors.toastAction,
                    }}>
                    {toast.actionLabel}
                  </AppText>
                </Pressable>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a ToastProvider');
  return context;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  host: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  toast: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});
