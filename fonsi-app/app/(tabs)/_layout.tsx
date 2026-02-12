/**
 * Bottom tab navigation with 4 tabs: Home, Services, Book, Profile
 */

import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { COLORS } from '@constants/theme';

const Tab = Tabs;

export default function TabsLayout() {
  const tabScreenOptions = ({
    title,
    icon,
  }: {
    title: string;
    icon: string;
  }): BottomTabNavigationOptions => ({
    title,
    tabBarLabel: title,
    tabBarIcon: ({ color, size }) => icon,
    headerShown: false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.tabInactive,
    tabBarStyle: {
      backgroundColor: COLORS.bgSecondary,
      borderTopColor: COLORS.borderColor,
      borderTopWidth: 1,
      paddingBottom: Platform.OS === 'ios' ? 8 : 0,
      paddingTop: 8,
      height: Platform.OS === 'ios' ? 88 : 64,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
    },
  });

  return (
    <Tab
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: {
          backgroundColor: COLORS.bgSecondary,
          borderTopColor: COLORS.borderColor,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 8 : 0,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>🏠</span>
          ),
        }}
      />
      <Tab.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarLabel: 'Services',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>✂️</span>
          ),
        }}
      />
      <Tab.Screen
        name="book"
        options={{
          title: 'Book',
          tabBarLabel: 'Book',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>📅</span>
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <span style={{ fontSize: 20, color }}>👤</span>
          ),
        }}
      />
    </Tab>
  );
}
