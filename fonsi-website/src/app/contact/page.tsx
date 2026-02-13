'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, MapPin, Phone, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const faqs = [
  {
    question: 'Do you accept walk-ins?',
    answer:
      'No, Fonsi operates by appointment only. This ensures you receive personalized attention and avoid wait times. Please call (210) 551-7742 to schedule your appointment.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'I require 24-hour notice for cancellations. If you need to cancel within 24 hours of your appointment, a 50% service charge will apply to your account.',
  },
  {
    question: 'How are prices determined?',
    answer:
      'Prices vary based on hair length, density, complexity, and specific services. The prices listed on my site are estimates. Final pricing will be discussed during your consultation or when booking.',
  },
  {
    question: 'Do you offer bridal services?',
    answer:
      'Yes! I offer comprehensive bridal packages including bride hair and makeup, wedding party styling, and on-site services. Bridal services are available by consultation. Please contact me to discuss your wedding day needs.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'I accept all major credit cards and cash. Payment is typically due at the time of service. Please contact me for details about payment options.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-neutral-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-6 flex items-center justify-between gap-6"
      >
        <span className="font-sans text-base font-semibold text-neutral-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="text-neutral-600" size={16} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <p className="text-neutral-900 font-sans text-base leading-relaxed pb-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <>
      {/* Header */}
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative pb-4 md:pb-6 bg-neutral-900 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
            }}
          />
          <div className="relative px-8 md:px-12 pt-8 md:pt-10 pb-2">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
                Get in Touch
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white">
                Contact
              </h1>
          </div>
        </section>
      </div>

      {/* Contact Info + Map */}
      <section className="pt-8 md:pt-10 pb-12 md:pb-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Contact Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 mb-4">
                  <MapPin size={16} strokeWidth={1.5} className="text-white" />
                </div>
                <p className="text-neutral-900 font-sans text-sm font-semibold mb-1">Location</p>
                <p className="text-neutral-600 font-sans text-sm leading-relaxed">6626 West Loop 1604 N, Suite 105</p>
                <p className="text-neutral-500 font-sans text-xs mt-0.5">San Antonio, TX 78254 (Suites 39 &amp; 41)</p>
              </div>

              <a href="tel:2105517742" className="group rounded-xl border border-neutral-200 bg-neutral-50 p-5 hover:border-neutral-400 transition-colors">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 mb-4">
                  <Phone size={16} strokeWidth={1.5} className="text-white" />
                </div>
                <p className="text-neutral-900 font-sans text-sm font-semibold mb-1">Phone</p>
                <p className="text-neutral-600 font-sans text-sm group-hover:text-neutral-900 transition-colors">(210) 551-7742</p>
                <p className="text-neutral-500 font-sans text-xs mt-0.5">Call to book or modify appointments</p>
              </a>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 mb-4">
                  <Clock size={16} strokeWidth={1.5} className="text-white" />
                </div>
                <p className="text-neutral-900 font-sans text-sm font-semibold mb-1">Hours</p>
                <p className="text-neutral-600 font-sans text-sm">Tue &ndash; Sat: 10 AM &ndash; 6:30 PM</p>
                <p className="text-neutral-600 font-sans text-sm">Sun &amp; Mon: Closed</p>
                <p className="text-neutral-500 font-sans text-xs mt-0.5">By appointment only</p>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-900 mb-4">
                  <AlertCircle size={16} strokeWidth={1.5} className="text-white" />
                </div>
                <p className="text-neutral-900 font-sans text-sm font-semibold mb-1">Cancellation Policy</p>
                <p className="text-neutral-600 font-sans text-sm leading-relaxed">24-hour notice required. 50% charge within 24 hours.</p>
              </div>
            </div>

            {/* Map */}
            <div className="lg:w-1/2 flex-shrink-0">
              <div className="relative rounded-2xl overflow-hidden border border-neutral-200 h-full min-h-[300px]">
                {!mapLoaded && (
                  <div className="absolute inset-0 bg-neutral-100 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={24} className="text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-400 font-sans text-xs">Loading map...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src="https://maps.google.com/maps?q=6626+W+Loop+1604+N+Suite+105,+San+Antonio,+TX+78254&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fonsi by Cristal location"
                  onLoad={() => setMapLoaded(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-16 md:pb-20">
        <div className="container-custom max-w-2xl">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-12">
              Frequently Asked Questions
            </h2>
          </ScrollReveal>

          <div>
            {faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 md:pb-20">
        <div className="container-custom text-center max-w-xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
              Ready to book?
            </h2>
            <p className="text-neutral-600 font-sans text-sm mb-8">
              Schedule your appointment online or give us a call
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
                className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium"
              >
                (210) 551-7742
              </HoverBorderGradient>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
