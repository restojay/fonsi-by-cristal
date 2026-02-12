'use client'

import { useState } from 'react'
import { Service } from '@/types'
import { bookingSchema, BookingFormData } from '@/lib/validation'
import { generateTimeSlots, formatTime } from '@/lib/utils'
import { format, addDays, isWeekday } from 'date-fns'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface BookingWidgetProps {
  services: Service[]
  onSuccess?: (appointmentId: string) => void
}

type BookingStep = 'service' | 'datetime' | 'info' | 'confirm'

export default function BookingWidget({ services, onSuccess }: BookingWidgetProps) {
  const [step, setStep] = useState<BookingStep>('service')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setStep('datetime')
    setError(null)
  }

  const handleDateChange = async (dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedTime('')

    // Generate time slots (10am-6:30pm, 30-min intervals)
    const slots = generateTimeSlots('10:00', '18:30', 30)
    setAvailableTimeSlots(slots)
  }

  const handleContinueToInfo = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time')
      return
    }
    setStep('info')
    setError(null)
  }

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContinueToConfirm = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please fill in all required fields')
      return
    }
    setStep('confirm')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!selectedService) throw new Error('Service not selected')

      const bookingData = {
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes,
      }

      // Validate with Zod schema
      const validated = bookingSchema.parse(bookingData)

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create appointment')
      }

      const result = await response.json()
      setSuccess(`Appointment booked successfully! Confirmation email sent to ${formData.email}`)

      // Reset form
      setTimeout(() => {
        setStep('service')
        setSelectedService(null)
        setSelectedDate('')
        setSelectedTime('')
        setFormData({ name: '', email: '', phone: '', notes: '' })
        setSuccess(null)
        if (onSuccess) onSuccess(result.id)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Get next 30 days, only Tuesday-Saturday
  const generateAvailableDates = () => {
    const dates: string[] = []
    for (let i = 0; i < 90; i++) {
      const date = addDays(new Date(), i)
      const dayOfWeek = date.getDay()
      // Tuesday (2) - Saturday (6)
      if (dayOfWeek >= 2 && dayOfWeek <= 6) {
        dates.push(format(date, 'yyyy-MM-dd'))
        if (dates.length === 30) break
      }
    }
    return dates
  }

  const groupedServices = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) acc[service.category] = []
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>
  )

  const categories = Object.keys(groupedServices).sort()

  return (
    <div className="bg-dark-800 border border-gold-500 border-opacity-30 rounded-lg p-8">
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {['service', 'datetime', 'info', 'confirm'].map((s, idx) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-sans font-semibold transition ${
                step === s
                  ? 'bg-gold-500 text-dark-900'
                  : ['service', 'datetime', 'info', 'confirm'].indexOf(step) > idx
                    ? 'bg-gold-500 bg-opacity-50 text-gold-500'
                    : 'bg-dark-700 text-gray-500'
              }`}
            >
              {idx + 1}
            </div>
            {idx < 3 && (
              <div
                className={`flex-1 h-1 mx-2 transition ${
                  ['service', 'datetime', 'info', 'confirm'].indexOf(step) > idx
                    ? 'bg-gold-500 bg-opacity-50'
                    : 'bg-dark-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-900 bg-opacity-30 border border-green-500 rounded text-green-400 text-sm font-sans">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900 bg-opacity-30 border border-red-500 rounded text-red-400 text-sm font-sans">
          {error}
        </div>
      )}

      {/* Step 1: Service Selection */}
      {step === 'service' && (
        <div>
          <h2 className="text-3xl font-serif font-bold text-gold-500 mb-6">Select a Service</h2>
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-serif font-semibold text-gold-400 mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedServices[category].map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="text-left p-4 bg-dark-700 border border-gold-500 border-opacity-30 rounded hover:border-gold-500 hover:border-opacity-60 transition group"
                    >
                      <p className="font-sans font-semibold text-gray-100 group-hover:text-gold-400 transition">
                        {service.name}
                      </p>
                      <p className="text-gold-500 text-sm font-sans mt-1">
                        ${service.priceMin} - ${service.priceMax}
                      </p>
                      <p className="text-gray-500 text-xs font-sans mt-1">{service.duration} min</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 'datetime' && selectedService && (
        <div>
          <h2 className="text-3xl font-serif font-bold text-gold-500 mb-2">
            {selectedService.name}
          </h2>
          <p className="text-gray-400 font-sans text-sm mb-6">
            Select your preferred date and time
          </p>

          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-gray-300 font-sans font-semibold mb-3">Date</label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {generateAvailableDates().map((date) => (
                  <button
                    key={date}
                    onClick={() => handleDateChange(date)}
                    className={`p-2 rounded text-sm font-sans font-semibold transition ${
                      selectedDate === date
                        ? 'bg-gold-500 text-dark-900'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600 border border-gold-500 border-opacity-20'
                    }`}
                  >
                    <div className="text-xs opacity-75">
                      {format(new Date(date), 'EEE')}
                    </div>
                    <div>{format(new Date(date), 'd')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="block text-gray-300 font-sans font-semibold mb-3">Time</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-2 rounded text-sm font-sans font-semibold transition ${
                        selectedTime === time
                          ? 'bg-gold-500 text-dark-900'
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600 border border-gold-500 border-opacity-20'
                      }`}
                    >
                      {formatTime(time)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep('service')}
              className="flex items-center gap-2 px-6 py-3 bg-dark-700 text-gray-300 rounded font-sans font-semibold hover:text-gold-500 transition"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={handleContinueToInfo}
              disabled={!selectedDate || !selectedTime}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-dark-900 rounded font-sans font-semibold hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition ml-auto"
            >
              Continue
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Personal Information */}
      {step === 'info' && selectedService && (
        <div>
          <h2 className="text-3xl font-serif font-bold text-gold-500 mb-6">Your Information</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-gray-300 font-sans font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-500 border-opacity-30 text-white rounded font-sans focus:outline-none focus:border-gold-500 focus:border-opacity-100 transition"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-sans font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-500 border-opacity-30 text-white rounded font-sans focus:outline-none focus:border-gold-500 focus:border-opacity-100 transition"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-sans font-semibold mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-500 border-opacity-30 text-white rounded font-sans focus:outline-none focus:border-gold-500 focus:border-opacity-100 transition"
                placeholder="(210) 555-0000"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-sans font-semibold mb-2">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInfoChange}
                className="w-full px-4 py-2 bg-dark-700 border border-gold-500 border-opacity-30 text-white rounded font-sans focus:outline-none focus:border-gold-500 focus:border-opacity-100 transition"
                placeholder="Any special requests or preferences?"
                rows={4}
              />
            </div>
          </form>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setStep('datetime')}
              className="flex items-center gap-2 px-6 py-3 bg-dark-700 text-gray-300 rounded font-sans font-semibold hover:text-gold-500 transition"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={handleContinueToConfirm}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-dark-900 rounded font-sans font-semibold hover:bg-gold-400 transition ml-auto"
            >
              Review Booking
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 'confirm' && selectedService && (
        <div>
          <h2 className="text-3xl font-serif font-bold text-gold-500 mb-6">Confirm Your Booking</h2>

          <div className="bg-dark-700 border border-gold-500 border-opacity-30 rounded-lg p-6 space-y-4 mb-6">
            <div className="flex justify-between items-start pb-4 border-b border-gold-500 border-opacity-20">
              <span className="text-gray-400 font-sans">Service</span>
              <span className="text-white font-sans font-semibold">{selectedService.name}</span>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gold-500 border-opacity-20">
              <span className="text-gray-400 font-sans">Date</span>
              <span className="text-white font-sans font-semibold">
                {format(new Date(selectedDate), 'MMMM d, yyyy')}
              </span>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gold-500 border-opacity-20">
              <span className="text-gray-400 font-sans">Time</span>
              <span className="text-white font-sans font-semibold">{formatTime(selectedTime)}</span>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gold-500 border-opacity-20">
              <span className="text-gray-400 font-sans">Duration</span>
              <span className="text-white font-sans font-semibold">{selectedService.duration} minutes</span>
            </div>

            <div className="flex justify-between items-start pb-4 border-b border-gold-500 border-opacity-20">
              <span className="text-gray-400 font-sans">Price</span>
              <span className="text-gold-500 font-sans font-semibold">
                ${selectedService.priceMin} - ${selectedService.priceMax}
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-sans">Name</span>
              <span className="text-white font-sans font-semibold">{formData.name}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-sans">Email</span>
              <span className="text-white font-sans font-semibold">{formData.email}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-gray-400 font-sans">Phone</span>
              <span className="text-white font-sans font-semibold">{formData.phone}</span>
            </div>
          </div>

          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-600 border-opacity-50 rounded p-4 mb-6">
            <p className="text-yellow-200 text-xs font-sans">
              <strong>Cancellation Policy:</strong> 24-hour cancellation required. 50% charge applies for cancellations within 24 hours.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('info')}
              className="flex items-center gap-2 px-6 py-3 bg-dark-700 text-gray-300 rounded font-sans font-semibold hover:text-gold-500 transition"
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-gold-500 text-dark-900 rounded font-sans font-semibold hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition ml-auto"
            >
              {isLoading ? 'Booking...' : 'Complete Booking'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
