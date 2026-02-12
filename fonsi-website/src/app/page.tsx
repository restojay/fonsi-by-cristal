'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Sparkles, Award, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedText from '@/components/AnimatedText'
import ScrollReveal from '@/components/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/ScrollReveal'

const SparklesFalling = dynamic(() => import('@/components/SparklesFalling'), { ssr: false })

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-overlay relative h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <SparklesFalling />
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 inline-block"
          >
            <div className="text-gold-500/70 text-sm uppercase tracking-widest font-sans font-semibold">
              Welcome to Luxury
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            <AnimatedText text="Fonsi" delay={0.4} />
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif text-gold-500 mb-8">
            <AnimatedText text="by Cristal" delay={0.7} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans"
          >
            Experience luxury hair and makeup services in San Antonio. Book your appointment today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/booking"
              className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-400 flex items-center justify-center gap-2 group btn-premium"
            >
              Book Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/services"
              className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-500/10"
            >
              View Services
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Features Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="text-center">
                <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                  <Sparkles className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-2">
                  Professional Stylists
                </h3>
                <p className="text-gray-400 font-sans">
                  Our experienced team provides expert hair and makeup services.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                  <Clock className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-2">
                  Flexible Scheduling
                </h3>
                <p className="text-gray-400 font-sans">
                  Book your appointment at a time that works best for you.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="text-center">
                <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                  <Award className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-2">
                  Premium Quality
                </h3>
                <p className="text-gray-400 font-sans">
                  We use only the finest products and techniques.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* About Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative h-96 bg-gradient-to-br from-gold-500/20 to-gold-500/5 rounded-lg overflow-hidden border border-gold-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="text-gold-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-400 font-sans">Image placeholder</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-500 mb-6">
                  About Cristal
                </h2>
                <p className="text-gray-300 font-sans text-lg mb-4">
                  Cristal brings years of expertise in hair styling and makeup artistry to
                  San Antonio. With a passion for beauty and perfection, she has built Fonsi
                  into a premier destination for those seeking luxury beauty services.
                </p>
                <p className="text-gray-400 font-sans mb-6">
                  Every client is treated with care and attention to detail, ensuring you
                  leave feeling confident and beautiful.
                </p>
                <Link
                  href="/about"
                  className="text-gold-500 font-sans font-semibold hover:text-gold-400 flex items-center gap-2 group"
                >
                  Learn More
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Services Preview */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-500 mb-4">
                Our Services
              </h2>
              <p className="text-gray-400 font-sans text-lg max-w-2xl mx-auto">
                From hair cuts and color to bridal packages and makeup services
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {['Hair Services', 'Bridal Packages', 'Makeup Artistry', 'Waxing'].map((service) => (
              <StaggerItem key={service}>
                <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-6 hover:border-gold-500/60 group cursor-pointer card-hover">
                  <h3 className="text-xl font-serif font-bold text-gold-500 group-hover:text-gold-400 transition-colors">
                    {service}
                  </h3>
                  <p className="text-gray-400 text-sm font-sans mt-2">
                    Professional services tailored to your needs
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <ScrollReveal>
            <div className="text-center">
              <Link
                href="/services"
                className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 inline-flex items-center gap-2 group btn-premium"
              >
                View All Services
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* CTA Section */}
      <ScrollReveal>
        <section className="section-padding bg-gradient-to-r from-gold-900/20 to-dark-900">
          <div className="container-custom text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-500 mb-6">
              Ready to Book?
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-8 max-w-2xl mx-auto">
              Schedule your appointment with Cristal today. Walk-ins not accepted. By appointment only.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/booking"
                className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-400 btn-premium"
              >
                Book Your Appointment
              </Link>
              <a
                href="tel:2105517742"
                className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-500/10"
              >
                (210) 551-7742
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
