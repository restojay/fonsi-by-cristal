/**
 * Fade-in + slide-up animation wrapper with spring-based entrance
 */

import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
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
  const translateY = useSharedValue(28);

  const totalDelay = delay + index * ANIMATION.stagger.delay;

  useEffect(() => {
    opacity.value = withDelay(
      totalDelay,
      withSpring(1, ANIMATION.springGentle)
    );
    translateY.value = withDelay(
      totalDelay,
      withSpring(0, ANIMATION.springGentle)
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
