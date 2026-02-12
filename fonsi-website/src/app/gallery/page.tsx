'use client'

import { Instagram } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import InstagramEmbed from '@/components/InstagramEmbed'

const instagramPosts = [
  'https://www.instagram.com/p/fonsi_by_cristal/',
  // Add real post URLs here as they become available
]

export default function GalleryPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <ScrollReveal>
          <div className="container-custom text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
              Gallery
            </h1>
            <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
              See the beautiful transformations our clients have experienced
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Instagram Gallery Section */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 text-gold-500 mb-4">
                <Instagram size={24} />
                <span className="font-sans font-semibold text-lg">@fonsi_by_cristal</span>
              </div>
              <p className="text-gray-400 font-sans max-w-xl mx-auto">
                Follow us on Instagram to see our latest work and transformations
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <InstagramEmbed postUrls={instagramPosts} />
          </ScrollReveal>
        </div>
      </section>

      <div className="gradient-divider" />

      {/* CTA Section */}
      <ScrollReveal>
        <section className="section-padding bg-dark-800">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-serif font-bold text-gold-500 mb-4">
              Follow Us on Instagram
            </h2>
            <p className="text-gray-300 font-sans text-lg mb-8 max-w-2xl mx-auto">
              Stay up to date with our latest work and book your appointment today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.instagram.com/fonsi_by_cristal/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 inline-flex items-center justify-center gap-2 btn-premium"
              >
                <Instagram size={20} />
                Follow on Instagram
              </a>
              <a
                href="/booking"
                className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-500/10"
              >
                Book Now
              </a>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </>
  )
}
