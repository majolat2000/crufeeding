import React from 'react';
import { View, Text, StyleSheet } from 'react';
import { colors, radius } from '../theme/colors';
import { Card } from './Card';

type Props = {
  balance: number;
  studentName: string;
  matricNo: string;
};

/**
 * Wallet balance hero card — navy header text, white body.
 */
export function BalanceCard({ balance, studentName, matricNo }: Props) {
  return (
    <Card style={styles.container}>
      <Text style={styles.label}>Wallet Balance</Text>
      <Text style={styles.balance}>₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</Text>
      <View style={styles.divider} />
      <Text style={styles.name}>{studentName}</Text>
      <Text style={styles.matric}>{matricNo}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  balance: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.navy,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  matric: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
