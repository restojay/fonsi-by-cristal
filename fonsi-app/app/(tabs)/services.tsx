/**
 * Services screen with category icons, flat active tabs, skeleton loading, and staggered cards
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@components/Header';
import { ServiceCard } from '@components/ServiceCard';
import { AnimatedSection } from '@components/AnimatedSection';
import { SkeletonList } from '@components/SkeletonLoader';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@constants/theme';
import { useBookingStore } from '@store/bookingStore';
import { apiClient } from '@api/client';
import { Service } from '@types/index';
import { SERVICES } from '@constants/services';

type ServiceCategory = 'Hair' | 'Bridal' | 'Makeup' | 'Waxing';

const CATEGORY_CONFIG: {
  name: ServiceCategory;
  icon: string;
}[] = [
  { name: 'Hair', icon: 'content-cut' },
  { name: 'Bridal', icon: 'diamond-stone' },
  { name: 'Makeup', icon: 'brush' },
  { name: 'Waxing', icon: 'spa' },
];

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
  const categoryCount = (cat: ServiceCategory) =>
    services.filter((s) => s.category === cat).length;

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
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORY_CONFIG.map((cat) => {
            const isActive = selectedCategory === cat.name;
            const count = categoryCount(cat.name);

            if (isActive) {
              return (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setSelectedCategory(cat.name)}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryTab}>
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={16}
                      color={COLORS.bgPrimary}
                    />
                    <Text style={styles.categoryTabTextActive}>{cat.name}</Text>
                    {count > 0 && (
                      <View style={styles.countBadgeActive}>
                        <Text style={styles.countBadgeTextActive}>{count}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={cat.name}
                onPress={() => setSelectedCategory(cat.name)}
                style={styles.categoryTabInactive}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={cat.icon as any}
                  size={16}
                  color={COLORS.textSecondary}
                />
                <Text style={styles.categoryTabText}>{cat.name}</Text>
                {count > 0 && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{count}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Services List */}
      <View style={styles.servicesSection}>
        {isLoading ? (
          <SkeletonList count={4} />
        ) : filteredServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="magnify" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No services found</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.categoryCount}>
              {filteredServices.length} {selectedCategory} Service
              {filteredServices.length !== 1 ? 's' : ''}
            </Text>
            {filteredServices.map((service, index) => (
              <AnimatedSection key={service.id} index={index}>
                <ServiceCard
                  service={service}
                  onBookPress={() => handleBookService(service)}
                />
              </AnimatedSection>
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
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
  } as ViewStyle,
  categoriesContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  } as ViewStyle,
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#171717',
    gap: SPACING.sm,
  } as ViewStyle,
  categoryTabInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#f5f5f5',
    borderColor: '#e5e5e5',
    borderWidth: 1,
    gap: SPACING.sm,
  } as ViewStyle,
  categoryTabText: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textSecondary,
  } as TextStyle,
  categoryTabTextActive: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.bgPrimary,
  } as TextStyle,
  countBadge: {
    backgroundColor: '#e5e5e5',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  } as ViewStyle,
  countBadgeText: {
    fontSize: FONTS.xs - 1,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textMuted,
  } as TextStyle,
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  } as ViewStyle,
  countBadgeTextActive: {
    fontSize: FONTS.xs - 1,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.bgPrimary,
  } as TextStyle,
  servicesSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  categoryCount: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    fontFamily: FONTS.sansSerifMedium,
  } as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  } as ViewStyle,
  emptyText: {
    fontSize: FONTS.lg,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifMedium,
    marginTop: SPACING.md,
  } as TextStyle,
});
