import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, radius } from '../src/theme/theme';
import { api } from '../src/api/client';

export function OrderConfirmScreen() {
  const router = useRouter();
  const { orderId, qrCode, shortCode, totalAmount, expiresAt } = useLocalSearchParams<{
    orderId: string; qrCode: string; shortCode: string; totalAmount: string; expiresAt: string;
  }>();
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const end = new Date(expiresAt!).getTime();
    const tick = () => {
      const diff = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setTimeLeft(diff);
      if (diff <= 0) setExpired(true);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const renderQRCode = () => {
    if (!qrCode) return null;
    const size = 200;
    const cellSize = size / 25;
    const modules = generateQRMatrix(qrCode);
    return (
      <View style={{ width: size, height: size, backgroundColor: '#fff', padding: 10, borderRadius: 12 }}>
        {modules.map((row, y) => (
          <View key={y} style={{ flexDirection: 'row' }}>
            {row.map((cell, x) => (
              <View key={x} style={{ width: cellSize - 0.5, height: cellSize - 0.5, backgroundColor: cell ? '#000' : '#fff' }} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', padding: 24, paddingTop: 60 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: expired ? 'rgba(239,68,68,0.2)' : colors.emeraldGlow, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 28 }}>{expired ? '\u274C' : '\u2705'}</Text>
        </View>
        <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginBottom: 4 }}>
          {expired ? 'Order Expired' : 'Order Created'}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: 24, textAlign: 'center' }}>
          {expired ? 'This order has expired. Create a new order to try again.' : 'Show this code to the vendor or enter it manually'}
        </Text>

        {!expired && (
          <>
            {/* Countdown Timer */}
            <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.borderSubtle, marginBottom: 20 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Time Remaining</Text>
              <Text style={{ color: timeLeft <= 60 ? '#EF4444' : colors.gold, fontSize: 42, fontWeight: '900', fontVariant: ['tabular-nums'] }}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </Text>
            </View>

            {/* QR Code */}
            <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.borderSubtle, marginBottom: 20 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>QR Code</Text>
              {renderQRCode()}
            </View>

            {/* Short Code */}
            <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: colors.gold, marginBottom: 20 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>5-Digit Code</Text>
              <Text style={{ color: colors.gold, fontSize: 36, fontWeight: '900', letterSpacing: 12 }}>{shortCode}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 8 }}>Show or tell this code to the vendor</Text>
            </View>

            {/* Order Summary */}
            <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, width: '100%', borderWidth: 1, borderColor: colors.borderSubtle }}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Order Total</Text>
              <Text style={{ color: colors.textPrimary, fontSize: 22, fontWeight: '800' }}>{'\u20A6'}{Number(totalAmount).toLocaleString()}</Text>
            </View>
          </>
        )}

        {expired && (
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, paddingHorizontal: 32, alignItems: 'center', marginTop: 12 }}>
            <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>Back to Home</Text>
          </TouchableOpacity>
        )}

        {!expired && (
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Done</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

function generateQRMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Simple finder patterns
  const drawFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (y === 0 || y === 6 || x === 0 || x === 6 || (y >= 2 && y <= 4 && x >= 2 && x <= 4)) {
          matrix[startY + y][startX + x] = true;
        }
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // Encode text into data area
  const bytes = [];
  for (let i = 0; i < text.length; i++) bytes.push(text.charCodeAt(i));
  let bitIndex = 0;
  for (let x = 9; x < size - 1; x++) {
    for (let y = 0; y < size; y++) {
      const row = (x % 2 === 0) ? y : size - 1 - y;
      if (row < size && x < size) {
        if (bitIndex < bytes.length * 8) {
          const byteIdx = Math.floor(bitIndex / 8);
          const bitIdx = 7 - (bitIndex % 8);
          matrix[row][x] = ((bytes[byteIdx] >> bitIdx) & 1) === 1;
          bitIndex++;
        }
      }
    }
  }

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  return matrix;
}

export default OrderConfirmScreen;
