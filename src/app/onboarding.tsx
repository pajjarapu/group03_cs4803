import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { PrimaryButton, TextLink } from '@/components/button';
import { Chip, ChipRow } from '@/components/chip';
import { Page } from '@/components/page';
import { SegmentedControl } from '@/components/segmented-control';
import { useApp } from '@/store/app-store';
import { Fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

const DIETARY = [
  'None',
  'Vegetarian',
  'Vegan',
  'Pescatarian',
  'Gluten-free',
  'Dairy-free',
  'Nut-free',
  'Halal',
  'Kosher',
];

const SKILLS = ['Beginner', 'Comfortable', 'Confident'];
const TIMES = ['15 min', '30 min', '45 min', '60+'];
const GOALS = ['Cook more often', 'Save money', 'Use up food', 'Learn new dishes'];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { state, setPreferences } = useApp();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const prefs = state.prefs;

  const toggleDietary = (label: string) => {
    if (label === 'None') {
      setPreferences({ dietary: prefs.dietary.includes('None') ? [] : ['None'] });
      return;
    }
    const withoutNone = prefs.dietary.filter((item) => item !== 'None');
    setPreferences({
      dietary: withoutNone.includes(label)
        ? withoutNone.filter((item) => item !== label)
        : [...withoutNone, label],
    });
  };

  const toggleGoal = (label: string) => {
    setPreferences({
      goals: prefs.goals.includes(label)
        ? prefs.goals.filter((item) => item !== label)
        : [...prefs.goals, label],
    });
  };

  const finish = () => {
    if (edit) {
      router.back();
      return;
    }
    router.replace('/home');
  };

  return (
    <Page
      scroll
      footer={<PrimaryButton label="Continue" onPress={finish} />}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={10}
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
          <Ionicons name="chevron-back" size={24} color={colors.fg} />
        </Pressable>
        <TextLink label="Skip" onPress={finish} />
      </View>

      <View style={styles.progressRow}>
        {[0, 1, 2].map((step) => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              { backgroundColor: step === 0 ? colors.fg : colors.placeholder },
            ]}
          />
        ))}
      </View>
      <AppText variant="small" color={colors.sub} style={{ marginTop: 12 }}>
        Step 1 of 3
      </AppText>

      <AppText variant="heading" style={{ marginTop: 22 }}>
        Tell us how you cook
      </AppText>
      <AppText variant="sub" color={colors.sub} style={{ marginTop: 4 }}>
        We&rsquo;ll use this to tailor your recipes.
      </AppText>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <AppText variant="item" weight="semibold">
            Dietary needs
          </AppText>
          <AppText variant="small" color={colors.sub}>
            Select all that apply
          </AppText>
        </View>
        <ChipRow>
          {DIETARY.map((label) => (
            <Chip
              key={label}
              label={label}
              selected={prefs.dietary.includes(label)}
              onPress={() => toggleDietary(label)}
            />
          ))}
        </ChipRow>
      </View>

      <View style={styles.section}>
        <AppText variant="item" weight="semibold" style={{ marginBottom: 10 }}>
          Cooking skill
        </AppText>
        <SegmentedControl
          options={SKILLS.map((label) => ({ label, value: label }))}
          value={prefs.skill}
          onChange={(skill) => setPreferences({ skill })}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="item" weight="semibold" style={{ marginBottom: 10 }}>
          Time per meal
        </AppText>
        <SegmentedControl
          options={TIMES.map((label) => ({ label, value: label }))}
          value={prefs.time}
          onChange={(time) => setPreferences({ time })}
        />
      </View>

      <View style={styles.section}>
        <AppText variant="item" weight="semibold" style={{ marginBottom: 10 }}>
          Your goal
        </AppText>
        <ChipRow>
          {GOALS.map((label) => (
            <Chip
              key={label}
              label={label}
              selected={prefs.goals.includes(label)}
              onPress={() => toggleGoal(label)}
            />
          ))}
        </ChipRow>
      </View>

      <AppText
        variant="small"
        color={colors.sub}
        align="center"
        style={{ marginTop: 28, fontFamily: Fonts.regular }}>
        You can change these anytime in Settings.
      </AppText>
    </Page>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    marginBottom: 20,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  section: {
    marginTop: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
});
