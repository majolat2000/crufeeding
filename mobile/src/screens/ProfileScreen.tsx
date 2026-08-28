import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react';
import { colors, spacing, radius } from '../theme/colors';
import { Card } from '../components/Card';

/**
 * ProfileScreen — Student info, hostel/level, support, logout.
 */
export function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.md, gap: spacing.md, paddingBottom: 32 }}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>MO</Text></View>
          <Text style={styles.name}>Majesty O. Olatimilehin</Text>
          <Text style={styles.matric}>CRA/2023/001 • Computer Science • 300L</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>Faith Hall • Room 12</Text></View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Account</Text>
          {[
            { label: 'Wallet ID', value: 'WLT-9A2B-77C1' },
            { label: 'Hostel', value: 'Faith Hall' },
            { label: 'Level', value: '300' },
            { label: 'Bursary Status', value: 'Verified' },
          ].map((row) => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Actions</Text>
          {['Top up Wallet', 'Change PIN', 'Support / Help', 'Privacy Policy'].map((label) => (
            <TouchableOpacity key={label} style={styles.actionRow}>
              <Text style={styles.actionText}>{label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>crawford-feeding-mobile v1.0.0 • #1A153B theme</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.navy },
  header: { backgroundColor: colors.navy, padding: spacing.md },
  headerTitle: { color: colors.white, fontSize: 20, fontWeight: '800' },
  container: { flex: 1, backgroundColor: colors.background },
  profileCard: { alignItems: 'center', paddingVertical: spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: colors.white, fontWeight: '800', fontSize: 22 },
  name: { fontWeight: '800', fontSize: 18, color: colors.navy },
  matric: { color: colors.textSecondary, fontSize: 13, marginTop: 4, textAlign: 'center' },
  badge: { marginTop: 12, backgroundColor: '#EEF2FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  badgeText: { color: colors.navy, fontWeight: '700', fontSize: 12 },
  sectionTitle: { fontWeight: '700', color: colors.navy, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.borderLight },
  rowLabel: { color: colors.textSecondary, fontSize: 13 },
  rowValue: { fontWeight: '600', color: colors.textPrimary, fontSize: 13 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderTopWidth: 1, borderTopColor: colors.borderLight },
  actionText: { fontWeight: '600', color: colors.textPrimary },
  chevron: { color: colors.textSecondary, fontSize: 18 },
  logoutBtn: { backgroundColor: colors.white, borderWidth: 1, borderColor: '#FECACA', borderRadius: radius.md, padding: 16, alignItems: 'center' },
  logoutText: { color: colors.danger, fontWeight: '800' },
  version: { textAlign: 'center', color: colors.textSecondary, fontSize: 12, marginTop: 4 },
});
