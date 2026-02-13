import { z } from 'zod'

export const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
  date: z.string().min(1, 'Please select a date'),
  time: z.string().min(1, 'Please select a time'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please provide a valid phone number'),
  notes: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type EmailFormData = z.infer<typeof emailSchema>
