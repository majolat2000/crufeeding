import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius } from '../src/theme/theme';
import { api } from '../src/api/client';
import { GoldButton } from '../src/components/GoldButton';

export function VendorConfirmScreen() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length < 5) return Alert.alert('Error', 'Enter the 5-digit code from the student');
    setConfirming(true);
    try {
      const { data } = await api.post('/orders/confirm', { shortCode: trimmed });
      Alert.alert('Payment Confirmed', data.message, [
        { text: 'OK', onPress: () => router.replace('/vendor') },
      ]);
    } catch (e: any) {
      Alert.alert('Confirmation Failed', e.message);
    } finally { setConfirming(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '700' }}>{'\u2190'} Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary }}>Confirm Payment</Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 32 }}>{'\uD83D\uDD0D'}</Text>
          </View>
          <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 16 }}>Enter 5-Digit Code</Text>
          <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4, textAlign: 'center' }}>
            Ask the student for their payment code and enter it below
          </Text>
        </View>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="ABCDE"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="characters"
          maxLength={5}
          style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, fontSize: 28, textAlign: 'center', letterSpacing: 12, fontWeight: '800' }}
        />

        <TouchableOpacity onPress={handleConfirm} disabled={confirming} activeOpacity={0.85} style={{ backgroundColor: colors.emerald, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>{confirming ? 'Verifying...' : 'Verify & Confirm'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13 }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default VendorConfirmScreen;
