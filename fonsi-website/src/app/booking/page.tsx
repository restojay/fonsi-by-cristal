'use client'

import BookingWidget from '@/components/BookingWidget'
import { servicesData } from '@/lib/services-data'

const services = servicesData.map((s, i) => ({ id: `service-${i + 1}`, ...s }))

export default function BookingPage() {

  return (
    <>
      {/* Header */}
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative pb-8 md:pb-10 bg-neutral-900 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
            }}
          />
          <div className="relative px-8 md:px-12 pt-8 md:pt-10 pb-2">
              <p className="text-xs uppercase tracking-[0.3em] text-white font-sans mb-6">
                Schedule
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                Book
              </h1>
              <p className="text-neutral-400 font-sans max-w-lg leading-relaxed">
                Available Tuesday through Saturday, 10 AM &ndash; 6:30 PM. All services by appointment only.
              </p>
          </div>
        </section>
      </div>

      
      {/* Booking Widget */}
      <section className="pt-8 md:pt-10 pb-16 md:pb-20">
        <div className="container-custom max-w-4xl">
          <BookingWidget services={services} />
        </div>
      </section>

    </>
  )
}
