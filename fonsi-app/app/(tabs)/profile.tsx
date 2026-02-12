/**
 * Profile screen with gradient avatar, stats row, Feather icons, and glass cards
 */

import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Header } from '@components/Header';
import { AppointmentCard } from '@components/AppointmentCard';
import { AnimatedSection } from '@components/AnimatedSection';
import { GradientButton } from '@components/GradientButton';
import { GradientCard } from '@components/GradientCard';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS } from '@constants/theme';
import { useBookingStore } from '@store/bookingStore';
import { useAppointmentStore } from '@store/appointmentStore';

const SETTINGS_ITEMS: {
  label: string;
  subtitle: string;
  icon: keyof typeof Feather.glyphMap;
}[] = [
  { label: 'Notifications', subtitle: 'Manage alerts', icon: 'bell' },
  { label: 'Preferences', subtitle: 'App settings', icon: 'settings' },
  { label: 'Privacy Policy', subtitle: 'Your data', icon: 'shield' },
  { label: 'Terms of Service', subtitle: 'Legal', icon: 'file-text' },
];

export default function ProfileScreen() {
  const { clientInfo } = useBookingStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const appointments = useAppointmentStore((state) => state.appointments);
  const upcoming = useMemo(() => {
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
  const past = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((apt) => {
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return aptDate <= now || apt.status === 'completed' || apt.status === 'cancelled';
      })
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`).getTime() -
          new Date(`${a.date}T${a.time}`).getTime()
      );
  }, [appointments]);

  const totalVisits = appointments.filter((a) => a.status === 'completed').length;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Sign Out',
          onPress: () => {
            router.replace('/');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'Keep', onPress: () => {} },
        {
          text: 'Cancel Appointment',
          onPress: () => {
            Alert.alert('Success', 'Appointment cancelled');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleAppointmentPress = (appointmentId: string) => {
    router.push(`/appointment/${appointmentId}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header title="Profile" subtitle="Your account" showLogo={false} />

      {/* Client Info Card */}
      <AnimatedSection delay={100} style={styles.section}>
        <GradientCard>
          <View style={styles.profileHeader}>
            <LinearGradient
              colors={[...GRADIENTS.goldButton]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {clientInfo.firstName ? clientInfo.firstName.charAt(0).toUpperCase() : 'G'}
              </Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {clientInfo.firstName || 'Guest'} {clientInfo.lastName}
              </Text>
              {clientInfo.email ? (
                <View style={styles.profileDetailRow}>
                  <Feather name="mail" size={12} color={COLORS.textMuted} />
                  <Text style={styles.profileDetail}>{clientInfo.email}</Text>
                </View>
              ) : null}
              {clientInfo.phone ? (
                <View style={styles.profileDetailRow}>
                  <Feather name="phone" size={12} color={COLORS.textMuted} />
                  <Text style={styles.profileDetail}>{clientInfo.phone}</Text>
                </View>
              ) : null}
            </View>
            {!isEditingProfile && (
              <TouchableOpacity
                onPress={() => setIsEditingProfile(true)}
                style={styles.editButton}
              >
                <Feather name="edit-2" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>

          {isEditingProfile && (
            <View style={styles.editSection}>
              <Text style={styles.editNote}>
                Edit your information below
              </Text>
              <GradientButton
                title="Done"
                onPress={() => setIsEditingProfile(false)}
                size="small"
              />
            </View>
          )}
        </GradientCard>
      </AnimatedSection>

      {/* Stats Row */}
      <AnimatedSection delay={200} style={styles.section}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalVisits}</Text>
            <Text style={styles.statLabel}>Total Visits</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>2025</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{upcoming.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>
      </AnimatedSection>

      {/* Upcoming Appointments */}
      <AnimatedSection delay={300} style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {upcoming.length === 0 ? (
          <GradientCard variant="glass" showAccent={false}>
            <View style={styles.emptyState}>
              <Feather name="calendar" size={24} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No upcoming appointments</Text>
              <View style={{ marginTop: SPACING.md }}>
                <GradientButton
                  title="Book Now"
                  onPress={() => router.push('/book')}
                  size="small"
                  icon="calendar"
                />
              </View>
            </View>
          </GradientCard>
        ) : (
          <View>
            {upcoming.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentContainer}>
                <AppointmentCard
                  appointment={appointment}
                  onPress={() => handleAppointmentPress(appointment.id)}
                />
                {appointment.status !== 'cancelled' && (
                  <TouchableOpacity
                    onPress={() => handleCancelAppointment(appointment.id)}
                    style={styles.cancelButton}
                  >
                    <Feather name="x" size={14} color={COLORS.error} />
                    <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </AnimatedSection>

      {/* Past Appointments */}
      {past.length > 0 && (
        <AnimatedSection delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>Past Appointments</Text>
          <View>
            {past.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onPress={() => handleAppointmentPress(appointment.id)}
                isPast={true}
              />
            ))}
          </View>
        </AnimatedSection>
      )}

      {/* Settings */}
      <AnimatedSection delay={500} style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {SETTINGS_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={styles.settingItem}
            activeOpacity={0.7}
          >
            <View style={styles.settingIconContainer}>
              <Feather name={item.icon} size={18} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingValue}>{item.subtitle}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </AnimatedSection>

      {/* About */}
      <AnimatedSection delay={600} style={styles.section}>
        <GradientCard>
          <Text style={styles.aboutTitle}>About Fonsi by Cristal</Text>
          <Text style={styles.aboutText}>
            Beauty is my passion and my passion shows on every client that walks out of my doors. Through extensive, ongoing continuing education I stay up to date on the latest cut and color styles and techniques to bring you the looks you want.
          </Text>
          <View style={styles.aboutInfo}>
            <View style={styles.aboutLabelRow}>
              <Feather name="map-pin" size={12} color={COLORS.primary} />
              <Text style={styles.aboutLabel}>Address</Text>
            </View>
            <Text style={styles.aboutValue}>6626 West Loop 1604 North suite 105</Text>
            <Text style={styles.aboutValue}>San Antonio, TX 78254</Text>
          </View>
          <View style={styles.aboutInfo}>
            <View style={styles.aboutLabelRow}>
              <Feather name="phone" size={12} color={COLORS.primary} />
              <Text style={styles.aboutLabel}>Phone</Text>
            </View>
            <Text style={styles.aboutValue}>(210) 551-7742</Text>
          </View>
          <View style={styles.aboutInfo}>
            <View style={styles.aboutLabelRow}>
              <Feather name="info" size={12} color={COLORS.primary} />
              <Text style={styles.aboutLabel}>Version</Text>
            </View>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </GradientCard>
      </AnimatedSection>

      {/* Logout Button */}
      <AnimatedSection delay={700} style={styles.section}>
        <GradientButton
          title="Sign Out"
          onPress={handleLogout}
          variant="outline"
          icon="log-out"
        />
        <View style={{ height: SPACING.xl }} />
      </AnimatedSection>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  } as ViewStyle,
  sectionTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  } as TextStyle,
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  } as ViewStyle,
  avatarText: {
    fontSize: FONTS['3xl'],
    fontFamily: FONTS.serifBold,
    color: COLORS.bgPrimary,
  } as TextStyle,
  profileInfo: {
    flex: 1,
  } as ViewStyle,
  profileName: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  } as TextStyle,
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  } as ViewStyle,
  profileDetail: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerif,
    marginLeft: SPACING.sm,
  } as TextStyle,
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  editSection: {
    marginTop: SPACING.lg,
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 1,
    paddingTop: SPACING.lg,
  } as ViewStyle,
  editNote: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  } as ViewStyle,
  statCard: {
    flex: 1,
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  } as ViewStyle,
  statValue: {
    fontSize: FONTS['2xl'],
    fontFamily: FONTS.sansSerifBold,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  } as TextStyle,
  statLabel: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifMedium,
    color: COLORS.textMuted,
  } as TextStyle,
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  } as ViewStyle,
  emptyText: {
    fontSize: FONTS.base,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerif,
    marginTop: SPACING.sm,
  } as TextStyle,
  appointmentContainer: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
  } as ViewStyle,
  cancelButtonText: {
    color: COLORS.error,
    fontFamily: FONTS.sansSerifSemiBold,
    fontSize: FONTS.sm,
    marginLeft: SPACING.sm,
  } as TextStyle,
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.glassBackground,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  } as ViewStyle,
  settingContent: {
    flex: 1,
  } as ViewStyle,
  settingLabel: {
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerifMedium,
    color: COLORS.textPrimary,
  } as TextStyle,
  settingValue: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerif,
    marginTop: 2,
  } as TextStyle,
  aboutTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  } as TextStyle,
  aboutText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  aboutInfo: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  aboutLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  } as ViewStyle,
  aboutLabel: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  } as TextStyle,
  aboutValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
    marginLeft: SPACING.xl,
  } as TextStyle,
});
