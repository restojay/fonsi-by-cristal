/**
 * Individual appointment detail screen
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { useAppointmentStore } from '@store/appointmentStore';
import { apiClient } from '@api/client';
import { Appointment } from '@types/index';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAppointmentById = useAppointmentStore((state) => state.getAppointmentById);
  const removeAppointment = useAppointmentStore((state) => state.removeAppointment);

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setIsLoading(true);
        // Try to get from store first
        const cachedApt = getAppointmentById(id as string);
        if (cachedApt) {
          setAppointment(cachedApt);
        } else {
          // Try to fetch from API
          const apt = await apiClient.getAppointment(id as string);
          if (apt) {
            setAppointment(apt);
          }
        }
      } catch (error) {
        console.error('Failed to load appointment', error);
        Alert.alert('Error', 'Failed to load appointment details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAppointment();
    }
  }, [id, getAppointmentById]);

  const handleReschedule = () => {
    if (appointment) {
      Alert.alert(
        'Reschedule Appointment',
        'You can reschedule this appointment.',
        [
          { text: 'Cancel', onPress: () => {} },
          {
            text: 'Reschedule',
            onPress: () => {
              router.push('/book');
            },
          },
        ]
      );
    }
  };

  const handleCancel = async () => {
    if (!appointment) return;

    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'Keep', onPress: () => {} },
        {
          text: 'Cancel Appointment',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              const success = await apiClient.cancelAppointment(appointment.id);
              if (success) {
                removeAppointment(appointment.id);
                Alert.alert('Success', 'Appointment cancelled successfully', [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]);
              }
            } catch (error) {
              console.error('Failed to cancel appointment', error);
              Alert.alert('Error', 'Failed to cancel appointment');
            } finally {
              setIsSubmitting(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading appointment...</Text>
        </View>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Appointment not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(appointmentDate, 'h:mm a');

  const getStatusColor = () => {
    switch (appointment.status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'completed':
        return COLORS.info;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textMuted;
    }
  };

  const isPast = new Date() > appointmentDate;
  const canCancel = !isPast && appointment.status !== 'cancelled';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
        <View style={styles.spacer} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View
            style={[
              styles.statusBadge,
              { borderColor: getStatusColor() },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Service Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service</Text>
          <Text style={styles.serviceName}>{appointment.service.name}</Text>
          <Text style={styles.serviceDescription}>
            {appointment.service.description}
          </Text>
        </View>

        {/* Date & Time Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Date & Time</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formattedDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Time</Text>
            <Text style={styles.value}>{formattedTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{appointment.service.duration} minutes</Text>
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pricing</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Price Range</Text>
            <Text style={styles.priceValue}>
              ${appointment.service.priceMin} - ${appointment.service.priceMax}
            </Text>
          </View>
        </View>

        {/* Client Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Client Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>
              {appointment.clientInfo.firstName} {appointment.clientInfo.lastName}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{appointment.clientInfo.email}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{appointment.clientInfo.phone}</Text>
          </View>
        </View>

        {/* Notes Card */}
        {appointment.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notes</Text>
            <Text style={styles.notes}>{appointment.notes}</Text>
          </View>
        )}

        {/* Metadata */}
        <View style={styles.metadata}>
          <Text style={styles.metadataLabel}>Booking ID</Text>
          <Text style={styles.metadataValue}>{appointment.id}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          {!isPast && appointment.status !== 'cancelled' && (
            <TouchableOpacity
              onPress={handleReschedule}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Text style={styles.actionButtonText}>📅 Reschedule</Text>
            </TouchableOpacity>
          )}

          {canCancel && (
            <TouchableOpacity
              onPress={handleCancel}
              style={[styles.actionButton, styles.cancelActionButton]}
              activeOpacity={0.7}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelActionButtonText}>
                {isSubmitting ? 'Cancelling...' : '✕ Cancel Appointment'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={[styles.actionButton, styles.secondaryButton]}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>👤 View Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactText}>
            Contact us if you need to reschedule or have questions about your appointment.
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.contactLink}
          >
            <Text style={styles.contactLinkText}>📞 (210) 551-7742</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
  } as ViewStyle,
  closeButton: {
    flex: 1,
  } as ViewStyle,
  closeButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  headerTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  spacer: {
    flex: 1,
  } as ViewStyle,
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  } as ViewStyle,
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.base,
    color: COLORS.textSecondary,
  } as TextStyle,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  } as ViewStyle,
  errorText: {
    fontSize: FONTS.lg,
    color: COLORS.error,
    marginBottom: SPACING.md,
  } as TextStyle,
  backButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.md,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  backButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  statusSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  } as ViewStyle,
  statusBadge: {
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  } as ViewStyle,
  statusText: {
    fontSize: FONTS.base,
    fontWeight: '700',
  } as TextStyle,
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  } as ViewStyle,
  cardTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  serviceName: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  serviceDescription: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomColor: COLORS.borderColor,
    borderBottomWidth: 1,
  } as ViewStyle,
  label: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  } as TextStyle,
  value: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontWeight: '500',
  } as TextStyle,
  priceValue: {
    fontSize: FONTS.base,
    color: COLORS.primary,
    fontWeight: '600',
  } as TextStyle,
  notes: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  metadata: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  } as ViewStyle,
  metadataLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  } as TextStyle,
  metadataValue: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: 'Courier New, monospace',
  } as TextStyle,
  actionsSection: {
    marginBottom: SPACING.xl,
  } as ViewStyle,
  actionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  } as ViewStyle,
  actionButtonText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  cancelActionButton: {
    backgroundColor: 'transparent',
    borderColor: COLORS.error,
    borderWidth: 2,
  } as ViewStyle,
  cancelActionButtonText: {
    color: COLORS.error,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  secondaryButton: {
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  secondaryButtonText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  contactCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    alignItems: 'center',
  } as ViewStyle,
  contactTitle: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  contactText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
  } as TextStyle,
  contactLink: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.md,
  } as ViewStyle,
  contactLinkText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
});
