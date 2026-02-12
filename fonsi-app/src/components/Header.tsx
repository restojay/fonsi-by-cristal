/**
 * Custom header component with salon branding
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '@constants/theme';

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
  backgroundColor = COLORS.bgPrimary,
  style,
}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={backgroundColor} />
      <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.content}>
          {showLogo && (
            <View style={styles.logoSection}>
              <Text style={styles.logoText}>✨</Text>
            </View>
          )}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
  } as ViewStyle,
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,
  logoSection: {
    marginRight: SPACING.md,
  } as ViewStyle,
  logoText: {
    fontSize: FONTS['2xl'],
  } as TextStyle,
  titleSection: {
    flex: 1,
  } as ViewStyle,
  title: {
    fontSize: FONTS.xl,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  subtitle: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  } as TextStyle,
});
