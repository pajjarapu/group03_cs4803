import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';

import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { useAnimatedValue } from '@/lib/use-animated-value';

import { AppText } from './app-text';
import { PrimaryButton, TextLink } from './button';
import { Confetti } from './confetti';

export function AchievementModal() {
  const { state, dismissCelebration } = useApp();
  const { colors } = useTheme();
  const router = useRouter();
  const celebration = state.celebration;

  const scale = useAnimatedValue(0.88);
  const opacity = useAnimatedValue(0);

  useEffect(() => {
    if (!celebration) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 170,
        mass: 0.8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [celebration, opacity, scale]);

  if (!celebration) return null;

  const progress = Math.min(1, celebration.days / celebration.nextDays);

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={dismissCelebration}>
      <View style={[styles.scrim, { backgroundColor: colors.scrim }]}>
        <Confetti />

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.bg,
              opacity,
              transform: [{ scale }],
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
            onPress={dismissCelebration}
            style={[styles.close, { borderColor: colors.line }]}>
            <View style={[styles.closeLine, { backgroundColor: colors.sub, transform: [{ rotate: '45deg' }] }]} />
            <View style={[styles.closeLine, { backgroundColor: colors.sub, transform: [{ rotate: '-45deg' }] }]} />
          </Pressable>

          <View
            style={{
              width: 128,
              height: 128,
              borderRadius: 64,
              backgroundColor: colors.placeholder,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 8,
            }}>
            <View
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: colors.fg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <AppText
                style={{
                  fontFamily: Fonts.extrabold,
                  fontSize: 40,
                  lineHeight: 46,
                  color: colors.fg,
                }}>
                {celebration.days}
              </AppText>
            </View>
          </View>

          <AppText variant="eyebrow" color={colors.accent} style={{ marginTop: 24 }}>
            Achievement unlocked
          </AppText>
          <AppText variant="title" align="center" style={{ marginTop: 6 }}>
            {celebration.days}-Day Streak
          </AppText>
          <AppText variant="sub" color={colors.sub} align="center" style={{ marginTop: 6 }}>
            You cooked {celebration.days} days in a row.
          </AppText>
          <AppText variant="sub" color={colors.sub} align="center">
            Next: {celebration.nextDays}-Day Streak
          </AppText>

          <View
            style={{
              alignSelf: 'stretch',
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.placeholder,
              marginTop: 22,
              overflow: 'hidden',
            }}>
            <View
              style={{
                width: `${progress * 100}%`,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.fg,
              }}
            />
          </View>
          <AppText variant="small" color={colors.sub} align="center" style={{ marginTop: 10 }}>
            {celebration.days} / {celebration.nextDays} days
          </AppText>

          <View style={{ alignSelf: 'stretch', marginTop: 22 }}>
            <PrimaryButton label="View Progress" onPress={dismissCelebration} />
            <TextLink
              label="Back to Home"
              onPress={() => {
                dismissCelebration();
                router.navigate('/home');
              }}
              style={styles.homeLink}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 326,
    borderRadius: Radius.sheet,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLine: {
    position: 'absolute',
    width: 14,
    height: 1.8,
    borderRadius: 1,
  },
  homeLink: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
});
