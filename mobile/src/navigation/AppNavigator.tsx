import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { QRPaymentScreen } from '../screens/QRPaymentScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, label }: { focused: boolean; label: string }) {
  const icons: Record<string, string> = { Home: '⌂', Pay: '◧', History: '≡', Profile: '☺' };
  return <Text style={{ fontSize: 20, color: focused ? colors.navy : colors.textSecondary }}>{icons[label] ?? '•'}</Text>;
}

/**
 * Bottom tab navigator — navy active tint, white cards inside.
 */
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.navy,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.borderLight },
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} label={route.name} />,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Pay" component={QRPaymentScreen} options={{ title: 'QR Pay' }} />
        <Tab.Screen name="History" component={TransactionsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
