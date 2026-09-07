import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius } from '../src/theme/theme';

export function PaymentScreen() {
  const router = useRouter();
  const { merchant = 'The Cafeteria', amount = '5' } = useLocalSearchParams<{ merchant: string; amount: string }>();

  const [seconds, setSeconds] = useState(599);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const qrValue = JSON.stringify({
    studentId: 'STU-LCU-17109',
    matric: 'LCU/UG/20/17109',
    merchant,
    amount: Number(amount),
    ts: Date.now(),
    directPayout: { gross: Number(amount), vendorPayout: Number(amount) },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}>
        {/* Close handle */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </View>

        {/* Header */}
        <View style={{ alignItems: 'center', paddingHorizontal: 8 }}>
          <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center' }}>QR Payment</Text>
          <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '700', textAlign: 'center', marginTop: 12, lineHeight: 26 }}>
            Present this QR code to complete your payment of{' '}
            <Text style={{ fontWeight: '900', color: colors.gold }}>{'\u20A6'}{amount}</Text> to{' '}
            <Text style={{ fontWeight: '900' }}>{merchant}</Text>
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8, textAlign: 'center' }}>Vendor will scan \u2014 100% direct payout</Text>
        </View>

        {/* QR Container */}
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            padding: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.gold,
            shadowColor: colors.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 12,
          }}>
            <View style={{ backgroundColor: colors.textPrimary, padding: 12, borderRadius: radius.lg }}>
              <QRCode value={qrValue} size={200} color={colors.bg} backgroundColor={colors.textPrimary} />
            </View>
            <Text style={{ color: colors.gold, fontWeight: '800', fontSize: 14, marginTop: 12 }}>{merchant}</Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 4 }}>Amount: {'\u20A6'}{amount} \u2014 100% to vendor</Text>
            <View style={{ marginTop: 10, backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700', letterSpacing: 1 }}>LCU/UG/20/17109</Text>
            </View>
          </View>

          {/* Countdown */}
          <View style={{ marginTop: 20, backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: seconds > 0 ? colors.emerald : colors.textMuted, marginRight: 8 }} />
            <Text style={{ color: colors.textPrimary, fontFamily: 'monospace', fontWeight: '700', fontSize: 14, letterSpacing: 2 }}>
              {mm}:{ss}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginLeft: 8 }}>expires</Text>
          </View>
          {seconds === 0 && (
            <Text style={{ color: colors.gold, fontSize: 11, marginTop: 8 }}>QR expired \u2014 generate a new one</Text>
          )}
        </View>

        {/* Done Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.gold,
            borderRadius: radius.md,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Done</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12 }}>Keep screen bright for scanner \u2014 Don't screenshot QR</Text>
      </View>
    </SafeAreaView>
  );
}

export default PaymentScreen;
