/**
 * Uppercase tracked section label — brand signature element from the website
 * Used as section dividers: "POPULAR PICKS", "YOUR SCHEDULE", etc.
 */

import React from 'react';
import { Text, StyleSheet, TextStyle, ViewStyle, View } from 'react-native';
import { TYPOGRAPHY, SPACING } from '@constants/theme';

interface SectionLabelProps {
  text: string;
  style?: ViewStyle;
  light?: boolean;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  text,
  style,
  light = false,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, light && styles.labelLight]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.sm,
  } as ViewStyle,
  label: {
    ...TYPOGRAPHY.sectionLabel,
  } as TextStyle,
  labelLight: {
    color: 'rgba(255, 255, 255, 0.5)',
  } as TextStyle,
});
