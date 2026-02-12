/**
 * Booking screen with animated progress bar, gradient step indicators, and smooth transitions
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ViewStyle,
  TextStyle,
  Animated as RNAnimated,
} from 'react-native';
import { format, addDays, isPast, isSunday, isMonday } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';
import { Header } from '@components/Header';
import { ServiceCard } from '@components/ServiceCard';
import { TimeSlotPicker } from '@components/TimeSlotPicker';
import { GradientButton } from '@components/GradientButton';
import { GradientCard } from '@components/GradientCard';
import { AnimatedSection } from '@components/AnimatedSection';
import { SkeletonList, SkeletonLoader } from '@components/SkeletonLoader';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, GRADIENTS, ANIMATION } from '@constants/theme';
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
  const progressWidth = useSharedValue(20);

  useEffect(() => {
    progressWidth.value = withTiming((step / 5) * 100, {
      duration: ANIMATION.timing.normal,
      easing: Easing.out(Easing.cubic),
    });
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%` as any,
  }));

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

  useEffect(() => {
    if (selectedDate && selectedService) {
      const loadSlots = async () => {
        try {
          setIsLoading(true);
          const slots = await apiClient.getAvailability(selectedDate, selectedService.id);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Failed to load time slots', error);
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

  const getDisabledDates = () => {
    const disabled: { [key: string]: { disabled: boolean; disableTouchEvent: boolean } } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
          <Animated.View style={[styles.progressFillContainer, progressStyle]}>
            <LinearGradient
              colors={[...GRADIENTS.goldButton]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
            />
          </Animated.View>
        </View>
        <View style={styles.stepsContainer}>
          {STEPS.map((stepName, index) => {
            const isCompleted = index + 1 < step;
            const isCurrent = index + 1 === step;
            const isActive = index + 1 <= step;

            return (
              <View key={index} style={styles.stepIndicator}>
                {isActive ? (
                  <LinearGradient
                    colors={[...GRADIENTS.goldButton]}
                    style={styles.stepCircle}
                  >
                    {isCompleted ? (
                      <Feather name="check" size={14} color={COLORS.bgPrimary} />
                    ) : (
                      <Text style={styles.stepNumberActive}>{index + 1}</Text>
                    )}
                  </LinearGradient>
                ) : (
                  <View style={styles.stepCircleInactive}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                  ]}
                >
                  {stepName}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <Text style={styles.stepTitle}>Select a Service</Text>
          {allServices.length === 0 ? (
            <SkeletonList count={4} />
          ) : (
            <View>
              {allServices.map((service, index) => (
                <AnimatedSection key={service.id} index={index}>
                  <ServiceCard
                    service={service}
                    isSelected={selectedService?.id === service.id}
                    onPress={() => setSelectedService(service)}
                  />
                </AnimatedSection>
              ))}
            </View>
          )}
        </Animated.View>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <Text style={styles.stepTitle}>Choose a Date</Text>
          <Text style={styles.stepSubtitle}>
            Available: Tuesday - Saturday
          </Text>
          <GradientCard showAccent={false}>
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
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
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
                textDayFontFamily: FONTS.sansSerif,
                textMonthFontFamily: FONTS.serifSemiBold,
                textDayHeaderFontFamily: FONTS.sansSerifMedium,
                textDayFontSize: 14,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 12,
              }}
            />
          </GradientCard>
        </Animated.View>
      )}

      {/* Step 3: Time Selection */}
      {step === 3 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <Text style={styles.stepTitle}>Select a Time</Text>
          {isLoading ? (
            <View style={styles.loadingTimeSlots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ marginBottom: SPACING.lg }}>
                  <SkeletonLoader width={120} height={18} style={{ marginBottom: SPACING.sm }} />
                  <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                    <SkeletonLoader width="30%" height={44} borderRadius={BORDER_RADIUS.md} />
                    <SkeletonLoader width="30%" height={44} borderRadius={BORDER_RADIUS.md} />
                    <SkeletonLoader width="30%" height={44} borderRadius={BORDER_RADIUS.md} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <TimeSlotPicker
              slots={timeSlots}
              selectedTime={selectedTime || ''}
              onSelectTime={setSelectedTime}
            />
          )}
        </Animated.View>
      )}

      {/* Step 4: Contact Info */}
      {step === 4 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <Text style={styles.stepTitle}>Your Information</Text>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Feather name="user" size={14} color={COLORS.primary} />
              <Text style={styles.label}>First Name</Text>
            </View>
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
            <View style={styles.labelRow}>
              <Feather name="user" size={14} color={COLORS.primary} />
              <Text style={styles.label}>Last Name</Text>
            </View>
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
            <View style={styles.labelRow}>
              <Feather name="mail" size={14} color={COLORS.primary} />
              <Text style={styles.label}>Email</Text>
            </View>
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
            <View style={styles.labelRow}>
              <Feather name="phone" size={14} color={COLORS.primary} />
              <Text style={styles.label}>Phone Number</Text>
            </View>
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
        </Animated.View>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <Text style={styles.stepTitle}>Confirm Your Booking</Text>

          <GradientCard>
            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <Feather name="scissors" size={14} color={COLORS.primary} />
                <Text style={styles.reviewLabel}>Service</Text>
              </View>
              <Text style={styles.reviewValue}>
                {selectedService?.name || 'Not selected'}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <Feather name="dollar-sign" size={14} color={COLORS.primary} />
                <Text style={styles.reviewLabel}>Price Range</Text>
              </View>
              <Text style={styles.reviewValue}>
                ${selectedService?.priceMin} - ${selectedService?.priceMax}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <Feather name="calendar" size={14} color={COLORS.primary} />
                <Text style={styles.reviewLabel}>Date & Time</Text>
              </View>
              <Text style={styles.reviewValue}>
                {selectedDate && format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                {'\n'}
                {selectedTime}
              </Text>
            </View>

            <View style={styles.reviewDivider} />

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <Feather name="user" size={14} color={COLORS.primary} />
                <Text style={styles.reviewLabel}>Name</Text>
              </View>
              <Text style={styles.reviewValue}>
                {clientInfo.firstName} {clientInfo.lastName}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <Feather name="mail" size={14} color={COLORS.primary} />
                <Text style={styles.reviewLabel}>Email</Text>
              </View>
              <Text style={styles.reviewValue}>{clientInfo.email}</Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <Feather name="phone" size={14} color={COLORS.primary} />
                <Text style={styles.reviewLabel}>Phone</Text>
              </View>
              <Text style={styles.reviewValue}>{clientInfo.phone}</Text>
            </View>
          </GradientCard>

          <Text style={styles.confirmNote}>
            We'll contact you to confirm your appointment within 24 hours.
          </Text>
        </Animated.View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <View style={{ flex: 1 }}>
            <GradientButton
              title="Back"
              onPress={prevStep}
              variant="outline"
              icon="arrow-left"
            />
          </View>
        )}

        <View style={{ flex: 1 }}>
          <GradientButton
            title={step === 5 ? 'Book Now' : 'Next'}
            onPress={handleNextStep}
            disabled={
              !validation[`isStep${step}Valid` as keyof typeof validation] ||
              isLoading
            }
            loading={isLoading && step === 5}
            icon={step === 5 ? 'check' : undefined}
            iconRight={step < 5 ? 'arrow-right' : undefined}
          />
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
  progressSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  } as ViewStyle,
  progressBar: {
    height: 4,
    backgroundColor: COLORS.bgSecondary,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  } as ViewStyle,
  progressFillContainer: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  } as ViewStyle,
  progressFill: {
    flex: 1,
  } as ViewStyle,
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  } as ViewStyle,
  stepCircleInactive: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  } as ViewStyle,
  stepNumber: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textMuted,
  } as TextStyle,
  stepNumberActive: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.bgPrimary,
  } as TextStyle,
  stepLabel: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerifMedium,
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
    fontFamily: FONTS.serifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  stepSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  loadingTimeSlots: {
    paddingVertical: SPACING.lg,
  } as ViewStyle,
  formGroup: {
    marginBottom: SPACING.lg,
  } as ViewStyle,
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  } as ViewStyle,
  label: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.sm,
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
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  inputError: {
    borderColor: COLORS.error,
  } as TextStyle,
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.xs,
    marginTop: SPACING.xs,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  reviewSection: {
    marginBottom: SPACING.md,
  } as ViewStyle,
  reviewLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  } as ViewStyle,
  reviewLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifMedium,
    marginLeft: SPACING.sm,
  } as TextStyle,
  reviewValue: {
    fontSize: FONTS.base,
    color: COLORS.textPrimary,
    fontFamily: FONTS.sansSerifMedium,
    lineHeight: 22,
    marginLeft: SPACING.xl + 2,
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
    marginVertical: SPACING.lg,
    fontStyle: 'italic',
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  } as ViewStyle,
});
