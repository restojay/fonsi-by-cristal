/**
 * Zustand store for booking state management
 * Handles: service selection, date, time, client info, and current step
 */

import { create } from 'zustand';
import { Service, ClientInfo, BookingState } from '@types/index';

interface BookingStoreState extends BookingState {
  // Actions
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedTime: (time: string | null) => void;
  setClientInfo: (info: ClientInfo) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
  resetToStep: (step: number) => void;
  getBookingSummary: () => {
    service: Service | null;
    date: string | null;
    time: string | null;
    clientInfo: ClientInfo;
  };
}

const initialState: BookingState = {
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  clientInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },
  step: 1,
};

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  ...initialState,

  setSelectedService: (service: Service | null) => {
    set({ selectedService: service });
  },

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },

  setSelectedTime: (time: string | null) => {
    set({ selectedTime: time });
  },

  setClientInfo: (info: ClientInfo) => {
    set({ clientInfo: info });
  },

  setStep: (step: number) => {
    if (step >= 1 && step <= 5) {
      set({ step });
    }
  },

  nextStep: () => {
    set((state) => ({
      step: Math.min(state.step + 1, 5),
    }));
  },

  prevStep: () => {
    set((state) => ({
      step: Math.max(state.step - 1, 1),
    }));
  },

  resetToStep: (step: number) => {
    if (step === 1) {
      set({
        selectedService: null,
        selectedDate: null,
        selectedTime: null,
        step: 1,
      });
    } else if (step === 2) {
      set({
        selectedDate: null,
        selectedTime: null,
        step: 2,
      });
    } else if (step === 3) {
      set({
        selectedTime: null,
        step: 3,
      });
    }
  },

  resetBooking: () => {
    set(initialState);
  },

  getBookingSummary: () => {
    const state = get();
    return {
      service: state.selectedService,
      date: state.selectedDate,
      time: state.selectedTime,
      clientInfo: state.clientInfo,
    };
  },
}));

/**
 * Hook to validate current step completion
 */
export const useBookingValidation = () => {
  const { selectedService, selectedDate, selectedTime, clientInfo } =
    useBookingStore();

  const isStep1Valid = selectedService !== null;
  const isStep2Valid = selectedDate !== null;
  const isStep3Valid = selectedTime !== null;
  const isStep4Valid =
    clientInfo.firstName.trim() !== '' &&
    clientInfo.lastName.trim() !== '' &&
    clientInfo.email.trim() !== '' &&
    clientInfo.phone.trim() !== '';
  const isStep5Valid = isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid;

  return {
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStep4Valid,
    isStep5Valid,
  };
};
