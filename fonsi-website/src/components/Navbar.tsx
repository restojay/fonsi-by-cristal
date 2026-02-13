'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Home, Scissors, Image, User, Phone, CalendarDays } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavBar } from '@/components/ui/tubelight-navbar'
import { FluidDockMenu } from '@/components/ui/fluid-dock-menu'

const navItems = [
  { name: 'Home', url: '/', icon: Home },
  { name: 'Services', url: '/services', icon: Scissors },
  { name: 'Gallery', url: '/gallery', icon: Image },
  { name: 'About', url: '/about', icon: User },
  { name: 'Contact', url: '/contact', icon: Phone },
  { name: 'Book', url: '/booking', icon: CalendarDays },
]

export default function Navbar() {
  const tubelightRef = useRef<HTMLDivElement>(null)
  const [tubelightVisible, setTubelightVisible] = useState(true)

  useEffect(() => {
    const el = tubelightRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setTubelightVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Tubelight nav — overlays page top, scrolls with content */}
      <div ref={tubelightRef} className="absolute top-0 left-0 w-full z-40">
        <NavBar items={navItems} variant="dark" />
      </div>

      {/* Fixed logo — appears when tubelight nav scrolls out */}
      <AnimatePresence>
        {!tubelightVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed top-5 left-6 z-50"
          >
            <Link href="/" className="group">
              <span className="text-xl font-heading font-normal text-neutral-900 tracking-wide">
                FONSI
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-sans">
                by Cristal
              </span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock menu — appears when tubelight nav scrolls out */}
      <FluidDockMenu items={navItems} visible={!tubelightVisible} />
    </>
  )
}
