'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
// LucideIcon kept in interface for compatibility
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface FluidDockMenuProps {
  items: NavItem[]
  visible: boolean
}

export function FluidDockMenu({ items, visible }: FluidDockMenuProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Close on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [isOpen])

  // Close menu when dock hides
  useEffect(() => {
    if (!visible) setIsOpen(false)
  }, [visible])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2"
        >
          {/* Expanded nav items */}
          <AnimatePresence>
            {isOpen && (
              <div className="flex flex-col items-end gap-1.5 mb-2">
                {items.map((item, i) => {
                  const isActive = pathname === item.url
                  const index = items.length - 1 - i

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20, scale: 0.6 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.04,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          'block px-5 py-2.5 rounded-full border font-sans text-sm font-medium transition-colors duration-200 shadow-lg whitespace-nowrap',
                          isActive
                            ? 'bg-white text-neutral-900 border-neutral-300'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:text-white hover:border-neutral-500'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          <button
            onClick={toggle}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-900 border border-neutral-700 shadow-xl hover:border-neutral-500 transition-colors duration-200 cursor-pointer"
          >
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-0.5 w-5 bg-white rounded-full origin-center"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.15 }}
                className="block h-0.5 w-5 bg-white rounded-full"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25 }}
                className="block h-0.5 w-5 bg-white rounded-full origin-center"
              />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
