'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import BookingWidget from '@/components/BookingWidget'
import { Loader } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/ScrollReveal'

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
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <ScrollReveal>
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
              Book Your Appointment
            </h1>
            <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
              Easy online booking for all our services. Available Tuesday through Saturday.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Booking Widget */}
      <section className="section-padding">
        <ScrollReveal>
          <div className="container-custom max-w-3xl">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="animate-spin text-gold-500" size={40} />
              </div>
            ) : (
              <BookingWidget services={services} />
            )}
          </div>
        </ScrollReveal>
      </section>

      <div className="gradient-divider" />

      {/* Info Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">
                  Hours
                </h3>
                <p className="text-gray-300 font-sans mb-2">
                  <strong>Tuesday - Saturday</strong>
                </p>
                <p className="text-gold-500 font-sans">10:00 AM - 6:30 PM</p>
                <p className="text-gray-400 font-sans text-sm mt-3">
                  Sunday & Monday: Closed
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">
                  Location
                </h3>
                <p className="text-gray-300 font-sans text-sm">
                  6626 West Loop 1604 North<br />
                  Suite 105<br />
                  San Antonio, TX 78254
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">
                  Phone
                </h3>
                <a
                  href="tel:2105517742"
                  className="text-gray-300 font-sans hover:text-gold-500 text-lg font-semibold"
                >
                  (210) 551-7742
                </a>
                <p className="text-gray-400 font-sans text-sm mt-3">
                  Call to confirm or modify appointments
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>
    </>
  )
}
