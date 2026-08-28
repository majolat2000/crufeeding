import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react';
import { colors, spacing, radius } from '../theme/colors';
import { Card } from '../components/Card';
import { BalanceCard } from '../components/BalanceCard';

/**
 * HomeScreen — Navy header, white cards, quick actions.
 * Route: /(tabs)/index
 */
export function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Crawford Feeding</Text>
          <Text style={styles.headerSubtitle}>Digital Wallet • Hostel Dining</Text>
        </View>

        <BalanceCard balance={12500} studentName="Majesty O. Olatimilehin" matricNo="CRA/2023/001" />

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation?.navigate('QRPayment')}>
            <View style={styles.actionIcon}><Text style={styles.actionEmoji}>📷</Text></View>
            <Text style={styles.actionLabel}>Scan to Pay</Text>
            <Text style={styles.actionHint}>QR at cafeteria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation?.navigate('Transactions')}>
            <View style={[styles.actionIcon, { backgroundColor: '#EEF2FF' }]}><Text style={styles.actionEmoji}>🧾</Text></View>
            <Text style={styles.actionLabel}>History</Text>
            <Text style={styles.actionHint}>All transactions</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Card>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[
            { title: 'Lunch - Main Cafeteria', amount: '-₦1,200', date: 'Today 12:34 PM', status: 'Success' },
            { title: 'Wallet Top-up', amount: '+₦10,000', date: 'Yesterday 09:12 AM', status: 'Success' },
            { title: 'Dinner - Hostel Cafe', amount: '-₦950', date: 'Aug 26 07:45 PM', status: 'Success' },
          ].map((item, idx) => (
            <View key={idx} style={styles.txRow}>
              <View style={styles.txDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{item.title}</Text>
                <Text style={styles.txDate}>{item.date}</Text>
              </View>
              <Text style={[styles.txAmount, item.amount.startsWith('+') && styles.txPositive]}>{item.amount}</Text>
            </View>
          ))}
        </Card>

        {/* Hostel Info */}
        <Card>
          <Text style={styles.sectionTitle}>Meal Access</Text>
          <Text style={styles.muted}>Hostel: Faith Hall • Level: 300</Text>
          <Text style={styles.muted}>Next meal window: 12:00 - 14:00</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, gap: spacing.md, paddingBottom: 32 },
  header: { backgroundColor: colors.navy, margin: -16, padding: 16, marginBottom: 0, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  headerTitle: { color: colors.textOnNavy, fontSize: 22, fontWeight: '800' },
  headerSubtitle: { color: '#A5B4FC', fontSize: 13, marginTop: 4 },
  actions: { flexDirection: 'row', gap: spacing.md },
  actionCard: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight },
  actionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F0F0FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionEmoji: { fontSize: 22 },
  actionLabel: { fontWeight: '700', color: colors.navy },
  actionHint: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontWeight: '700', color: colors.navy, marginBottom: 12, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.borderLight },
  txDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  txTitle: { fontWeight: '600', color: colors.textPrimary, fontSize: 14 },
  txDate: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  txAmount: { fontWeight: '700', color: colors.navy },
  txPositive: { color: colors.success },
  muted: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
});
