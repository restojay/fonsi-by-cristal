'use client'

import { Award, Heart, Sparkles } from 'lucide-react'
import AnimatedText from '@/components/AnimatedText'
import ScrollReveal from '@/components/ScrollReveal'
import { StaggerContainer, StaggerItem } from '@/components/ScrollReveal'

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
            <AnimatedText text="About Cristal" />
          </h1>
          <ScrollReveal delay={0.3}>
            <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
              The passion and expertise behind Fonsi
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Image Placeholder */}
            <ScrollReveal direction="left">
              <div className="relative h-96 bg-gradient-to-br from-gold-500/20 to-gold-500/5 rounded-lg overflow-hidden border border-gold-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="text-gold-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-400 font-sans">Photo of Cristal</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Content */}
            <ScrollReveal direction="right">
              <div>
                <h2 className="text-4xl font-serif font-bold text-gold-500 mb-6">
                  Cristal&apos;s Story
                </h2>
                <div className="space-y-4 text-gray-300 font-sans text-lg mb-8">
                  <p>
                    With over a decade of experience in the beauty industry, Cristal has built
                    Fonsi into one of San Antonio&apos;s premier luxury beauty destinations. Her passion
                    for hair artistry and makeup begins with understanding each client&apos;s unique vision
                    and bringing it to life.
                  </p>
                  <p>
                    What started as a dream to create a space where clients feel pampered, confident,
                    and beautiful has become a thriving studio beloved by the San Antonio community.
                    Cristal&apos;s commitment to excellence and continuous learning ensures that every
                    client receives the highest quality service.
                  </p>
                  <p>
                    From bridal transformations to everyday glam, color corrections to special occasion
                    styling, Cristal&apos;s expertise spans the full spectrum of beauty services.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Values Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-4xl font-serif font-bold text-gold-500 mb-12 text-center">
              Our Values
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StaggerItem>
              <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500/60 card-hover">
                <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                  <Heart className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">Client Care</h3>
                <p className="text-gray-300 font-sans">
                  Every client is treated like family. We listen to your needs and work with you
                  to create the perfect look that makes you feel confident and beautiful.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500/60 card-hover">
                <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                  <Award className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">Excellence</h3>
                <p className="text-gray-300 font-sans">
                  We&apos;re committed to using only premium products and the latest techniques.
                  Your satisfaction is our priority.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500/60 card-hover">
                <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                  <Sparkles className="text-gold-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">Artistry</h3>
                <p className="text-gray-300 font-sans">
                  Beauty is an art form. We bring creativity, skill, and passion to every
                  service, creating transformations that inspire.
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* Specializations */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-4xl font-serif font-bold text-gold-500 mb-12 text-center">
              Specializations
            </h2>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StaggerItem>
              <div className="bg-dark-800 border border-gold-500/30 rounded-lg p-6 card-hover">
                <h3 className="text-xl font-serif font-bold text-gold-500 mb-3">Hair Services</h3>
                <p className="text-gray-300 font-sans mb-4">
                  Expert cuts, color, styling, and treatments including keratin and Olaplex.
                </p>
                <ul className="text-gray-400 font-sans text-sm space-y-2">
                  <li>&bull; Color correction and transformation</li>
                  <li>&bull; Bridal and special occasion styling</li>
                  <li>&bull; Advanced coloring techniques</li>
                  <li>&bull; Hair health treatments</li>
                </ul>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="bg-dark-800 border border-gold-500/30 rounded-lg p-6 card-hover">
                <h3 className="text-xl font-serif font-bold text-gold-500 mb-3">Makeup & Beauty</h3>
                <p className="text-gray-300 font-sans mb-4">
                  Professional makeup application and beauty services for any occasion.
                </p>
                <ul className="text-gray-400 font-sans text-sm space-y-2">
                  <li>&bull; Bridal makeup and styling</li>
                  <li>&bull; Professional makeup application</li>
                  <li>&bull; MAC cosmetics expertise</li>
                  <li>&bull; On-site services available</li>
                </ul>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* CTA Section */}
      <ScrollReveal>
        <section className="section-padding bg-dark-800">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-serif font-bold text-gold-500 mb-4">
              Experience the Difference
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-8 max-w-2xl mx-auto">
              Schedule your appointment with Cristal today and discover why clients keep coming back
            </p>
            <a
              href="/booking"
              className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 inline-block btn-premium"
            >
              Book Your Appointment
            </a>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
