import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/app-text';
import { Fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

function TabSquare({ focused }: { focused: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: focused ? colors.fg : 'transparent',
        borderWidth: focused ? 0 : 1.5,
        borderColor: colors.sub,
      }}
    />
  );
}

function tabLabel(label: string) {
  return function TabLabel({ focused, color }: { focused: boolean; color: ColorValue | null }) {
    const { colors } = useTheme();
    return (
      <AppText
        style={{
          fontFamily: focused ? Fonts.semibold : Fonts.regular,
          fontSize: 11,
          color: typeof color === 'string' ? color : colors.fg,
        }}>
        {label}
      </AppText>
    );
  };
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.fg,
        tabBarInactiveTintColor: colors.sub,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
        },
        tabBarLabelStyle: { fontSize: 11 },
        tabBarIconStyle: { marginBottom: 2 },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabSquare focused={focused} />,
          tabBarLabel: tabLabel('Home'),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ focused }) => <TabSquare focused={focused} />,
          tabBarLabel: tabLabel('Pantry'),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ focused }) => <TabSquare focused={focused} />,
          tabBarLabel: tabLabel('Progress'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabSquare focused={focused} />,
          tabBarLabel: tabLabel('Settings'),
        }}
      />
    </Tabs>
  );
}
