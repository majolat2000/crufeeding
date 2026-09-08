import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, FlatList, Modal, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius } from '../src/theme/theme';
import { api } from '../src/api/client';
import { useAuthStore } from '../src/store/authStore';
import { GoldButton } from '../src/components/GoldButton';
import { FlashyCard } from '../src/components/FlashyCard';
import { StatusBadge } from '../src/components/StatusBadge';

type FoodItem = {
  id: string;
  name: string;
  cost: number;
  category: string;
  pictureUrl?: string;
  available: boolean;
  createdAt: string;
};

const CATEGORIES = ['Carbohydrate', 'Protein', 'Drink', 'Others'] as const;

export function VendorScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formCategory, setFormCategory] = useState<string>('Carbohydrate');
  const [formPictureUrl, setFormPictureUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/vendor/food');
      setItems(data.data || []);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormCost('');
    setFormCategory('Carbohydrate');
    setFormPictureUrl('');
    setShowAdd(true);
  };

  const openEdit = (item: FoodItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCost(String(item.cost));
    setFormCategory(item.category);
    setFormPictureUrl(item.pictureUrl || '');
    setShowAdd(true);
  };

  const handleSave = async () => {
    if (!formName || !formCost) return Alert.alert('Error', 'Name and cost required');
    const cost = Number(formCost);
    if (cost <= 0) return Alert.alert('Error', 'Cost must be positive');
    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/vendor/food/${editingItem.id}`, { name: formName, cost, category: formCategory, pictureUrl: formPictureUrl || undefined });
        Alert.alert('Success', 'Food item updated');
      } else {
        await api.post('/vendor/food', { name: formName, cost, category: formCategory, pictureUrl: formPictureUrl || undefined });
        Alert.alert('Success', 'Food item created');
      }
      setShowAdd(false);
      fetchItems();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (item: FoodItem) => {
    Alert.alert('Delete Item', `Delete "${item.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/vendor/food/${item.id}`);
          fetchItems();
        } catch (e: any) {
          Alert.alert('Error', e.message);
        }
      }},
    ]);
  };

  const toggleAvailability = async (item: FoodItem) => {
    try {
      await api.put(`/vendor/food/${item.id}`, { available: !item.available });
      fetchItems();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const categoryIcon = (cat: string) => {
    switch (cat) {
      case 'Carbohydrate': return '🍞';
      case 'Protein': return '🥩';
      case 'Drink': return '🥤';
      default: return '🍽️';
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary }}>Vendor Platform</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{user?.fullname || 'The Cafeteria'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: colors.borderSubtle }}>
            <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '700' }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <View style={{ flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.gold, borderWidth: 1, borderColor: colors.gold, alignItems: 'center' }}>
            <Text style={{ color: colors.surface, fontSize: 13, fontWeight: '700' }}>{'\uD83C\uDF7D\uFE0F'} Food Items</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/vendor-confirm')} style={{ flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.emeraldGlow, borderWidth: 1, borderColor: colors.emerald, alignItems: 'center' }}>
            <Text style={{ color: colors.emerald, fontSize: 13, fontWeight: '700' }}>{'\u2705'} Confirm Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <FlashyCard style={{ flex: 1 }}>
            <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Total Items</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 24, fontWeight: '900', marginTop: 4 }}>{items.length}</Text>
          </FlashyCard>
          <FlashyCard style={{ flex: 1 }}>
            <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>Available</Text>
            <Text style={{ color: colors.emerald, fontSize: 24, fontWeight: '900', marginTop: 4 }}>{items.filter(i => i.available).length}</Text>
          </FlashyCard>
        </View>

        {/* Add Button */}
        <TouchableOpacity onPress={openAdd} style={{ backgroundColor: colors.gold, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ color: colors.surface, fontWeight: '800', fontSize: 14 }}>+ Add Food Item</Text>
        </TouchableOpacity>

        {/* Food Items List */}
        {loading ? (
          <ActivityIndicator color={colors.gold} size="large" style={{ marginTop: 40 }} />
        ) : items.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 40 }}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>No food items yet</Text>
            <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4 }}>Tap "Add Food Item" to get started</Text>
          </View>
        ) : (
          items.map(item => (
            <View key={item.id} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: 12, padding: 16, borderWidth: 1, borderColor: item.available ? colors.borderSubtle : 'rgba(239,68,68,0.3)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.goldGlow, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20 }}>{categoryIcon(item.category)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>{item.name}</Text>
                    {!item.available && <StatusBadge label="Unavailable" variant="info" />}
                  </View>
                  <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>{item.category}</Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: colors.gold }}>{'\u20A6'}{Number(item.cost).toLocaleString()}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity onPress={() => toggleAvailability(item)} style={{ flex: 1, backgroundColor: item.available ? 'rgba(239,68,68,0.15)' : colors.emeraldGlow, borderRadius: radius.sm, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: item.available ? 'rgba(239,68,68,0.3)' : colors.emerald }}>
                  <Text style={{ color: item.available ? '#EF4444' : colors.emerald, fontSize: 11, fontWeight: '700' }}>{item.available ? 'Mark Unavailable' : 'Mark Available'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openEdit(item)} style={{ flex: 1, backgroundColor: colors.goldGlow, borderRadius: radius.sm, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: colors.goldText, fontSize: 11, fontWeight: '700' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={{ flex: 1, backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: radius.sm, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' }}>
                  <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Footer */}
        <Text style={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>v1.0.0 {'\u00A9'} CRU Feeding</Text>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(9,13,22,0.9)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary }}>{editingItem ? 'Edit Food Item' : 'Add Food Item'}</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)}>
                <Text style={{ color: colors.textMuted, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Food Name</Text>
              <TextInput value={formName} onChangeText={setFormName} placeholder="e.g. Jollof Rice" placeholderTextColor={colors.textMuted} style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 16 }} />

              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Cost / Price (₦)</Text>
              <TextInput value={formCost} onChangeText={setFormCost} placeholder="0" placeholderTextColor={colors.textMuted} keyboardType="numeric" style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 16 }} />

              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Category</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setFormCategory(cat)}
                    style={{
                      paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.sm,
                      backgroundColor: formCategory === cat ? colors.goldGlow : colors.surfaceOverlay,
                      borderWidth: 1, borderColor: formCategory === cat ? colors.gold : colors.borderSubtle,
                    }}
                  >
                    <Text style={{ color: formCategory === cat ? colors.goldText : colors.textMuted, fontSize: 12, fontWeight: '700' }}>{categoryIcon(cat)} {cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Picture URL (optional)</Text>
              <TextInput value={formPictureUrl} onChangeText={setFormPictureUrl} placeholder="https://..." placeholderTextColor={colors.textMuted} autoCapitalize="none" style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 12, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, fontSize: 14, marginBottom: 20 }} />

              <GoldButton title={saving ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'} onPress={handleSave} disabled={saving} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default VendorScreen;
