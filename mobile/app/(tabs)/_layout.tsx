import React from 'react';
import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors } from '../../src/theme/theme';

import { Home, ClipboardList, ArrowLeftRight, User } from 'lucide-react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, any> = {
    Home,
    Orders: ClipboardList,
    Transactions: ArrowLeftRight,
    Profile: User,
  };
  
  const Icon = icons[name];

  return (
    <View
      style={{
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        backgroundColor: focused ? colors.gold : 'transparent',
      }}
    >
      {Icon && <Icon size={20} color={focused ? colors.surface : colors.textMuted} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
          color: colors.textMuted,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => <TabIcon name="Orders" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ focused }) => <TabIcon name="Transactions" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
