'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import ScrollReveal from '@/components/ScrollReveal'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function GalleryPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-6 md:pb-8 bg-black">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            <ScrollReveal>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-sans mb-6">
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

            <ScrollReveal direction="right">
              <div className="flex flex-col items-start md:items-end gap-4 md:pb-1">
                <div className="flex items-center gap-3">
                  <Instagram size={20} className="text-neutral-400" />
                  <p className="text-neutral-400 font-sans text-sm">
                    Follow along for the latest
                  </p>
                </div>
                <div className="flex flex-row gap-4">
                  <HoverBorderGradient
                    as="a"
                    href="https://www.instagram.com/fonsi_by_cristal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    containerClassName="rounded-full"
                    className="bg-black text-white px-6 py-2.5 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center justify-center gap-2"
                  >
                    <Instagram size={14} />
                    @fonsi_by_cristal
                  </HoverBorderGradient>
                  <Link href="/booking">
                    <HoverBorderGradient
                      as="div"
                      containerClassName="rounded-full"
                      className="bg-black text-white px-6 py-2.5 font-sans text-sm uppercase tracking-[0.15em] font-medium"
                    >
                      Book Now
                    </HoverBorderGradient>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

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
