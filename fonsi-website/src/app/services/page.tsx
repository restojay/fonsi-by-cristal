'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { servicesData } from '@/lib/services-data'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const services = servicesData.map((s, i) => ({ id: `service-${i + 1}`, ...s }))

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Hair')

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
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-black">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-sans mb-6">
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
      <section className="py-8">
        <div className="container-custom">
          <div className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-200 py-1 px-1 rounded-full">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative cursor-pointer text-sm font-sans font-semibold px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {selectedCategory === category && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                      <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
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
          {displayedServices.length > 0 ? (
            <div className="max-w-3xl">
              {displayedServices.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  className="group border-b border-neutral-200 py-6 md:py-8"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                      <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-1 group-hover:text-neutral-700">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-neutral-500 font-sans text-sm">
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-neutral-900 font-sans text-sm font-medium">
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
                <h3 className="text-sm font-sans font-medium text-neutral-900 uppercase tracking-[0.1em] mb-3">
                  Consultations
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                  For services like color correction, keratin treatments, and on-site services,
                  a consultation may be required. We&apos;ll contact you to discuss your needs.
                </p>
              </div>

              <div className="h-px bg-neutral-200" />

              <div>
                <h3 className="text-sm font-sans font-medium text-neutral-900 uppercase tracking-[0.1em] mb-3">
                  Custom Pricing
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                  Prices shown are estimates and may vary based on hair length, density, and
                  complexity. Final pricing will be discussed at your consultation.
                </p>
              </div>

              <div className="h-px bg-neutral-200" />

              <div>
                <h3 className="text-sm font-sans font-medium text-neutral-900 uppercase tracking-[0.1em] mb-3">
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
              <Link href="/booking">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium"
                >
                  Book Appointment
                </HoverBorderGradient>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
