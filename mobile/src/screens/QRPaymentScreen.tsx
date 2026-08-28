import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react';
import { colors, spacing, radius } from '../theme/colors';
import { Card } from '../components/Card';

/**
 * QRPaymentScreen — Scanner placeholder + manual amount + levy preview.
 * 10% levy is split at backend (payment.service), preview shown here.
 */
export function QRPaymentScreen() {
  const [amount, setAmount] = useState('1500');
  const [vendorId, setVendorId] = useState('CAF-Main-01');
  const numericAmount = parseFloat(amount) || 0;
  const levy = +(numericAmount * 0.1).toFixed(2);
  const vendorReceives = +(numericAmount * 0.9).toFixed(2);

  const handlePay = () => {
    if (!numericAmount || numericAmount < 100) {
      Alert.alert('Invalid amount', 'Minimum payment is ₦100');
      return;
    }
    Alert.alert('Confirm Payment', `Pay ₦${numericAmount.toLocaleString()} to ${vendorId}?\nVendor: ₦${vendorReceives}\nPlatform levy (10%): ₦${levy}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pay', onPress: () => Alert.alert('Success', 'Payment processed — ledger updated') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan to Pay</Text>
        <Text style={styles.headerSubtitle}>Point camera at vendor QR</Text>
      </View>

      <View style={styles.container}>
        {/* Scanner placeholder */}
        <Card style={styles.scannerCard}>
          <View style={styles.scannerBox}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            <Text style={styles.scannerText}>📷 Camera preview</Text>
            <Text style={styles.scannerHint}>expo-camera / barcode-scanner</Text>
          </View>
          <TouchableOpacity style={styles.scanBtn}>
            <Text style={styles.scanBtnText}>Start Scanner</Text>
          </TouchableOpacity>
        </Card>

        {/* Manual form */}
        <Card>
          <Text style={styles.label}>Vendor QR / ID</Text>
          <TextInput value={vendorId} onChangeText={setVendorId} placeholder="Scan or enter ID" style={styles.input} placeholderTextColor={colors.textSecondary} />
          <Text style={[styles.label, { marginTop: spacing.md }]}>Amount (₦)</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" style={styles.input} placeholderTextColor={colors.textSecondary} />

          {/* Levy breakdown */}
          <View style={styles.breakdown}>
            <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>You pay</Text><Text style={styles.breakdownValue}>₦{numericAmount.toLocaleString()}</Text></View>
            <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Vendor receives (90%)</Text><Text style={styles.breakdownValue}>₦{vendorReceives.toLocaleString()}</Text></View>
            <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Platform levy (10%)</Text><Text style={[styles.breakdownValue, { color: colors.warning }]}>₦{levy.toLocaleString()}</Text></View>
          </View>

          <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
            <Text style={styles.payBtnText}>Confirm & Pay</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  header: { backgroundColor: colors.navy, padding: spacing.md, paddingBottom: spacing.lg },
  headerTitle: { color: colors.textOnNavy, fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#A5B4FC', fontSize: 13, marginTop: 4 },
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md, gap: spacing.md },
  scannerCard: { alignItems: 'center' },
  scannerBox: { width: '100%', height: 180, backgroundColor: '#0F0A2F', borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: 1, borderColor: colors.navyMuted },
  cornerTL: { position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTopWidth: 3, borderLeftWidth: 3, borderColor: colors.white, borderTopLeftRadius: 8 },
  cornerTR: { position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTopWidth: 3, borderRightWidth: 3, borderColor: colors.white, borderTopRightRadius: 8 },
  cornerBL: { position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottomWidth: 3, borderLeftWidth: 3, borderColor: colors.white, borderBottomLeftRadius: 8 },
  cornerBR: { position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottomWidth: 3, borderRightWidth: 3, borderColor: colors.white, borderBottomRightRadius: 8 },
  scannerText: { color: colors.white, fontWeight: '700' },
  scannerHint: { color: '#A5B4FC', fontSize: 12, marginTop: 4 },
  scanBtn: { marginTop: spacing.md, backgroundColor: colors.navy, paddingVertical: 10, paddingHorizontal: 20, borderRadius: radius.md },
  scanBtnText: { color: colors.white, fontWeight: '700' },
  label: { fontSize: 12, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { marginTop: 6, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: 12, color: colors.textPrimary, backgroundColor: colors.white },
  breakdown: { marginTop: spacing.md, backgroundColor: '#F9FAFB', borderRadius: radius.md, padding: spacing.md, gap: 8 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  breakdownLabel: { color: colors.textSecondary, fontSize: 13 },
  breakdownValue: { fontWeight: '700', color: colors.navy },
  payBtn: { marginTop: spacing.md, backgroundColor: colors.navy, borderRadius: radius.md, padding: 16, alignItems: 'center' },
  payBtnText: { color: colors.white, fontWeight: '800', fontSize: 16 },
});
