import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { colors, radius } from '../../src/theme/theme';
import { api } from '../../src/api/client';
import { useAuthStore } from '../../src/store/authStore';
import { FlashyCard } from '../../src/components/FlashyCard';
import { StatusBadge } from '../../src/components/StatusBadge';
import { useFocusEffect } from 'expo-router';

type OrderItem = { foodItemId: string; name: string; cost: number; quantity: number };
type Order = {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shortCode: string;
  createdAt: string;
  confirmedAt?: string;
};

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B', label: 'Processing' },
  confirmed: { bg: 'rgba(16,185,129,0.15)', text: '#10B981', label: 'Completed' },
  expired: { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8', label: 'Expired' },
  cancelled: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Cancelled' },
  failed: { bg: 'rgba(239,68,68,0.15)', text: '#EF4444', label: 'Failed' },
};

export function OrdersScreen() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchOrders(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const statusInfo = STATUS_COLORS[item.status] || STATUS_COLORS.pending;
    const itemCount = item.items.reduce((sum, i) => sum + i.quantity, 0);

    return (
      <View style={{
        backgroundColor: colors.surface, borderRadius: radius.lg,
        marginBottom: 12, padding: 16,
        borderWidth: 1, borderColor: colors.borderSubtle,
      }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: statusInfo.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16 }}>{item.status === 'confirmed' ? '\u2705' : item.status === 'pending' ? '\u23F3' : '\u274C'}</Text>
            </View>
            <View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPrimary }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>
                {new Date(item.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}{' \u2022 '}{new Date(item.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.gold }}>{'\u20A6'}{Number(item.totalAmount).toLocaleString()}</Text>
            <View style={{ backgroundColor: statusInfo.bg, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4, borderWidth: 1, borderColor: `${statusInfo.text}33` }}>
              <Text style={{ color: statusInfo.text, fontSize: 10, fontWeight: '700' }}>{statusInfo.label}</Text>
            </View>
          </View>
        </View>

        {/* Items breakdown */}
        <View style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.md, padding: 12, borderWidth: 1, borderColor: colors.borderSubtle }}>
          {item.items.map((food, idx) => (
            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
              <Text style={{ fontSize: 13, color: colors.textPrimary, flex: 1 }}>
                {food.quantity} x {food.name}
              </Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted, marginLeft: 8 }}>
                {'\u20A6'}{(food.cost * food.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={{ borderTopWidth: 1, borderTopColor: colors.borderSubtle, marginTop: 8, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Total</Text>
            <Text style={{ fontSize: 14, fontWeight: '800', color: colors.gold }}>{'\u20A6'}{Number(item.totalAmount).toLocaleString()}</Text>
          </View>
        </View>

        {/* Short code for pending */}
        {item.status === 'pending' && (
          <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>Show code to vendor:</Text>
            <View style={{ backgroundColor: colors.goldGlow, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.goldText, fontSize: 16, fontWeight: '900', letterSpacing: 4 }}>{item.shortCode}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>Orders</Text>
          <View style={{ backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700' }}>{orders.length} total</Text>
          </View>
        </View>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>Past and processing orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(i) => i.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
        ListEmptyComponent={
          loading ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>Loading orders...</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>No orders yet</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Orders you place will appear here</Text>
            </View>
          )
        }
      />
    </View>
  );
}

export default OrdersScreen;
