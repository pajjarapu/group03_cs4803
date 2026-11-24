import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { TextLink } from '@/components/button';
import { IconCircle } from '@/components/icon-circle';
import { Page } from '@/components/page';
import { SectionHeader } from '@/components/section-header';
import { useToast } from '@/components/toast';
import { useApp } from '@/store/app-store';
import { Fonts, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { state, resetApp } = useApp();
  const { showToast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const { prefs } = state;

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      showToast('Pantry, streak and history will reset. Tap reset again to confirm.');
      return;
    }
    resetApp();
    setConfirmReset(false);
    showToast('Demo data reset');
  };

  return (
    <Page scroll>
      <AppText variant="display">Settings</AppText>

      <View style={[styles.profile, { borderColor: colors.line, backgroundColor: colors.surface }]}>
        <IconCircle name="person" size={44} iconSize={22} />
        <View style={{ flex: 1 }}>
          <AppText variant="cardTitle">Sam</AppText>
          <AppText variant="small" color={colors.sub}>
            sam@email.com
          </AppText>
        </View>
      </View>

      <View style={{ marginTop: 26 }}>
        <SectionHeader title="Preferences" size="section" />
        <View style={[styles.card, { borderColor: colors.line }]}>
          <SettingRow label="Dietary needs" value={prefs.dietary.join(', ') || 'None'} onPress={() => router.push('/onboarding?edit=1')} />
          <SettingRow label="Cooking skill" value={prefs.skill} onPress={() => router.push('/onboarding?edit=1')} />
          <SettingRow label="Time per meal" value={prefs.time} onPress={() => router.push('/onboarding?edit=1')} />
          <SettingRow
            label="Goals"
            value={prefs.goals.join(', ') || 'None'}
            onPress={() => router.push('/onboarding?edit=1')}
            last
          />
        </View>
      </View>

      <View style={{ marginTop: 26 }}>
        <SectionHeader title="Kitchen" size="section" />
        <View style={[styles.card, { borderColor: colors.line }]}>
          <SettingRow
            label="Staples"
            value="Oil, salt & pepper"
            onPress={() => showToast('Oil, salt and pepper are always treated as staples.')}
          />
          <SettingRow
            label="Pantry items"
            value={`${state.pantry.length}`}
            onPress={() => router.push('/pantry')}
            last
          />
        </View>
      </View>

      <View style={{ marginTop: 26 }}>
        <SectionHeader title="Account" size="section" />
        <View style={[styles.card, { borderColor: colors.line }]}>
          <SettingRow
            label={confirmReset ? 'Tap again to reset' : 'Reset demo data'}
            value=""
            onPress={handleReset}
            accent={confirmReset}
            last
          />
        </View>
      </View>

      <TextLink
        label="Log out"
        onPress={() => router.replace('/')}
        muted
        style={{ alignSelf: 'center', marginTop: 32, paddingVertical: 12 }}
      />
    </Page>
  );
}

function SettingRow({
  label,
  value,
  onPress,
  last,
  accent,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  last?: boolean;
  accent?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
        { opacity: pressed ? 0.6 : 1 },
      ]}>
      <AppText
        variant="sub"
        style={{ fontFamily: Fonts.medium, color: accent ? colors.accent : colors.fg }}>
        {label}
      </AppText>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
        {value ? (
          <AppText variant="small" color={colors.sub} numberOfLines={1} style={{ flexShrink: 1 }}>
            {value}
          </AppText>
        ) : null}
        <Ionicons name="chevron-forward" size={14} color={colors.sub} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  card: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: Radius.xl,
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 12,
  },
});
