'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import BookingWidget from '@/components/BookingWidget'
import { Loader } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

export default function BookingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        if (response.ok) {
          const data = await response.json()
          setServices(data)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <>
      {/* Header */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
              Schedule
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Book
            </h1>
            <p className="text-neutral-400 font-sans max-w-lg leading-relaxed">
              Available Tuesday through Saturday, 10 AM &ndash; 6:30 PM. All services by appointment only.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* Booking Widget */}
      <section className="section-padding">
        <div className="container-custom max-w-2xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader className="animate-spin text-neutral-500" size={24} />
            </div>
          ) : (
            <BookingWidget services={services} />
          )}
        </div>
      </section>

      <div className="divider" />

      {/* Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <ScrollReveal delay={0}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans font-medium mb-4">
                  Hours
                </h3>
                <p className="text-neutral-300 font-sans text-sm">Tuesday &ndash; Saturday</p>
                <p className="text-white font-sans text-sm">10:00 AM &ndash; 6:30 PM</p>
                <p className="text-neutral-600 font-sans text-xs mt-2">Sunday & Monday: Closed</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans font-medium mb-4">
                  Location
                </h3>
                <p className="text-neutral-300 font-sans text-sm">
                  6626 West Loop 1604 North<br />
                  Suite 105<br />
                  San Antonio, TX 78254
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans font-medium mb-4">
                  Phone
                </h3>
                <a
                  href="tel:2105517742"
                  className="text-neutral-300 font-sans text-sm hover:text-white"
                >
                  (210) 551-7742
                </a>
                <p className="text-neutral-600 font-sans text-xs mt-2">
                  Call to confirm or modify appointments
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
