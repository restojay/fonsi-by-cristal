'use client'

import Link from 'next/link'
import { ArrowRight, Phone, Scissors, Heart, Sparkles, Droplets } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { BUSINESS } from '@/lib/constants'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-black rounded-2xl">
          {/* Background photo — cinematic Ken Burns zoom */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.3 }}
            className="absolute inset-0 z-0"
          >
            <img
              src="/images/hero-bg.webp"
              alt=""
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Dark overlays — ensure text readability */}
          <div className="absolute inset-0 z-[1] bg-black/50 pointer-events-none" />
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.5)_60%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-transparent to-black/50 pointer-events-none" />

          {/* Content — staggered entrance */}
          <div className="text-center relative z-10 px-8 py-16 md:py-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-xs uppercase tracking-[0.4em] text-white/80 font-sans mb-8"
            >
              Hair Salon & Makeup Studio &mdash; San Antonio, TX
            </motion.p>

            <motion.img
              src="/images/fonsi-logo-white.svg"
              alt="FONSI by Cristal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="h-16 sm:h-20 md:h-28 lg:h-36 w-auto mx-auto mb-12"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="text-white/90 font-sans text-base md:text-lg max-w-md mx-auto mb-14 leading-relaxed"
            >
              Let me help you shine. Professional hair and makeup services, by appointment only.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link href="/booking">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full btn-pop"
                  className="bg-black/60 backdrop-blur-sm text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-3 border-white/10"
                >
                  Book Appointment
                  <ArrowRight size={16} />
                </HoverBorderGradient>
              </Link>
              <Link href="/services">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
                  className="bg-black/60 backdrop-blur-sm text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium border-white/10"
                >
                  View Services
                </HoverBorderGradient>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Artist & Services */}
      <section className="py-24 md:py-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-stretch">
            {/* Left — Artist */}
            <ScrollReveal direction="left">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left justify-between h-full">
                <div>
                  <div className="w-64 h-64 md:w-72 md:h-72 bg-neutral-200 overflow-hidden rounded-full mb-6 mx-auto">
                    <img
                      src="/images/headshot2.jpg"
                      alt="Cristal - Hair Stylist & Makeup Artist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-3">
                    About the Artist
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4 leading-tight">
                    Over a decade of<br />beauty expertise
                  </h2>
                  <p className="text-neutral-600 font-sans leading-relaxed max-w-md">
                    With certifications from MAC Pro, Wella, OLAPLEX, and MOROCCANOIL, Cristal brings
                    world-class expertise to every appointment.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Services */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Hair Services',
                    desc: 'Cuts, color, styling, keratin treatments, and more. Tailored to your hair type and vision.',
                    icon: Scissors,
                    category: 'Hair',
                  },
                  {
                    title: 'Bridal Packages',
                    desc: 'Complete bridal hair and makeup, including consultation and practice run.',
                    icon: Heart,
                    category: 'Bridal',
                  },
                  {
                    title: 'Makeup Artistry',
                    desc: 'Full face and eye makeup with MAC cosmetics. Perfect for special occasions or everyday glam.',
                    icon: Sparkles,
                    category: 'Makeup',
                  },
                  {
                    title: 'Treatments & Waxing',
                    desc: 'Olaplex treatments, perms, hair health services, and professional eyebrow waxing.',
                    icon: Droplets,
                    category: 'Waxing',
                  },
                ].map((service, i) => (
                  <ScrollReveal key={service.title} delay={i * 0.1}>
                    <Link href={`/services?category=${service.category}`} className="block h-full group">
                      <div className="relative bg-neutral-50 border border-neutral-200 rounded-xl p-6 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:border-neutral-400 group-hover:shadow-lg">
                        <service.icon
                          size={28}
                          className="text-neutral-500 mb-5 group-hover:text-neutral-900 transition-colors duration-300"
                          strokeWidth={1.5}
                        />
                        <h3 className="text-lg font-serif font-bold text-neutral-900 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-neutral-600 font-sans text-sm leading-relaxed mb-4">
                          {service.desc}
                        </p>
                        <ArrowRight
                          size={14}
                          className="text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all duration-300"
                        />
                      </div>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 pt-10">
            <div className="flex justify-center lg:justify-start">
              <Link href="/about">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-3"
                >
                  Learn more
                  <ArrowRight size={14} />
                </HoverBorderGradient>
              </Link>
            </div>
            <div className="flex justify-center">
              <Link href="/services">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-3"
                >
                  View all services & pricing
                  <ArrowRight size={14} />
                </HoverBorderGradient>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — inline at bottom of page */}
      <section className="pb-24 md:pb-32">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-6">
                Ready to book?
              </h2>
              <p className="text-neutral-600 font-sans mb-10 leading-relaxed">
                {BUSINESS.hours.note}. {BUSINESS.hours.open}, {BUSINESS.hours.time}.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/booking">
                  <HoverBorderGradient
                    as="div"
                    containerClassName="rounded-full btn-pop"
                    className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium"
                  >
                    Book Online
                  </HoverBorderGradient>
                </Link>
                <HoverBorderGradient
                  as="a"
                  href={`tel:${BUSINESS.phoneTel}`}
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  {BUSINESS.phone}
                </HoverBorderGradient>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
