import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { TextLink } from '@/components/button';
import { Page } from '@/components/page';
import { PhotoPlaceholder } from '@/components/photo-placeholder';
import { SectionHeader } from '@/components/section-header';
import { lastSevenDays, relativeDay, starString } from '@/lib/dates';
import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import type { AppState } from '@/types';

type Achievement = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  unlocked: boolean;
  progress?: string;
};

function getAchievements(state: AppState): Achievement[] {
  return [
    {
      id: 'first-meal',
      name: 'First Meal',
      icon: 'restaurant',
      unlocked: state.mealsCooked > 0,
    },
    {
      id: '7-day',
      name: '7-Day Streak',
      icon: 'flame',
      unlocked: state.streak >= 7,
    },
    {
      id: 'one-pan',
      name: 'One-Pan Hero',
      icon: 'pizza',
      unlocked: true,
    },
    {
      id: 'pantry-pro',
      name: 'Pantry Pro',
      icon: 'basket-outline',
      unlocked: state.pantry.length >= 20,
    },
    {
      id: '10-recipes',
      name: '10 Recipes',
      icon: 'bookmark',
      unlocked: state.recipesTried >= 10,
      progress: `${Math.min(state.recipesTried, 10)} / 10`,
    },
    {
      id: '30-day',
      name: '30-Day Streak',
      icon: 'trophy',
      unlocked: state.streak >= 30,
      progress: `${Math.min(state.streak, 30)} / 30`,
    },
  ];
}

export default function ProgressScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const [showHistory, setShowHistory] = useState(false);

  const week = lastSevenDays(state.cookedDays);
  const achievements = getAchievements(state);
  const unlockedCount = achievements.filter((achievement) => achievement.unlocked).length;
  const history = showHistory ? state.history : state.history.slice(0, 2);

  return (
    <Page scroll>
      <AppText variant="display">Progress</AppText>

      <View style={[styles.hero, { backgroundColor: colors.inverseBg }]}>
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <AppText
              style={{
                fontFamily: Fonts.extrabold,
                fontSize: 48,
                lineHeight: 54,
                color: colors.inverseFg,
              }}>
              {state.streak}
            </AppText>
            <AppText variant="sub" style={{ color: colors.inverseSub }}>
              day cooking streak
            </AppText>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <AppText variant="meta" style={{ color: colors.inverseSub }}>
              Best: {state.bestStreak} days
            </AppText>
            <AppText
              variant="meta"
              style={{ fontFamily: Fonts.semibold, color: colors.inverseFg }}>
              {state.graceDaysLeft} grace day{state.graceDaysLeft === 1 ? '' : 's'} left
            </AppText>
          </View>
        </View>

        <View style={styles.heroBottom}>
          <View style={styles.heroDots}>
            {week.map((day) => (
              <View
                key={day.key}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: day.cooked ? colors.inverseFg : 'transparent',
                  borderWidth: day.cooked ? 0 : 1.5,
                  borderColor: colors.inverseSub,
                }}
              />
            ))}
          </View>
          <AppText variant="small" style={{ color: colors.inverseSub }}>
            Last 7 days
          </AppText>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard value={String(state.mealsCooked)} label="Meals cooked" />
        <StatCard value={String(state.recipesTried)} label="Recipes tried" />
        <StatCard value={`${state.avgRating.toFixed(1)}★`} label="Avg rating" />
      </View>

      <View style={{ marginTop: 26 }}>
        <SectionHeader
          title="Achievements"
          size="section"
          right={
            <AppText variant="meta" color={colors.sub}>
              {unlockedCount} of 20
            </AppText>
          }
        />
      </View>

      <View style={{ marginTop: 14, gap: 12 }}>
        {[0, 3].map((start) => (
          <View key={start} style={styles.gridRow}>
            {achievements.slice(start, start + 3).map((achievement) => (
              <AchievementTile key={achievement.id} achievement={achievement} />
            ))}
          </View>
        ))}
      </View>

      <View style={{ marginTop: 26 }}>
        <SectionHeader
          title="Recent cooks"
          size="section"
          right={
            state.history.length > 2 ? (
              <TextLink
                label={showHistory ? 'Show less' : 'See history'}
                onPress={() => setShowHistory((prev) => !prev)}
              />
            ) : undefined
          }
        />
      </View>

      <View style={{ marginTop: 10 }}>
        {history.map((entry) => (
          <Pressable
            key={entry.id}
            accessibilityRole="button"
            onPress={() => router.push(`/recipe/${entry.recipeId}`)}
            style={({ pressed }) => [styles.historyRow, { opacity: pressed ? 0.7 : 1 }]}>
            {entry.photoUri ? (
              <Image
                source={{ uri: entry.photoUri }}
                style={{ width: 44, height: 44, borderRadius: 8 }}
                contentFit="cover"
              />
            ) : (
              <PhotoPlaceholder width={44} height={44} />
            )}
            <View style={{ flex: 1 }}>
              <AppText variant="cardTitle">{entry.name}</AppText>
              <AppText variant="small" color={colors.sub}>
                {relativeDay(entry.cookedAt)} · {starString(entry.rating)}
              </AppText>
            </View>
          </Pressable>
        ))}

        {history.length === 0 && (
          <AppText variant="meta" color={colors.sub}>
            Your cooked meals will show up here.
          </AppText>
        )}
      </View>
    </Page>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: colors.surfaceAlt }]}>
      <AppText style={{ fontFamily: Fonts.bold, fontSize: 22, lineHeight: 28 }}>{value}</AppText>
      <AppText variant="small" color={colors.sub}>
        {label}
      </AppText>
    </View>
  );
}

function AchievementTile({ achievement }: { achievement: Achievement }) {
  const { colors } = useTheme();
  const { unlocked } = achievement;

  return (
    <View
      style={[
        styles.tile,
        { borderColor: colors.line, backgroundColor: colors.surface },
      ]}>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: unlocked ? colors.placeholder : 'transparent',
          borderWidth: unlocked ? 0 : 1.5,
          borderStyle: unlocked ? 'solid' : 'dashed',
          borderColor: colors.sub,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons
          name={unlocked ? achievement.icon : 'lock-closed'}
          size={unlocked ? 20 : 16}
          color={unlocked ? colors.sub : colors.sub}
        />
      </View>
      <AppText
        variant="small"
        align="center"
        style={{
          fontFamily: unlocked ? Fonts.semibold : Fonts.medium,
          color: unlocked ? colors.fg : colors.sub,
        }}>
        {achievement.name}
      </AppText>
      {!unlocked && achievement.progress && (
        <AppText variant="badge" color={colors.sub} style={{ marginTop: -4 }}>
          {achievement.progress}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    gap: 20,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroDots: {
    flexDirection: 'row',
    gap: 10,
  },
  statsRow: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    height: 76,
    borderRadius: Radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tile: {
    flex: 1,
    height: 108,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
  },
});
