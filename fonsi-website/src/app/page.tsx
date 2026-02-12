'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        <div className="container-custom text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.4em] text-neutral-500 font-sans mb-8"
          >
            Hair Salon & Makeup Studio &mdash; San Antonio, TX
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-white leading-[0.9] tracking-tight mb-4"
          >
            Fonsi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-3xl font-serif italic text-neutral-400 mb-12"
          >
            by Cristal
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-neutral-400 font-sans text-base md:text-lg max-w-md mx-auto mb-14 leading-relaxed"
          >
            Let me help you shine. Professional hair and makeup services, by appointment only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/booking"
              className="bg-white text-black px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-200 inline-flex items-center justify-center gap-3"
            >
              Book Appointment
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="border border-neutral-700 text-neutral-300 px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:border-white hover:text-white"
            >
              View Services
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="divider" />

      {/* About Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <div className="aspect-[4/5] bg-neutral-900 flex items-center justify-center">
                <p className="text-neutral-700 font-sans text-sm">Photo of Cristal</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
                  About the Artist
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight">
                  Over a decade of<br />beauty expertise
                </h2>
                <p className="text-neutral-400 font-sans leading-relaxed mb-6">
                  You know you&apos;ve gotten a really superb service when strangers stop you and ask
                  you who your stylist is. With certifications from MAC Pro, Wella, OLAPLEX, and
                  MOROCCANOIL, Cristal brings world-class expertise to every appointment.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-white font-sans text-sm uppercase tracking-[0.15em] font-medium group"
                >
                  Learn more
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Services Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
                What We Offer
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
                Services
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-900">
            {[
              {
                title: 'Hair Services',
                desc: 'Cuts, color, styling, keratin treatments, and more. Tailored to your hair type and vision.',
              },
              {
                title: 'Bridal Packages',
                desc: 'Complete bridal hair and makeup, including consultation and practice run. On-site services available.',
              },
              {
                title: 'Makeup Artistry',
                desc: 'Full face and eye makeup with MAC cosmetics. Perfect for special occasions or everyday glam.',
              },
              {
                title: 'Treatments & Waxing',
                desc: 'Olaplex treatments, perms, hair health services, and professional eyebrow waxing.',
              },
            ].map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div className="bg-black p-10 md:p-14 group">
                  <span className="text-neutral-700 font-sans text-xs mb-6 block">
                    0{i + 1}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white mb-4">
                    {service.title}
                  </h3>
                  <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-white font-sans text-sm uppercase tracking-[0.15em] font-medium group"
              >
                View all services & pricing
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center max-w-2xl">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              Ready to book?
            </h2>
            <p className="text-neutral-400 font-sans mb-10 leading-relaxed">
              By appointment only. Tuesday through Saturday, 10 AM &ndash; 6:30 PM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="bg-white text-black px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-200"
              >
                Book Online
              </Link>
              <a
                href="tel:2105517742"
                className="border border-neutral-700 text-neutral-300 px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:border-white hover:text-white inline-flex items-center justify-center gap-2"
              >
                <Phone size={14} />
                (210) 551-7742
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
