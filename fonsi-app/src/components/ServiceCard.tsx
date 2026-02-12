/**
 * Service card with gradient card wrapper, category icon, duration badge, and animated book button
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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Service } from '@types/index';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION } from '@constants/theme';
import { GradientCard } from './GradientCard';
import { GradientButton } from './GradientButton';

interface ServiceCardProps {
  service: Service;
  onPress?: () => void;
  onBookPress?: () => void;
  isSelected?: boolean;
}

const getCategoryIcon = (category: string): { name: any; type: 'feather' | 'material' } => {
  switch (category) {
    case 'Hair':
      return { name: 'content-cut', type: 'material' };
    case 'Bridal':
      return { name: 'diamond-stone', type: 'material' };
    case 'Makeup':
      return { name: 'brush', type: 'material' };
    case 'Waxing':
      return { name: 'spa', type: 'material' };
    default:
      return { name: 'star', type: 'material' };
  }
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  onBookPress,
  isSelected = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, ANIMATION.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring);
  };

  const priceRange =
    service.priceMin === 0 && service.priceMax === 0
      ? 'Consultation'
      : service.priceMin === service.priceMax
        ? `$${service.priceMin}`
        : `$${service.priceMin} - $${service.priceMax}`;

  const categoryIcon = getCategoryIcon(service.category);

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[animatedStyle, styles.wrapper, isSelected && styles.selectedWrapper]}
    >
      <GradientCard showAccent={true} style={isSelected ? styles.selectedCard : undefined}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={categoryIcon.name}
                  size={16}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.name} numberOfLines={2}>{service.name}</Text>
            </View>
            <View style={styles.durationBadge}>
              <Feather name="clock" size={12} color={COLORS.primary} />
              <Text style={styles.durationText}>{service.duration}m</Text>
            </View>
          </View>

          {service.description && (
            <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.price}>{priceRange}</Text>
            {onBookPress && (
              <GradientButton
                title="Book"
                onPress={onBookPress}
                size="small"
                icon="calendar"
              />
            )}
          </View>
        </View>
      </GradientCard>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  selectedWrapper: {} as ViewStyle,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  } as ViewStyle,
  name: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    flex: 1,
  } as TextStyle,
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginLeft: SPACING.sm,
  } as ViewStyle,
  durationText: {
    fontSize: FONTS.xs,
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: 4,
  } as TextStyle,
  description: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  price: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.sansSerifBold,
    color: COLORS.primary,
  } as TextStyle,
});
