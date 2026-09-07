import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius, shadow } from '../theme/theme';

type Props = {
  children: React.ReactNode;
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FlashyCard({ children, glow = false, style }: Props) {
  return (
    <View style={[styles.card, glow && styles.glow, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    ...shadow.card,
  },
  glow: {
    borderColor: colors.gold,
    ...shadow.glow,
  },
});
