export interface Service {
  id: string
  category: string
  name: string
  description?: string
  priceMin: number
  priceMax: number
  duration: number
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  date: Date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  userId: string
  serviceId: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface BusinessHours {
  id: string
  dayOfWeek: number
  openTime: string
  closeTime: string
  isClosed: boolean
  createdAt: Date
  updatedAt: Date
}

export interface BookingFormData {
  serviceId: string
  date: Date
  time: string
  name: string
  email: string
  phone: string
  notes?: string
}
