/**
 * Shared TypeScript types for Fonsi by Cristal app
 */

export interface Service {
  id: string;
  name: string;
  category: 'Hair' | 'Bridal' | 'Makeup' | 'Waxing';
  description: string;
  priceMin: number;
  priceMax: number;
  duration: number; // in minutes
  image?: string;
}

export interface TimeSlot {
  id: string;
  time: string; // HH:mm format
  available: boolean;
  serviceId?: string;
}

export interface ClientInfo {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  clientId?: string;
  clientInfo: ClientInfo;
  service: Service;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface BookingState {
  selectedService: Service | null;
  selectedDate: string | null;
  selectedTime: string | null;
  clientInfo: ClientInfo;
  step: number; // 1-5
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GetServicesResponse {
  services: Service[];
}

export interface GetAvailabilityResponse {
  slots: TimeSlot[];
}

export interface CreateAppointmentRequest {
  serviceId: string;
  date: string;
  time: string;
  clientInfo: ClientInfo;
  notes?: string;
}

export interface CreateAppointmentResponse {
  appointment: Appointment;
}

export interface GetAppointmentsResponse {
  appointments: Appointment[];
}
