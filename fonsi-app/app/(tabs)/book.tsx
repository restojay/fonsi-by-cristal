/**
 * Booking screen with section labels, larger step titles, glowing Book Now, upgraded inputs
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
  Pressable,
  ViewStyle,
  TextStyle,
  Animated as RNAnimated,
} from 'react-native';
import { format, addDays, isPast, isSunday, isMonday } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Header } from '@components/Header';
import { ServiceCard } from '@components/ServiceCard';
import { TimeSlotPicker } from '@components/TimeSlotPicker';
import { GradientButton } from '@components/GradientButton';
import { GradientCard } from '@components/GradientCard';
import { GlowingBorderButton } from '@components/GlowingBorderButton';
import { AnimatedSection } from '@components/AnimatedSection';
import { SectionLabel } from '@components/SectionLabel';
import { SkeletonList, SkeletonLoader } from '@components/SkeletonLoader';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION } from '@constants/theme';
import { useBookingStore, useBookingValidation } from '@store/bookingStore';
import { useAppointmentStore } from '@store/appointmentStore';
import { apiClient } from '@api/client';
import { Service, TimeSlot } from '@types/index';
import { SERVICES, SERVICES_BY_CATEGORY } from '@constants/services';

const STEPS = ['Service', 'Date', 'Time', 'Info', 'Review'];

type ServiceCategory = 'Hair' | 'Bridal' | 'Makeup' | 'Waxing';

export default function BookScreen() {
  const bookingState = useBookingStore();
  const {
    selectedService,
    stackedServices,
    selectedDate,
    selectedTime,
    clientInfo,
    step,
  } = bookingState;

  const {
    setSelectedService,
    setStackedServices,
    toggleStackedService,
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
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('Hair');
  const scrollViewRef = useRef<ScrollView>(null);
  const orderSummaryY = useRef(0);
  const [showFloatingContinue, setShowFloatingContinue] = useState(true);
  const insets = useSafeAreaInsets();
  const progressWidth = useSharedValue(20);

  const scrollToOrderSummary = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: orderSummaryY.current, animated: true });
    setShowFloatingContinue(false);
  }, []);

  const handleScroll = useCallback((e: any) => {
    if (step !== 1 || stackedServices.length === 0) return;
    const scrollY = e.nativeEvent.contentOffset.y;
    const summaryVisible = scrollY >= orderSummaryY.current - 300;
    setShowFloatingContinue(!summaryVisible);
  }, [step, stackedServices.length]);

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

  // Generate time slots based on service duration
  const generateDynamicSlots = (duration: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const clampedDuration = Math.min(duration, 180);
    const startMinutes = 10 * 60; // 10am
    const lastSlotMinutes = 18 * 60 - clampedDuration; // finish by 6pm
    let id = 0;

    for (let minutes = startMinutes; minutes <= lastSlotMinutes; minutes += 30) {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({
        id: `slot-${id++}`,
        time,
        available: true,
      });
    }
    return slots;
  };

  useEffect(() => {
    if (selectedDate && selectedService) {
      const loadSlots = async () => {
        try {
          setIsLoading(true);
          const slots = await apiClient.getAvailability(selectedDate, selectedService.id);
          setTimeSlots(slots);
        } catch (error) {
          console.error('Failed to load time slots', error);
          setTimeSlots(generateDynamicSlots(selectedService.duration));
        } finally {
          setIsLoading(false);
        }
      };

      loadSlots();
    }
  }, [selectedDate, selectedService]);

  const getMinDate = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const blockToday = hours > 17 || (hours === 17 && minutes >= 30);
    const start = blockToday ? addDays(now, 1) : now;
    return format(start, 'yyyy-MM-dd');
  };

  const getMaxDate = () => {
    return format(addDays(new Date(), 90), 'yyyy-MM-dd');
  };

  const getDisabledDates = () => {
    const disabled: { [key: string]: { disabled: boolean; disableTouchEvent: boolean } } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    // Only block today after 5:30 PM
    const blockToday = hours > 17 || (hours === 17 && minutes >= 30);

    for (let i = 0; i < 90; i++) {
      const date = addDays(today, i);
      if (isSunday(date) || isMonday(date) || (i === 0 && blockToday)) {
        disabled[format(date, 'yyyy-MM-dd')] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
    }

    return disabled;
  };

  const filteredServices = allServices.length > 0
    ? allServices.filter((s) => s.category === selectedCategory)
    : SERVICES.filter((s) => s.category === selectedCategory);

  const handleServiceSelect = (service: Service) => {
    toggleStackedService(service);
  };

  const handleStackedContinue = () => {
    if (stackedServices.length === 0) return;
    if (stackedServices.length === 1) {
      setSelectedService(stackedServices[0]);
    } else {
      const combined: Service = {
        id: stackedServices.map((s) => s.id).join('+'),
        name: stackedServices.map((s) => s.name).join(' + '),
        category: stackedServices[0].category,
        description: stackedServices.map((s) => s.name).join(', '),
        priceMin: stackedServices.reduce((sum, s) => sum + s.priceMin, 0),
        priceMax: stackedServices.reduce((sum, s) => sum + s.priceMax, 0),
        duration: stackedServices.reduce((sum, s) => sum + s.duration, 0),
      };
      setSelectedService(combined);
    }
    nextStep();
  };

  const totalStackedDuration = stackedServices.reduce((sum, s) => sum + s.duration, 0);
  const totalStackedMin = stackedServices.reduce((sum, s) => sum + s.priceMin, 0);
  const totalStackedMax = stackedServices.reduce((sum, s) => sum + s.priceMax, 0);

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
          'Your appointment has been booked. I will contact you to confirm.',
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

  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) return 'Consultation';
    if (min === max) return `$${min}`;
    return `$${min} - $${max}`;
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      <Header title="Book Appointment" subtitle={`Step ${step} of 5`} showLogo={false} />

      {/* Progress Indicator */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFillContainer, progressStyle]}>
            <View style={styles.progressFill} />
          </Animated.View>
        </View>
        <View style={styles.stepsContainer}>
          {STEPS.map((stepName, index) => {
            const isCompleted = index + 1 < step;
            const isCurrent = index + 1 === step;
            const isActive = index + 1 <= step;

            return (
              <View key={index} style={styles.stepIndicator}>
                <View style={[
                  styles.stepCircle,
                  isActive ? styles.stepCircleActive : styles.stepCircleInactive,
                ]}>
                  {isCompleted ? (
                    <Feather name="check" size={14} color="#ffffff" />
                  ) : (
                    <Text style={[
                      styles.stepNumber,
                      isActive && styles.stepNumberActive,
                    ]}>{index + 1}</Text>
                  )}
                </View>
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

      {/* Step 1: Service Selection with category tabs and stacking */}
      {step === 1 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <SectionLabel text="STEP 1 OF 5" />
          <Text style={styles.stepTitle}>Select a Service</Text>

          {/* Category Tabs */}
          <View style={styles.categoriesRow}>
            {(['Hair', 'Bridal', 'Makeup', 'Waxing'] as ServiceCategory[]).map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                  style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                >
                  <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.stackingHint}>
            Select one or more services, then press Continue
          </Text>

          {allServices.length === 0 && SERVICES.length === 0 ? (
            <SkeletonList count={4} />
          ) : (
            <View>
              {filteredServices.map((service, index) => (
                <AnimatedSection key={service.id} index={index}>
                  <ServiceCard
                    service={service}
                    isSelected={stackedServices.some((s) => s.id === service.id)}
                    onPress={() => handleServiceSelect(service)}
                  />
                </AnimatedSection>
              ))}
            </View>
          )}

          {/* Order Summary */}
          {stackedServices.length > 0 && (
            <View
              style={styles.orderSummary}
              onLayout={(e) => { orderSummaryY.current = e.nativeEvent.layout.y; }}
            >
              <Text style={styles.orderSummaryTitle}>
                Order Summary ({stackedServices.length})
              </Text>
              {stackedServices.map((s) => (
                <View key={s.id} style={styles.orderSummaryItem}>
                  <Text style={styles.orderSummaryItemText}>{s.name}</Text>
                  <TouchableOpacity onPress={() => toggleStackedService(s)}>
                    <Feather name="x" size={14} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.orderSummaryStats}>
                <View style={styles.orderSummaryStat}>
                  <Text style={styles.orderSummaryStatLabel}>Estimate</Text>
                  <Text style={styles.orderSummaryStatValue}>
                    {formatPrice(totalStackedMin, totalStackedMax)}
                  </Text>
                </View>
                <View style={styles.orderSummaryStat}>
                  <Text style={styles.orderSummaryStatLabel}>Duration</Text>
                  <Text style={styles.orderSummaryStatValue}>
                    {totalStackedDuration} min
                  </Text>
                </View>
              </View>
              {totalStackedDuration > 180 && (
                <Text style={styles.durationWarning}>
                  This combination exceeds 3 hours — a second appointment may be needed.
                </Text>
              )}
              <GradientButton
                title="Continue"
                onPress={handleStackedContinue}
                iconRight="arrow-right"
              />
            </View>
          )}
        </Animated.View>
      )}

      {/* Step 2: Date Selection */}
      {step === 2 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <SectionLabel text="STEP 2 OF 5" />
          <Text style={styles.stepTitle}>Choose a Date</Text>
          <Text style={styles.stepSubtitle}>
            Available: Tuesday - Saturday
          </Text>
          <GradientCard showAccent={false}>
            <Calendar
              onDayPress={(day) => setSelectedDate(day.dateString)}
              minDate={getMinDate()}
              maxDate={getMaxDate()}
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
                selectedDayTextColor: '#ffffff',
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.textPrimary,
                textDisabledColor: COLORS.textMuted,
                dotColor: COLORS.primary,
                selectedDotColor: '#ffffff',
                monthTextColor: COLORS.textPrimary,
                arrowColor: COLORS.primary,
                disabledArrowColor: COLORS.textMuted,
                textDayFontFamily: FONTS.sansSerif,
                textMonthFontFamily: FONTS.serifBold,
                textDayHeaderFontFamily: FONTS.sansSerifMedium,
                textDayFontSize: 14,
                textMonthFontSize: 22,
                textDayHeaderFontSize: 12,
              }}
            />
          </GradientCard>
        </Animated.View>
      )}

      {/* Step 3: Time Selection */}
      {step === 3 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <SectionLabel text="STEP 3 OF 5" />
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
              selectedDate={selectedDate || undefined}
            />
          )}
        </Animated.View>
      )}

      {/* Step 4: Contact Info + Notes */}
      {step === 4 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <SectionLabel text="STEP 4 OF 5" />
          <Text style={styles.stepTitle}>Your Information</Text>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Feather name="user" size={14} color={COLORS.textSecondary} />
              <Text style={styles.label}>First Name</Text>
            </View>
            <TextInput
              style={[styles.input, formErrors.firstName && styles.inputError]}
              placeholder="John"
              placeholderTextColor={COLORS.textMuted}
              value={clientInfo.firstName}
              onChangeText={(text) => setClientInfo({ ...clientInfo, firstName: text })}
              autoComplete="given-name"
              textContentType="givenName"
              autoCapitalize="words"
              returnKeyType="next"
            />
            {formErrors.firstName && <Text style={styles.errorText}>{formErrors.firstName}</Text>}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Feather name="user" size={14} color={COLORS.textSecondary} />
              <Text style={styles.label}>Last Name</Text>
            </View>
            <TextInput
              style={[styles.input, formErrors.lastName && styles.inputError]}
              placeholder="Doe"
              placeholderTextColor={COLORS.textMuted}
              value={clientInfo.lastName}
              onChangeText={(text) => setClientInfo({ ...clientInfo, lastName: text })}
              autoComplete="family-name"
              textContentType="familyName"
              autoCapitalize="words"
              returnKeyType="next"
            />
            {formErrors.lastName && <Text style={styles.errorText}>{formErrors.lastName}</Text>}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Feather name="mail" size={14} color={COLORS.textSecondary} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={[styles.input, formErrors.email && styles.inputError]}
              placeholder="john@example.com"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              value={clientInfo.email}
              onChangeText={(text) => setClientInfo({ ...clientInfo, email: text })}
              autoComplete="email"
              textContentType="emailAddress"
              autoCapitalize="none"
              returnKeyType="next"
            />
            {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Feather name="phone" size={14} color={COLORS.textSecondary} />
              <Text style={styles.label}>Phone Number</Text>
            </View>
            <TextInput
              style={[styles.input, formErrors.phone && styles.inputError]}
              placeholder="(210) 555-1234"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={clientInfo.phone}
              onChangeText={(text) => setClientInfo({ ...clientInfo, phone: text })}
              autoComplete="tel"
              textContentType="telephoneNumber"
              returnKeyType="next"
            />
            {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Feather name="message-square" size={14} color={COLORS.textSecondary} />
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.labelOptional}>(optional)</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special requests or preferences?"
              placeholderTextColor={COLORS.textMuted}
              value={clientInfo.notes || ''}
              onChangeText={(text) => setClientInfo({ ...clientInfo, notes: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </View>
        </Animated.View>
      )}

      {/* Step 5: Review + Cancellation Policy */}
      {step === 5 && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.stepContent}>
          <SectionLabel text="STEP 5 OF 5" />
          <Text style={styles.stepTitle}>Confirm Your Booking</Text>

          <GradientCard>
            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <View style={styles.reviewIconCircle}>
                  <Feather name="scissors" size={14} color="#ffffff" />
                </View>
                <Text style={styles.reviewLabel}>Service</Text>
              </View>
              <Text style={styles.reviewValue}>
                {selectedService?.name || 'Not selected'}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <View style={styles.reviewIconCircle}>
                  <Feather name="dollar-sign" size={14} color="#ffffff" />
                </View>
                <Text style={styles.reviewLabel}>Price Range</Text>
              </View>
              <Text style={styles.reviewValue}>
                {selectedService ? formatPrice(selectedService.priceMin, selectedService.priceMax) : '—'}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <View style={styles.reviewIconCircle}>
                  <Feather name="clock" size={14} color="#ffffff" />
                </View>
                <Text style={styles.reviewLabel}>Duration</Text>
              </View>
              <Text style={styles.reviewValue}>
                {selectedService?.duration} minutes
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <View style={styles.reviewIconCircle}>
                  <Feather name="calendar" size={14} color="#ffffff" />
                </View>
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
                <View style={styles.reviewIconCircle}>
                  <Feather name="user" size={14} color="#ffffff" />
                </View>
                <Text style={styles.reviewLabel}>Name</Text>
              </View>
              <Text style={styles.reviewValue}>
                {clientInfo.firstName} {clientInfo.lastName}
              </Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <View style={styles.reviewIconCircle}>
                  <Feather name="mail" size={14} color="#ffffff" />
                </View>
                <Text style={styles.reviewLabel}>Email</Text>
              </View>
              <Text style={styles.reviewValue}>{clientInfo.email}</Text>
            </View>

            <View style={styles.reviewSection}>
              <View style={styles.reviewLabelRow}>
                <View style={styles.reviewIconCircle}>
                  <Feather name="phone" size={14} color="#ffffff" />
                </View>
                <Text style={styles.reviewLabel}>Phone</Text>
              </View>
              <Text style={styles.reviewValue}>{clientInfo.phone}</Text>
            </View>

            {clientInfo.notes ? (
              <View style={styles.reviewSection}>
                <View style={styles.reviewLabelRow}>
                  <View style={styles.reviewIconCircle}>
                    <Feather name="message-square" size={14} color="#ffffff" />
                  </View>
                  <Text style={styles.reviewLabel}>Notes</Text>
                </View>
                <Text style={styles.reviewValue}>{clientInfo.notes}</Text>
              </View>
            ) : null}
          </GradientCard>

          {/* Cancellation Policy */}
          <View style={styles.cancellationPolicy}>
            <Text style={styles.cancellationPolicyText}>
              <Text style={styles.cancellationPolicyBold}>Cancellation Policy: </Text>
              24-hour notice required. 50% charge for cancellations within 24 hours.
            </Text>
          </View>

          <Text style={styles.confirmNote}>
            I'll contact you to confirm your appointment within 24 hours.
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

        {step !== 1 && (
          <View style={{ flex: 1 }}>
            {step === 5 ? (
              <GlowingBorderButton
                title="Book Now"
                onPress={handleNextStep}
                icon="check"
                disabled={
                  !validation[`isStep${step}Valid` as keyof typeof validation] ||
                  isLoading
                }
                loading={isLoading}
              />
            ) : (
              <GradientButton
                title="Next"
                onPress={handleNextStep}
                disabled={
                  !validation[`isStep${step}Valid` as keyof typeof validation] ||
                  isLoading
                }
                iconRight="arrow-right"
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>

      {/* Floating Continue — visible on step 1 when services are selected */}
      {step === 1 && stackedServices.length > 0 && showFloatingContinue && (
        <TouchableOpacity
          style={[styles.floatingContinue, { bottom: insets.bottom + 20 }]}
          activeOpacity={0.85}
          onPress={scrollToOrderSummary}
        >
          <Text style={styles.floatingContinueText}>
            Continue ({stackedServices.length})
          </Text>
          <Feather name="chevron-down" size={18} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  } as ViewStyle,
  progressSection: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  progressBar: {
    height: 4,
    backgroundColor: COLORS.borderColor,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  } as ViewStyle,
  progressFillContainer: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  } as ViewStyle,
  progressFill: {
    flex: 1,
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
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  } as ViewStyle,
  stepCircleActive: {
    backgroundColor: COLORS.primary,
  } as ViewStyle,
  stepCircleInactive: {
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  stepNumber: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textMuted,
  } as TextStyle,
  stepNumberActive: {
    color: '#ffffff',
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    minHeight: 300,
  } as ViewStyle,
  stepTitle: {
    fontSize: 30,
    fontFamily: FONTS.serifBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  } as TextStyle,
  stepSubtitle: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  // Category tabs
  categoriesRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  } as ViewStyle,
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.bgTertiary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
  } as ViewStyle,
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  } as ViewStyle,
  categoryTabText: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textSecondary,
  } as TextStyle,
  categoryTabTextActive: {
    color: '#ffffff',
  } as TextStyle,
  stackingHint: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  // Order Summary
  orderSummary: {
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS['2xl'],
    padding: SPACING.xl,
    marginTop: SPACING.xl,
  } as ViewStyle,
  orderSummaryTitle: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifSemiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 3,
  } as TextStyle,
  orderSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgTertiary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  } as ViewStyle,
  orderSummaryItemText: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifMedium,
    color: COLORS.textPrimary,
    flex: 1,
  } as TextStyle,
  orderSummaryStats: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginVertical: SPACING.md,
  } as ViewStyle,
  orderSummaryStat: {
    flex: 1,
    backgroundColor: COLORS.bgTertiary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  } as ViewStyle,
  orderSummaryStatLabel: {
    fontSize: 10,
    fontFamily: FONTS.sansSerifMedium,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: SPACING.xs,
  } as TextStyle,
  orderSummaryStatValue: {
    fontSize: FONTS.sm,
    fontFamily: FONTS.sansSerifBold,
    color: COLORS.textPrimary,
  } as TextStyle,
  durationWarning: {
    fontSize: FONTS.xs,
    color: COLORS.warning,
    fontFamily: FONTS.sansSerif,
    marginBottom: SPACING.md,
  } as TextStyle,
  loadingTimeSlots: {
    paddingVertical: SPACING.xl,
  } as ViewStyle,
  formGroup: {
    marginBottom: SPACING.xl,
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
  labelOptional: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerif,
    color: COLORS.textMuted,
    marginLeft: SPACING.xs,
  } as TextStyle,
  input: {
    backgroundColor: '#ffffff',
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    color: COLORS.textPrimary,
    fontSize: FONTS.base,
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  textArea: {
    minHeight: 80,
    paddingTop: SPACING.lg,
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
  reviewIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  } as ViewStyle,
  reviewLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifMedium,
  } as TextStyle,
  reviewValue: {
    fontSize: FONTS.base,
    color: COLORS.textPrimary,
    fontFamily: FONTS.sansSerifMedium,
    lineHeight: 22,
    marginLeft: SPACING['3xl'] + SPACING.sm,
  } as TextStyle,
  reviewDivider: {
    height: 1,
    backgroundColor: COLORS.borderColor,
    marginVertical: SPACING.md,
  } as ViewStyle,
  cancellationPolicy: {
    backgroundColor: COLORS.bgSecondary,
    borderColor: COLORS.borderColor,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS['2xl'],
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.md,
  } as ViewStyle,
  cancellationPolicyText: {
    fontSize: FONTS.xs,
    color: COLORS.textMuted,
    fontFamily: FONTS.sansSerif,
    lineHeight: 18,
  } as TextStyle,
  cancellationPolicyBold: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.sansSerifMedium,
  } as TextStyle,
  confirmNote: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.xl,
    fontStyle: 'italic',
    fontFamily: FONTS.sansSerif,
  } as TextStyle,
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  } as ViewStyle,
  floatingContinue: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 23, 23, 0.85)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: BORDER_RADIUS.full,
    gap: 4,
  } as ViewStyle,
  floatingContinueText: {
    fontSize: FONTS.xs,
    fontFamily: FONTS.sansSerifSemiBold,
    color: '#ffffff',
    letterSpacing: 1,
  } as TextStyle,
});
