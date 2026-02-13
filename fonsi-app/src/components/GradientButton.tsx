/**
 * Flat monochrome button with press scale animation
 * Primary: dark bg, white text, rounded-full
 * Outline: white bg, dark border, rounded-full
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, ANIMATION, SHADOWS } from '@constants/theme';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  icon?: keyof typeof Feather.glyphMap;
  iconRight?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  icon,
  iconRight,
  disabled = false,
  loading = false,
  style,
  size = 'medium',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, ANIMATION.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring);
  };

  const sizeStyles = {
    small: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
    medium: { paddingVertical: SPACING.md + 2, paddingHorizontal: SPACING.xl },
    large: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING['2xl'] },
  };

  const fontSizes = {
    small: FONTS.sm,
    medium: FONTS.base,
    large: FONTS.lg,
  };

  const iconSize = size === 'small' ? 14 : size === 'medium' ? 16 : 18;

  if (variant === 'outline') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={disabled || loading}
        style={[animatedStyle, styles.outlineButton, sizeStyles[size], disabled && styles.disabledOutline, style]}
      >
        {icon && (
          <Feather
            name={icon}
            size={iconSize}
            color={disabled ? COLORS.textMuted : COLORS.textSecondary}
            style={styles.iconLeft}
          />
        )}
        {loading ? (
          <ActivityIndicator size="small" color={COLORS.textSecondary} />
        ) : (
          <Text
            style={[
              styles.outlineText,
              { fontSize: fontSizes[size] },
              disabled && styles.disabledOutlineText,
            ]}
          >
            {title}
          </Text>
        )}
        {iconRight && (
          <Feather
            name={iconRight}
            size={iconSize}
            color={disabled ? COLORS.textMuted : COLORS.textSecondary}
            style={styles.iconRight}
          />
        )}
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      disabled={disabled || loading}
      style={[animatedStyle, disabled && { opacity: 0.5 }, style]}
    >
      <View style={[styles.primaryButton, sizeStyles[size], disabled && styles.disabledPrimary, !disabled && SHADOWS.gold]}>
        {icon && (
          <Feather
            name={icon}
            size={iconSize}
            color={disabled ? COLORS.textMuted : '#ffffff'}
            style={styles.iconLeft}
          />
        )}
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text
            style={[
              styles.primaryText,
              { fontSize: fontSizes[size] },
              disabled && { color: COLORS.textMuted },
            ]}
          >
            {title}
          </Text>
        )}
        {iconRight && !loading && (
          <Feather
            name={iconRight}
            size={iconSize}
            color={disabled ? COLORS.textMuted : '#ffffff'}
            style={styles.iconRight}
          />
        )}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  primaryText: {
    color: '#ffffff',
    fontFamily: FONTS.sansSerifSemiBold,
    fontSize: FONTS.base,
  } as TextStyle,
  disabledPrimary: {
    backgroundColor: COLORS.buttonDisabled,
  } as ViewStyle,
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLORS.borderColor,
    backgroundColor: '#ffffff',
  } as ViewStyle,
  outlineText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifSemiBold,
    fontSize: FONTS.base,
  } as TextStyle,
  disabledOutline: {
    borderColor: COLORS.borderColor,
    opacity: 0.5,
  } as ViewStyle,
  disabledOutlineText: {
    color: COLORS.textMuted,
  } as TextStyle,
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});
