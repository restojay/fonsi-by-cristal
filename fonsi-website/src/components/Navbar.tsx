'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, Scissors, Image, User, Phone, CalendarDays } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

      {/* Fixed tubelight nav — appears when top nav scrolls out */}
      <AnimatePresence>
        {!tubelightVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 w-full z-50"
          >
            <NavBar items={navItems} variant="dark" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
