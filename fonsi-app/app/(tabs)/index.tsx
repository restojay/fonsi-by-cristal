/**
 * Home screen with hero gradient, animated sections, skeleton loading, and vector icons
 */

import React, { useEffect, useMemo, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Header } from '@components/Header';
import { AppointmentCard } from '@components/AppointmentCard';
import { ServiceCard } from '@components/ServiceCard';
import { AnimatedSection } from '@components/AnimatedSection';
import { SkeletonList } from '@components/SkeletonLoader';
import { GradientButton } from '@components/GradientButton';
import { GradientCard } from '@components/GradientCard';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '@constants/theme';
import { useAppointmentStore } from '@store/appointmentStore';
import { useBookingStore } from '@store/bookingStore';
import { apiClient } from '@api/client';
import { Service } from '@types/index';

export default function HomeScreen() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const appointments = useAppointmentStore((state) => state.appointments);
  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return aptDate > now && (apt.status === 'confirmed' || apt.status === 'pending');
      })
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      );
  }, [appointments]);
  const nextAppointment = upcomingAppointments[0] || null;
  const { setSelectedService, setStep } = useBookingStore();

  useEffect(() => {
    const loadFeaturedServices = async () => {
      try {
        const services = await apiClient.getServices();
        const hairServices = services.filter((s) => s.category === 'Hair').slice(0, 3);
        setFeaturedServices(hairServices);
      } catch (error) {
        console.error('Failed to load featured services', error);
        const { SERVICES } = require('@constants/services');
        const hairServices = SERVICES.filter((s: Service) => s.category === 'Hair').slice(0, 3);
        setFeaturedServices(hairServices);
      } finally {
        setIsLoading(false);
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

  const handleAppointmentPress = (appointmentId: string) => {
    router.push(`/appointment/${appointmentId}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={[...GRADIENTS.heroGold]}
        style={styles.heroSection}
      >
        <Header
          title="Fonsi by Cristal"
          subtitle="Let me help you shine!"
          showLogo={true}
        />

        {/* Quick Book */}
        <AnimatedSection delay={100} style={styles.quickBookSection}>
          <GradientButton
            title="Book Your Appointment"
            onPress={handleQuickBook}
            icon={"sparkles" as any}
            iconRight="arrow-right"
            size="large"
          />
        </AnimatedSection>
      </LinearGradient>

      {/* Upcoming Appointment */}
      <AnimatedSection delay={200} style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
        {nextAppointment ? (
          <AppointmentCard
            appointment={nextAppointment}
            onPress={() => handleAppointmentPress(nextAppointment.id)}
          />
        ) : (
          <GradientCard variant="glass" showAccent={false}>
            <View style={styles.emptyState}>
              <Feather name="calendar" size={28} color={COLORS.textMuted} />
              <Text style={styles.noAppointmentText}>No upcoming appointments</Text>
              <Text style={styles.noAppointmentSubtext}>
                Book your first appointment today!
              </Text>
            </View>
          </GradientCard>
        )}
      </AnimatedSection>

      {/* Featured Services */}
      <AnimatedSection delay={300} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity
            onPress={() => router.push('/services')}
            style={styles.seeAllButton}
          >
            <Text style={styles.seeAllLink}>See All</Text>
            <Feather name="arrow-right" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <SkeletonList count={3} />
        ) : (
          <View>
            {featuredServices.map((service, index) => (
              <AnimatedSection key={service.id} index={index} delay={400}>
                <ServiceCard
                  service={service}
                  onBookPress={() => handleBookService(service)}
                />
              </AnimatedSection>
            ))}
          </View>
        )}
      </AnimatedSection>

      {/* Contact Info */}
      <AnimatedSection delay={500} style={styles.section}>
        <GradientCard>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <View style={styles.contactLabelRow}>
              <Feather name="map-pin" size={14} color={COLORS.primary} />
              <Text style={styles.contactLabel}>Address</Text>
            </View>
            <Text style={styles.contactValue}>
              6626 West Loop 1604 North suite 105
            </Text>
            <Text style={styles.contactValue}>San Antonio, TX 78254</Text>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactLabelRow}>
              <Feather name="phone" size={14} color={COLORS.primary} />
              <Text style={styles.contactLabel}>Phone</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.contactLink}>(210) 551-7742</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactItem}>
            <View style={styles.contactLabelRow}>
              <Feather name="clock" size={14} color={COLORS.primary} />
              <Text style={styles.contactLabel}>Hours</Text>
            </View>
            <Text style={styles.contactValue}>Tuesday - Saturday</Text>
            <Text style={styles.contactValue}>10:00 AM - 6:30 PM</Text>
            <Text style={styles.contactValueMuted}>Sunday & Monday - Closed</Text>
          </View>
        </GradientCard>
      </AnimatedSection>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Text style={styles.footerText}>Call or Text to Book</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  heroSection: {
    paddingBottom: SPACING.lg,
  } as ViewStyle,
  quickBookSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  } as ViewStyle,
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING['2xl'],
  } as ViewStyle,
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONTS.xl,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  } as TextStyle,
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  seeAllLink: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifSemiBold,
    marginRight: SPACING.xs,
  } as TextStyle,
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  } as ViewStyle,
  noAppointmentText: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  } as TextStyle,
  noAppointmentSubtext: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  contactTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  } as TextStyle,
  contactItem: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  contactLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  } as ViewStyle,
  contactLabel: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  } as TextStyle,
  contactValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
    marginLeft: SPACING.xl + 2,
  } as TextStyle,
  contactValueMuted: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
    marginLeft: SPACING.xl + 2,
  } as TextStyle,
  contactLink: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifSemiBold,
    textDecorationLine: 'underline',
    marginLeft: SPACING.xl + 2,
  } as TextStyle,
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    paddingHorizontal: SPACING.lg,
  } as ViewStyle,
  footerLine: {
    height: 1,
    width: 60,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
    marginBottom: SPACING.md,
  } as ViewStyle,
  footerText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
});
