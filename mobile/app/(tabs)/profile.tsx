import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors, radius } from '../../src/theme/theme';
import { FlashyCard } from '../../src/components/FlashyCard';
import { GoldButton } from '../../src/components/GoldButton';
import { StatusBadge } from '../../src/components/StatusBadge';

const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</Text>
    <View style={{ backgroundColor: colors.surfaceOverlay, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: colors.borderSubtle }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary }}>{value}</Text>
    </View>
  </View>
);

export function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: colors.surface, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, alignItems: 'center' }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.surface, fontWeight: '900', fontSize: 22 }}>CU</Text>
          </View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 12 }}>Crawford University</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 4 }}>Majesty Olatimilehin</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>LCU/UG/20/17109 \u2014 300 Level \u2014 Faith Hall</Text>
          <StatusBadge label="Active Student" variant="success" />
          <GoldButton title="Sign Out" onPress={() => {}} style={{ marginTop: 16 }} />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Field label="Firstname" value="Majesty" />
          <Field label="Lastname" value="Olatimilehin" />
          <Field label="Middlename" value="Oluwakolade" />
          <Field label="Email" value="majesty.olat@crawford.edu.ng" />
          <Field label="Next Funding Date" value="01 Sept 2026" />
          <Field label="Total Feeding Amount" value={'\u20A675,000'} />
          <Field label="Total Amount Funded" value={'\u20A668,500'} />

          <FlashyCard style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: colors.goldText, textTransform: 'uppercase', letterSpacing: 1 }}>Feeding Summary</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>Balance</Text>
              <Text style={{ fontWeight: '800', color: colors.gold, fontSize: 14 }}>{'\u20A6'}75.00</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={{ color: colors.textMuted, fontSize: 13 }}>Spent this semester</Text>
              <Text style={{ fontWeight: '700', color: colors.textPrimary, fontSize: 14 }}>{'\u20A6'}6,500</Text>
            </View>
          </FlashyCard>

          <Text style={{ fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 20 }}>v1.0.0 \u2014 #090D16 \u2014 Bursary: bursary@crawford.edu.ng</Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default ProfileScreen;
