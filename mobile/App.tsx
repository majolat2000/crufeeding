import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

/**
 * Entry point — wraps navigation with safe area + navy status bar.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1A153B" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
