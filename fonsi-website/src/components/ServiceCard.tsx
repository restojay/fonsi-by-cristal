'use client'

import { Service } from '@/types'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-dark-800 border border-gold-500 border-opacity-30 rounded-lg p-6 hover:border-gold-500 hover:border-opacity-60 transition group">
      <h3 className="text-lg font-serif font-semibold text-gold-500 mb-2 group-hover:text-gold-400 transition">
        {service.name}
      </h3>

      {service.description && (
        <p className="text-gray-400 text-sm mb-4 font-sans">{service.description}</p>
      )}

      <div className="flex justify-between items-end">
        <div>
          <p className="text-gold-500 font-sans font-semibold">
            {formatPrice(service.priceMin, service.priceMax)}
          </p>
          <p className="text-gray-500 text-xs font-sans mt-1">
            {service.duration} minutes
          </p>
        </div>
        <Link
          href={`/booking?service=${service.id}`}
          className="bg-gold-500 text-dark-900 px-4 py-2 rounded text-sm font-sans font-semibold hover:bg-gold-400 transition"
        >
          Book
        </Link>
      </div>
    </div>
  )
}
