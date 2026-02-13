/**
 * Dark flat header with diagonal stripe pattern overlay
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, TYPOGRAPHY } from '@constants/theme';
import { DiagonalStripePattern } from './DiagonalStripePattern';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'Fonsi by Cristal',
  subtitle,
  showLogo = true,
  backgroundColor,
  style,
}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor || COLORS.primary} />
      <View style={[styles.headerBg, backgroundColor ? { backgroundColor } : undefined]}>
        <DiagonalStripePattern opacity={0.08} />
        <SafeAreaView style={[styles.container, style]} edges={['top']}>
          <View style={styles.content}>
            {showLogo && (
              <View style={styles.logoSection}>
                <Ionicons name="sparkles" size={22} color="#ffffff" />
              </View>
            )}
            <View style={styles.titleSection}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
        </SafeAreaView>
        <View style={styles.separator} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  } as ViewStyle,
  container: {
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  } as ViewStyle,
  logoSection: {
    marginRight: SPACING.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  titleSection: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: 30,
    fontFamily: FONTS.serifBold,
    color: '#ffffff',
  } as TextStyle,
  subtitle: {
    fontSize: TYPOGRAPHY.sectionLabel.fontSize,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: SPACING.xs,
    fontFamily: FONTS.sansSerifSemiBold,
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.sectionLabel.letterSpacing,
  } as TextStyle,
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  } as ViewStyle,
});
