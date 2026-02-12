'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('Hair')
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

  const categories = ['Hair', 'Bridal', 'Makeup', 'Waxing']
  const groupedServices = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) acc[service.category] = []
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>
  )

  const displayedServices = groupedServices[selectedCategory] || []

  return (
    <>
      {/* Header */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
              What We Offer
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Services
            </h1>
            <p className="text-neutral-400 font-sans max-w-lg leading-relaxed">
              Prices vary based on hair type, length, density, and complexity.
              All services by appointment only.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* Category Tabs */}
      <section className="py-8 border-b border-neutral-900">
        <div className="container-custom">
          <div className="flex gap-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative px-6 py-3 font-sans text-sm tracking-wide ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {selectedCategory === category && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 bg-neutral-900"
                    style={{ borderRadius: 0 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader className="animate-spin text-neutral-500" size={24} />
            </div>
          ) : displayedServices.length > 0 ? (
            <div className="max-w-3xl">
              {displayedServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group border-b border-neutral-900 py-6 md:py-8"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <h3 className="text-lg font-serif font-semibold text-white mb-1 group-hover:text-neutral-200">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-neutral-500 font-sans text-sm">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-sans text-sm font-medium">
                        {formatPrice(service.priceMin, service.priceMax)}
                      </p>
                      <p className="text-neutral-600 font-sans text-xs mt-1">
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-16">
              <p className="text-neutral-500 font-sans">
                No services available in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="divider" />

      {/* Info */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <ScrollReveal>
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-sans font-medium text-white uppercase tracking-[0.1em] mb-3">
                  Consultations
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                  For services like color correction, keratin treatments, and on-site services,
                  a consultation may be required. We&apos;ll contact you to discuss your needs.
                </p>
              </div>

              <div className="h-px bg-neutral-900" />

              <div>
                <h3 className="text-sm font-sans font-medium text-white uppercase tracking-[0.1em] mb-3">
                  Custom Pricing
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                  Prices shown are estimates and may vary based on hair length, density, and
                  complexity. Final pricing will be discussed at your consultation.
                </p>
              </div>

              <div className="h-px bg-neutral-900" />

              <div>
                <h3 className="text-sm font-sans font-medium text-white uppercase tracking-[0.1em] mb-3">
                  Cancellation Policy
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                  By appointment only. Walk-ins are not accepted.
                  24-hour notice required for cancellations. A 50% charge applies for
                  cancellations within 24 hours.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="mt-16">
              <Link
                href="/booking"
                className="bg-white text-black px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-200 inline-block"
              >
                Book Appointment
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
