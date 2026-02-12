/**
 * Home screen with welcome header, quick-book button, upcoming appointment, featured services
 */

import React, { useEffect, useMemo, useState } from 'react';
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
import { AppointmentCard } from '@components/AppointmentCard';
import { ServiceCard } from '@components/ServiceCard';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
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
        // Get featured services (first 3 from Hair category)
        const hairServices = services.filter((s) => s.category === 'Hair').slice(0, 3);
        setFeaturedServices(hairServices);
      } catch (error) {
        console.error('Failed to load featured services', error);
        // Use fallback
        const { SERVICES } = require('@constants/services');
        const hairServices = SERVICES.filter((s: Service) => s.category === 'Hair').slice(
          0,
          3
        );
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
      <Header
        title="Fonsi by Cristal"
        subtitle="Premium Hair & Makeup Studio"
        showLogo={true}
      />

      {/* Quick Book Button */}
      <TouchableOpacity
        onPress={handleQuickBook}
        style={styles.quickBookButton}
        activeOpacity={0.8}
      >
        <Text style={styles.quickBookButtonEmoji}>✨</Text>
        <View style={styles.quickBookContent}>
          <Text style={styles.quickBookTitle}>Quick Book</Text>
          <Text style={styles.quickBookSubtitle}>
            Schedule your next appointment
          </Text>
        </View>
        <Text style={styles.quickBookArrow}>→</Text>
      </TouchableOpacity>

      {/* Upcoming Appointment */}
      {nextAppointment && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>
          <AppointmentCard
            appointment={nextAppointment}
            onPress={() => handleAppointmentPress(nextAppointment.id)}
          />
        </View>
      )}

      {!nextAppointment && (
        <View style={styles.section}>
          <View style={styles.noAppointmentCard}>
            <Text style={styles.noAppointmentText}>
              No upcoming appointments
            </Text>
            <Text style={styles.noAppointmentSubtext}>
              Book your first appointment today!
            </Text>
          </View>
        </View>
      )}

      {/* Featured Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Services</Text>
          <TouchableOpacity onPress={() => router.push('/services')}>
            <Text style={styles.seeAllLink}>See All →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <View>
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBookPress={() => handleBookService(service)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>📍 Address</Text>
            <Text style={styles.contactValue}>
              6626 West Loop 1604 North suite 105
            </Text>
            <Text style={styles.contactValue}>San Antonio, TX 78254</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>📞 Phone</Text>
            <TouchableOpacity>
              <Text style={styles.contactLink}>(210) 551-7742</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactLabel}>🕐 Hours</Text>
            <Text style={styles.contactValue}>Tuesday - Saturday</Text>
            <Text style={styles.contactValue}>10:00 AM - 6:30 PM</Text>
            <Text style={styles.contactValue}>Sunday & Monday - Closed</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>By appointment only</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  quickBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    ...SHADOWS.lg,
  } as ViewStyle,
  quickBookButtonEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  } as TextStyle,
  quickBookContent: {
    flex: 1,
  } as ViewStyle,
  quickBookTitle: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.bgPrimary,
  } as TextStyle,
  quickBookSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.bgSecondary,
    marginTop: SPACING.xs,
  } as TextStyle,
  quickBookArrow: {
    fontSize: FONTS.xl,
    color: COLORS.bgPrimary,
    marginLeft: SPACING.md,
  } as TextStyle,
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
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  seeAllLink: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
  } as TextStyle,
  noAppointmentCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  noAppointmentText: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  } as TextStyle,
  noAppointmentSubtext: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  } as TextStyle,
  loadingContainer: {
    paddingVertical: SPACING['3xl'],
    alignItems: 'center',
  } as ViewStyle,
  contactCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  contactTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  contactItem: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  contactLabel: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  } as TextStyle,
  contactValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  contactLink: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  } as TextStyle,
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING['2xl'],
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 1,
  } as ViewStyle,
  footerText: {
    fontSize: FONTS.sm,
    color: COLORS.textMuted,
  } as TextStyle,
});
