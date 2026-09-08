import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { RESTAURANTS } from '../../src/constants/restaurants';
import { colors, radius } from '../../src/theme/theme';
import { useAuthStore } from '../../src/store/authStore';
import { StatusBadge } from '../../src/components/StatusBadge';
import { FlashyCard } from '../../src/components/FlashyCard';
import { api } from '../../src/api/client';

export function HomeScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuthStore();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBalance = async () => {
    try {
      if (!user?.id) return;
      const { data } = await api.get(`/wallet/${user.id}`);
      setBalance(Number(data.data?.balance ?? 0));
    } catch {}
  };

  const handleRestaurantPress = (merchant: string, amount: string) => {
    router.push({ pathname: '/pin-verify', params: { merchant, amount } });
  };

  const handleFundWallet = () => {
    Alert.alert('XpressPayments', 'Wallet funding via XpressPayments is coming soon. This feature will be available in a future update.', [{ text: 'OK' }]);
  };

  const renderRestaurant = ({ item }: { item: (typeof RESTAURANTS)[0] }) => (
    <TouchableOpacity
      onPress={() => handleRestaurantPress(item.name, '5')}
      activeOpacity={0.85}
      style={{
        flex: 1, margin: 6, minHeight: 110,
        backgroundColor: colors.surface, borderRadius: radius.lg,
        borderWidth: 1, borderColor: colors.border, padding: 16,
        alignItems: 'center', justifyContent: 'center',
        elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
      }}
    >
      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.goldGlow, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        <Text style={{ fontSize: 24 }}>{item.icon}</Text>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' }} numberOfLines={2}>{item.name}</Text>
      <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>Tap to pay</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.surface, fontWeight: '900', fontSize: 14 }}>CU</Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' }}>Crawford University</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.textPrimary }}>{user?.fullname || 'Student'}</Text>
            </View>
          </View>
          <StatusBadge label="Active" variant="success" />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <LinearGradient
            colors={[colors.bg, colors.surfaceOverlay, '#1a2744']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: radius.lg, padding: 24, borderWidth: 1, borderColor: colors.border }}
          >
            <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>Feeding Balance</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 38, fontWeight: '900', marginTop: 8, letterSpacing: -1 }}>{'\u20A6'}{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>{user?.matricNo || user?.level || 'Student'}</Text>
              <StatusBadge label="Active" variant="success" />
            </View>
            <View style={{ position: 'absolute', right: -20, top: -20, width: 96, height: 96, borderRadius: 48, backgroundColor: colors.goldGlow }} />
          </LinearGradient>
        </View>

        {/* Fund Wallet Button */}
        <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
          <TouchableOpacity
            onPress={handleFundWallet}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.emeraldGlow, borderRadius: radius.md, paddingVertical: 14,
              alignItems: 'center', borderWidth: 1, borderColor: colors.emerald,
              flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}
          >
            <Text style={{ color: colors.emerald, fontWeight: '800', fontSize: 14 }}>💳 Fund Wallet</Text>
            <View style={{ backgroundColor: colors.goldGlow, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.goldText, fontSize: 9, fontWeight: '700' }}>SOON</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 12, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: colors.goldText, letterSpacing: 1, textTransform: 'uppercase' }}>Available Restaurants</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{RESTAURANTS.length} vendor</Text>
          </View>
          <FlatList
            data={RESTAURANTS}
            keyExtractor={(i) => i.id}
            numColumns={2}
            scrollEnabled={false}
            renderItem={renderRestaurant}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          />
        </View>

        <FlashyCard glow style={{ marginHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: colors.gold, fontSize: 16 }}>{'\u26A1'}</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 12, flex: 1 }}>
              Tap The Cafeteria to generate your QR payment. 100% direct payout to vendor.
            </Text>
          </View>
        </FlashyCard>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
