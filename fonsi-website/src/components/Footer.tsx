'use client'

import Link from 'next/link'
import { SocialLinks } from '@/components/ui/social-links'
import { InstagramGradient } from '@/components/ui/instagram-gradient'
import { BUSINESS } from '@/lib/constants'

const socials = [
  {
    name: BUSINESS.social.instagramHandle,
    url: BUSINESS.social.instagram,
    icon: <InstagramGradient size={40} />,
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="container-custom pb-6 md:pb-10">
      <footer className="relative bg-neutral-900 rounded-2xl overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
          }}
        />

        <div className="relative px-8 md:px-12 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {/* Brand */}
            <div>
              <h3 className="text-lg font-display font-bold text-white tracking-wide mb-1">
                FONSI
              </h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white font-sans mb-3">
                by Cristal
              </p>
              <SocialLinks socials={socials} className="justify-start text-neutral-400 text-sm [&_span]:text-sm [&_a]:px-0 [&_a]:py-0" />
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-white font-sans font-bold mb-3">
                Navigate
              </h4>
              <ul className="space-y-1.5">
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
              <h4 className="text-xs uppercase tracking-[0.15em] text-white font-sans font-bold mb-3">
                Contact
              </h4>
              <div className="space-y-1.5 text-sm font-sans text-white">
                <a href={`tel:${BUSINESS.phoneTel}`} className="block text-neutral-400 hover:text-white">
                  {BUSINESS.phone}
                </a>
                <p>
                  {BUSINESS.address.street}<br />
                  {BUSINESS.address.suite}, {BUSINESS.address.city}, {BUSINESS.address.state} {BUSINESS.address.zip}
                </p>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-xs uppercase tracking-[0.15em] text-white font-sans font-bold mb-3">
                Hours
              </h4>
              <div className="space-y-1 text-sm font-sans text-white">
                <p>{BUSINESS.hours.openShort}: {BUSINESS.hours.time}</p>
                <p>{BUSINESS.hours.closedShort}: Closed</p>
                <p className="text-xs text-white font-bold mt-2">{BUSINESS.hours.note}</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white text-xs font-sans">
              &copy; {currentYear} {BUSINESS.name}
            </p>
            <p className="text-neutral-400 text-xs font-sans">
              {BUSINESS.cancellation}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
