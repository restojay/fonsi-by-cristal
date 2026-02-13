/**
 * Shimmer loading placeholder - lighter base, subtler highlight, slower shimmer
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SPACING } from '@constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonItem: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = BORDER_RADIUS.md,
  style,
}) => {
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value * 200 }],
  }));

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#f0f0f0',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          animatedStyle,
          { width: '200%' },
        ]}
      >
        <LinearGradient
          colors={['transparent', '#fafafa', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardHeader}>
      <SkeletonItem width="60%" height={18} />
      <SkeletonItem width={50} height={24} borderRadius={BORDER_RADIUS.sm} />
    </View>
    <SkeletonItem width="90%" height={14} style={{ marginBottom: SPACING.sm }} />
    <SkeletonItem width="70%" height={14} style={{ marginBottom: SPACING.lg }} />
    <View style={styles.cardFooter}>
      <SkeletonItem width={80} height={20} />
      <SkeletonItem width={70} height={32} borderRadius={BORDER_RADIUS.md} />
    </View>
  </View>
);

export const SkeletonList: React.FC<{ count?: number; style?: ViewStyle }> = ({
  count = 3,
  style,
}) => (
  <View style={style}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} style={{ marginBottom: SPACING.md }} />
    ))}
  </View>
);

export { SkeletonItem as SkeletonLoader };

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS['2xl'],
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    padding: SPACING.xl,
    marginBottom: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
