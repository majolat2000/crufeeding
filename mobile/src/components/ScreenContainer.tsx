import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';

type Props = { children: React.ReactNode; padded?: boolean };

export function ScreenContainer({ children, padded = true }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.container, padded && styles.padded]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  padded: {
    paddingHorizontal: Platform.OS === 'web' ? 24 : 20,
  },
});
