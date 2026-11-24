import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RECIPES_BY_ID } from '@/data/recipes';
import { ingredientName } from '@/lib/pantry';
import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import type { PantryUpdate } from '@/types';

import { useAnimatedValue } from '@/lib/use-animated-value';

import { AppText } from './app-text';
import { PrimaryButton } from './button';
import { SegmentedControl } from './segmented-control';
import { StarRating } from './star-rating';
import { useToast } from './toast';

const DEDUCTION_OPTIONS: { label: string; value: PantryUpdate }[] = [
  { label: 'Used up', value: 'used' },
  { label: 'Low', value: 'low' },
  { label: 'Have', value: 'have' },
];

export function LogMealSheet() {
  const { state, closeLogMeal } = useApp();
  const recipeId = state.logSheetRecipeId;
  const recipe = recipeId ? RECIPES_BY_ID[recipeId] : undefined;

  if (!recipe) return null;

  return <LogMealContent key={recipe.id} recipeId={recipe.id} onClosed={closeLogMeal} />;
}

function LogMealContent({ recipeId, onClosed }: { recipeId: string; onClosed: () => void }) {
  const { state, logMeal } = useApp();
  const { showToast } = useToast();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const recipe = RECIPES_BY_ID[recipeId];

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [rating, setRating] = useState(4);

  const [updates, setUpdates] = useState<Record<string, PantryUpdate>>(() => {
    // Conservative defaults: only the main ingredient is assumed used up,
    // everything else drops to "running low" so the pantry is not emptied.
    const initial: Record<string, PantryUpdate> = {};
    recipe.ingredients.forEach((ingredient, index) => {
      const pantryItem = state.pantry.find((item) => item.id === ingredient.id);
      if (!pantryItem) return;
      initial[ingredient.id] =
        index === 0 && pantryItem.status === 'have' ? 'used' : 'low';
    });
    return initial;
  });

  const translateY = useAnimatedValue(height);
  const scrimOpacity = useAnimatedValue(0);
  const closing = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scrimOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scrimOpacity, translateY]);

  const dismiss = useCallback(
    (after?: () => void) => {
      if (closing.current) return;
      closing.current = true;
      Animated.parallel([
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: height,
          duration: 240,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) return;
        onClosed();
        after?.();
      });
    },
    [height, onClosed, scrimOpacity, translateY],
  );

  const pickPhoto = async () => {
    if (photoUri) {
      setPhotoUri(undefined);
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
        selectionLimit: 1,
      });
      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      showToast('Photo library is not available on this device');
    }
  };

  const submit = () => {
    dismiss(() => {
      logMeal({
        recipeId,
        updates: Object.entries(updates).map(([ingredientId, status]) => ({
          ingredientId,
          status,
        })),
        rating,
        photoUri,
      });
      router.navigate('/progress');
    });
  };

  const deductionRows = recipe.ingredients
    .map((ingredient) => ({
      ingredient,
      pantryItem: state.pantry.find((item) => item.id === ingredient.id),
    }))
    .filter((row) => row.pantryItem);

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={() => dismiss()}>
      <View style={styles.fill}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrim, opacity: scrimOpacity }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={StyleSheet.absoluteFill}
          onPress={() => dismiss()}
        />

        <Animated.View
          style={{
            maxHeight: '88%',
            backgroundColor: colors.bg,
            borderTopLeftRadius: Radius.sheet,
            borderTopRightRadius: Radius.sheet,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 12),
            paddingHorizontal: 24,
            transform: [{ translateY }],
          }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Dismiss sheet"
            onPress={() => dismiss()}
            style={styles.handleHit}>
            <View style={[styles.handle, { backgroundColor: colors.line }]} />
          </Pressable>

          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingBottom: 8 }}
            keyboardShouldPersistTaps="handled">
            <AppText variant="subheading">Nice work, chef!</AppText>
            <AppText variant="sub" color={colors.sub} style={{ marginTop: 4 }}>
              Review what you used from your pantry.
            </AppText>

            <AppText variant="item" weight="semibold" style={styles.sectionTitle}>
              Pantry update
            </AppText>

            <View style={{ gap: 0 }}>
              {deductionRows.map(({ ingredient, pantryItem }) => (
                <View key={ingredient.id} style={{ paddingVertical: 12 }}>
                  <View style={styles.deductionRow}>
                    <View style={{ flex: 1, gap: 2 }}>
                      <AppText variant="sub" style={{ fontFamily: Fonts.medium }}>
                        {ingredientName(ingredient)}
                      </AppText>
                      <AppText variant="small" color={colors.sub}>
                        Used: {ingredient.amount}
                        {pantryItem?.status === 'low' ? ' · running low' : ''}
                      </AppText>
                    </View>
                    <View style={{ width: 186 }}>
                      <SegmentedControl
                        size="sm"
                        options={DEDUCTION_OPTIONS}
                        value={updates[ingredient.id] ?? 'have'}
                        onChange={(value) =>
                          setUpdates((prev) => ({ ...prev, [ingredient.id]: value }))
                        }
                      />
                    </View>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.line }]} />
                </View>
              ))}
              {deductionRows.length === 0 && (
                <AppText variant="meta" color={colors.sub}>
                  Nothing in this recipe comes out of your pantry.
                </AppText>
              )}
            </View>

            <View style={styles.feedbackRow}>
              <AppText variant="item" weight="semibold">
                How did it go?
              </AppText>
              <AppText variant="meta" color={colors.sub}>
                (optional)
              </AppText>
            </View>

            <View style={{ marginTop: 8, marginBottom: 16 }}>
              <StarRating value={rating} onChange={setRating} />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={photoUri ? 'Remove photo' : 'Add a photo of your dish'}
              onPress={pickPhoto}
              style={[
                styles.dropzone,
                {
                  backgroundColor: colors.surfaceAlt,
                  borderColor: photoUri ? colors.fg : colors.sub,
                  borderStyle: photoUri ? 'solid' : 'dashed',
                },
              ]}>
              {photoUri ? (
                <>
                  <Image
                    source={{ uri: photoUri }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />
                  <AppText
                    variant="label"
                    style={{ color: '#FFFFFF', fontFamily: Fonts.medium }}>
                    Photo added · tap to remove
                  </AppText>
                </>
              ) : (
                <>
                  <View
                    style={{
                      width: 28,
                      height: 22,
                      borderRadius: 5,
                      borderWidth: 1.5,
                      borderColor: colors.sub,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <View
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 5,
                        borderWidth: 1.5,
                        borderColor: colors.sub,
                      }}
                    />
                  </View>
                  <AppText variant="label" color={colors.sub}>
                    Add a photo of your dish
                  </AppText>
                </>
              )}
            </Pressable>

          </ScrollView>

          <View style={{ paddingTop: 16 }}>
            <PrimaryButton label="Log Meal" onPress={submit} />
            <Pressable
              accessibilityRole="button"
              onPress={submit}
              style={({ pressed }) => [styles.skip, { opacity: pressed ? 0.6 : 1 }]}>
              <AppText variant="sub" style={{ fontFamily: Fonts.semibold }}>
                Skip feedback & log
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  handleHit: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 40,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 3,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 4,
  },
  deductionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    height: 1,
    marginTop: 12,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 16,
  },
  dropzone: {
    height: 84,
    borderRadius: Radius.lg,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  skip: {
    alignSelf: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
});
