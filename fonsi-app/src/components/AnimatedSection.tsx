/**
 * Fade-in + slide-up animation wrapper with stagger support
 */

import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ANIMATION } from '@constants/theme';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  index?: number;
  style?: ViewStyle;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  delay = 0,
  index = 0,
  style,
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const totalDelay = delay + index * ANIMATION.stagger.delay;

  useEffect(() => {
    opacity.value = withDelay(
      totalDelay,
      withTiming(1, {
        duration: ANIMATION.timing.slow,
        easing: Easing.out(Easing.cubic),
      })
    );
    translateY.value = withDelay(
      totalDelay,
      withTiming(0, {
        duration: ANIMATION.timing.slow,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};
