/**
 * Booking screen with 5-step booking flow
 * Step 1: Service selection
 * Step 2: Date picker
 * Step 3: Time slot selection
 * Step 4: Contact info form
 * Step 5: Confirmation summary
 */

import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { format, addDays, isPast, isSunday, isMonday } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
import { Header } from '@components/Header';
import { ServiceCard } from '@components/ServiceCard';
import { TimeSlotPicker } from '@components/TimeSlotPicker';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '@constants/theme';
import { useBookingStore, useBookingValidation } from '@store/bookingStore';
import { useAppointmentStore } from '@store/appointmentStore';
import { apiClient } from '@api/client';
import { Service, TimeSlot } from '@types/index';
import { SERVICES } from '@constants/services';

const STEPS = ['Service', 'Date', 'Time', 'Info', 'Review'];

export default function BookScreen() {
  const bookingState = useBookingStore();
  const {
    selectedService,
    selectedDate,
    selectedTime,
    clientInfo,
    step,
  } = bookingState;

  const {
    setSelectedService,
    setSelectedDate,
    setSelectedTime,
    setClientInfo,
    setStep,
    nextStep,
    prevStep,
    resetBooking,
  } = bookingState;

  const addAppointment = useAppointmentStore((state) => state.addAppointment);
  const validation = useBookingValidation();

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Load services on mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await apiClient.getServices();
        setAllServices(services);
      } catch (error) {
        console.error('Failed to load services', error);
        setAllServices(SERVICES);
      }
    };

    loadServices();
  }, []);

  // Load time slots when date and service change
  useEffect(() => {
    if (selectedDate && selectedService) {
      const loadSlots = async () => {
        try {
          setIsLoading(true);
          const slots = await apiClient.getAvailability(selectedDate, selectedService.id);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Failed to load time slots', error);
          // Use default slots
          setTimeSlots(generateDefaultSlots());
        } finally {
          setIsLoading(false);
        }
      };

      loadSlots();
    }
  }, [selectedDate, selectedService]);

  const generateDefaultSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 10; hour < 18.5; hour += 0.5) {
      const h = Math.floor(hour);
      const m = (hour - h) * 60;
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({
        id: `slot-${time}`,
        time,
        available: true,
      });
    }
    return slots;
  };

  const isDateDisabled = (dateString: string): boolean => {
    const date = new Date(dateString);
    return (
      isPast(date) ||
      isSunday(date) ||
      isMonday(date)
    );
  };

  const getDisabledDates = () => {
    const disabled: { [key: string]: { disabled: boolean; disableTouchEvent: boolean } } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable next 90 days
    for (let i = 0; i < 90; i++) {
      const date = addDays(today, i);
      if (isSunday(date) || isMonday(date) || i === 0) {
        disabled[format(date, 'yyyy-MM-dd')] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
    }

    return disabled;
  };

  const validateContactInfo = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!clientInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!clientInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!clientInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!clientInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = async () => {
    if (step === 4) {
      if (!validateContactInfo()) return;
    }

    if (step === 5) {
      await handleSubmitBooking();
      return;
    }

    nextStep();
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please complete all booking steps');
      return;
    }

    try {
      setIsLoading(true);

      const appointmentData = {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        clientInfo,
      };

      const newAppointment = await apiClient.createAppointment(appointmentData);

      if (newAppointment) {
        addAppointment(newAppointment);
        Alert.alert(
          'Success!',
          'Your appointment has been booked. We will contact you to confirm.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetBooking();
                router.push('/');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create appointment. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit booking', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Header title="Book Appointment" subtitle={`Step ${step} of 5`} showLogo={false} />

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(step / 5) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.stepsContainer}>
          {STEPS.map((stepName, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                index + 1 <= step && styles.stepIndicatorActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  index + 1 <= step && styles.stepNumberActive,
                ]}
              >
                {index + 1}
              </Text>
              <Text
                style={[
                  styles.stepLabel,
                  index + 1 <= step && styles.stepLabelActive,
                ]}
              >
                {stepName}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Select a Service</Text>
          {allServices.length === 0 ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <ScrollView>
              {allServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={selectedService?.id === service.id}
                  onPress={() => setSelectedService(service)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Choose a Date</Text>
          <Text style={styles.stepSubtitle}>
            Available: Tuesday - Saturday
          </Text>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              ...getDisabledDates(),
              [selectedDate || '']: {
                selected: true,
                selectedColor: COLORS.primary,
              },
            }}
            theme={{
              backgroundColor: COLORS.cardBg,
              calendarBackground: COLORS.cardBg,
              textSectionTitleColor: COLORS.textPrimary,
              textSectionTitleDisabledColor: COLORS.textMuted,
              selectedDayBackgroundColor: COLORS.primary,
              selectedDayTextColor: COLORS.bgPrimary,
              todayTextColor: COLORS.primary,
              dayTextColor: COLORS.textPrimary,
              textDisabledColor: COLORS.textMuted,
              dotColor: COLORS.primary,
              selectedDotColor: COLORS.bgPrimary,
              monthTextColor: COLORS.textPrimary,
              arrowColor: COLORS.primary,
              disabledArrowColor: COLORS.textMuted,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'Georgia, serif',
              textDayHeaderFontFamily: 'System',
              textDayFontSize: 14,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>
      )}

      {/* Step 3: Time Selection */}
      {step === 3 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Select a Time</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <TimeSlotPicker
              slots={timeSlots}
              selectedTime={selectedTime || ''}
              onSelectTime={setSelectedTime}
            />
          )}
        </View>
      )}

      {/* Step 4: Contact Info */}
      {step === 4 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Your Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                formErrors.firstName && styles.inputError,
              ]}
              placeholder="John"
              placeholderTextColor={COLORS.textMuted}
              value={clientInfo.firstName}
              onChangeText={(text) =>
                setClientInfo({ ...clientInfo, firstName: text })
              }
            />
            {formErrors.firstName && (
              <Text style={styles.errorText}>{formErrors.firstName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[
                styles.input,
                formErrors.lastName && styles.inputError,
              ]}
              placeholder="Doe"
              placeholderTextColor={COLORS.textMuted}
              value={clientInfo.lastName}
              onChangeText={(text) =>
                setClientInfo({ ...clientInfo, lastName: text })
              }
            />
            {formErrors.lastName && (
              <Text style={styles.errorText}>{formErrors.lastName}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                formErrors.email && styles.inputError,
              ]}
              placeholder="john@example.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              value={clientInfo.email}
              onChangeText={(text) =>
                setClientInfo({ ...clientInfo, email: text })
              }
            />
            {formErrors.email && (
              <Text style={styles.errorText}>{formErrors.email}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[
                styles.input,
                formErrors.phone && styles.inputError,
              ]}
              placeholder="(210) 555-1234"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={clientInfo.phone}
              onChangeText={(text) =>
                setClientInfo({ ...clientInfo, phone: text })
              }
            />
            {formErrors.phone && (
              <Text style={styles.errorText}>{formErrors.phone}</Text>
            )}
          </View>
        </View>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Confirm Your Booking</Text>

          <View style={styles.reviewCard}>
            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Service</Text>
              <Text style={styles.reviewValue}>
                {selectedService?.name || 'Not selected'}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Price Range</Text>
              <Text style={styles.reviewValue}>
                ${selectedService?.priceMin} - ${selectedService?.priceMax}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Date & Time</Text>
              <Text style={styles.reviewValue}>
                {selectedDate && format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                {'\n'}
                {selectedTime}
              </Text>
            </View>

            <View style={styles.reviewDivider} />

            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Name</Text>
              <Text style={styles.reviewValue}>
                {clientInfo.firstName} {clientInfo.lastName}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Email</Text>
              <Text style={styles.reviewValue}>{clientInfo.email}</Text>
            </View>

            <View style={styles.reviewSection}>
              <Text style={styles.reviewLabel}>Phone</Text>
              <Text style={styles.reviewValue}>{clientInfo.phone}</Text>
            </View>
          </View>

          <Text style={styles.confirmNote}>
            We'll contact you to confirm your appointment within 24 hours.
          </Text>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            onPress={prevStep}
            style={styles.buttonSecondary}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonSecondaryText}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleNextStep}
          style={[
            styles.buttonPrimary,
            !validation[`isStep${step}Valid` as keyof typeof validation] &&
              styles.buttonDisabled,
          ]}
          activeOpacity={0.8}
          disabled={
            !validation[`isStep${step}Valid` as keyof typeof validation] ||
            isLoading
          }
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.bgPrimary} />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {step === 5 ? 'Book Now' : 'Next →'}
            </Text>
          )}
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
  progressSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  } as ViewStyle,
  progressBar: {
    height: 4,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  } as ViewStyle,
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  stepIndicatorActive: {
    opacity: 1,
  } as ViewStyle,
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    color: COLORS.textMuted,
    fontSize: FONTS.sm,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: SPACING.xs,
  } as TextStyle,
  stepNumberActive: {
    backgroundColor: COLORS.primary,
    color: COLORS.bgPrimary,
  } as TextStyle,
  stepLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  } as TextStyle,
  stepLabelActive: {
    color: COLORS.textPrimary,
  } as TextStyle,
  stepContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    minHeight: 300,
  } as ViewStyle,
  stepTitle: {
    fontSize: FONTS['2xl'],
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    fontFamily: 'Georgia, serif',
  } as TextStyle,
  stepSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  } as TextStyle,
  formGroup: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  label: {
    fontSize: FONTS.sm,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  input: {
    backgroundColor: COLORS.inputBg,
    borderColor: COLORS.inputBorder,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONTS.base,
  } as ViewStyle,
  inputError: {
    borderColor: COLORS.error,
  } as ViewStyle,
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.xs,
    marginTop: SPACING.xs,
  } as TextStyle,
  reviewCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    marginVertical: SPACING.lg,
  } as ViewStyle,
  reviewSection: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  reviewLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  } as TextStyle,
  reviewValue: {
    fontSize: FONTS.base,
    color: COLORS.textPrimary,
    fontWeight: '500',
    lineHeight: 22,
  } as TextStyle,
  reviewDivider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: SPACING.md,
  } as ViewStyle,
  confirmNote: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  } as ViewStyle,
  buttonSecondary: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderColor: COLORS.primary,
    borderWidth: 2,
    alignItems: 'center',
  } as ViewStyle,
  buttonSecondaryText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
  buttonPrimary: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.lg,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: COLORS.buttonDisabled,
    opacity: 0.6,
  } as ViewStyle,
  buttonPrimaryText: {
    color: COLORS.bgPrimary,
    fontWeight: '600',
    fontSize: FONTS.base,
  } as TextStyle,
});
