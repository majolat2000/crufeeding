import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { colors, radius } from '../../src/theme/theme';

type Tx = { id: string; merchant: string; icon: string; timestamp: string; amount: number };

const DATA: Tx[] = [
  { id: '1', merchant: 'Burger & Bread', icon: '\uD83C\uDF54', timestamp: '28 Aug 2026 \u2022 12:34 PM', amount: 50 },
  { id: '2', merchant: 'Tasty Vine Kitchen', icon: '\uD83C\uDF72', timestamp: '28 Aug 2026 \u2022 09:12 AM', amount: 10 },
  { id: '3', merchant: 'Cresta', icon: '\uD83C\uDF55', timestamp: '27 Aug 2026 \u2022 07:45 PM', amount: 50 },
  { id: '4', merchant: 'Mama Cass', icon: '\uD83C\uDF5B', timestamp: '27 Aug 2026 \u2022 01:20 PM', amount: 10 },
  { id: '5', merchant: 'Burger & Bread', icon: '\uD83C\uDF54', timestamp: '26 Aug 2026 \u2022 06:05 PM', amount: 5 },
];

export function TransactionsScreen() {
  const renderItem = ({ item }: { item: Tx }) => (
    <View style={{
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginHorizontal: 20,
      marginBottom: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderSubtle,
    }}>
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.goldGlow, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Text style={{ fontSize: 18 }}>{item.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>{item.merchant}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>{item.timestamp}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '800', color: colors.gold }}>{'\u20A6'}{item.amount}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>Transactions</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>History \u2014 All debits, ledger-backed</Text>
      </View>
      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default TransactionsScreen;
