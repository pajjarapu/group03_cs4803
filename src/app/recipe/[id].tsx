import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Badge } from '@/components/badge';
import { PrimaryButton, TextLink } from '@/components/button';
import { IconButton } from '@/components/icon-circle';
import { PhotoPlaceholder } from '@/components/photo-placeholder';
import { useToast } from '@/components/toast';
import { getRecipe } from '@/data/recipes';
import { ingredientName, matchRecipe } from '@/lib/pantry';
import { useApp } from '@/store/app-store';
import { Fonts, MaxContentWidth, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = id ? getRecipe(id) : undefined;
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, openLogMeal } = useApp();
  const { showToast } = useToast();
  const [expanded, setExpanded] = useState(false);

  if (!recipe) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          gap: 12,
        }}>
        <AppText variant="section">Recipe not found</AppText>
        <TextLink label="Back to Home" onPress={() => router.replace('/home')} />
      </View>
    );
  }

  const match = matchRecipe(recipe, state.pantry);
  const ingredients = expanded ? recipe.ingredients : recipe.ingredients.slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={{ height: 250 }}>
          <PhotoPlaceholder radius={0} style={{ flex: 1 }} />

          <View
            style={{
              position: 'absolute',
              top: insets.top + 10,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                maxWidth: MaxContentWidth,
                paddingHorizontal: 24,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <IconButton
                name="chevron-back"
                accessibilityLabel="Back"
                onPress={() => router.back()}
              />
              <IconButton
                name="ellipsis-horizontal"
                accessibilityLabel="More options"
                onPress={() => showToast('Saved to your recipes')}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: -48,
            width: '100%',
            maxWidth: MaxContentWidth,
            alignSelf: 'center',
            borderTopLeftRadius: Radius.sheet,
            borderTopRightRadius: Radius.sheet,
            backgroundColor: colors.bg,
            paddingHorizontal: 24,
            paddingTop: 26,
          }}>
          <AppText variant="subheading">{recipe.name}</AppText>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
            <Badge label={`${recipe.minutes} min`} />
            <Badge label={recipe.difficulty} />
            <Badge label={recipe.panLabel} />
            <Badge label={`★ ${recipe.rating.toFixed(1)} (${recipe.ratingCount})`} />
          </View>

          <View style={styles.sectionHeader}>
            <AppText variant="item" weight="semibold" style={{ fontSize: 16 }}>
              Cookware ({recipe.tools.length})
            </AppText>
            <AppText variant="small" color={colors.sub}>
              {recipe.cleanupNote}
            </AppText>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {recipe.tools.map((tool) => (
              <View
                key={tool}
                style={[
                  styles.toolCard,
                  { backgroundColor: colors.surfaceAlt },
                ]}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    backgroundColor: colors.placeholder,
                  }}
                />
                <AppText
                  variant="sub"
                  numberOfLines={1}
                  style={{ fontFamily: Fonts.medium, flexShrink: 1 }}>
                  {tool}
                </AppText>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <AppText variant="item" weight="semibold" style={{ fontSize: 16 }}>
                Ingredients
              </AppText>
              {match.missing.length > 0 && (
                <AppText variant="small" color={colors.accent} style={{ fontFamily: Fonts.semibold }}>
                  {match.missing.length} missing
                </AppText>
              )}
            </View>
            <AppText variant="meta" style={{ fontFamily: Fonts.semibold }}>
              You have {match.haveCount} of {match.totalTracked}
            </AppText>
          </View>

          <View>
            {ingredients.map((ingredient) => {
              const pantryItem = state.pantry.find((item) => item.id === ingredient.id);
              const isLow = pantryItem?.status === 'low';
              const isMissing = !pantryItem;
              return (
                <View key={ingredient.id} style={[styles.ingredientRow, { borderBottomColor: colors.line }]}>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: isMissing || isLow ? 'transparent' : colors.primary,
                      borderWidth: isMissing || isLow ? 1.5 : 0,
                      borderStyle: isMissing || isLow ? 'dashed' : 'solid',
                      borderColor: colors.accent,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {!isMissing && !isLow && (
                      <Ionicons name="checkmark" size={13} color={colors.onPrimary} />
                    )}
                  </View>

                  <AppText variant="body" style={{ flex: 1 }}>
                    {ingredientName(ingredient)}
                  </AppText>

                  <AppText
                    variant="meta"
                    color={isMissing || isLow ? colors.accent : colors.sub}
                    style={{ fontFamily: isMissing ? Fonts.semibold : Fonts.regular }}>
                    {isMissing ? 'Missing' : isLow ? 'Running low' : ingredient.amount}
                  </AppText>
                </View>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setExpanded((prev) => !prev)}
            style={({ pressed }) => [styles.expandLink, { opacity: pressed ? 0.6 : 1 }]}>
            <AppText variant="meta" style={{ fontFamily: Fonts.semibold }}>
              {expanded
                ? 'Show fewer'
                : `Show all ingredients & steps (${recipe.steps.length})`}
            </AppText>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-forward'}
              size={14}
              color={colors.fg}
            />
          </Pressable>

          {expanded && (
            <View style={{ marginTop: 22 }}>
              <AppText variant="item" weight="semibold" style={{ fontSize: 16 }}>
                Method
              </AppText>
              <View style={{ marginTop: 12, gap: 12 }}>
                {recipe.steps.map((step, index) => (
                  <View key={step} style={{ flexDirection: 'row', gap: 12 }}>
                    <AppText
                      variant="meta"
                      style={{ fontFamily: Fonts.semibold, color: colors.accent, width: 18 }}>
                      {index + 1}
                    </AppText>
                    <AppText variant="sub" style={{ flex: 1 }}>
                      {step}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          borderTopWidth: 1,
          borderTopColor: colors.line,
          backgroundColor: colors.bg,
        }}>
        <View style={{ width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center' }}>
          <PrimaryButton label="Mark Cooked" onPress={() => openLogMeal(recipe.id)} />
          <AppText variant="small" color={colors.sub} align="center" style={{ marginTop: 10 }}>
            Updates your pantry &amp; streak
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginTop: 26,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  toolCard: {
    flexGrow: 1,
    flexBasis: '45%',
    height: 48,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ingredientRow: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  expandLink: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
