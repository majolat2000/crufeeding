import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import { useAuthStore } from '../src/store/authStore';
import '../global.css';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { token, hydrated, hydrate } = useAuthStore();

  useEffect(() => { hydrate(); }, []);

  useEffect(() => {
    if (!hydrated) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password';
    if (!token && !inAuthGroup) {
      router.replace('/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, hydrated, segments]);

  useEffect(() => {
    if (__DEV__) return;
    async function checkUpdate() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch {}
    }
    checkUpdate();
  }, []);

  if (!hydrated) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#090D16" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#090D16' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="pin-verify" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="payment"
          options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
