/**
 * Services screen with grid cards, category tabs, and floating book button
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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '@components/Header';
import { AnimatedSection } from '@components/AnimatedSection';
import { SectionLabel } from '@components/SectionLabel';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { useBookingStore } from '@store/bookingStore';
import { apiClient } from '@api/client';
import { Service } from '@types/index';
import { SERVICES } from '@constants/services';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Hair': return 'content-cut';
    case 'Bridal': return 'diamond-stone';
    case 'Makeup': return 'brush';
    case 'Waxing': return 'spa';
    default: return 'star';
  }
};

export default function ServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Hair');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setSelectedService, setStep } = useBookingStore();
  const insets = useSafeAreaInsets();

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

  const handleSelectService = (service: Service) => {
    if (selectedCategory === 'Hair') {
      // Multi-select for Hair
      setSelectedServices((prev) => {
        const exists = prev.find((s) => s.id === service.id);
        if (exists) return prev.filter((s) => s.id !== service.id);
        return [...prev, service];
      });
    } else {
      // Single-select for other categories
      setSelectedServices((prev) =>
        prev.length === 1 && prev[0].id === service.id ? [] : [service]
      );
    }
  };

  const handleBook = () => {
    if (selectedServices.length === 1) {
      setSelectedService(selectedServices[0]);
      setStep(2);
    } else if (selectedServices.length > 1) {
      // Set first as primary, store will handle stacking
      setSelectedService(selectedServices[0]);
      setStep(2);
    } else {
      setStep(1);
    }
    router.push('/book');
  };

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Header
          title="Services"
          subtitle="Explore our offerings"
          showLogo={false}
        />

        {/* Category Tabs */}
        <View style={styles.categoriesSection}>
          <View style={styles.categoriesGrid}>
            {CATEGORY_CONFIG.map((cat) => {
              const isActive = selectedCategory === cat.name;
              const count = categoryCount(cat.name);

              return (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => {
                    setSelectedCategory(cat.name);
                    setSelectedServices([]);
                  }}
                  activeOpacity={0.7}
                  style={[
                    styles.categoryGridItem,
                    isActive ? styles.categoryTab : styles.categoryTabInactive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={cat.icon as any}
                    size={16}
                    color={isActive ? COLORS.bgPrimary : COLORS.textSecondary}
                  />
                  <Text style={isActive ? styles.categoryTabTextActive : styles.categoryTabText}>
                    {cat.name}
                  </Text>
                  {count > 0 && (
                    <View style={isActive ? styles.countBadgeActive : styles.countBadge}>
                      <Text style={isActive ? styles.countBadgeTextActive : styles.countBadgeText}>
                        {count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesSection}>
          {isLoading ? (
            <View style={styles.loadingGrid}>
              {[1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.skeletonCard} />
              ))}
            </View>
          ) : filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="magnify" size={32} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          ) : (
            <>
              <Text style={styles.categoryCount}>
                {filteredServices.length} {selectedCategory} Service
                {filteredServices.length !== 1 ? 's' : ''}
              </Text>
              <View style={styles.grid}>
                {filteredServices.map((service, index) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  const priceText =
                    service.priceMin === service.priceMax
                      ? `$${service.priceMin}`
                      : `$${service.priceMin} - $${service.priceMax}`;

                  return (
                    <AnimatedSection key={service.id} index={index} style={styles.gridItem}>
                      <TouchableOpacity
                        style={[styles.card, isSelected && styles.cardSelected]}
                        activeOpacity={0.7}
                        onPress={() => handleSelectService(service)}
                      >
                        <View style={[styles.cardIcon, isSelected && styles.cardIconSelected]}>
                          <MaterialCommunityIcons
                            name={getCategoryIcon(service.category) as any}
                            size={16}
                            color="#ffffff"
                          />
                        </View>
                        <Text
                          style={[styles.cardName, isSelected && styles.cardNameSelected]}
                          numberOfLines={2}
                        >
                          {service.name}
                        </Text>
                        <Text style={[styles.cardPrice, isSelected && styles.cardPriceSelected]}>
                          {priceText}
                        </Text>
                        <View style={styles.cardFooter}>
                          <Feather
                            name="clock"
                            size={10}
                            color={isSelected ? 'rgba(255,255,255,0.5)' : COLORS.textMuted}
                          />
                          <Text style={[styles.cardDuration, isSelected && styles.cardDurationSelected]}>
                            {service.duration}m
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkBadge}>
                            <Feather name="check" size={12} color="#171717" />
                          </View>
                        )}
                      </TouchableOpacity>
                    </AnimatedSection>
                  );
                })}
              </View>
            </>
          )}
          {/* Bottom spacer for floating button */}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Floating Book Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 70 }]}
        activeOpacity={0.85}
        onPress={handleBook}
      >
        <Feather name="calendar" size={20} color="#ffffff" />
        <Text style={styles.fabText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  container: {
    flex: 1,
  } as ViewStyle,
  categoriesSection: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomColor: '#e5e5e5',
    borderBottomWidth: 1,
  } as ViewStyle,
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  } as ViewStyle,
  categoryGridItem: {
    width: '48%',
    justifyContent: 'center',
  } as ViewStyle,
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: '#171717',
    gap: SPACING.xs,
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
    gap: SPACING.xs,
  } as ViewStyle,
  categoryTabText: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textSecondary,
  } as TextStyle,
  categoryTabTextActive: {
    fontSize: FONTS.xs,
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
  } as ViewStyle,
  categoryCount: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
    fontFamily: FONTS.sansSerifSemiBold,
    textTransform: 'uppercase',
    letterSpacing: 3,
  } as TextStyle,
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  } as ViewStyle,
  gridItem: {
    width: '50%',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  card: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    height: 150,
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  } as ViewStyle,
  cardSelected: {
    backgroundColor: '#171717',
    borderColor: '#171717',
  } as ViewStyle,
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  cardIconSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  } as ViewStyle,
  cardName: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    lineHeight: 18,
  } as TextStyle,
  cardNameSelected: {
    color: '#ffffff',
  } as TextStyle,
  cardPrice: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifBold,
    color: COLORS.primary,
  } as TextStyle,
  cardPriceSelected: {
    color: '#ffffff',
  } as TextStyle,
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  cardDuration: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: 4,
  } as TextStyle,
  cardDurationSelected: {
    color: 'rgba(255,255,255,0.5)',
  } as TextStyle,
  checkBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  loadingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  } as ViewStyle,
  skeletonCard: {
    width: '48%',
    height: 150,
    backgroundColor: '#f0f0f0',
    borderRadius: BORDER_RADIUS['2xl'],
    marginHorizontal: '1%',
    marginBottom: SPACING.sm,
  } as ViewStyle,
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
  fab: {
    position: 'absolute',
    right: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#171717',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
    ...SHADOWS.lg,
  } as ViewStyle,
  fabText: {
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerifSemiBold,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 2,
  } as TextStyle,
});
