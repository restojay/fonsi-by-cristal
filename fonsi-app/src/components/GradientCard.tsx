/**
 * Card with gradient background + gold accent bar
 * Supports glass-morphism variant
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SPACING, SHADOWS, GRADIENTS } from '@constants/theme';

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
  if (variant === 'glass') {
    return (
      <View style={[styles.glassCard, style]}>
        {showAccent && <View style={styles.accentBar} />}
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.cardContainer, style]}>
      <LinearGradient
        colors={[...GRADIENTS.darkCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        {showAccent && <View style={styles.accentBar} />}
        <View style={styles.content}>{children}</View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BORDER_RADIUS.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    overflow: 'hidden',
    ...SHADOWS.md,
  } as ViewStyle,
  gradient: {
    borderRadius: BORDER_RADIUS.lg,
  } as ViewStyle,
  glassCard: {
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    overflow: 'hidden',
  } as ViewStyle,
  accentBar: {
    height: 3,
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  content: {
    padding: SPACING.lg,
  } as ViewStyle,
});
