import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Chip, ChipRow } from '@/components/chip';
import { IconCircle } from '@/components/icon-circle';
import { Page } from '@/components/page';
import { RecipeCard } from '@/components/recipe-card';
import { SectionHeader } from '@/components/section-header';
import { TextLink } from '@/components/button';
import { useToast } from '@/components/toast';
import { RECIPES } from '@/data/recipes';
import { lastSevenDays, relativeDay } from '@/lib/dates';
import { matchRecipe } from '@/lib/pantry';
import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import type { Recipe } from '@/types';

const FEATURED_IDS = ['lemon-chicken', 'garlic-butter-pasta', 'veggie-fried-rice'];

type FilterKey = 'quick' | 'pantry' | 'onepan';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { state, hideRecipe, showRecipe } = useApp();
  const { showToast } = useToast();
  const [filters, setFilters] = useState<FilterKey[]>([]);

  const week = lastSevenDays(state.cookedDays);
  const lastCook = state.history[0];

  const featured = FEATURED_IDS.map((id) => RECIPES.find((recipe) => recipe.id === id)).filter(
    (recipe): recipe is Recipe => Boolean(recipe),
  );

  const matches = new Map(featured.map((recipe) => [recipe.id, matchRecipe(recipe, state.pantry)]));
  const readyCount = RECIPES.filter((recipe) => matchRecipe(recipe, state.pantry).missing.length === 0).length;

  const visible = featured
    .filter((recipe) => !state.hiddenRecipes[recipe.id])
    .filter((recipe) => {
      const match = matches.get(recipe.id);
      if (!match) return false;
      if (filters.includes('quick') && recipe.minutes > 30) return false;
      if (filters.includes('pantry') && match.missing.length > 0) return false;
      if (filters.includes('onepan') && recipe.tools.length > 1) return false;
      return true;
    })
    .sort((a, b) => {
      const missingA = matches.get(a.id)?.missing.length ?? 0;
      const missingB = matches.get(b.id)?.missing.length ?? 0;
      return missingA - missingB || b.rating - a.rating;
    });

  const toggleFilter = (key: FilterKey) => {
    setFilters((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]));
  };

  const dismissRecipe = (recipe: Recipe) => {
    hideRecipe(recipe);
    showToast(`Hid ${recipe.name} for 30 days`, {
      actionLabel: 'Undo',
      onAction: () => showRecipe(recipe.id),
    });
  };

  return (
    <Page scroll>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText style={{ fontFamily: Fonts.bold, fontSize: 22, lineHeight: 28 }}>
            Good evening, Sam
          </AppText>
          <AppText variant="sub" color={colors.sub} style={{ marginTop: 2 }}>
            What&rsquo;s cooking tonight?
          </AppText>
        </View>
        <IconCircle name="person" size={40} iconSize={20} />
      </View>

      <View style={[styles.card, { borderColor: colors.line, backgroundColor: colors.surface }]}>
        <View style={styles.streakTop}>
          <IconCircle name="flame" size={36} iconSize={18} />
          <View style={{ flex: 1 }}>
            <AppText style={{ fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24 }}>
              {state.streak}-day streak
            </AppText>
            <AppText variant="small" color={colors.sub}>
              {state.graceDaysLeft} grace day{state.graceDaysLeft === 1 ? '' : 's'} left this week
            </AppText>
          </View>
          <TextLink label="View" onPress={() => router.navigate('/progress')} />
        </View>

        <View style={styles.weekRow}>
          {week.map((day) => {
            const filled = day.cooked;
            const outline = day.isToday && !day.cooked;
            return (
              <View
                key={day.key}
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: filled ? colors.primary : 'transparent',
                    borderColor: filled ? colors.primary : outline ? colors.fg : colors.line,
                    borderWidth: filled ? 0 : 1.5,
                    borderStyle: filled || outline ? 'solid' : 'dashed',
                  },
                ]}>
                <AppText
                  style={{
                    fontFamily: Fonts.semibold,
                    fontSize: 11,
                    color: filled ? colors.onPrimary : outline ? colors.fg : colors.sub,
                  }}>
                  {day.initial}
                </AppText>
              </View>
            );
          })}
        </View>

        <AppText variant="small" color={colors.sub}>
          {lastCook
            ? `Last cooked: ${lastCook.name} · ${relativeDay(lastCook.cookedAt).toLowerCase()}`
            : 'No meals logged yet'}
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/cook-now')}
        style={({ pressed }) => [
          styles.cookNow,
          { backgroundColor: colors.inverseBg, opacity: pressed ? 0.9 : 1 },
        ]}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.inverseSubtleBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="restaurant" size={16} color={colors.inverseFg} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={{ fontFamily: Fonts.bold, fontSize: 16, color: colors.inverseFg }}>
            Cook Now
          </AppText>
          <AppText variant="small" style={{ color: colors.inverseSub }}>
            {readyCount} recipe{readyCount === 1 ? '' : 's'} ready with what you have
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.inverseFg} />
      </Pressable>

      <View style={{ marginTop: 26 }}>
        <SectionHeader
          title="Recommended for you"
          right={
            filters.length > 0 ? (
              <TextLink label="Clear" onPress={() => setFilters([])} />
            ) : (
              <AppText variant="label" color={colors.fg} style={{ fontFamily: Fonts.semibold }}>
                Filter
              </AppText>
            )
          }
        />
      </View>

      <View style={{ marginTop: 12 }}>
        <ChipRow>
          <Chip
            label="≤ 30 min"
            selected={filters.includes('quick')}
            onPress={() => toggleFilter('quick')}
          />
          <Chip
            label="Uses what I have"
            selected={filters.includes('pantry')}
            onPress={() => toggleFilter('pantry')}
          />
          <Chip
            label="One-pan"
            selected={filters.includes('onepan')}
            onPress={() => toggleFilter('onepan')}
          />
        </ChipRow>
      </View>

      <View style={{ marginTop: 16, gap: 12 }}>
        {visible.map((recipe) => {
          const match = matches.get(recipe.id);
          if (!match) return null;
          return (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              match={match}
              onPress={() => router.push(`/recipe/${recipe.id}`)}
              onDismiss={() => dismissRecipe(recipe)}
            />
          );
        })}

        {visible.length === 0 && (
          <View
            style={{
              borderRadius: Radius.xl,
              borderWidth: 1,
              borderColor: colors.line,
              padding: 20,
              alignItems: 'center',
              gap: 6,
            }}>
            <AppText variant="item">Nothing matches those filters.</AppText>
            <TextLink label="Clear filters" onPress={() => setFilters([])} muted />
          </View>
        )}
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  card: {
    borderRadius: Radius.xxl,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  streakTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookNow: {
    marginTop: 14,
    borderRadius: Radius.xxl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
});
