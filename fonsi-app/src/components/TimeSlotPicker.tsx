/**
 * Time slot grid picker component
 * Displays available time slots in a grid layout
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { TimeSlot } from '@types/index';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '@constants/theme';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onSelectTime: (time: string) => void;
  disabled?: boolean;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedTime,
  onSelectTime,
  disabled = false,
}) => {
  // Group slots into rows of 3
  const groupedSlots = useMemo(() => {
    const groups: TimeSlot[][] = [];
    for (let i = 0; i < slots.length; i += 3) {
      groups.push(slots.slice(i, i + 3));
    }
    return groups;
  }, [slots]);

  const renderTimeSlot = (slot: TimeSlot) => {
    const isSelected = selectedTime === slot.time;
    const isAvailable = slot.available;

    return (
      <TouchableOpacity
        key={slot.id}
        onPress={() => isAvailable && !disabled && onSelectTime(slot.time)}
        disabled={!isAvailable || disabled}
        style={[
          styles.slot,
          isSelected && styles.selectedSlot,
          !isAvailable && styles.unavailableSlot,
        ]}
        activeOpacity={isAvailable ? 0.7 : 1}
      >
        <Text
          style={[
            styles.slotText,
            isSelected && styles.selectedSlotText,
            !isAvailable && styles.unavailableSlotText,
          ]}
        >
          {slot.time}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = ({ item }: { item: TimeSlot[] }) => (
    <View style={styles.row}>
      {item.map((slot) => renderTimeSlot(slot))}
      {/* Fill empty spaces in the row */}
      {item.length < 3 &&
        Array(3 - item.length)
          .fill(null)
          .map((_, i) => (
            <View key={`empty-${i}`} style={styles.slot} />
          ))}
    </View>
  );

  if (slots.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No available time slots for this date</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedSlots}
        renderItem={renderRow}
        keyExtractor={(_, index) => `row-${index}`}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  } as ViewStyle,
  slot: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  selectedSlot: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  } as ViewStyle,
  unavailableSlot: {
    opacity: 0.5,
    backgroundColor: COLORS.bgTertiary,
  } as ViewStyle,
  slotText: {
    fontSize: FONTS.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  } as TextStyle,
  selectedSlotText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
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
    fontSize: FONTS.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  } as TextStyle,
});
