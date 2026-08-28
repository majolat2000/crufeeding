import React from "react";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

/**
 * Bottom Tab Bar — 3 tabs: Home, Transactions, Profile.
 * Custom icons, navy active tint (#1A153B), smooth switching.
 * PaymentScreen is NOT a tab — opened as modal from Home cards.
 */

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap: Record<string, string> = {
    Home: "⌂",
    Transactions: "≡",
    Profile: "☺",
  };
  return (
    <View
      className={`w-7 h-7 items-center justify-center rounded-full ${focused ? "bg-[#1A153B]" : "bg-transparent"}`}
    >
      <Text className={`text-[18px] ${focused ? "text-white" : "text-gray-400"}`}>{iconMap[name] ?? "•"}</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1A153B",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ focused }) => <TabIcon name="Transactions" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
