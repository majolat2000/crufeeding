import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius } from '../src/theme/theme';
import { api } from '../src/api/client';
import { useAuthStore } from '../src/store/authStore';
import { GoldButton } from '../src/components/GoldButton';

type FoodItem = {
  id: string;
  name: string;
  cost: number;
  category: string;
  pictureUrl?: string;
  available: boolean;
};

type CartItem = { item: FoodItem; quantity: number };

const CATEGORIES = ['Carbohydrate', 'Protein', 'Drink', 'Others'] as const;

const categoryIcon = (cat: string) => {
  switch (cat) {
    case 'Carbohydrate': return '\uD83C\uDF5E';
    case 'Protein': return '\uD83E\uDD69';
    case 'Drink': return '\uD83E\uDD64';
    default: return '\uD83C\uDF7D\uFE0F';
  }
};

export function CafeteriaScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | 'All'>('All');
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/vendor/catalog');
      setItems(data.data || []);
    } catch {
      Alert.alert('Error', 'Failed to load menu');
    } finally { setLoading(false); }
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === itemId);
      if (!existing) return prev;
      if (existing.quantity <= 1) return prev.filter(c => c.item.id !== itemId);
      return prev.map(c => c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c);
    });
  };

  const getCartQty = (itemId: string) => cart.find(c => c.item.id === itemId)?.quantity || 0;

  const totalAmount = cart.reduce((sum, c) => sum + c.item.cost * c.quantity, 0);

  const handlePay = () => {
    if (cart.length === 0) return Alert.alert('Empty Cart', 'Add items to your cart first');
    setShowPinModal(true);
  };

  const submitOrder = async () => {
    if (!pin || pin.length < 4) return Alert.alert('Error', 'Enter your 4-6 digit PIN');
    setOrdering(true);
    try {
      const orderItems = cart.map(c => ({ foodItemId: c.item.id, name: c.item.name, quantity: c.quantity }));
      const { data } = await api.post('/orders', { items: orderItems, pin });
      setShowPinModal(false);
      setPin('');
      setCart([]);
      router.push({ pathname: '/order-confirm', params: {
        orderId: data.data.orderId,
        qrCode: data.data.qrCode,
        shortCode: data.data.shortCode,
        totalAmount: String(data.data.totalAmount),
        expiresAt: data.data.expiresAt,
      }});
    } catch (e: any) {
      Alert.alert('Order Failed', e.message);
      setPin('');
    } finally { setOrdering(false); }
  };

  const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '700' }}>{'\u2190'} Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary }}>The Cafeteria</Text>
          <View style={{ width: 50 }} />
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, paddingVertical: 12 }} contentContainerStyle={{ gap: 8 }}>
        {(['All', ...CATEGORIES] as const).map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={{
              paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.full,
              backgroundColor: activeCategory === cat ? colors.gold : colors.surfaceOverlay,
              borderWidth: 1, borderColor: activeCategory === cat ? colors.gold : colors.borderSubtle,
            }}
          >
            <Text style={{ color: activeCategory === cat ? colors.surface : colors.textMuted, fontSize: 12, fontWeight: '700' }}>
              {cat === 'All' ? '\uD83C\uDF7D\uFE0F All' : `${categoryIcon(cat)} ${cat}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Food Items */}
      {loading ? (
        <ActivityIndicator color={colors.gold} size="large" style={{ marginTop: 60 }} />
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingBottom: 120 }}>
          {filteredItems.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Text style={{ color: colors.textMuted, fontSize: 14 }}>No items available</Text>
            </View>
          ) : (
            filteredItems.map(item => {
              const qty = getCartQty(item.id);
              return (
                <View key={item.id} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.borderSubtle }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.goldGlow, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20 }}>{categoryIcon(item.category)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{item.category}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: colors.gold }}>{'\u20A6'}{Number(item.cost).toLocaleString()}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12, gap: 12 }}>
                    {qty > 0 && (
                      <>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' }}>
                          <Text style={{ color: '#EF4444', fontSize: 18, fontWeight: '700' }}>-</Text>
                        </TouchableOpacity>
                        <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: '800', minWidth: 20, textAlign: 'center' }}>{qty}</Text>
                      </>
                    )}
                    <TouchableOpacity onPress={() => addToCart(item)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.emeraldGlow, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.emerald }}>
                      <Text style={{ color: colors.emerald, fontSize: 18, fontWeight: '700' }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Cart Footer */}
      {cart.length > 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.borderSubtle, padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{cart.reduce((s, c) => s + c.quantity, 0)} item(s)</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: '800' }}>{'\u20A6'}{totalAmount.toLocaleString()}</Text>
          </View>
          <GoldButton title="Pay" onPress={handlePay} />
        </View>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(9,13,22,0.95)', justifyContent: 'center', padding: 32 }}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <Text style={{ fontSize: 32 }}>{'\uD83D\uDD10'}</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '800', marginTop: 12 }}>Enter Transaction PIN</Text>
            <Text style={{ color: colors.textMuted, fontSize: 13, marginTop: 4 }}>Confirm payment of {'\u20A6'}{totalAmount.toLocaleString()}</Text>
          </View>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="\u2022\u2022\u2022\u2022"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            secureTextEntry
            style={{ backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border, fontSize: 24, textAlign: 'center', letterSpacing: 12 }}
          />
          <TouchableOpacity onPress={submitOrder} disabled={ordering} activeOpacity={0.85} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 15 }}>{ordering ? 'Processing...' : 'Verify & Pay'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setShowPinModal(false); setPin(''); }} style={{ alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default CafeteriaScreen;
