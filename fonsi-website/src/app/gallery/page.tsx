'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { SocialLinks } from '@/components/ui/social-links'
import { InstagramGradient } from '@/components/ui/instagram-gradient'

const socials = [
  {
    name: '@fonsi_by_cristal',
    url: 'https://www.instagram.com/fonsi_by_cristal/',
    icon: <InstagramGradient size={48} />,
  },
]

export default function GalleryPage() {
  return (
    <>
      {/* Header */}
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative pb-6 md:pb-8 bg-neutral-900 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
            }}
          />
          <div className="relative px-8 md:px-12 pt-8 md:pt-10 pb-2">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
                  My Work
                </p>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                  Gallery
                </h1>
                <p className="text-neutral-400 font-sans max-w-lg leading-relaxed">
                  See the transformations my clients have experienced. Follow me on Instagram
                  for my latest work.
                </p>
              </div>

              <ScrollReveal direction="right">
                <div className="flex flex-col items-start md:items-end gap-4 md:pb-1">
                  <SocialLinks socials={socials} className="text-white" animationDirection="up" />
                  <Link href="/booking">
                    <HoverBorderGradient
                      as="div"
                      containerClassName="rounded-full btn-pop"
                      className="bg-black text-white px-6 py-2.5 font-sans text-sm uppercase tracking-[0.15em] font-medium"
                    >
                      Book Now
                    </HoverBorderGradient>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </div>

      {/* Gallery Grid */}
      <section className="pt-10 md:pt-14 pb-16 md:pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] overflow-hidden rounded-lg"
                >
                  <img
                    src={`/images/image${i}.jpg`}
                    alt={`Gallery photo ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
