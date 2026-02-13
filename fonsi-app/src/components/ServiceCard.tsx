/**
 * Light service card with monochrome style
 * Selected state: inverted (dark bg, white text)
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
      style={[animatedStyle, styles.wrapper]}
    >
      <View style={[styles.card, isSelected && styles.selectedCard]}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleRow}>
              <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
                <MaterialCommunityIcons
                  name={categoryIcon.name}
                  size={16}
                  color={isSelected ? '#ffffff' : COLORS.primary}
                />
              </View>
              <Text style={[styles.name, isSelected && styles.nameSelected]} numberOfLines={2}>{service.name}</Text>
            </View>
            <View style={[styles.durationBadge, isSelected && styles.durationBadgeSelected]}>
              <Feather name="clock" size={12} color={isSelected ? 'rgba(255,255,255,0.7)' : COLORS.textMuted} />
              <Text style={[styles.durationText, isSelected && styles.durationTextSelected]}>{service.duration}m</Text>
            </View>
          </View>

          {service.description && (
            <Text style={[styles.description, isSelected && styles.descriptionSelected]} numberOfLines={2}>{service.description}</Text>
          )}

          <View style={styles.footer}>
            <View style={[styles.priceBadge, isSelected && styles.priceBadgeSelected]}>
              <Text style={[styles.price, isSelected && styles.priceSelected]}>{priceRange}</Text>
            </View>
            {onBookPress && !isSelected && (
              <GradientButton
                title="Book"
                onPress={onBookPress}
                size="small"
                icon="calendar"
              />
            )}
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  card: {
    backgroundColor: COLORS.bgTertiary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.sm,
  } as ViewStyle,
  selectedCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
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
    backgroundColor: COLORS.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  } as ViewStyle,
  iconContainerSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  } as ViewStyle,
  name: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    flex: 1,
  } as TextStyle,
  nameSelected: {
    color: '#ffffff',
  } as TextStyle,
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginLeft: SPACING.sm,
  } as ViewStyle,
  durationBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  } as ViewStyle,
  durationText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: 4,
  } as TextStyle,
  durationTextSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  } as TextStyle,
  description: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  descriptionSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  } as TextStyle,
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  priceBadge: {
    backgroundColor: '#ffffff',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  } as ViewStyle,
  priceBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  } as ViewStyle,
  price: {
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerifBold,
    color: COLORS.textPrimary,
  } as TextStyle,
  priceSelected: {
    color: '#ffffff',
  } as TextStyle,
});
