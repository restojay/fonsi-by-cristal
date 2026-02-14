import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '@constants/theme';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('App ErrorBoundary:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.link}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgPrimary },
  title: { fontSize: FONTS['2xl'], fontFamily: FONTS.serifBold, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  link: { fontSize: FONTS.base, color: COLORS.primary, textDecorationLine: 'underline' },
});
