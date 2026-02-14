'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { servicesData } from '@/lib/services-data'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { Clock } from 'lucide-react'
import type { Service } from '@/types'

const services = servicesData

export default function ServicesPage() {
  return (
    <Suspense>
      <ServicesContent />
    </Suspense>
  )
}

function ServicesContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const categories = ['Hair', 'Bridal', 'Makeup', 'Waxing']
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryParam && categories.includes(categoryParam) ? categoryParam : 'Hair'
  )


  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

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
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative pb-4 md:pb-6 bg-neutral-900 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
            }}
          />
          <div className="relative px-8 md:px-12 pt-8 md:pt-10 pb-2">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
                What I Offer
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                Services
              </h1>
              <p className="text-neutral-400 font-sans max-w-lg leading-relaxed">
                Prices vary based on hair type, length, density, and complexity.
                All services by appointment only.
              </p>
          </div>
        </section>
      </div>

      {/* Category Tabs */}
      <section className="pt-6 pb-4 sticky top-0 bg-white/80 backdrop-blur-lg z-30">
        <div className="container-custom">
          <div className="relative inline-flex items-center gap-1 border border-neutral-200 py-1 px-1 rounded-full bg-neutral-50 overflow-visible">
            {categories.map((category, idx) => (
              <button
                key={category}

                onClick={() => setSelectedCategory(category)}
                className={`relative overflow-visible cursor-pointer text-sm font-sans font-semibold px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'text-neutral-900'
                    : 'text-neutral-400 hover:text-neutral-900'
                }`}
              >
                {selectedCategory === category && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 w-full rounded-full border border-neutral-300 bg-white shadow-md"
                    style={{ zIndex: 0 }}
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-neutral-900">
                      <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2 bg-neutral-900/15" />
                      <div className="absolute w-8 h-6 rounded-full blur-md -top-1 bg-neutral-900/15" />
                      <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2 bg-neutral-900/15" />
                    </div>
                  </motion.div>
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid + Sidebar */}
      <section className="pt-4 pb-12 md:pb-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cards */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {displayedServices.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                    >
                      <div className="relative h-full bg-neutral-100 border border-neutral-200 rounded-2xl p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <h3 className="text-base font-serif font-bold text-neutral-900">
                              {service.name}
                            </h3>
                            <span className="flex-shrink-0 text-sm font-sans font-semibold text-neutral-900 bg-white border border-neutral-200 px-3 py-1 rounded-full">
                              {formatPrice(service.priceMin, service.priceMax)}
                            </span>
                          </div>

                          {service.description && (
                            <p className="text-neutral-600 font-sans text-sm leading-relaxed mb-3">
                              {service.description}
                            </p>
                          )}

                          <span className="inline-flex items-center gap-1.5 text-neutral-500 font-sans text-xs">
                            <Clock size={12} strokeWidth={2} />
                            {service.duration} min
                          </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="lg:w-64 lg:sticky lg:top-20 lg:self-start flex-shrink-0">
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 space-y-4">
                {[
                  { title: 'Consultations', text: 'May be required for color correction, keratin, and on-site services.' },
                  { title: 'Pricing', text: 'Estimates shown — final pricing based on hair length, density, and complexity.' },
                  { title: 'Cancellations', text: '24-hour notice required. 50% charge within 24 hours.' },
                ].map((info, i) => (
                  <div key={info.title}>
                    {i > 0 && <div className="h-px bg-neutral-200 mb-4" />}
                    <h4 className="text-xs font-sans font-medium text-neutral-900 uppercase tracking-[0.1em] mb-1.5">
                      {info.title}
                    </h4>
                    <p className="text-neutral-500 font-sans text-xs leading-relaxed">
                      {info.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <Link href="/booking" className="block">
                  <HoverBorderGradient
                    as="div"
                    containerClassName="rounded-full w-full btn-pop"
                    className="bg-black text-white px-6 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium text-center w-full"
                  >
                    Book Appointment
                  </HoverBorderGradient>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
