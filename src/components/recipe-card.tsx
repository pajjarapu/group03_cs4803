import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import type { RecipeMatch } from '@/lib/pantry';
import { Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import type { Recipe } from '@/types';

import { AppText } from './app-text';
import { Badge } from './badge';
import { PhotoPlaceholder } from './photo-placeholder';

type RecipeCardProps = {
  recipe: Recipe;
  match: RecipeMatch;
  variant?: 'feed' | 'compact';
  onPress: () => void;
  onDismiss?: () => void;
};

export function RecipeCard({
  recipe,
  match,
  variant = 'feed',
  onPress,
  onDismiss,
}: RecipeCardProps) {
  const { colors } = useTheme();
  const compact = variant === 'compact';
  const missingCount = match.missing.length;

  const missingLabel = compact
    ? `${missingCount} missing`
    : missingCount === 0
      ? '0 missing'
      : `${missingCount} missing: ${match.missing.join(', ').toLowerCase()}`;

  return (
    <View
      style={[
        styles.card,
        compact ? styles.compactCard : styles.feedCard,
        { backgroundColor: colors.surface, borderColor: colors.line },
      ]}>
      <PhotoPlaceholder width={compact ? 60 : 88} height={compact ? 60 : 88} radius={8} />

      <View style={styles.content}>
        <AppText variant="cardTitle" numberOfLines={1} style={{ paddingRight: onDismiss ? 24 : 0 }}>
          {recipe.name}
        </AppText>

        <AppText variant="small" color={colors.sub} numberOfLines={1}>
          {compact
            ? missingCount > 0
              ? `Missing: ${match.missing.join(', ').toLowerCase()}`
              : `${recipe.minutes} min · ${recipe.panLabel} · ${recipe.difficulty}`
            : `${recipe.minutes} min · ${recipe.difficulty} · ★ ${recipe.rating.toFixed(1)}`}
        </AppText>

        <View style={styles.badges}>
          <Badge label={missingLabel} variant={missingCount === 0 ? 'solid' : 'accent'} />
          <Badge label={recipe.panLabel} variant="soft" />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${recipe.name}. ${recipe.minutes} minutes. ${recipe.difficulty}.`}
        onPress={onPress}
        style={({ pressed }) => [
          StyleSheet.absoluteFill,
          { backgroundColor: pressed ? colors.surfaceAlt : 'transparent', opacity: pressed ? 0.5 : 1 },
        ]}
      />

      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Hide ${recipe.name}`}
          hitSlop={12}
          onPress={onDismiss}
          style={({ pressed }) => [styles.dismiss, { opacity: pressed ? 0.5 : 1 }]}>
          <Ionicons name="close" size={18} color={colors.sub} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 12,
  },
  feedCard: {
    minHeight: 112,
  },
  compactCard: {
    minHeight: 84,
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    gap: 4,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  dismiss: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
