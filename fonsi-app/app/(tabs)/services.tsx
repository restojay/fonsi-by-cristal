/**
 * Services screen with category filters and service cards
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Header } from '@components/Header';
import { ServiceCard } from '@components/ServiceCard';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@constants/theme';
import { useBookingStore } from '@store/bookingStore';
import { apiClient } from '@api/client';
import { Service } from '@types/index';
import { SERVICES } from '@constants/services';

type ServiceCategory = 'Hair' | 'Bridal' | 'Makeup' | 'Waxing';

const CATEGORIES: ServiceCategory[] = ['Hair', 'Bridal', 'Makeup', 'Waxing'];

export default function ServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Hair');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedService, setStep } = useBookingStore();

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        const allServices = await apiClient.getServices();
        setServices(allServices);
      } catch (error) {
        console.error('Failed to load services', error);
        setServices(SERVICES);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter((s) => s.category === selectedCategory);

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    router.push('/book');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header
        title="Services"
        subtitle="Explore our offerings"
        showLogo={false}
      />

      {/* Category Tabs */}
      <View style={styles.categoriesSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.categoryTabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Services List */}
      <View style={styles.servicesSection}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : filteredServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.categoryCount}>
              {filteredServices.length} {selectedCategory} Service
              {filteredServices.length !== 1 ? 's' : ''}
            </Text>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookPress={() => handleBookService(service)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  categoriesSection: {
    paddingVertical: SPACING.md,
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
  } as ViewStyle,
  categoriesList: {
    flexGrow: 0,
  } as ViewStyle,
  categoriesContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  } as ViewStyle,
  categoryTab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    marginRight: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  } as ViewStyle,
  categoryTabText: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  } as TextStyle,
  categoryTabTextActive: {
    color: COLORS.bgPrimary,
  } as TextStyle,
  servicesSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  categoryCount: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontWeight: '500',
  } as TextStyle,
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  } as ViewStyle,
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
  } as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  } as ViewStyle,
  emptyText: {
    fontSize: FONTS.lg,
    color: COLORS.textSecondary,
    fontWeight: '500',
  } as TextStyle,
});
