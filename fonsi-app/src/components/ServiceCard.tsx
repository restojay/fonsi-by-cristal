/**
 * Reusable service card component with dark theme and gold accents
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Service } from '@types/index';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
  onBookPress?: () => void;
  isSelected?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  onBookPress,
  isSelected = false,
}) => {
  const priceRange =
    service.priceMin === service.priceMax
      ? `$${service.priceMin}`
      : `$${service.priceMin} - $${service.priceMax}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{service.name}</Text>
          <Text style={styles.duration}>{service.duration}m</Text>
        </View>

        {service.description && (
          <Text style={styles.description}>{service.description}</Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{priceRange}</Text>
          {onBookPress && (
            <TouchableOpacity
              onPress={onBookPress}
              style={styles.bookButton}
              activeOpacity={0.8}
            >
              <Text style={styles.bookButtonText}>Book</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  } as ViewStyle,
  selectedCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  } as ViewStyle,
  content: {
    flex: 1,
  } as ViewStyle,
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  name: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  duration: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    backgroundColor: COLORS.bgSecondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  } as TextStyle,
  description: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  price: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.primary,
  } as TextStyle,
  bookButton: {
    backgroundColor: COLORS.buttonBg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  } as ViewStyle,
  bookButtonText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
    fontSize: FONTS.sm,
  } as TextStyle,
});
