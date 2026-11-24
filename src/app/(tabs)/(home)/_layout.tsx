import { Stack } from 'expo-router';

import { useTheme } from '@/theme/use-theme';

export default function HomeStackLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="cook-now" />
    </Stack>
  );
}
