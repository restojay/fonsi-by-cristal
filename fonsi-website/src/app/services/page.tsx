'use client'

import { useState, useEffect } from 'react'
import { Service } from '@/types'
import ServiceCard from '@/components/ServiceCard'
import { Loader } from 'lucide-react'

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
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
            Our Services
          </h1>
          <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
            Comprehensive beauty services from professional stylists and makeup artists
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-sans font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-gold-500 text-dark-900'
                    : 'bg-dark-800 text-gray-300 border border-gold-500/30 hover:border-gold-500/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="animate-spin text-gold-500" size={40} />
            </div>
          ) : displayedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 font-sans text-lg">
                No services available in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Info */}
      <section className="section-padding bg-dark-800 border-t border-gold-500/20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-gold-500 mb-6 text-center">
              Service Information
            </h2>

            <div className="space-y-6">
              <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-6">
                <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">
                  Consultations
                </h3>
                <p className="text-gray-300 font-sans">
                  For services like color correction, keratin treatments, and on-site services,
                  a consultation may be required. We'll contact you to discuss your needs.
                </p>
              </div>

              <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-6">
                <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">
                  Custom Pricing
                </h3>
                <p className="text-gray-300 font-sans">
                  Prices shown are estimates and may vary based on hair length, density, and
                  complexity of the service. Final pricing will be discussed at your consultation.
                </p>
              </div>

              <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-6">
                <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">
                  Appointment Policy
                </h3>
                <p className="text-gray-300 font-sans mb-3">
                  By appointment only. Walk-ins are not accepted.
                </p>
                <p className="text-gray-300 font-sans">
                  <strong className="text-gold-500">Cancellation Policy:</strong> 24-hour notice
                  required. 50% charge applies for cancellations within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
