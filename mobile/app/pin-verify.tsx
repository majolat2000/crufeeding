import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, radius } from '../../src/theme/theme';

export function PinVerifyScreen() {
  const router = useRouter();
  const { merchant, amount } = useLocalSearchParams<{ merchant: string; amount: string }>();
  const { verifyPin, user } = useAuthStore();
  const [pin, setPin] = useState('');

  const handleVerify = async () => {
    if (pin.length < 4) return Alert.alert('Error', 'Enter your 4-6 digit PIN');
    try {
      await verifyPin(pin);
      router.replace({ pathname: '/payment', params: { merchant: merchant || 'The Cafeteria', amount: amount || '5' } });
    } catch (e: any) {
      Alert.alert('Invalid PIN', e.message);
      setPin('');
    }
  };

  const hasPin = user?.pin !== undefined;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32 }}>{'\uD83D\uDD10'}</Text>
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 16 }}>Enter Transaction PIN</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>
            Authorize payment of {'\u20A6'}{amount} to {merchant}
          </Text>
        </View>

        <TextInput
          value={pin}
          onChangeText={setPin}
          placeholder="\u2022\u2022\u2022\u2022"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, fontSize: 24, textAlign: 'center', letterSpacing: 12 }}
        />

        <TouchableOpacity onPress={handleVerify} activeOpacity={0.85} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Verify & Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default PinVerifyScreen;
