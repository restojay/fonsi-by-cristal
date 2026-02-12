'use client'

import Link from 'next/link'
import { Home, Scissors, Image, User, Phone, CalendarDays } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Services', url: '/services', icon: Scissors },
  { name: 'Gallery', url: '/gallery', icon: Image },
  { name: 'About', url: '/about', icon: User },
  { name: 'Contact', url: '/contact', icon: Phone },
  { name: 'Book', url: '/booking', icon: CalendarDays },
]

export default function Navbar() {
  return (
    <>
      {/* Logo — fixed top-left */}
      <div className="fixed top-5 left-6 z-50">
        <Link href="/" className="group">
          <span className="text-xl font-heading font-normal text-white tracking-wide">
            FONSI
          </span>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-sans">
            by Cristal
          </span>
        </Link>
      </div>

      {/* Tubelight Nav */}
      <NavBar items={navItems} />
    </>
  )
}
