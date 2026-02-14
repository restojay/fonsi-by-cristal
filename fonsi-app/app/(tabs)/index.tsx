/**
 * Home screen with hero typography, section labels, glowing CTA, and dark icon circles
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { router } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedSection } from '@components/AnimatedSection';
import { GradientButton } from '@components/GradientButton';
import { GradientCard } from '@components/GradientCard';
import { GlowingBorderButton } from '@components/GlowingBorderButton';
import { SectionLabel } from '@components/SectionLabel';
import { SilkBackground } from '@components/SilkBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '@constants/theme';
import { BUSINESS } from '@constants/business';
import { useBookingStore } from '@store/bookingStore';
import { apiClient } from '@api/client';
import { Service } from '@types/index';

const FEATURED_IDS = ['hair-1', 'hair-3', 'hair-5', 'bridal-1', 'makeup-1', 'waxing-1'];

const pickFeatured = (services: Service[]): Service[] => {
  const picked = FEATURED_IDS.map((id) => services.find((s) => s.id === id)).filter(Boolean) as Service[];
  if (picked.length >= 6) return picked;
  return services.slice(0, 6);
};

const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'Hair': return 'content-cut';
    case 'Bridal': return 'diamond-stone';
    case 'Makeup': return 'brush';
    case 'Waxing': return 'spa';
    default: return 'star';
  }
};

export default function HomeScreen() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const { setSelectedService, setStep } = useBookingStore();

  useEffect(() => {
    const loadFeaturedServices = async () => {
      try {
        const services = await apiClient.getServices();
        setFeaturedServices(pickFeatured(services));
      } catch (error) {
        console.error('Failed to load featured services', error);
        const { SERVICES } = require('@constants/services');
        setFeaturedServices(pickFeatured(SERVICES));
      }
    };

    loadFeaturedServices();
  }, []);

  const handleQuickBook = () => {
    setStep(1);
    router.push('/book');
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service);
    setStep(2);
    router.push('/book');
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screenWrapper}>
    <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="never"
    >
      {/* Hero Section — padded top to extend behind status bar */}
      <View style={[styles.heroSection, { paddingTop: insets.top }]}>
        <SilkBackground />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.5)']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        {/* Hero Typography */}
        <AnimatedSection delay={50} style={styles.heroTypography}>
          <Text style={styles.heroTitle}>FONSI</Text>
          <Text style={styles.heroSubtitle}>BY CRISTAL</Text>
        </AnimatedSection>

        {/* Quick Book */}
        <AnimatedSection delay={100} style={styles.quickBookSection}>
          <GlowingBorderButton
            title="Book Your Appointment"
            onPress={handleQuickBook}
            iconRight="arrow-right"
          />
        </AnimatedSection>
      </View>

      <View style={styles.contentBelow}>
      {/* Featured Services */}
      <AnimatedSection delay={200} style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>

        <View style={styles.serviceGrid}>
          {featuredServices.map((service, index) => {
            const priceText =
              service.priceMin === service.priceMax
                ? `$${service.priceMin}`
                : `$${service.priceMin}+`;

            return (
              <AnimatedSection key={service.id} index={index} delay={250} style={styles.serviceGridItem}>
                <TouchableOpacity
                  style={styles.serviceCard}
                  activeOpacity={0.7}
                  onPress={() => handleBookService(service)}
                >
                  <View style={styles.serviceCardIcon}>
                    <MaterialCommunityIcons
                      name={getCategoryIcon(service.category) as any}
                      size={18}
                      color="#ffffff"
                    />
                  </View>
                  <Text style={styles.serviceCardName} numberOfLines={2}>
                    {service.name}
                  </Text>
                  <Text style={styles.serviceCardPrice}>{priceText}</Text>
                  <View style={styles.serviceCardDuration}>
                    <Feather name="clock" size={10} color={COLORS.textMuted} />
                    <Text style={styles.serviceCardDurationText}>{service.duration}m</Text>
                  </View>
                </TouchableOpacity>
              </AnimatedSection>
            );
          })}
        </View>

        <View style={styles.viewAllContainer}>
          <GradientButton
            title="View All Services"
            onPress={() => router.push('/services')}
            variant="primary"
            icon="arrow-right"
          />
        </View>
      </AnimatedSection>

      {/* Contact Info */}
      <AnimatedSection delay={500} style={styles.section}>
        <SectionLabel text="GET IN TOUCH" />
        <GradientCard>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <View style={styles.contactLabelRow}>
              <View style={styles.contactIconCircle}>
                <Feather name="map-pin" size={14} color="#ffffff" />
              </View>
              <Text style={styles.contactLabel}>Address</Text>
            </View>
            <Text style={styles.contactValue}>
              {BUSINESS.address.street}, {BUSINESS.address.suite}
            </Text>
            <Text style={styles.contactValue}>{BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}</Text>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactLabelRow}>
              <View style={styles.contactIconCircle}>
                <Feather name="phone" size={14} color="#ffffff" />
              </View>
              <Text style={styles.contactLabel}>Phone</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.contactLink}>{BUSINESS.phone}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactLabelRow}>
              <View style={styles.contactIconCircle}>
                <Feather name="clock" size={14} color="#ffffff" />
              </View>
              <Text style={styles.contactLabel}>Hours</Text>
            </View>
            <Text style={styles.contactValue}>{BUSINESS.hours.open}</Text>
            <Text style={styles.contactValue}>{BUSINESS.hours.time}</Text>
            <Text style={styles.contactValueMuted}>{BUSINESS.hours.closed} - Closed</Text>
          </View>
        </GradientCard>
      </AnimatedSection>

      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#171717',
  } as ViewStyle,
  container: {
    flex: 1,
  } as ViewStyle,
  contentBelow: {
    backgroundColor: '#ffffff',
    paddingTop: SPACING['2xl'],
  } as ViewStyle,
  heroSection: {
    backgroundColor: '#171717',
    paddingBottom: SPACING.xl,
    overflow: 'hidden',
  } as ViewStyle,
  heroTypography: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  heroTitle: {
    fontSize: FONTS['6xl'],
    fontFamily: FONTS.serifBold,
    color: '#ffffff',
    letterSpacing: 6,
  } as TextStyle,
  heroSubtitle: {
    fontSize: 10,
    fontFamily: FONTS.sansSerifSemiBold,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 8,
    marginTop: SPACING.sm,
    textTransform: 'uppercase',
  } as TextStyle,
  quickBookSection: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  } as ViewStyle,
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING['3xl'],
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONTS['2xl'],
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  } as TextStyle,
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  } as ViewStyle,
  serviceGridItem: {
    width: '50%',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  serviceCard: {
    backgroundColor: '#f5f5f5',
    borderColor: '#e5e5e5',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.lg,
    height: 150,
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  } as ViewStyle,
  serviceCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  serviceCardName: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  } as TextStyle,
  serviceCardPrice: {
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerifBold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  serviceCardDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  serviceCardDurationText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: 4,
  } as TextStyle,
  viewAllContainer: {
    marginTop: SPACING.md,
  } as ViewStyle,
  contactTitle: {
    fontSize: FONTS['2xl'],
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  } as TextStyle,
  contactItem: {
    marginBottom: SPACING.xl,
  } as ViewStyle,
  contactLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  contactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  } as ViewStyle,
  contactLabel: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.primary,
  } as TextStyle,
  contactValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
    marginLeft: SPACING['3xl'] + SPACING.sm,
  } as TextStyle,
  contactValueMuted: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
    marginLeft: SPACING['3xl'] + SPACING.sm,
  } as TextStyle,
  contactLink: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifSemiBold,
    textDecorationLine: 'underline',
    marginLeft: SPACING['3xl'] + SPACING.sm,
  } as TextStyle,
});
