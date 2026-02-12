/**
 * Profile/account screen with client info, appointment history, and settings
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
import { Header } from '@components/Header';
import { AppointmentCard } from '@components/AppointmentCard';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { useBookingStore } from '@store/bookingStore';
import { useAppointmentStore } from '@store/appointmentStore';
import { Appointment } from '@types/index';

export default function ProfileScreen() {
  const { clientInfo, setClientInfo } = useBookingStore();
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

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Sign Out',
          onPress: () => {
            // Clear booking state
            // In a real app, you'd also clear auth tokens
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
            // In a real app, call API to cancel
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
      <View style={styles.section}>
        <View style={styles.infoCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {clientInfo.firstName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {clientInfo.firstName} {clientInfo.lastName}
              </Text>
              {clientInfo.email && (
                <Text style={styles.profileEmail}>{clientInfo.email}</Text>
              )}
              {clientInfo.phone && (
                <Text style={styles.profilePhone}>{clientInfo.phone}</Text>
              )}
            </View>
            {!isEditingProfile && (
              <TouchableOpacity
                onPress={() => setIsEditingProfile(true)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>✎</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingProfile && (
            <View style={styles.editSection}>
              <Text style={styles.editNote}>
                Edit your information below
              </Text>
              {/* In a production app, you'd add editable TextInputs here */}
              <TouchableOpacity
                onPress={() => setIsEditingProfile(false)}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {upcoming.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming appointments</Text>
            <TouchableOpacity
              onPress={() => router.push('/book')}
              style={styles.bookButton}
            >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
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
                    <Text style={styles.cancelButtonText}>
                      Cancel Appointment
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Past Appointments */}
      {past.length > 0 && (
        <View style={styles.section}>
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
        </View>
      )}

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Preferences</Text>
            <Text style={styles.settingValue}>Edit</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Privacy Policy</Text>
            <Text style={styles.settingValue}>View</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Terms of Service</Text>
            <Text style={styles.settingValue}>View</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About Fonsi by Cristal</Text>
          <Text style={styles.aboutText}>
            Premium hair and makeup studio in San Antonio, TX. By appointment only.
          </Text>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Address</Text>
            <Text style={styles.aboutValue}>
              6626 West Loop 1604 North suite 105
            </Text>
            <Text style={styles.aboutValue}>
              San Antonio, TX 78254
            </Text>
          </View>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Phone</Text>
            <Text style={styles.aboutValue}>(210) 551-7742</Text>
          </View>
          <View style={styles.aboutInfo}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    ...SHADOWS.md,
  } as ViewStyle,
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  } as ViewStyle,
  avatarText: {
    fontSize: FONTS['2xl'],
    fontWeight: '700',
    color: COLORS.bgPrimary,
  } as TextStyle,
  profileInfo: {
    flex: 1,
  } as ViewStyle,
  profileName: {
    fontSize: FONTS.base,
    fontWeight: '600',
    color: COLORS.textPrimary,
  } as TextStyle,
  profileEmail: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  } as TextStyle,
  profilePhone: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  } as TextStyle,
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  editButtonText: {
    fontSize: FONTS.lg,
    color: COLORS.primary,
  } as TextStyle,
  editSection: {
    marginTop: SPACING.lg,
    paddingTopColor: COLORS.borderColor,
    borderTopWidth: 1,
    paddingTop: SPACING.lg,
  } as ViewStyle,
  editNote: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  } as TextStyle,
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  } as ViewStyle,
  saveButtonText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  emptyCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  emptyText: {
    fontSize: FONTS.base,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  } as TextStyle,
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  } as ViewStyle,
  bookButtonText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
    fontSize: FONTS.sm,
  } as TextStyle,
  appointmentContainer: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  cancelButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  } as ViewStyle,
  cancelButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: FONTS.sm,
  } as TextStyle,
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  settingContent: {
    flex: 1,
  } as ViewStyle,
  settingLabel: {
    fontSize: FONTS.base,
    fontWeight: '500',
    color: COLORS.textPrimary,
  } as TextStyle,
  settingValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  } as TextStyle,
  settingArrow: {
    fontSize: FONTS.lg,
    color: COLORS.primary,
    marginLeft: SPACING.md,
  } as TextStyle,
  aboutCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  aboutTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  aboutText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  } as TextStyle,
  aboutInfo: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  aboutLabel: {
    fontSize: FONTS.xs,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  } as TextStyle,
  aboutValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  logoutButton: {
    paddingVertical: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.error,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  } as ViewStyle,
  logoutButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
});
