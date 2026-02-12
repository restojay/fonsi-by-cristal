'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface Sparkle {
  id: number
  x: number
  size: number
  opacity: number
  duration: number
  delay: number
  drift: number
}

export default function SparklesFalling() {
  const sparkles = useMemo<Sparkle[]>(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 2 + Math.random() * 3,
        opacity: 0.15 + Math.random() * 0.45,
        duration: 5 + Math.random() * 7,
        delay: Math.random() * 8,
        drift: (Math.random() - 0.5) * 40,
      })),
    []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${sparkle.x}%`,
            width: sparkle.size,
            height: sparkle.size,
            boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
          }}
          animate={{
            y: ['-20px', '110vh'],
            x: [0, sparkle.drift, 0],
            opacity: [0, sparkle.opacity, sparkle.opacity, 0],
          }}
          transition={{
            y: {
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'linear',
            },
            x: {
              duration: sparkle.duration * 0.5,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: 'easeInOut',
              repeatType: 'mirror',
            },
            opacity: {
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              times: [0, 0.1, 0.9, 1],
              ease: 'linear',
            },
          }}
        />
      ))}
    </div>
  )
}
