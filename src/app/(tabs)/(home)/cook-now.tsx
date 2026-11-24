import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Page } from '@/components/page';
import { RecipeCard } from '@/components/recipe-card';
import { useToast } from '@/components/toast';
import { RECIPES } from '@/data/recipes';
import { matchRecipe } from '@/lib/pantry';
import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

const SORTS = ['Fastest', 'Fewest tools', 'Top rated'];

export default function CookNowScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const { showToast } = useToast();
  const [sortIndex, setSortIndex] = useState(0);

  const withMatches = RECIPES.map((recipe) => ({
    recipe,
    match: matchRecipe(recipe, state.pantry),
  }));

  const sorted = [...withMatches].sort((a, b) => {
    if (sortIndex === 1) return a.recipe.tools.length - b.recipe.tools.length;
    if (sortIndex === 2) return b.recipe.rating - a.recipe.rating;
    return a.recipe.minutes - b.recipe.minutes;
  });

  const fullMatches = sorted.filter(({ match }) => match.missing.length === 0);
  const almost = sorted.filter(
    ({ match }) => match.missing.length > 0 && match.missing.length <= 2,
  );

  const cycleSort = () => {
    const next = (sortIndex + 1) % SORTS.length;
    setSortIndex(next);
    showToast(`Sorted by ${SORTS[next].toLowerCase()}`);
  };

  return (
    <Page scroll>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={10}
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Ionicons name="chevron-back" size={24} color={colors.fg} />
        </Pressable>
        <AppText variant="cardTitle" style={{ fontFamily: Fonts.semibold, fontSize: 17 }}>
          Cook Now
        </AppText>
        <View style={{ width: 24 }} />
      </View>

      <AppText variant="heading" style={{ marginTop: 24 }}>
        Ready to cook
      </AppText>
      <AppText variant="sub" color={colors.sub} style={{ marginTop: 4 }}>
        Recipes that use only what&rsquo;s in your pantry.
      </AppText>

      <View style={[styles.staples, { backgroundColor: colors.surfaceAlt }]}>
        <View
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 1.5,
            borderColor: colors.sub,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 2,
          }}>
          <AppText style={{ fontFamily: Fonts.bold, fontSize: 10, color: colors.sub }}>i</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="meta" style={{ fontFamily: Fonts.medium }}>
            Assuming oil, salt &amp; pepper on hand
          </AppText>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() =>
              showToast('Oil, salt and pepper are always treated as staples.')
            }>
            <AppText
              variant="small"
              color={colors.sub}
              style={{ fontFamily: Fonts.semibold, marginTop: 2 }}>
              Edit staples
            </AppText>
          </Pressable>
        </View>
      </View>

      <View style={styles.resultsHeader}>
        <AppText variant="item" weight="semibold">
          {fullMatches.length === 0
            ? 'No full matches yet'
            : `${fullMatches.length} recipe${fullMatches.length === 1 ? '' : 's'} ready`}
        </AppText>
        <Pressable accessibilityRole="button" onPress={cycleSort} hitSlop={8}>
          <AppText variant="meta" color={colors.sub} style={{ fontFamily: Fonts.medium }}>
            Sort: {SORTS[sortIndex]} ▾
          </AppText>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        {fullMatches.map(({ recipe, match }) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            match={match}
            variant="compact"
            onPress={() => router.push(`/recipe/${recipe.id}`)}
          />
        ))}
      </View>

      {almost.length > 0 && (
        <>
          <View style={{ marginTop: 26 }}>
            <AppText variant="item" weight="semibold">
              Almost there · 1–2 missing
            </AppText>
            <AppText variant="small" color={colors.sub} style={{ marginTop: 2 }}>
              Shown first if nothing is a full match
            </AppText>
          </View>
          <View style={{ gap: 12, marginTop: 12 }}>
            {almost.map(({ recipe, match }) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                match={match}
                variant="compact"
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              />
            ))}
          </View>
        </>
      )}

      {fullMatches.length === 0 && almost.length === 0 && (
        <AppText variant="meta" color={colors.sub} style={{ marginTop: 16 }}>
          Add a few pantry items to unlock recipes.
        </AppText>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  staples: {
    marginTop: 18,
    borderRadius: Radius.lg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  resultsHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
});
