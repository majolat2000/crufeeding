import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppState, AppStateStatus, Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { useAuthStore } from '../src/store/authStore';
import { colors } from '../src/theme/theme';
import { api } from '../src/api/client';

SplashScreen.preventAutoHideAsync();

const LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { token, hydrated, hydrate, user } = useAuthStore();
  const [locked, setLocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const lastActiveRef = useRef(Date.now());
  const appStateRef = useRef(AppState.currentState);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => { hydrate(); }, []);

  // OTA update check + splash hide
  useEffect(() => {
    async function prepare() {
      if (__DEV__) {
        setAppReady(true);
        return;
      }
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
          return; // reloadAsync restarts the app — splash stays visible
        }
      } catch {}
      setAppReady(true);
    }
    prepare();
  }, []);

  // Hide splash once hydrated + update check complete
  useEffect(() => {
    if (hydrated && appReady) {
      SplashScreen.hideAsync();
    }
  }, [hydrated, appReady]);

  // Auth guard
  useEffect(() => {
    if (!hydrated) return;
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup' || segments[0] === 'forgot-password';
    if (!token && !inAuthGroup) {
      router.replace('/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, hydrated, segments]);

  // Screen lock: track app state changes
  const handleAppStateChange = useCallback((nextState: AppStateStatus) => {
    const now = Date.now();
    if (appStateRef.current === 'active' && nextState.match(/inactive|background/)) {
      lastActiveRef.current = now;
    }
    if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
      const elapsed = now - lastActiveRef.current;
      if (elapsed >= LOCK_TIMEOUT && token) {
        setLocked(true);
      }
    }
    appStateRef.current = nextState;
  }, [token]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [handleAppStateChange]);

  async function handlePinVerify() {
    if (!pinInput || pinInput.length < 4) {
      Alert.alert('Error', 'Enter your PIN');
      return;
    }
    try {
      await api.post('/auth/verify-pin', { pin: pinInput });
      setLocked(false);
      setPinInput('');
    } catch (e: any) {
      Alert.alert('Invalid PIN', e.message || 'PIN verification failed');
      setPinInput('');
    }
  }

  // Don't render anything until hydration + OTA check complete
  if (!hydrated || !appReady) return null;

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

      {/* Screen Lock Modal */}
      <Modal visible={locked} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(9,13,22,0.95)', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Text style={{ color: colors.surface, fontWeight: '900', fontSize: 22 }}>CU</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 }}>Screen Locked</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 24, textAlign: 'center' }}>Enter your PIN to continue</Text>
          <TextInput
            value={pinInput}
            onChangeText={setPinInput}
            placeholder="Enter PIN"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            style={{ backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, color: '#fff', borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 18, width: '100%', textAlign: 'center', letterSpacing: 8 }}
          />
          <TouchableOpacity
            onPress={handlePinVerify}
            style={{ backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16, alignItems: 'center', width: '100%', marginTop: 16 }}
          >
            <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Unlock</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}
