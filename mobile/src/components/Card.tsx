import React from 'react';
import { View, StyleSheet, ViewProps } from 'react';
import { colors, radius, spacing } from '../theme/colors';

type CardProps = ViewProps & {
  elevated?: boolean;
};

/**
 * White card on navy background — unified card style for all mobile screens.
 * Usage: wrap content in <Card> to get white rounded container with shadow.
 */
export function Card({ style, elevated = true, children, ...props }: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
