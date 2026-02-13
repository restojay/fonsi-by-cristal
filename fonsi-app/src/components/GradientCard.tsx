/**
 * Light card with flat background, visible shadow, and subtle border
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS } from '@constants/theme';

interface GradientCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  showAccent?: boolean;
  style?: ViewStyle;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  variant = 'default',
  showAccent = true,
  style,
}) => {
  return (
    <View
      style={[
        variant === 'glass' ? styles.glassCard : styles.cardContainer,
        style,
      ]}
    >
      {showAccent && <View style={styles.accentBar} />}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.md,
  } as ViewStyle,
  glassCard: {
    borderRadius: BORDER_RADIUS['2xl'],
    backgroundColor: COLORS.bgTertiary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    overflow: 'hidden',
  } as ViewStyle,
  accentBar: {
    height: 3,
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  content: {
    padding: SPACING.xl,
  } as ViewStyle,
});
