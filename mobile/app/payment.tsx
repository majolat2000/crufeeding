import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../src/theme/theme';
import { api } from '../src/api/client';
import { useAuthStore } from '../src/store/authStore';

export function PaymentScreen() {
  const router = useRouter();
  const { merchant = 'The Cafeteria', amount = '5' } = useLocalSearchParams<{ merchant: string; amount: string }>();
  const { user, refreshUser } = useAuthStore();
  const [seconds, setSeconds] = useState(599);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (seconds === 0 && !processed) {
      Alert.alert('QR Expired', 'The QR code has expired. No funds were deducted.', [{ text: 'OK', onPress: () => router.back() }]);
    }
  }, [seconds]);

  const processPayment = async () => {
    if (processed) return;
    try {
      await api.post('/payments/qr', {
        studentId: user?.id,
        vendorId: 'CAFETERIA',
        vendorName: merchant,
        amount: Number(amount),
      });
      setProcessed(true);
      if (timerRef.current) clearInterval(timerRef.current);
      await refreshUser();
      Alert.alert('Payment Successful', `N${amount} paid to ${merchant} — 100% direct payout`, [{ text: 'Done', onPress: () => router.back() }]);
    } catch (e: any) {
      Alert.alert('Payment Failed', e.message);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const qrValue = JSON.stringify({
    studentId: user?.id,
    matric: user?.matricNo,
    merchant,
    amount: Number(amount),
    ts: Date.now(),
    expiresIn: seconds,
    directPayout: { gross: Number(amount), vendorPayout: Number(amount) },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </View>

        <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
          <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center' }}>QR Payment</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700', textAlign: 'center', marginTop: 12, lineHeight: 26 }}>
            Present this QR code to complete your payment of{' '}
            <Text style={{ fontWeight: '900', color: colors.gold }}>{'\u20A6'}{amount}</Text> to{' '}
            <Text style={{ fontWeight: '900' }}>{merchant}</Text>
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8, textAlign: 'center' }}>Vendor will scan \u2014 100% direct payout</Text>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
          <View style={{
            backgroundColor: colors.surface, borderRadius: radius.xl, padding: 24, alignItems: 'center',
            borderWidth: 1, borderColor: processed ? colors.emerald : colors.gold,
            shadowColor: processed ? colors.emerald : colors.gold,
            shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
          }}>
            <View style={{ backgroundColor: colors.textPrimary, padding: 12, borderRadius: radius.lg }}>
              <QRCode value={qrValue} size={200} color={processed ? '#10B981' : colors.bg} backgroundColor={colors.textPrimary} />
            </View>
            <Text style={{ color: processed ? colors.emerald : colors.gold, fontWeight: '800', fontSize: 14, marginTop: 12 }}>
              {processed ? 'Payment Complete' : merchant}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>Amount: {'\u20A6'}{amount} \u2014 100% to vendor</Text>
            <View style={{ marginTop: 10, backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>{user?.matricNo || 'N/A'}</Text>
            </View>
          </View>

          <View style={{ marginTop: 20, backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: seconds > 0 ? colors.emerald : '#EF4444', marginRight: 8 }} />
            <Text style={{ color: colors.textPrimary, fontFamily: 'monospace', fontWeight: '700', fontSize: 14, letterSpacing: 2 }}>{mm}:{ss}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginLeft: 8 }}>{processed ? 'complete' : 'expires'}</Text>
          </View>
          {seconds === 0 && <Text style={{ color: '#EF4444', fontSize: 11, marginTop: 8 }}>QR expired \u2014 no funds deducted</Text>}
        </View>

        {!processed ? (
          <TouchableOpacity onPress={processPayment} activeOpacity={0.85} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Confirm Payment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.85} style={{ backgroundColor: colors.emerald, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' }}>
            <Text style={{ color: colors.textPrimary, fontWeight: '800', fontSize: 15 }}>Done</Text>
          </TouchableOpacity>
        )}

        <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12 }}>Keep screen bright for scanner \u2014 Don't screenshot QR</Text>
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;
