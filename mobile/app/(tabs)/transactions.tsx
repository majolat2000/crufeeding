import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { colors, radius } from '../../src/theme/theme';
import { api } from '../../src/api/client';
import { useAuthStore } from '../../src/store/authStore';

type Tx = { id: string; vendorName: string; type: string; gross: number; status: string; createdAt: string; reference?: string };

export function TransactionsScreen() {
  const { user } = useAuthStore();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/payments/transactions?limit=50');
      setTxs(data.data || []);
    } catch {}
  };

  useEffect(() => { fetchTransactions(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Tx }) => (
    <View style={{
      backgroundColor: colors.surface, borderRadius: radius.lg,
      marginHorizontal: 20, marginBottom: 12, padding: 16,
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderColor: colors.borderSubtle,
    }}>
      <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: item.type === 'credit' ? colors.emeraldGlow : colors.goldGlow, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Text style={{ fontSize: 18 }}>{item.type === 'credit' ? '\uD83D\uDCB0' : '\uD83C\uDF7D'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>{item.vendorName || item.vendorId}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
          {new Date(item.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}{' \u2022 '}{new Date(item.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        {item.reference && <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>{item.reference}</Text>}
      </View>
      <Text style={{ fontSize: 15, fontWeight: '800', color: item.type === 'credit' ? colors.emerald : colors.gold }}>
        {item.type === 'credit' ? '+' : '-'}{'\u20A6'}{Number(item.gross).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>Transactions</Text>
          <View style={{ backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700' }}>{user?.matricNo || 'N/A'}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>History</Text>
      </View>
      <FlatList
        data={txs}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>No transactions yet</Text>
          </View>
        }
      />
    </View>
  );
}

export default TransactionsScreen;
