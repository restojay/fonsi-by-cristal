"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Social {
  name: string
  url: string
  icon: React.ReactNode
}

interface SocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  socials: Social[]
  animationDirection?: 'up' | 'down'
}

export function SocialLinks({ socials, className, animationDirection = 'down', ...props }: SocialLinksProps) {
  const [hoveredSocial, setHoveredSocial] = React.useState<string | null>(null)
  const [rotation, setRotation] = React.useState<number>(0)
  const [clicked, setClicked] = React.useState<boolean>(false)

  const animation = {
    scale: clicked ? [1, 1.3, 1] : 1,
    transition: { duration: 0.3 },
  }

  React.useEffect(() => {
    const handleClick = () => {
      setClicked(true)
      setTimeout(() => {
        setClicked(false)
      }, 200)
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [clicked])

  return (
    <div
      className={cn("flex items-center justify-center gap-0", className)}
      {...props}
    >
      {socials.map((social, index) => (
        <a
          className={cn(
            "relative cursor-pointer px-5 py-2 transition-opacity duration-200",
            hoveredSocial && hoveredSocial !== social.name
              ? "opacity-50"
              : "opacity-100"
          )}
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => {
            setHoveredSocial(social.name)
            setRotation(Math.random() * 20 - 10)
          }}
          onMouseLeave={() => setHoveredSocial(null)}
        >
          <span className="block text-lg font-medium">{social.name}</span>
          <AnimatePresence>
            {hoveredSocial === social.name && (
              <motion.div
                className="absolute top-0 left-0 right-0 flex h-full w-full items-center justify-center pointer-events-none"
                animate={animation}
              >
                <motion.div
                  key={social.name}
                  className="size-12"
                  initial={{
                    y: animationDirection === 'up' ? -40 : 40,
                    rotate: rotation,
                    opacity: 0,
                    filter: "blur(2px)",
                  }}
                  animate={{ y: animationDirection === 'up' ? -50 : 50, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: animationDirection === 'up' ? -40 : 40, opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 0.2 }}
                >
                  {social.icon}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </a>
      ))}
    </div>
  )
}
