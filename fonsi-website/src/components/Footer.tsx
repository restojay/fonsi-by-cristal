'use client'

import Link from 'next/link'
import { MapPin, Phone, Instagram } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-900 border-t border-gold-500/0">
      <div className="gradient-divider" />
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-display font-bold text-gold-500 mb-2">Fonsi</h3>
              <p className="text-gray-400 font-sans text-sm mb-4">by Cristal</p>
              <p className="text-gray-500 text-sm mb-4">
                Luxury hair salon and makeup studio in San Antonio, TX.
              </p>
              <a
                href="https://www.instagram.com/fonsi_by_cristal/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-500 text-sm"
              >
                <Instagram size={18} />
                @fonsi_by_cristal
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-sans font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-gold-500 text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-gold-500 text-sm">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="text-gray-400 hover:text-gold-500 text-sm">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-gold-500 text-sm">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-sans font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Phone className="text-gold-500 flex-shrink-0 mt-1" size={16} />
                  <a href="tel:2105517742" className="text-gray-400 hover:text-gold-500 text-sm">
                    (210) 551-7742
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="text-gold-500 flex-shrink-0 mt-1" size={16} />
                  <span className="text-gray-400 text-sm">
                    6626 West Loop 1604 North<br />
                    Suite 105, San Antonio, TX 78254
                  </span>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-white font-sans font-semibold mb-4">Hours</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>Tuesday - Saturday</li>
                <li className="text-gold-500">10:00 AM - 6:30 PM</li>
                <li className="mt-2">Sunday & Monday</li>
                <li>Closed</li>
                <li className="mt-3 text-xs text-gray-500">
                  By appointment only
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="gradient-divider mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Fonsi by Cristal. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              24-hour cancellation policy applies &bull; 50% charge within 24 hours
            </p>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}
