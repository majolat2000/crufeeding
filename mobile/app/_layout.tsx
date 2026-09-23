import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppState, AppStateStatus, Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { useAuthStore } from '../src/store/authStore';
import { colors } from '../src/theme/theme';
import { api } from '../src/api/client';
import { CrawfordLogo } from '../src/components/CrawfordLogo';

let LocalAuthentication: any = null;
try {
  LocalAuthentication = require('expo-local-authentication');
} catch {}

SplashScreen.preventAutoHideAsync();

const LOCK_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { token, hydrated, hydrate, user } = useAuthStore();
  const [locked, setLocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const lastActiveRef = useRef(Date.now());
  const appStateRef = useRef(AppState.currentState);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => { hydrate(); }, []);

  // Check biometric availability
  useEffect(() => {
    async function checkBio() {
      try {
        if (!LocalAuthentication) return;
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricAvailable(compatible && enrolled);
      } catch { setBiometricAvailable(false); }
    }
    checkBio();
  }, []);

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
          return;
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
    const isVendorRoute = segments[0] === 'vendor';
    if (!token && !inAuthGroup) {
      router.replace('/login');
    } else if (token && inAuthGroup) {
      if (user?.role === 'vendor') {
        router.replace('/vendor');
      } else {
        router.replace('/(tabs)');
      }
    } else if (token && !inAuthGroup && !isVendorRoute) {
      if (user?.role === 'vendor') {
        router.replace('/vendor');
      }
    } else if (token && !inAuthGroup && isVendorRoute) {
      if (user?.role !== 'vendor') {
        router.replace('/(tabs)');
      }
    }
  }, [token, hydrated, segments, user?.role]);

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

  async function handlePasswordUnlock() {
    if (!passwordInput) {
      Alert.alert('Error', 'Enter your password');
      return;
    }
    setUnlocking(true);
    try {
      const storedUser = await AsyncStorage.getItem('auth_user');
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      const email = parsed?.email || user?.email;
      if (!email) {
        Alert.alert('Error', 'User email not found');
        setUnlocking(false);
        return;
      }
      await api.post('/auth/verify-password', { email, password: passwordInput });
      setLocked(false);
      setPasswordInput('');
    } catch (e: any) {
      Alert.alert('Invalid Password', e.message || 'Password verification failed');
      setPasswordInput('');
    } finally {
      setUnlocking(false);
    }
  }

  async function handleBiometricUnlock() {
    try {
      if (!LocalAuthentication) return Alert.alert('Error', 'Biometrics not available');
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock with biometrics',
        cancelLabel: 'Cancel',
        disableDeviceFallback: true,
      });
      if (result.success) {
        setLocked(false);
      }
    } catch (e: any) {
      Alert.alert('Biometric Error', e.message);
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
        <Stack.Screen name="vendor" options={{ headerShown: false }} />
        <Stack.Screen name="cafeteria" options={{ headerShown: false }} />
        <Stack.Screen name="order-confirm" options={{ headerShown: false }} />
        <Stack.Screen name="vendor-confirm" options={{ headerShown: false }} />
        <Stack.Screen
          name="payment"
          options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }}
        />
      </Stack>

      {/* Screen Lock Modal */}
      <Modal visible={locked} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(9,13,22,0.95)', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
          <CrawfordLogo size={72} style={{ marginBottom: 24 }} />
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 }}>Screen Locked</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 24, textAlign: 'center' }}>Enter your password to continue</Text>
          <TextInput
            value={passwordInput}
            onChangeText={setPasswordInput}
            placeholder="Enter password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={{ backgroundColor: colors.surface, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, color: '#fff', borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 16, width: '100%' }}
          />
          <TouchableOpacity
            onPress={handlePasswordUnlock}
            disabled={unlocking}
            style={{ backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16, alignItems: 'center', width: '100%', marginTop: 16, opacity: unlocking ? 0.5 : 1 }}
          >
            <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>{unlocking ? 'Verifying...' : 'Unlock'}</Text>
          </TouchableOpacity>
          {biometricAvailable && (
            <TouchableOpacity
              onPress={handleBiometricUnlock}
              style={{ backgroundColor: colors.surfaceOverlay, borderRadius: 12, paddingVertical: 16, alignItems: 'center', width: '100%', marginTop: 12, borderWidth: 1, borderColor: colors.borderSubtle }}
            >
              <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 14 }}>{'\uD83D\uDD11'} Unlock with Biometrics</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>
    </SafeAreaProvider>
  );
}
