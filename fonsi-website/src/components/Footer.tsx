'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-neutral-900">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-display font-bold text-white tracking-wide mb-1">
              FONSI
            </h3>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white font-sans mb-6">
              by Cristal
            </p>
            <p className="text-white text-sm font-sans leading-relaxed mb-6">
              Hair salon & makeup studio<br />
              San Antonio, TX
            </p>
            <a
              href="https://www.instagram.com/fonsi_by_cristal/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm font-sans"
            >
              <Instagram size={16} />
              @fonsi_by_cristal
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans font-medium mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/booking', label: 'Book' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-white text-sm font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans font-medium mb-6">
              Contact
            </h4>
            <div className="space-y-3 text-sm font-sans text-white">
              <a href="tel:2105517742" className="block text-neutral-400 hover:text-white">
                (210) 551-7742
              </a>
              <p>
                6626 West Loop 1604 North<br />
                Suite 105, San Antonio, TX 78254
              </p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-neutral-400 font-sans font-medium mb-6">
              Hours
            </h4>
            <div className="space-y-2 text-sm font-sans text-white">
              <p>Tuesday &ndash; Saturday</p>
              <p className="text-white">10:00 AM &ndash; 6:30 PM</p>
              <p className="mt-3">Sunday & Monday</p>
              <p>Closed</p>
              <p className="mt-4 text-xs text-white">By appointment only</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white text-xs font-sans">
            &copy; {currentYear} Fonsi by Cristal
          </p>
          <p className="text-neutral-400 text-xs font-sans">
            24-hour cancellation policy &middot; 50% charge within 24 hours
          </p>
        </div>
      </div>
    </footer>
  )
}
