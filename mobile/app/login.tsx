import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, radius } from '../../src/theme/theme';

export function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Email and password required');
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Login Failed', e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.surface, fontWeight: '900', fontSize: 22 }}>CU</Text>
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 16 }}>Crawford Feeding</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>Sign in to your account</Text>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }}
          />
        </View>

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 15 }}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
          style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', opacity: loading ? 0.5 : 1 }}
        >
          <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgot-password')} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '600' }}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')} style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Don't have an account? <Text style={{ color: colors.gold, fontWeight: '700' }}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default LoginScreen;
