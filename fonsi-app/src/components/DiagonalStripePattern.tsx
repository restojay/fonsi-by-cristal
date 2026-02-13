/**
 * Diagonal stripe pattern overlay — replicates the website's repeating-linear-gradient(135deg) texture
 * Pure RN Views, no extra packages needed
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DiagonalStripePatternProps {
  opacity?: number;
  style?: ViewStyle;
}

const STRIPE_COUNT = 40;
const STRIPE_GAP = 8;

export const DiagonalStripePattern: React.FC<DiagonalStripePatternProps> = ({
  opacity = 0.06,
  style,
}) => {
  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {Array.from({ length: STRIPE_COUNT }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.stripe,
            {
              left: i * STRIPE_GAP - STRIPE_COUNT * 2,
              opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    transform: [{ rotate: '135deg' }],
  } as ViewStyle,
  stripe: {
    position: 'absolute',
    width: 1,
    height: '200%',
    top: '-50%',
    backgroundColor: '#ffffff',
  } as ViewStyle,
});
