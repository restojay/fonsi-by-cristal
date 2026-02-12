/**
 * Zustand store for appointments state management
 * Handles: upcoming appointments, past appointments, and appointment list
 */

import { create } from 'zustand';
import { Appointment } from '@types/index';

interface AppointmentStoreState {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointmentId: string, appointment: Appointment) => void;
  removeAppointment: (appointmentId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
  getAppointmentById: (id: string) => Appointment | undefined;
}

export const useAppointmentStore = create<AppointmentStoreState>((set, get) => ({
  appointments: [],
  isLoading: false,
  error: null,

  setAppointments: (appointments: Appointment[]) => {
    set({ appointments });
  },

  addAppointment: (appointment: Appointment) => {
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    }));
  },

  updateAppointment: (appointmentId: string, updatedAppointment: Appointment) => {
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === appointmentId ? updatedAppointment : apt
      ),
    }));
  },

  removeAppointment: (appointmentId: string) => {
    set((state) => ({
      appointments: state.appointments.filter((apt) => apt.id !== appointmentId),
    }));
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  getUpcomingAppointments: () => {
    const now = new Date();
    return get()
      .appointments.filter((apt) => {
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return (
          aptDate > now &&
          (apt.status === 'confirmed' || apt.status === 'pending')
        );
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() -
                       new Date(`${b.date}T${b.time}`).getTime());
  },

  getPastAppointments: () => {
    const now = new Date();
    return get()
      .appointments.filter((apt) => {
        const aptDate = new Date(`${apt.date}T${apt.time}`);
        return aptDate <= now || apt.status === 'completed' || apt.status === 'cancelled';
      })
      .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() -
                       new Date(`${a.date}T${a.time}`).getTime());
  },

  getAppointmentById: (id: string) => {
    return get().appointments.find((apt) => apt.id === id);
  },
}));
