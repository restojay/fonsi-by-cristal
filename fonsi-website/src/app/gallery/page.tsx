'use client'

import { Instagram } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'

export default function GalleryPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
              Our Work
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Gallery
            </h1>
            <p className="text-neutral-400 font-sans max-w-lg leading-relaxed">
              See the transformations our clients have experienced. Follow us on Instagram
              for our latest work.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <div className="columns-2 md:columns-3 gap-3 md:gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="mb-3 md:mb-4 break-inside-avoid"
                >
                  <div
                    className={`bg-neutral-900 w-full flex items-center justify-center ${
                      i % 3 === 0
                        ? 'aspect-[3/4]'
                        : i % 3 === 1
                          ? 'aspect-square'
                          : 'aspect-[4/5]'
                    }`}
                  >
                    <p className="text-neutral-700 font-sans text-xs">Photo {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="divider" />

      {/* Instagram CTA */}
      <section className="section-padding">
        <div className="container-custom text-center max-w-xl">
          <ScrollReveal>
            <Instagram size={24} className="text-neutral-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Follow along
            </h2>
            <p className="text-neutral-500 font-sans text-sm mb-8 leading-relaxed">
              See our latest transformations and behind-the-scenes on Instagram
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.instagram.com/fonsi_by_cristal/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-200 inline-flex items-center justify-center gap-2"
              >
                <Instagram size={16} />
                @fonsi_by_cristal
              </a>
              <a
                href="/booking"
                className="border border-neutral-700 text-neutral-300 px-8 py-4 font-sans text-sm uppercase tracking-[0.15em] font-medium hover:border-white hover:text-white"
              >
                Book Now
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
