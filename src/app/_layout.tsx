import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
  Geist_800ExtraBold,
} from '@expo-google-fonts/geist';
import { GeistMono_400Regular, GeistMono_500Medium } from '@expo-google-fonts/geist-mono';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppOverlays } from '@/components/overlays';
import { ToastProvider } from '@/components/toast';
import { AppProvider } from '@/store/app-store';
import { useTheme } from '@/theme/use-theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    Geist_800ExtraBold,
    GeistMono_400Regular,
    GeistMono_500Medium,
    ...Ionicons.font,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const base = isDark ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.bg,
      card: colors.bg,
      text: colors.fg,
      border: colors.line,
      primary: colors.accent,
      notification: colors.accent,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <AppProvider>
        <ToastProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="recipe/[id]" />
          </Stack>
          <AppOverlays />
        </ToastProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
