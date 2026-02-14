'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  variant?: 'light' | 'dark'
  className?: string
}

export function NavBar({ items, variant = 'light', className }: NavBarProps) {
  const pathname = usePathname()
  const activeTab = items.find((item) => item.url === pathname)?.name ?? items[0].name
  const isLight = variant === 'light'

  return (
    <nav
      className={cn(
        'w-full py-4 flex items-center justify-center',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-1 sm:gap-3 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg border',
          isLight
            ? 'bg-white/5 border-white/10'
            : 'bg-neutral-950 border-neutral-800'
        )}
      >
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              className={cn(
                'relative cursor-pointer text-xs sm:text-sm font-semibold px-3 sm:px-6 py-2 rounded-full transition-colors',
                isLight
                  ? 'text-white/70 hover:text-white'
                  : 'text-neutral-500 hover:text-white',
                isActive && (isLight ? 'text-white' : 'text-white'),
              )}
            >
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className={cn(
                    'absolute inset-0 w-full rounded-full -z-10 border',
                    isLight
                      ? 'border-white/20 bg-white/10'
                      : 'border-neutral-700 bg-neutral-800'
                  )}
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-white">
                    <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2 bg-white/20" />
                    <div className="absolute w-8 h-6 rounded-full blur-md -top-1 bg-white/20" />
                    <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2 bg-white/20" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
