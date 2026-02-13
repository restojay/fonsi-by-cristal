/**
 * Appointment card with uppercase tracked status badges and larger service name
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
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Appointment } from '@types/index';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, ANIMATION } from '@constants/theme';
import { GradientCard } from './GradientCard';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  isPast?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
      return { color: '#ffffff', bg: COLORS.primary, icon: 'check-circle' as const };
    case 'pending':
      return { color: COLORS.textSecondary, bg: COLORS.bgTertiary, icon: 'clock' as const };
    case 'completed':
      return { color: COLORS.textSecondary, bg: COLORS.bgTertiary, icon: 'award' as const };
    case 'cancelled':
      return { color: COLORS.textMuted, bg: COLORS.borderColor, icon: 'x-circle' as const };
    default:
      return { color: COLORS.textMuted, bg: COLORS.bgTertiary, icon: 'help-circle' as const };
  }
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  isPast = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, ANIMATION.spring);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, ANIMATION.spring);
  };

  const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
  const formattedDate = format(appointmentDate, 'EEE, MMM d');
  const formattedTime = format(appointmentDate, 'h:mm a');
  const statusConfig = getStatusConfig(appointment.status);
  const isCancelled = appointment.status === 'cancelled';

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[animatedStyle, styles.wrapper, isPast && styles.pastWrapper]}
    >
      <GradientCard showAccent={!isPast}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={[styles.serviceName, isCancelled && styles.cancelledText]}>{appointment.service.name}</Text>
            <View style={styles.dateRow}>
              <Feather name="calendar" size={13} color={COLORS.textMuted} />
              <Text style={[styles.dateTime, isCancelled && styles.cancelledText]}>
                {formattedDate} at {formattedTime}
              </Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
            <Feather name={statusConfig.icon} size={12} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelRow}>
              <Feather name="user" size={13} color={COLORS.textMuted} />
              <Text style={styles.label}>Client</Text>
            </View>
            <Text style={styles.value}>
              {appointment.clientInfo.firstName} {appointment.clientInfo.lastName}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelRow}>
              <Feather name="dollar-sign" size={13} color={COLORS.textMuted} />
              <Text style={styles.label}>Price</Text>
            </View>
            <Text style={styles.priceValue}>
              ${appointment.service.priceMin} - ${appointment.service.priceMax}
            </Text>
          </View>
        </View>

        {appointment.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notes}>{appointment.notes}</Text>
          </View>
        )}
      </GradientCard>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  pastWrapper: {
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
    fontSize: FONTS['2xl'],
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
  } as TextStyle,
  cancelledText: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  } as TextStyle,
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  } as ViewStyle,
  dateTime: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs + 2,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  } as ViewStyle,
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.sansSerifSemiBold,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 2,
  } as TextStyle,
  details: {
    borderTopColor: COLORS.borderColor,
    borderTopWidth: 1,
    paddingTop: SPACING.md,
  } as ViewStyle,
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  detailLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  label: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: SPACING.sm,
  } as TextStyle,
  value: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  priceValue: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    fontFamily: FONTS.sansSerifSemiBold,
  } as TextStyle,
  notesSection: {
    backgroundColor: COLORS.bgTertiary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  } as ViewStyle,
  notesLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifSemiBold,
    marginBottom: SPACING.xs,
  } as TextStyle,
  notes: {
    fontSize: FONTS.sm,
    color: COLORS.textPrimary,
    lineHeight: 20,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
});
