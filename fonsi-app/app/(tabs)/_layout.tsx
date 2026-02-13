/**
 * Custom animated tab bar with Feather icons, flat background, and dark indicator
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, ANIMATION, BORDER_RADIUS } from '@constants/theme';

type TabIconName = 'home' | 'scissors' | 'calendar' | 'user';

const TAB_CONFIG: { name: string; title: string; icon: TabIconName }[] = [
  { name: 'index', title: 'Home', icon: 'home' },
  { name: 'services', title: 'Services', icon: 'scissors' },
  { name: 'book', title: 'Book', icon: 'calendar' },
  { name: 'profile', title: 'Profile', icon: 'user' },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function TabButton({
  onPress,
  isFocused,
  icon,
  label,
}: {
  onPress: () => void;
  isFocused: boolean;
  icon: TabIconName;
  label: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9, ANIMATION.springBouncy);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring);
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[styles.tabButton, animatedStyle]}
    >
      {isFocused && (
        <View style={styles.activeIndicator} />
      )}
      <Feather
        name={icon}
        size={20}
        color={isFocused ? COLORS.primary : COLORS.tabInactive}
      />
      <Text
        style={[
          styles.tabLabel,
          isFocused && styles.tabLabelActive,
        ]}
      >
        {label}
      </Text>
    </AnimatedTouchable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : SPACING.sm },
      ]}
    >
      <View style={styles.tabBarSeparator} />
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const config = TAB_CONFIG.find((t) => t.name === route.name);
          if (!config) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              onPress={onPress}
              isFocused={isFocused}
              icon={config.icon}
              label={config.title}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="services" options={{ title: 'Services' }} />
      <Tabs.Screen name="book" options={{ title: 'Book' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e5e5e5',
    borderTopWidth: 1,
    paddingTop: SPACING.sm,
  } as ViewStyle,
  tabBarSeparator: {
    height: 1,
    backgroundColor: '#e5e5e5',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  } as ViewStyle,
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  } as ViewStyle,
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    flex: 1,
  } as ViewStyle,
  activeIndicator: {
    position: 'absolute',
    top: -SPACING.sm,
    height: 3,
    width: 24,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#171717',
  } as ViewStyle,
  tabLabel: {
    fontSize: 11,
    fontFamily: FONTS.sansSerifMedium,
    color: COLORS.tabInactive,
    marginTop: SPACING.xs,
  } as TextStyle,
  tabLabelActive: {
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifSemiBold,
  } as TextStyle,
});
