'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-dark-900 border-b border-gold-500 border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <div className="text-2xl font-display font-bold text-gold-500 group-hover:text-gold-400 transition">
              Fonsi
            </div>
            <p className="text-xs text-gray-400 font-sans">by Cristal</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-gold-500 font-sans text-sm font-medium transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/booking"
              className="bg-gold-500 text-dark-900 px-6 py-2 rounded-md font-sans font-semibold text-sm hover:bg-gold-400 transition"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gold-500 hover:text-gold-400 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gold-500 border-opacity-20">
            <div className="flex flex-col gap-2 pt-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-gray-300 hover:text-gold-500 px-4 py-2 font-sans text-sm font-medium transition"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={closeMenu}
                className="bg-gold-500 text-dark-900 px-4 py-2 rounded-md font-sans font-semibold text-sm hover:bg-gold-400 transition mx-4 text-center"
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
