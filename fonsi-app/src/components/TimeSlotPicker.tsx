/**
 * Time slot picker grouped by Morning/Afternoon/Evening
 * Light theme with dark selected state
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { TimeSlot } from '@types/index';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@constants/theme';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelectTime: (time: string) => void;
  disabled?: boolean;
  selectedDate?: string;
}

interface TimeGroup {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  slots: TimeSlot[];
}

const getHourFromTime = (time: string): number => {
  return parseInt(time.split(':')[0], 10);
};

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedTime,
  onSelectTime,
  disabled = false,
  selectedDate,
}) => {
  const now = new Date();
  const isToday = selectedDate === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const groupedSlots = useMemo((): TimeGroup[] => {
    const morning: TimeSlot[] = [];
    const afternoon: TimeSlot[] = [];
    const evening: TimeSlot[] = [];

    slots.forEach((slot) => {
      const hour = getHourFromTime(slot.time);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    const groups: TimeGroup[] = [];
    if (morning.length > 0) groups.push({ label: 'Morning', icon: 'sunrise', slots: morning });
    if (afternoon.length > 0) groups.push({ label: 'Afternoon', icon: 'sun', slots: afternoon });
    if (evening.length > 0) groups.push({ label: 'Evening', icon: 'sunset', slots: evening });

    return groups;
  }, [slots]);

  const formatTimeDisplay = (time: string): string => {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayHour}:${String(m).padStart(2, '0')} ${period}`;
  };

  const isSlotPast = (time: string): boolean => {
    if (!isToday) return false;
    const [h, m] = time.split(':').map(Number);
    const slotMinutes = h * 60 + m;
    return slotMinutes <= currentMinutes;
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedTime === slot.time;
    const isAvailable = slot.available;
    const isPast = isSlotPast(slot.time);
    const isDisabled = !isAvailable || disabled || isPast;

    return (
      <TouchableOpacity
        key={slot.id}
        onPress={() => !isDisabled && onSelectTime(slot.time)}
        disabled={isDisabled}
        activeOpacity={isDisabled ? 1 : 0.7}
        style={styles.slotWrapper}
      >
        <View style={[
          styles.slot,
          isSelected && styles.selectedSlot,
          isPast && styles.pastSlot,
          !isAvailable && !isPast && styles.unavailableSlot,
        ]}>
          {isSelected && (
            <Feather name="check" size={14} color="#ffffff" style={{ marginRight: 4 }} />
          )}
          <Text
            style={[
              styles.slotText,
              isSelected && styles.selectedSlotText,
              isPast && styles.pastSlotText,
              !isAvailable && !isPast && styles.unavailableSlotText,
            ]}
          >
            {formatTimeDisplay(slot.time)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="calendar" size={32} color={COLORS.textMuted} />
        <Text style={styles.emptyText}>No available time slots for this date</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groupedSlots.map((group) => (
        <View key={group.label} style={styles.groupSection}>
          <View style={styles.groupHeader}>
            <Feather name={group.icon} size={16} color={COLORS.textSecondary} />
            <Text style={styles.groupLabel}>{group.label}</Text>
            <Text style={styles.groupCount}>{group.slots.length}</Text>
          </View>
          <View style={styles.slotsGrid}>
            {group.slots.map((slot) => renderTimeSlot(slot))}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  groupSection: {
    marginBottom: SPACING.xl,
  } as ViewStyle,
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  } as ViewStyle,
  groupLabel: {
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
    flex: 1,
  } as TextStyle,
  groupCount: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  } as ViewStyle,
  slotWrapper: {
    width: '33.33%',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  slot: {
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  } as ViewStyle,
  selectedSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  } as ViewStyle,
  pastSlot: {
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
  } as ViewStyle,
  unavailableSlot: {
    opacity: 0.4,
    backgroundColor: COLORS.bgTertiary,
  } as ViewStyle,
  slotText: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifMedium,
    color: '#404040',
  } as TextStyle,
  selectedSlotText: {
    color: '#ffffff',
    fontFamily: FONTS.sansSerifSemiBold,
  } as TextStyle,
  pastSlotText: {
    color: '#d4d4d4',
    textDecorationLine: 'line-through',
  } as TextStyle,
  unavailableSlotText: {
    color: COLORS.textMuted,
  } as TextStyle,
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING['3xl'],
  } as ViewStyle,
  emptyText: {
    fontSize: FONTS.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
});
