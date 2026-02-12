/**
 * Upcoming/past appointment card component
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { format } from 'date-fns';
import { Appointment } from '@types/index';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  isPast?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  isPast = false,
}) => {
  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = format(appointmentDate, 'EEE, MMM d');
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

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.card, isPast && styles.pastCard]}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.serviceName}>{appointment.service.name}</Text>
          <Text style={styles.dateTime}>
            {formattedDate} at {formattedTime}
          </Text>
        </View>
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

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Client:</Text>
          <Text style={styles.value}>
            {appointment.clientInfo.firstName} {appointment.clientInfo.lastName}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.priceValue}>
            ${appointment.service.priceMin} - ${appointment.service.priceMax}
          </Text>
        </View>
      </View>

      {appointment.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes}>{appointment.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  } as ViewStyle,
  pastCard: {
    opacity: 0.7,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  } as ViewStyle,
  titleSection: {
    flex: 1,
    marginRight: SPACING.md,
  } as ViewStyle,
  serviceName: {
    fontSize: FONTS.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  dateTime: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    marginTop: SPACING.xs,
  } as TextStyle,
  statusBadge: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  } as ViewStyle,
  statusText: {
    fontSize: FONTS.xs,
    fontWeight: '600',
  } as TextStyle,
  details: {
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 1,
    paddingTop: SPACING.md,
    marginBottom: SPACING.md,
  } as ViewStyle,
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  label: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  } as TextStyle,
  value: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
  } as TextStyle,
  priceValue: {
    fontSize: FONTS.sm,
    color: COLORS.primary,
    fontWeight: '600',
  } as TextStyle,
  notesSection: {
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  } as ViewStyle,
  notesLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  } as TextStyle,
  notes: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
  } as TextStyle,
});
