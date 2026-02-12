'use client'

import { useState } from 'react'
import { Service } from '@/types'
import { bookingSchema } from '@/lib/validation'
import { generateTimeSlots, formatTime } from '@/lib/utils'
import { format, addDays } from 'date-fns'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookingWidgetProps {
  services: Service[]
  onSuccess?: (appointmentId: string) => void
}

type BookingStep = 'service' | 'datetime' | 'info' | 'confirm'

const steps: BookingStep[] = ['service', 'datetime', 'info', 'confirm']

export default function BookingWidget({ services, onSuccess }: BookingWidgetProps) {
  const [step, setStep] = useState<BookingStep>('service')
  const [direction, setDirection] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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

  const goToStep = (newStep: BookingStep) => {
    const currentIdx = steps.indexOf(step)
    const newIdx = steps.indexOf(newStep)
    setDirection(newIdx > currentIdx ? 1 : -1)
    setStep(newStep)
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    goToStep('datetime')
    setError(null)
  }

  const handleDateChange = async (dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedTime('')
    const slots = generateTimeSlots('10:00', '18:30', 30)
    setAvailableTimeSlots(slots)
  }

  const handleContinueToInfo = () => {
    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time')
      return
    }
    goToStep('info')
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
    goToStep('confirm')
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
      setSuccess(`Appointment booked. Confirmation email sent to ${formData.email}`)

      setTimeout(() => {
        goToStep('service')
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

  const generateAvailableDates = () => {
    const dates: string[] = []
    for (let i = 0; i < 90; i++) {
      const date = addDays(new Date(), i)
      const dayOfWeek = date.getDay()
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

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center mb-12">
        {steps.map((s, idx) => (
          <div key={s} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center font-sans text-xs font-medium ${
                step === s
                  ? 'bg-white text-black'
                  : steps.indexOf(step) > idx
                    ? 'bg-neutral-700 text-neutral-300'
                    : 'bg-neutral-900 text-neutral-600'
              }`}
            >
              {idx + 1}
            </div>
            {idx < 3 && (
              <div
                className={`flex-1 h-px mx-2 ${
                  steps.indexOf(step) > idx ? 'bg-neutral-700' : 'bg-neutral-900'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {success && (
        <div className="mb-8 p-4 border border-neutral-700 text-neutral-300 text-sm font-sans">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 border border-red-900 text-red-400 text-sm font-sans">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {/* Step 1: Service */}
        {step === 'service' && (
          <motion.div
            key="service"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-8">Select a Service</h2>
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans mb-4">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {groupedServices[category].map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="w-full text-left py-4 px-4 border border-neutral-900 hover:border-neutral-700 hover:bg-neutral-950 group flex items-center justify-between"
                      >
                        <div>
                          <p className="font-sans text-sm text-white group-hover:text-neutral-200">
                            {service.name}
                          </p>
                          <p className="text-neutral-600 text-xs font-sans mt-0.5">
                            {service.duration} min
                          </p>
                        </div>
                        <p className="text-neutral-400 text-sm font-sans">
                          ${service.priceMin} &ndash; ${service.priceMax}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Date & Time */}
        {step === 'datetime' && selectedService && (
          <motion.div
            key="datetime"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-2">
              {selectedService.name}
            </h2>
            <p className="text-neutral-500 font-sans text-sm mb-8">
              Select your preferred date and time
            </p>

            <div className="space-y-8">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans mb-4">
                  Date
                </label>
                <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
                  {generateAvailableDates().map((date) => (
                    <button
                      key={date}
                      onClick={() => handleDateChange(date)}
                      className={`p-2 text-center font-sans text-xs ${
                        selectedDate === date
                          ? 'bg-white text-black'
                          : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-[10px] opacity-60 mb-0.5">
                        {format(new Date(date), 'EEE')}
                      </div>
                      <div className="font-medium">{format(new Date(date), 'd')}</div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans mb-4">
                    Time
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-center font-sans text-xs font-medium ${
                          selectedTime === time
                            ? 'bg-white text-black'
                            : 'bg-neutral-950 border border-neutral-900 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => goToStep('service')}
                className="flex items-center gap-2 px-5 py-3 border border-neutral-800 text-neutral-400 font-sans text-sm hover:text-white hover:border-neutral-600"
              >
                <ChevronLeft size={14} />
                Back
              </button>
              <button
                onClick={handleContinueToInfo}
                disabled={!selectedDate || !selectedTime}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
              >
                Continue
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Info */}
        {step === 'info' && selectedService && (
          <motion.div
            key="info"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-8">Your Information</h2>

            <form className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white font-sans text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-700"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white font-sans text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-700"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white font-sans text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-700"
                  placeholder="(210) 555-0000"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans mb-2">
                  Notes (optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInfoChange}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 text-white font-sans text-sm focus:outline-none focus:border-neutral-500 placeholder:text-neutral-700"
                  placeholder="Any special requests or preferences?"
                  rows={4}
                />
              </div>
            </form>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => goToStep('datetime')}
                className="flex items-center gap-2 px-5 py-3 border border-neutral-800 text-neutral-400 font-sans text-sm hover:text-white hover:border-neutral-600"
              >
                <ChevronLeft size={14} />
                Back
              </button>
              <button
                onClick={handleContinueToConfirm}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 ml-auto"
              >
                Review Booking
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 'confirm' && selectedService && (
          <motion.div
            key="confirm"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl font-serif font-bold text-white mb-8">Confirm Booking</h2>

            <div className="border border-neutral-800 divide-y divide-neutral-900">
              {[
                { label: 'Service', value: selectedService.name },
                { label: 'Date', value: format(new Date(selectedDate), 'MMMM d, yyyy') },
                { label: 'Time', value: formatTime(selectedTime) },
                { label: 'Duration', value: `${selectedService.duration} minutes` },
                { label: 'Price', value: `$${selectedService.priceMin} – $${selectedService.priceMax}` },
                { label: 'Name', value: formData.name },
                { label: 'Email', value: formData.email },
                { label: 'Phone', value: formData.phone },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center px-5 py-4">
                  <span className="text-neutral-500 font-sans text-sm">{row.label}</span>
                  <span className="text-white font-sans text-sm">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 border border-neutral-800 bg-neutral-950">
              <p className="text-neutral-500 text-xs font-sans">
                <span className="text-neutral-300">Cancellation Policy:</span> 24-hour notice required. 50% charge for cancellations within 24 hours.
              </p>
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => goToStep('info')}
                className="flex items-center gap-2 px-5 py-3 border border-neutral-800 text-neutral-400 font-sans text-sm hover:text-white hover:border-neutral-600"
              >
                <ChevronLeft size={14} />
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black font-sans text-sm font-medium hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
              >
                {isLoading ? 'Booking...' : 'Complete Booking'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
