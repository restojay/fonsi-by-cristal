'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
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
      'We require 24-hour notice for cancellations. If you need to cancel within 24 hours of your appointment, a 50% service charge will apply to your account.',
  },
  {
    question: 'How are prices determined?',
    answer:
      'Prices vary based on hair length, density, complexity, and specific services. The prices listed on our site are estimates. Final pricing will be discussed during your consultation or when booking.',
  },
  {
    question: 'Do you offer bridal services?',
    answer:
      'Yes! We offer comprehensive bridal packages including bride hair and makeup, wedding party styling, and on-site services. Bridal services are available by consultation. Please contact us to discuss your wedding day needs.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards and cash. Payment is typically due at the time of service. Please contact us for details about payment options.',
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
        <span className="font-sans text-sm text-neutral-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="text-neutral-500" size={16} />
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
            <p className="text-neutral-500 font-sans text-sm leading-relaxed pb-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 bg-black">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-sans mb-6">
              Get in Touch
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white">
              Contact
            </h1>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* Contact Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            <ScrollReveal delay={0}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans font-medium mb-4">
                  Address
                </h3>
                <p className="text-neutral-700 font-sans text-sm leading-relaxed">
                  6626 West Loop 1604 North<br />
                  Suite 105<br />
                  San Antonio, Texas 78254
                </p>
                <p className="text-neutral-400 font-sans text-xs mt-2">(Suites 39 & 41)</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans font-medium mb-4">
                  Phone
                </h3>
                <a
                  href="tel:2105517742"
                  className="text-neutral-700 font-sans text-sm hover:text-neutral-900"
                >
                  (210) 551-7742
                </a>
                <p className="text-neutral-400 font-sans text-xs mt-2">
                  Call to book or modify appointments
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans font-medium mb-4">
                  Hours
                </h3>
                <div className="text-neutral-700 font-sans text-sm space-y-1">
                  <p>Tuesday &ndash; Saturday</p>
                  <p className="text-neutral-900">10:00 AM &ndash; 6:30 PM</p>
                  <p className="mt-3 text-neutral-400">Sunday & Monday: Closed</p>
                </div>
                <p className="text-neutral-400 font-sans text-xs mt-2">
                  By appointment only
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div>
                <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-500 font-sans font-medium mb-4">
                  Cancellation Policy
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                  24-hour notice required. 50% charge applies for cancellations within 24 hours.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Map placeholder */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="aspect-[16/7] bg-neutral-50 border border-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-neutral-500 font-sans text-sm">Map</p>
                <p className="text-neutral-400 font-sans text-xs mt-1">
                  6626 West Loop 1604 North, San Antonio, TX 78254
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* FAQ */}
      <section className="section-padding">
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

      <div className="divider" />

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom text-center max-w-xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mb-4">
              Ready to book?
            </h2>
            <p className="text-neutral-500 font-sans text-sm mb-8">
              Schedule your appointment online or give us a call
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/booking">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
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
