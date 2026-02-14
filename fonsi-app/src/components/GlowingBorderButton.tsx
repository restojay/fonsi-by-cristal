/**
 * CTA button with press-to-pop scale animation — matches website feel
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { FONTS, SPACING, BORDER_RADIUS, ANIMATION } from '@constants/theme';

interface GlowingBorderButtonProps {
  title: string;
  onPress: () => void;
  icon?: keyof typeof Feather.glyphMap;
  iconRight?: keyof typeof Feather.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GlowingBorderButton: React.FC<GlowingBorderButtonProps> = ({
  title,
  onPress,
  icon,
  iconRight,
  disabled = false,
  loading = false,
  style,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, ANIMATION.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1.0, { ...ANIMATION.spring, stiffness: 300, damping: 10 });
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      disabled={disabled || loading}
      style={[scaleStyle, disabled && { opacity: 0.5 }, style]}
    >
      <View style={styles.button}>
        {icon && (
          <Feather
            name={icon}
            size={18}
            color="#ffffff"
            style={styles.iconLeft}
          />
        )}
        <Text style={styles.buttonText}>{title}</Text>
        {iconRight && (
          <Feather
            name={iconRight}
            size={18}
            color="#ffffff"
            style={styles.iconRight}
          />
        )}
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171717',
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING['2xl'],
  } as ViewStyle,
  buttonText: {
    color: '#ffffff',
    fontFamily: FONTS.sansSerifSemiBold,
    fontSize: FONTS.base,
    textTransform: 'uppercase',
    letterSpacing: 2,
  } as TextStyle,
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
});
