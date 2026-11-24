import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { OutlineButton, PrimaryButton } from '@/components/button';
import { PhotoPlaceholder } from '@/components/photo-placeholder';
import { TextField } from '@/components/text-field';
import { Fonts, MaxContentWidth, Radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const inset = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const emailMissing = email.trim().length === 0;
  const passwordMissing = password.trim().length === 0;
  const showError = error !== null;

  const createAccount = () => {
    if (emailMissing || passwordMissing) {
      setError('Enter your email and a password to create an account.');
      return;
    }
    setError(null);
    router.push('/onboarding');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          width: '100%',
          maxWidth: MaxContentWidth,
          alignSelf: 'center',
          paddingHorizontal: 24,
          paddingTop: Math.max(inset.top, 24) + 24,
          paddingBottom: Math.max(inset.bottom, 16) + 16,
        }}>
        <View style={styles.logoWrap}>
          <View style={[styles.logo, { backgroundColor: colors.placeholder }]}>
            <AppText
              variant="small"
              color={colors.sub}
              style={{ fontFamily: Fonts.bold, letterSpacing: 0.4 }}>
              LOGO
            </AppText>
          </View>
          <AppText variant="title" align="center" style={{ marginTop: 22 }}>
            [App Name]
          </AppText>
          <AppText variant="body" color={colors.sub} align="center" style={{ marginTop: 6 }}>
            Cook more with what you already have.
          </AppText>
        </View>

        <PhotoPlaceholder style={{ height: 150, marginTop: 26 }} radius={Radius.sm} />

        <View style={{ marginTop: 24, gap: 14 }}>
          <TextField
            label="Email"
            placeholder="you@email.com"
            value={email}
            onChangeText={(next) => {
              setEmail(next);
              if (showError) setError(null);
            }}
            error={showError && emailMissing}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
          />
          <TextField
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={(next) => {
              setPassword(next);
              if (showError) setError(null);
            }}
            error={showError && passwordMissing}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={createAccount}
          />

          <AppText
            variant="small"
            color={colors.accent}
            style={{ fontFamily: Fonts.medium, minHeight: 16, opacity: showError ? 1 : 0 }}>
            {error ?? ' '}
          </AppText>

          <PrimaryButton label="Create Account" onPress={createAccount} />

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: colors.line }]} />
            <AppText variant="meta" color={colors.sub}>
              or
            </AppText>
            <View style={[styles.dividerLine, { backgroundColor: colors.line }]} />
          </View>

          <View style={styles.socialRow}>
            <OutlineButton
              label="Apple"
              style={{ flex: 1 }}
              onPress={() => router.push('/onboarding')}
            />
            <OutlineButton
              label="Google"
              style={{ flex: 1 }}
              onPress={() => router.push('/onboarding')}
            />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/home')}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, paddingVertical: 14 })}>
            <AppText variant="sub" align="center" style={{ fontFamily: Fonts.medium }}>
              Already have an account? Log in
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
