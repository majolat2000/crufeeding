import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react';
import { colors, spacing, radius } from '../theme/colors';
import { Card } from '../components/Card';

type Tx = { id: string; title: string; amount: number; date: string; type: 'debit' | 'credit'; status: 'success' | 'pending' | 'failed' };

const MOCK: Tx[] = [
  { id: '1', title: 'Lunch - Main Cafeteria', amount: -1200, date: '2026-08-28 12:34', type: 'debit', status: 'success' },
  { id: '2', title: 'Wallet Top-up (Paystack)', amount: 10000, date: '2026-08-27 09:12', type: 'credit', status: 'success' },
  { id: '3', title: 'Dinner - Faith Hall Cafe', amount: -950, date: '2026-08-26 19:45', type: 'debit', status: 'success' },
  { id: '4', title: 'Breakfast - Main Cafeteria', amount: -800, date: '2026-08-26 08:20', type: 'debit', status: 'success' },
  { id: '5', title: 'Refund - Overcharge', amount: 200, date: '2026-08-25 14:00', type: 'credit', status: 'success' },
];

/**
 * TransactionsScreen — Filterable ledger list.
 */
export function TransactionsScreen() {
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');
  const data = filter === 'all' ? MOCK : MOCK.filter((t) => t.type === filter);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <Text style={styles.headerSubtitle}>Ledger • Wallet history</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.filters}>
          {(['all', 'debit', 'credit'] as const).map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterBtn, filter === f && styles.filterActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ gap: spacing.sm, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <Card style={styles.row}>
              <View style={[styles.icon, { backgroundColor: item.type === 'credit' ? '#ECFDF5' : '#FEF2F2' }]}>
                <Text>{item.type === 'credit' ? '↑' : '↓'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date} • {item.status}</Text>
              </View>
              <Text style={[styles.amount, item.amount > 0 ? styles.positive : styles.negative]}>
                {item.amount > 0 ? `+₦${item.amount.toLocaleString()}` : `₦${item.amount.toLocaleString()}`}
              </Text>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  header: { backgroundColor: colors.navy, padding: spacing.md },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: '800' },
  headerSubtitle: { color: '#A5B4FC', fontSize: 13, marginTop: 4 },
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  filters: { flexDirection: 'row', gap: 8, marginBottom: spacing.md },
  filterBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  filterActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  filterText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  filterTextActive: { color: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  title: { fontWeight: '600', color: colors.textPrimary },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  amount: { fontWeight: '800' },
  positive: { color: colors.success },
  negative: { color: colors.navy },
});
