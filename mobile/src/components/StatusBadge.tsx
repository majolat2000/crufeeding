import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

type Props = {
  label: string;
  variant?: 'success' | 'warning' | 'info';
};

const variants = {
  success: { bg: colors.emeraldGlow, text: colors.emerald },
  warning: { bg: colors.goldGlow, text: colors.goldText },
  info: { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8' },
};

export function StatusBadge({ label, variant = 'success' }: Props) {
  const v = variants[variant];
  return (
    <View style={[styles.badge, { backgroundColor: v.bg }]}>
      <View style={[styles.dot, { backgroundColor: v.text }]} />
      <Text style={[styles.label, { color: v.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
