/**
 * API Client for Fonsi by Cristal
 * Handles communication with the shared backend
 */

import axios, { AxiosInstance } from 'axios';
import {
  Service,
  TimeSlot,
  Appointment,
  ApiResponse,
  CreateAppointmentRequest,
  GetServicesResponse,
  GetAvailabilityResponse,
  CreateAppointmentResponse,
  GetAppointmentsResponse,
} from '@types/index';
import { SERVICES } from '@constants/services';

// Configure base URL - can be changed via environment or runtime config
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.fonsibycrystal.com';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FonsiByCristal-Mobile/1.0',
      },
    });

    // Response interceptor unwraps response.data automatically
    // so all methods receive the API payload directly (not AxiosResponse)
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        throw error;
      }
    );
  }

  /**
   * Get all services
   * Falls back to hardcoded services if API fails
   */
  async getServices(): Promise<Service[]> {
    try {
      // Interceptor already unwraps to ApiResponse<GetServicesResponse>
      const response = await this.client.get<ApiResponse<GetServicesResponse>>(
        '/api/services'
      );
      return (response as any)?.services || SERVICES;
    } catch (error) {
      console.warn('Failed to fetch services from API, using fallback', error);
      return SERVICES;
    }
  }

  /**
   * Get services by category
   */
  async getServicesByCategory(category: string): Promise<Service[]> {
    try {
      const response = await this.client.get<ApiResponse<GetServicesResponse>>(
        `/api/services?category=${encodeURIComponent(category)}`
      );
      return (response as any)?.services || [];
    } catch (error) {
      console.warn(`Failed to fetch ${category} services`, error);
      return SERVICES.filter((s) => s.category === category);
    }
  }

  /**
   * Get service by ID
   */
  async getService(serviceId: string): Promise<Service | null> {
    try {
      const response = await this.client.get<ApiResponse<{ service: Service }>>(
        `/api/services/${serviceId}`
      );
      return (response as any)?.service || null;
    } catch (error) {
      console.warn(`Failed to fetch service ${serviceId}`, error);
      return SERVICES.find((s) => s.id === serviceId) || null;
    }
  }

  /**
   * Get available time slots for a date and service
   * Returns 30-minute intervals from 10am to dynamic end based on duration
   * Excludes Sundays and Mondays
   */
  async getAvailability(date: string, serviceId: string): Promise<TimeSlot[]> {
    try {
      const response = await this.client.get<ApiResponse<GetAvailabilityResponse>>(
        `/api/availability?date=${date}&serviceId=${serviceId}`
      );
      return (response as any)?.slots || this.generateDefaultTimeSlots();
    } catch (error) {
      console.warn('Failed to fetch availability, using default slots', error);
      return this.generateDefaultTimeSlots();
    }
  }

  /**
   * Generate default time slots (fallback)
   * 30-minute intervals from 10am, last slot allows finish by 6pm
   */
  private generateDefaultTimeSlots(serviceDuration: number = 30): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const start = 10 * 60; // 10am in minutes
    const clampedDuration = Math.min(serviceDuration, 180);
    const lastSlotMinutes = 18 * 60 - clampedDuration; // finish by 6pm
    let id = 0;

    for (let minutes = start; minutes <= lastSlotMinutes; minutes += 30) {
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
  }

  /**
   * Create a new appointment
   */
  async createAppointment(
    data: CreateAppointmentRequest
  ): Promise<Appointment | null> {
    try {
      const response = await this.client.post<
        ApiResponse<CreateAppointmentResponse>
      >('/api/appointments', data);

      return (response as any)?.appointment || null;
    } catch (error) {
      console.error('Failed to create appointment', error);
      throw error;
    }
  }

  /**
   * Get appointments for a client
   */
  async getAppointments(clientId: string): Promise<Appointment[]> {
    try {
      const response = await this.client.get<ApiResponse<GetAppointmentsResponse>>(
        `/api/appointments?clientId=${clientId}`
      );
      return (response as any)?.appointments || [];
    } catch (error) {
      console.warn('Failed to fetch appointments', error);
      return [];
    }
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    try {
      const response = await this.client.get<ApiResponse<{ appointment: Appointment }>>(
        `/api/appointments/${appointmentId}`
      );
      return (response as any)?.appointment || null;
    } catch (error) {
      console.warn(`Failed to fetch appointment ${appointmentId}`, error);
      return null;
    }
  }

  /**
   * Update appointment
   */
  async updateAppointment(
    appointmentId: string,
    data: Partial<Appointment>
  ): Promise<Appointment | null> {
    try {
      const response = await this.client.put<ApiResponse<{ appointment: Appointment }>>(
        `/api/appointments/${appointmentId}`,
        data
      );
      return (response as any)?.appointment || null;
    } catch (error) {
      console.error(`Failed to update appointment ${appointmentId}`, error);
      throw error;
    }
  }

  /**
   * Cancel appointment
   */
  async cancelAppointment(appointmentId: string): Promise<boolean> {
    try {
      await this.client.delete(`/api/appointments/${appointmentId}`);
      return true;
    } catch (error) {
      console.error(`Failed to cancel appointment ${appointmentId}`, error);
      throw error;
    }
  }

  /**
   * Set or change the base URL
   */
  setBaseURL(url: string): void {
    this.client.defaults.baseURL = url;
  }

  /**
   * Add authorization token
   */
  setAuthToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Remove authorization token
   */
  clearAuthToken(): void {
    delete this.client.defaults.headers.common['Authorization'];
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing
export default ApiClient;
