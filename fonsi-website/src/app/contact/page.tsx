'use client'

import { useState } from 'react'
import { MapPin, Phone, Clock, AlertCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollReveal from '@/components/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/ScrollReveal'

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
    <div className="bg-dark-700 border border-gold-500/30 rounded-lg overflow-hidden card-hover">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-center justify-between gap-4"
      >
        <span className="font-serif font-bold text-gold-500 text-lg">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="text-gold-500" size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="text-gray-300 font-sans">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <ScrollReveal>
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
              Contact Us
            </h1>
            <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
              Reach out to Fonsi by Cristal. By appointment only.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Contact Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <ScrollReveal>
                <h2 className="text-4xl font-serif font-bold text-gold-500 mb-8">
                  Get in Touch
                </h2>
              </ScrollReveal>

              <StaggerContainer className="space-y-8">
                {/* Address */}
                <StaggerItem>
                  <div className="flex gap-4">
                    <MapPin className="text-gold-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">Address</h3>
                      <p className="text-gray-300 font-sans">
                        6626 West Loop 1604 North<br />
                        Suite 105<br />
                        San Antonio, Texas 78254
                      </p>
                      <p className="text-gray-400 font-sans text-sm mt-2">(Suites 39 & 41)</p>
                    </div>
                  </div>
                </StaggerItem>

                {/* Phone */}
                <StaggerItem>
                  <div className="flex gap-4">
                    <Phone className="text-gold-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">Phone</h3>
                      <a
                        href="tel:2105517742"
                        className="text-gray-300 font-sans text-lg hover:text-gold-500"
                      >
                        (210) 551-7742
                      </a>
                      <p className="text-gray-400 font-sans text-sm mt-2">
                        Call to book or modify appointments
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                {/* Hours */}
                <StaggerItem>
                  <div className="flex gap-4">
                    <Clock className="text-gold-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">Hours</h3>
                      <div className="text-gray-300 font-sans space-y-1">
                        <p><strong>Tuesday - Saturday:</strong> 10:00 AM - 6:30 PM</p>
                        <p><strong>Sunday & Monday:</strong> Closed</p>
                      </div>
                      <p className="text-gray-400 font-sans text-sm mt-2">
                        By appointment only. Walk-ins not accepted.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                {/* Policy */}
                <StaggerItem>
                  <div className="flex gap-4">
                    <AlertCircle className="text-gold-500 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-serif font-bold text-gold-500 mb-2">
                        Cancellation Policy
                      </h3>
                      <p className="text-gray-300 font-sans">
                        24-hour notice required for cancellations. A 50% service charge applies for
                        cancellations within 24 hours of your appointment.
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Map Placeholder */}
            <ScrollReveal direction="right">
              <div className="relative h-96 lg:h-full min-h-[24rem] rounded-lg overflow-hidden border border-gold-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-700" />
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="text-gold-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-400 font-sans">Map placeholder</p>
                    <p className="text-gray-500 font-sans text-sm mt-2">
                      6626 West Loop 1604 North<br />
                      San Antonio, TX 78254
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* FAQ Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-4xl font-serif font-bold text-gold-500 mb-12 text-center">
              Frequently Asked Questions
            </h2>
          </ScrollReveal>

          <StaggerContainer className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <StaggerItem key={faq.question}>
                <FaqItem question={faq.question} answer={faq.answer} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* CTA Section */}
      <ScrollReveal>
        <section className="section-padding">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-serif font-bold text-gold-500 mb-4">
              Ready to Book?
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-8 max-w-2xl mx-auto">
              Schedule your appointment online or give us a call
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/booking"
                className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 btn-premium"
              >
                Book Online
              </a>
              <a
                href="tel:2105517742"
                className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-500/10"
              >
                Call (210) 551-7742
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
