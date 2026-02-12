/**
 * Appointment detail screen with gradient cards, filled status badges, and Feather icons
 */

import React, { useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { useAppointmentStore } from '@store/appointmentStore';
import { apiClient } from '@api/client';
import { Appointment } from '@types/index';
import { GradientCard } from '@components/GradientCard';
import { GradientButton } from '@components/GradientButton';
import { AnimatedSection } from '@components/AnimatedSection';
import { SkeletonLoader, SkeletonCard } from '@components/SkeletonLoader';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { color: COLORS.success, bg: 'rgba(76, 175, 80, 0.15)', icon: 'check-circle' as const, label: 'Confirmed' };
    case 'pending':
      return { color: COLORS.warning, bg: 'rgba(255, 152, 0, 0.15)', icon: 'clock' as const, label: 'Pending' };
    case 'completed':
      return { color: COLORS.info, bg: 'rgba(33, 150, 243, 0.15)', icon: 'award' as const, label: 'Completed' };
    case 'cancelled':
      return { color: COLORS.error, bg: 'rgba(244, 67, 54, 0.15)', icon: 'x-circle' as const, label: 'Cancelled' };
    default:
      return { color: COLORS.textMuted, bg: 'rgba(136, 136, 136, 0.15)', icon: 'help-circle' as const, label: 'Unknown' };
  }
};

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
        const cachedApt = getAppointmentById(id as string);
        if (cachedApt) {
          setAppointment(cachedApt);
        } else {
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.content}>
          <SkeletonLoader width="40%" height={32} style={{ alignSelf: 'center', marginBottom: SPACING.xl }} />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={40} color={COLORS.error} />
          <Text style={styles.errorText}>Appointment not found</Text>
          <View style={{ marginTop: SPACING.lg }}>
            <GradientButton
              title="Go Back"
              onPress={() => router.back()}
              variant="outline"
              icon="arrow-left"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = format(appointmentDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(appointmentDate, 'h:mm a');
  const statusConfig = getStatusConfig(appointment.status);
  const isPastAppointment = new Date() > appointmentDate;
  const canCancel = !isPastAppointment && appointment.status !== 'cancelled';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SafeAreaView edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
            <Feather name="arrow-left" size={20} color={COLORS.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Appointment Details</Text>
          <View style={styles.spacer} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        {/* Status Badge */}
        <AnimatedSection delay={100}>
          <View style={styles.statusSection}>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Feather name={statusConfig.icon} size={16} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </AnimatedSection>

        {/* Service Card */}
        <AnimatedSection delay={200}>
          <GradientCard style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Feather name="scissors" size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Service</Text>
            </View>
            <Text style={styles.serviceName}>{appointment.service.name}</Text>
            <Text style={styles.serviceDescription}>
              {appointment.service.description}
            </Text>
          </GradientCard>
        </AnimatedSection>

        {/* Date & Time Card */}
        <AnimatedSection delay={300}>
          <GradientCard style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Feather name="calendar" size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Date & Time</Text>
            </View>
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
          </GradientCard>
        </AnimatedSection>

        {/* Pricing Card */}
        <AnimatedSection delay={400}>
          <GradientCard style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Feather name="dollar-sign" size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Pricing</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Price Range</Text>
              <Text style={styles.priceValue}>
                ${appointment.service.priceMin} - ${appointment.service.priceMax}
              </Text>
            </View>
          </GradientCard>
        </AnimatedSection>

        {/* Client Info Card */}
        <AnimatedSection delay={500}>
          <GradientCard style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Feather name="user" size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Client Information</Text>
            </View>
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
          </GradientCard>
        </AnimatedSection>

        {/* Notes Card */}
        {appointment.notes && (
          <AnimatedSection delay={600}>
            <GradientCard style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Feather name="file-text" size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Notes</Text>
              </View>
              <Text style={styles.notes}>{appointment.notes}</Text>
            </GradientCard>
          </AnimatedSection>
        )}

        {/* Metadata */}
        <AnimatedSection delay={650}>
          <View style={styles.metadata}>
            <Feather name="hash" size={12} color={COLORS.textMuted} />
            <Text style={styles.metadataLabel}>Booking ID: </Text>
            <Text style={styles.metadataValue}>{appointment.id}</Text>
          </View>
        </AnimatedSection>

        {/* Action Buttons */}
        <AnimatedSection delay={700}>
          <View style={styles.actionsSection}>
            {!isPastAppointment && appointment.status !== 'cancelled' && (
              <GradientButton
                title="Reschedule"
                onPress={handleReschedule}
                icon="calendar"
                style={styles.actionButtonSpacing}
              />
            )}

            {canCancel && (
              <GradientButton
                title={isSubmitting ? 'Cancelling...' : 'Cancel Appointment'}
                onPress={handleCancel}
                variant="outline"
                icon="x"
                disabled={isSubmitting}
                style={styles.actionButtonSpacing}
              />
            )}

            <GradientButton
              title="View Profile"
              onPress={() => router.push('/profile')}
              variant="outline"
              icon="user"
              style={styles.actionButtonSpacing}
            />
          </View>
        </AnimatedSection>

        {/* Contact Info */}
        <AnimatedSection delay={800}>
          <GradientCard variant="glass" showAccent={false}>
            <View style={styles.contactSection}>
              <Feather name="phone" size={20} color={COLORS.primary} />
              <Text style={styles.contactTitle}>Need Help?</Text>
              <Text style={styles.contactText}>
                Contact us if you need to reschedule or have questions.
              </Text>
              <TouchableOpacity activeOpacity={0.7} style={styles.contactLink}>
                <Feather name="phone" size={14} color={COLORS.primary} />
                <Text style={styles.contactLinkText}>(210) 551-7742</Text>
              </TouchableOpacity>
            </View>
          </GradientCard>
        </AnimatedSection>
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
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
  } as ViewStyle,
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  backText: {
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifSemiBold,
    fontSize: FONTS.base,
    marginLeft: SPACING.xs,
  } as TextStyle,
  headerTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    flex: 1,
    textAlign: 'center',
  } as TextStyle,
  spacer: {
    flex: 1,
  } as ViewStyle,
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING['4xl'],
  } as ViewStyle,
  errorText: {
    fontSize: FONTS.lg,
    color: COLORS.error,
    fontFamily: FONTS.sansSerifSemiBold,
    marginTop: SPACING.md,
  } as TextStyle,
  statusSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  } as ViewStyle,
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  } as ViewStyle,
  statusText: {
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerifBold,
    marginLeft: SPACING.sm,
  } as TextStyle,
  card: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  cardTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  } as TextStyle,
  serviceName: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  serviceDescription: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
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
    fontFamily: FONTS.sansSerifMedium,
  } as TextStyle,
  value: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.sansSerifMedium,
  } as TextStyle,
  priceValue: {
    fontSize: FONTS.base,
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifBold,
  } as TextStyle,
  notes: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.glassBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  } as ViewStyle,
  metadataLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: SPACING.xs,
  } as TextStyle,
  metadataValue: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  actionsSection: {
    marginBottom: SPACING.xl,
  } as ViewStyle,
  actionButtonSpacing: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  contactSection: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  } as ViewStyle,
  contactTitle: {
    fontSize: FONTS.lg,
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  } as TextStyle,
  contactText: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  contactLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.glassBackground,
    borderRadius: BORDER_RADIUS.md,
    borderColor: COLORS.glassBorder,
    borderWidth: 1,
  } as ViewStyle,
  contactLinkText: {
    color: COLORS.primary,
    fontFamily: FONTS.sansSerifSemiBold,
    fontSize: FONTS.base,
    marginLeft: SPACING.sm,
  } as TextStyle,
});
