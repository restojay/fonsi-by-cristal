'use client'

import { useState } from 'react'
import { Service } from '@/types'
import { bookingSchema } from '@/lib/validation'
import { generateTimeSlots, formatTime, formatPrice } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronRight, ChevronLeft, Clock, Check, Plus, X, User, Mail, Phone, MessageSquare, Scissors, CalendarDays } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from '@/components/ui/calendar'
import { BUSINESS } from '@/lib/constants'

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
  const [stackedServices, setStackedServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Hair')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const goToStep = (newStep: BookingStep) => {
    const currentIdx = steps.indexOf(step)
    const newIdx = steps.indexOf(newStep)
    setDirection(newIdx > currentIdx ? 1 : -1)
    setStep(newStep)
  }

  // Generate time slots client-side as fallback
  const generateFallbackSlots = (serviceDuration: number): string[] => {
    const clampedDuration = Math.min(serviceDuration, 180)
    const lastSlotMinutes = 18 * 60 - clampedDuration
    const endMinutes = lastSlotMinutes + 30
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`
    return generateTimeSlots('10:00', endTime, 30)
  }

  // Fetch real availability from API, fallback to client-side generation
  const fetchAvailability = async (date: string, serviceId: string, duration: number) => {
    setSlotsLoading(true)
    try {
      const res = await fetch(`/api/availability?date=${date}&serviceId=${serviceId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.slots && data.slots.length > 0) {
          setAvailableTimeSlots(data.slots)
          return
        }
      }
      // API returned no slots or failed — use fallback
      setAvailableTimeSlots(generateFallbackSlots(duration))
    } catch {
      setAvailableTimeSlots(generateFallbackSlots(duration))
    } finally {
      setSlotsLoading(false)
    }
  }

  const updateTimeSlots = (serviceDuration: number) => {
    setAvailableTimeSlots(generateFallbackSlots(serviceDuration))
  }

  const handleServiceSelect = (service: Service) => {
    if (selectedCategory === 'Hair') {
      // Toggle service in stack
      setStackedServices((prev) => {
        const exists = prev.find((s) => s.id === service.id)
        if (exists) return prev.filter((s) => s.id !== service.id)
        return [...prev, service]
      })
    } else {
      setSelectedService(service)
      setStackedServices([])
      updateTimeSlots(service.duration)
      goToStep('datetime')
      setError(null)
    }
  }

  const handleStackedContinue = () => {
    if (stackedServices.length === 0) return
    // Create a combined service for display
    const combined: Service = {
      id: stackedServices.map((s) => s.id).join('+'),
      name: stackedServices.map((s) => s.name).join(' + '),
      category: 'Hair',
      priceMin: stackedServices.reduce((sum, s) => sum + s.priceMin, 0),
      priceMax: stackedServices.reduce((sum, s) => sum + s.priceMax, 0),
      duration: stackedServices.reduce((sum, s) => sum + s.duration, 0),
    }
    setSelectedService(combined)
    updateTimeSlots(combined.duration)
    goToStep('datetime')
    setError(null)
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return
    setCalendarDate(date)
    const dateStr = format(date, 'yyyy-MM-dd')
    setSelectedDate(dateStr)
    setSelectedTime('')
    if (selectedService) {
      fetchAvailability(dateStr, selectedService.id, selectedService.duration)
    }
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
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
        firstName: formData.firstName,
        lastName: formData.lastName,
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
        setStackedServices([])
        setSelectedDate('')
        setCalendarDate(undefined)
        setSelectedTime('')
        setFormData({ firstName: '', lastName: '', email: '', phone: '', notes: '' })
        setSuccess(null)
        if (onSuccess) onSuccess(result.id)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Disable Sundays, Mondays, and past dates (including today if past closing at 6 PM)
  const now = new Date()
  const pastClosing = now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() >= 30)
  const disableBeforeDate = pastClosing
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    : now
  const disabledDays = [
    { dayOfWeek: [0, 1] },
    { before: disableBeforeDate },
  ]

  const groupedServices = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) acc[service.category] = []
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>
  )

  const categories = ['Hair', 'Bridal', 'Makeup', 'Waxing']

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center justify-center mb-16 sm:mb-20 max-w-lg mx-auto">
        {steps.map((s, idx) => {
          const currentIdx = steps.indexOf(step)
          const isCompleted = currentIdx > idx
          const isActive = step === s
          const stepLabels = ['Service', 'Date & Time', 'Details', 'Confirm']

          return (
            <div key={s} className="flex-1 flex items-center">
              <div className="relative flex flex-col items-center">
                <motion.div
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-semibold transition-colors duration-300 ${
                    isActive || isCompleted
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 border border-neutral-200 text-neutral-400'
                  }`}
                  animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={isActive ? { duration: 0.4, ease: 'easeOut' } : {}}
                >
                  {isActive && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border border-neutral-400"
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: [0.2, 0, 0, 1] }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border border-neutral-400"
                        initial={{ scale: 1, opacity: 0.35 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: [0.2, 0, 0, 1], delay: 0.5 }}
                      />
                    </>
                  )}
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {idx + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className={`text-xs uppercase tracking-[0.1em] font-sans font-medium transition-colors duration-300 hidden sm:block whitespace-nowrap absolute top-full mt-2 left-1/2 -translate-x-1/2 ${
                  isActive ? 'text-neutral-900' : isCompleted ? 'text-neutral-600' : 'text-neutral-400'
                }`}>
                  {stepLabels[idx]}
                </span>
              </div>
              {idx < 3 && (
                <div className="flex-1 h-px mx-3 relative self-start mt-[18px]">
                  <div className="absolute inset-0 bg-neutral-200 rounded-full" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-neutral-900 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {success && (
        <div className="mb-8 p-4 border border-neutral-300 text-neutral-700 text-sm font-sans">
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
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6 text-center">Select a Service</h2>

            {/* Category Tabs */}
            <div className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-200 py-1 px-1 rounded-full mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative cursor-pointer text-sm font-sans font-semibold px-5 py-1.5 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'text-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="booking-tab"
                      className="absolute inset-0 w-full bg-white rounded-full -z-10 shadow-sm"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>

            {selectedCategory === 'Hair' && (
              <p className="text-neutral-500 font-sans text-xs mb-4 -mt-2">
                Select one or more services to combine them into a single appointment
              </p>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left — Cards */}
              <div className="lg:w-[60%] min-w-0">
                {/* Service Cards Grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {(groupedServices[selectedCategory] || []).map((service) => {
                      const isStacked = selectedCategory === 'Hair' && stackedServices.some((s) => s.id === service.id)
                      return (
                        <button
                          key={service.id}
                          onClick={() => handleServiceSelect(service)}
                          className={`group text-left h-full border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer ${
                            isStacked
                              ? 'bg-neutral-900 border-neutral-900 text-white'
                              : 'bg-neutral-100 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h3 className={`text-sm font-serif font-bold transition-colors ${
                              isStacked ? 'text-white' : 'text-neutral-900 group-hover:text-neutral-700'
                            }`}>
                              {service.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`flex-shrink-0 text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full ${
                                isStacked
                                  ? 'text-white bg-neutral-700 border border-neutral-600'
                                  : 'text-neutral-900 bg-white border border-neutral-200'
                              }`}>
                                {formatPrice(service.priceMin, service.priceMax)}
                              </span>
                              {selectedCategory === 'Hair' && (
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isStacked ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-400'
                                }`}>
                                  {isStacked ? <Check size={11} strokeWidth={3} /> : <Plus size={11} strokeWidth={2} />}
                                </div>
                              )}
                            </div>
                          </div>
                          {service.description && (
                            <p className={`font-sans text-xs leading-relaxed mb-3 ${
                              isStacked ? 'text-neutral-300' : 'text-neutral-600'
                            }`}>
                              {service.description}
                            </p>
                          )}
                          <span className={`inline-flex items-center gap-1.5 font-sans text-xs ${
                            isStacked ? 'text-neutral-400' : 'text-neutral-500'
                          }`}>
                            <Clock size={11} strokeWidth={2} />
                            {service.duration} min
                          </span>
                        </button>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* Right — Sidebar */}
              <div className="lg:w-[40%] min-w-0 space-y-4">
                {/* Contact */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
                  <h4 className="text-xs font-sans font-medium uppercase tracking-[0.1em] text-neutral-900 mb-4">Contact</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock size={14} className="text-neutral-400 flex-shrink-0" />
                      <span className="font-sans text-sm text-neutral-900">{BUSINESS.hours.openShort}, {BUSINESS.hours.time}</span>
                    </div>
                    <a href={`tel:${BUSINESS.phoneTel}`} className="flex items-center gap-3 text-neutral-900 hover:text-neutral-600 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 flex-shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span className="font-sans text-sm">{BUSINESS.phone}</span>
                    </a>
                    <div className="flex items-center gap-3">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span className="font-sans text-sm text-neutral-500">San Antonio, TX</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary — sticky */}
                <div className="lg:sticky lg:top-20">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-sans font-medium text-neutral-900 uppercase tracking-[0.1em]">
                        Order Summary{stackedServices.length > 0 && ` (${stackedServices.length})`}
                      </h4>
                      {stackedServices.length > 0 && (
                        <button
                          onClick={() => setStackedServices([])}
                          className="inline-flex items-center gap-1 text-red-400 hover:text-red-600 text-xs font-sans cursor-pointer transition-colors"
                        >
                          <X size={10} strokeWidth={3} />
                          Clear
                        </button>
                      )}
                    </div>

                    {stackedServices.length === 0 ? (
                      <p className="text-neutral-400 font-sans text-xs leading-relaxed mb-4">
                        Select services to see your order summary
                      </p>
                    ) : (
                      <>
                        <div className="flex flex-col gap-2 mb-4">
                          {stackedServices.map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between gap-2 bg-neutral-100 border border-neutral-200 rounded-lg px-3 py-2"
                            >
                              <span className="text-neutral-900 text-xs font-sans font-medium truncate">
                                {s.name}
                              </span>
                              <button
                                onClick={() => setStackedServices((prev) => prev.filter((p) => p.id !== s.id))}
                                className="text-red-400 hover:text-red-600 flex-shrink-0 cursor-pointer transition-colors"
                              >
                                <X size={10} strokeWidth={3} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-[0.1em] font-sans text-neutral-500 mb-1">Estimate</p>
                            <p className="text-sm font-sans font-bold text-neutral-900">
                              {formatPrice(
                                stackedServices.reduce((sum, s) => sum + s.priceMin, 0),
                                stackedServices.reduce((sum, s) => sum + s.priceMax, 0)
                              )}
                            </p>
                          </div>
                          <div className="bg-neutral-100 border border-neutral-200 rounded-xl p-3">
                            <p className="text-[10px] uppercase tracking-[0.1em] font-sans text-neutral-500 mb-1">Duration</p>
                            <p className="text-sm font-sans font-bold text-neutral-900 inline-flex items-center gap-1.5">
                              <Clock size={13} strokeWidth={2} />
                              {stackedServices.reduce((sum, s) => sum + s.duration, 0)} min
                            </p>
                          </div>
                        </div>
                        {stackedServices.reduce((sum, s) => sum + s.duration, 0) > 180 && (
                          <p className="text-amber-600 font-sans text-xs leading-relaxed mb-3">
                            This combination exceeds 3 hours — a second appointment may be needed to complete all services.
                          </p>
                        )}
                        <button
                          onClick={handleStackedContinue}
                          className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-neutral-900 text-white font-sans text-sm font-medium rounded-full hover:bg-neutral-800 cursor-pointer"
                        >
                          Continue
                          <ChevronRight size={14} />
                        </button>
                      </>
                    )}

                    {/* TOS */}
                    <div className="border-t border-neutral-200 pt-3 mt-1">
                      <p className="text-neutral-400 font-sans text-[10px] leading-relaxed">
                        Prices are estimates — final pricing based on hair length, density, and complexity. Consultations may be required for color correction, keratin, and on-site services. A non-refundable deposit may be required for select services, to be determined at the time of initial consultation. 24-hour cancellation notice required; 50% charge within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
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
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2 text-center">
              {selectedService.name}
            </h2>
            <p className="text-neutral-500 font-sans text-sm mb-8 text-center">
              Select your preferred date and time
            </p>

            <div className="space-y-8">
              <div>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={handleDateChange}
                    disabled={disabledDays}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                  />
                </div>
              </div>

              {selectedDate && (() => {
                const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd')
                const now = new Date()
                const currentMinutes = now.getHours() * 60 + now.getMinutes()

                if (slotsLoading) {
                  return (
                    <div>
                      <label className="block text-sm uppercase tracking-[0.15em] text-neutral-600 font-sans mb-4 text-center">
                        Time
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-w-lg mx-auto">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="h-11 rounded-xl bg-neutral-100 animate-pulse" />
                        ))}
                      </div>
                    </div>
                  )
                }

                return (
                  <div>
                    <label className="block text-sm uppercase tracking-[0.15em] text-neutral-600 font-sans mb-4 text-center">
                      Time
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-w-lg mx-auto">
                      {availableTimeSlots.map((time) => {
                        const [h, m] = time.split(':').map(Number)
                        const slotMinutes = h * 60 + m
                        const isPast = isToday && slotMinutes <= currentMinutes

                        return (
                          <button
                            key={time}
                            onClick={() => !isPast && setSelectedTime(time)}
                            disabled={isPast}
                            className={`p-3 text-center font-sans text-sm font-medium rounded-xl transition-all duration-150 ${
                              isPast
                                ? 'bg-neutral-50 border border-neutral-100 text-neutral-300 cursor-not-allowed line-through'
                                : selectedTime === time
                                  ? 'bg-neutral-900 text-white cursor-pointer'
                                  : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 cursor-pointer'
                            }`}
                          >
                            {formatTime(time)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </div>

            <div className="flex gap-4 mt-10">
              <HoverBorderGradient
                as="button"
                onClick={() => goToStep('service')}
                containerClassName="rounded-full"
                className="bg-white text-neutral-600 px-5 py-3 font-sans text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft size={14} />
                Back
              </HoverBorderGradient>
              <div className="ml-auto">
                <HoverBorderGradient
                  as="button"
                  onClick={handleContinueToInfo}
                  disabled={!selectedDate || !selectedTime}
                  containerClassName="rounded-full"
                  className="bg-black text-white px-6 py-3 font-sans text-sm font-medium inline-flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight size={14} />
                </HoverBorderGradient>
              </div>
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
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2 text-center">Your Information</h2>
            <p className="text-neutral-500 font-sans text-sm mb-8 text-center">
              We&apos;ll use this to confirm your appointment
            </p>

            <div className="max-w-lg mx-auto">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 md:p-8">
                <form className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans mb-2.5">
                        <User size={12} strokeWidth={2} />
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-sans text-sm focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition-colors"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans mb-2.5">
                        <User size={12} strokeWidth={2} />
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-sans text-sm focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition-colors"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans mb-2.5">
                        <Phone size={12} strokeWidth={2} />
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-sans text-sm focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition-colors"
                        placeholder="(210) 555-0000"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans mb-2.5">
                        <Mail size={12} strokeWidth={2} />
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInfoChange}
                        className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-sans text-sm focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans mb-2.5">
                      <MessageSquare size={12} strokeWidth={2} />
                      Notes <span className="normal-case tracking-normal text-neutral-400">(optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInfoChange}
                      className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-900 font-sans text-sm focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition-colors resize-none"
                      placeholder="Any special requests or preferences?"
                      rows={3}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <HoverBorderGradient
                as="button"
                onClick={() => goToStep('datetime')}
                containerClassName="rounded-full"
                className="bg-white text-neutral-600 px-5 py-3 font-sans text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft size={14} />
                Back
              </HoverBorderGradient>
              <div className="ml-auto">
                <HoverBorderGradient
                  as="button"
                  onClick={handleContinueToConfirm}
                  containerClassName="rounded-full"
                  className="bg-black text-white px-6 py-3 font-sans text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
                >
                  Review Booking
                  <ChevronRight size={14} />
                </HoverBorderGradient>
              </div>
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
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-2 text-center">Confirm Booking</h2>
            <p className="text-neutral-500 font-sans text-sm mb-8 text-center">
              Review your details before completing
            </p>

            <div className="max-w-lg mx-auto space-y-4">
              {/* Appointment Details Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                <h4 className="text-xs font-sans font-medium uppercase tracking-[0.1em] text-neutral-400 mb-5">Appointment</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 flex-shrink-0">
                      <Scissors size={14} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-400 font-sans mb-0.5">{stackedServices.length > 1 ? 'Services' : 'Service'}</p>
                      <p className="text-sm font-semibold text-neutral-900 font-sans">{selectedService.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 flex-shrink-0">
                      <CalendarDays size={14} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-neutral-400 font-sans mb-0.5">Date & Time</p>
                      <p className="text-sm font-semibold text-neutral-900 font-sans">
                        {format(new Date(selectedDate), 'MMMM d, yyyy')} at {formatTime(selectedTime)}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-white border border-neutral-200 rounded-xl p-3">
                      <p className="text-[10px] uppercase tracking-[0.1em] font-sans text-neutral-400 mb-1">Duration</p>
                      <p className="text-sm font-sans font-bold text-neutral-900 inline-flex items-center gap-1.5">
                        <Clock size={13} strokeWidth={2} />
                        {selectedService.duration} min
                      </p>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-xl p-3">
                      <p className="text-[10px] uppercase tracking-[0.1em] font-sans text-neutral-400 mb-1">Estimate</p>
                      <p className="text-sm font-sans font-bold text-neutral-900 inline-flex items-center gap-1.5">
                        {formatPrice(selectedService.priceMin, selectedService.priceMax)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Details Card */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6">
                <h4 className="text-xs font-sans font-medium uppercase tracking-[0.1em] text-neutral-400 mb-5">Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 flex-shrink-0">
                      <User size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-sans mb-0.5">Name</p>
                      <p className="text-sm font-semibold text-neutral-900 font-sans">{formData.firstName} {formData.lastName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 flex-shrink-0">
                      <Mail size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-sans mb-0.5">Email</p>
                      <p className="text-sm font-semibold text-neutral-900 font-sans">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 flex-shrink-0">
                      <Phone size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-sans mb-0.5">Phone</p>
                      <p className="text-sm font-semibold text-neutral-900 font-sans">{formData.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl px-6 py-4">
                <p className="text-neutral-400 text-xs font-sans leading-relaxed">
                  <span className="text-neutral-600 font-medium">Cancellation Policy:</span> 24-hour notice required. 50% charge for cancellations within 24 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <HoverBorderGradient
                as="button"
                onClick={() => goToStep('info')}
                containerClassName="rounded-full"
                className="bg-white text-neutral-600 px-5 py-3 font-sans text-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <ChevronLeft size={14} />
                Back
              </HoverBorderGradient>
              <div className="ml-auto">
                <HoverBorderGradient
                  as="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm font-medium inline-flex items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Booking...' : 'Complete Booking'}
                </HoverBorderGradient>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
