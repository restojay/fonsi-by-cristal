'use client'

import Link from 'next/link'
import { ArrowRight, Phone, Scissors, Heart, Sparkles, Droplets } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { SilkBackground } from '@/components/ui/silk-background-animation'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-900 rounded-2xl">
          <SilkBackground />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none rounded-2xl" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center relative z-10 px-8 py-16 md:py-20"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white font-sans mb-8">
              Hair Salon & Makeup Studio &mdash; San Antonio, TX
            </p>

            <h1 className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] font-heading font-normal text-white leading-[0.9] tracking-wide mb-4">
              FONSI
            </h1>

            <p className="text-2xl md:text-3xl font-heading font-normal text-neutral-400 mb-12 uppercase tracking-widest">
              By Cristal
            </p>

            <p className="text-white font-sans text-base md:text-lg max-w-md mx-auto mb-14 leading-relaxed">
              Let me help you shine. Professional hair and makeup services, by appointment only.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/booking">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full btn-pop"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-3"
                >
                  Book Appointment
                  <ArrowRight size={16} />
                </HoverBorderGradient>
              </Link>
              <Link href="/services">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium"
                >
                  View Services
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
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
            <div className="text-center lg:text-left">
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
            <div className="text-center">
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
                By appointment only. Tuesday through Saturday, 10 AM &ndash; 6:30 PM.
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
                  href="tel:2105517742"
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  (210) 551-7742
                </HoverBorderGradient>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
