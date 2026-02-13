/**
 * Glowing border button — RN equivalent of the website's HoverBorderGradient
 * Continuously spinning gradient border around a dark pill button
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, ANIMATION } from '@constants/theme';

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
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 3000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.96, ANIMATION.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring);
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gradientStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
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
      <View style={styles.outerContainer}>
        {/* Spinning gradient border */}
        <Animated.View style={[styles.gradientContainer, gradientStyle]}>
          <LinearGradient
            colors={['#171717', '#525252', '#a3a3a3', '#525252', '#171717']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </Animated.View>

        {/* Inner dark pill */}
        <View style={styles.innerButton}>
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
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: BORDER_RADIUS.full,
    padding: 2,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#171717',
  } as ViewStyle,
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BORDER_RADIUS.full,
  } as ViewStyle,
  gradient: {
    width: '150%',
    height: '150%',
    position: 'absolute',
    top: '-25%',
    left: '-25%',
  } as ViewStyle,
  innerButton: {
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
