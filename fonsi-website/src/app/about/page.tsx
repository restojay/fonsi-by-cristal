'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { ArrowRight } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

const certifications = [
  'MAC Pro Certified',
  'OLAPLEX Certified',
  'Wella Professional',
  'MOROCCANOIL Certified',
  'Licensed Cosmetologist, 10+ yrs',
]

const values = [
  {
    title: 'Client Care',
    desc: 'Every client is treated like family. I listen to your needs and work with you to create the look that makes you feel your best.',
  },
  {
    title: 'Excellence',
    desc: 'I use only premium products and the latest techniques. Continuous learning ensures you receive the highest quality service.',
  },
  {
    title: 'Artistry',
    desc: 'Beauty is an art form. I bring creativity, skill, and passion to every service, creating results that inspire confidence.',
  },
]

const specializations = [
  {
    title: 'Color & Correction',
    items: ['Full color transformations', 'Balayage & highlights', 'Color correction', 'Toning & gloss treatments'],
  },
  {
    title: 'Cuts & Styling',
    items: ['Precision cuts', 'Blowouts & styling', 'Special occasion updos', 'Keratin & smoothing treatments'],
  },
  {
    title: 'Bridal',
    items: ['Bride hair & makeup', 'Wedding party styling', 'Trials & consultations', 'On-site services available'],
  },
  {
    title: 'Makeup & Beauty',
    items: ['Professional MAC application', 'Editorial & glam looks', 'Lash & brow services', 'Waxing treatments'],
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <div className="container-custom pt-16 md:pt-24">
        <section className="relative pb-6 bg-neutral-900 rounded-2xl overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(135deg, transparent, transparent 7px, rgba(255,255,255,0.06) 7px, rgba(255,255,255,0.06) 8px)`,
            }}
          />
          <div className="relative px-8 md:px-12 pt-8 md:pt-10 pb-2">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-3">
                The Artist
              </p>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-white">
                Meet Cristal
              </h1>
          </div>
        </section>
      </div>

      {/* Story */}
      <section className="py-12 md:py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Col 1 — Photo */}
            <ScrollReveal direction="left" className="lg:col-span-4 h-full flex justify-start">
              <div className="relative h-full max-w-xs">
                <div className="h-full overflow-hidden rounded-2xl">
                  <img
                    src="/images/cristal-headshot.jpg"
                    alt="Cristal - Hair Stylist & Makeup Artist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 w-full h-full border border-neutral-200 rounded-2xl -z-10" />
              </div>
            </ScrollReveal>

            {/* Col 2 — Story */}
            <ScrollReveal delay={0.05} className="lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-4">
                The Story
              </p>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-neutral-900 mb-5">
                A Decade of Artistry
              </h2>
              <div className="space-y-4 text-neutral-600 font-sans text-sm leading-relaxed">
                <p>
                  With over a decade of experience as a licensed cosmetologist, Cristal has
                  built Fonsi into one of San Antonio&apos;s trusted destinations for professional
                  beauty services. Working across salon and studio settings for diverse occasions
                  including bridal events, pageants, and runway work, she brings depth and
                  versatility to every appointment.
                </p>
                <p>
                  What started as a passion for making people feel confident has grown into a
                  thriving studio beloved by the San Antonio community. Every client receives
                  personalized attention and care, from the initial consultation to the final look.
                </p>
                <p>
                  From bridal transformations to everyday styling, color corrections to
                  special occasion looks, Cristal&apos;s expertise spans the full spectrum
                  of beauty services.
                </p>
              </div>
            </ScrollReveal>

            {/* Col 3 — Quote (top) + Certifications (bottom) */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <ScrollReveal delay={0.1} className="flex items-center">
                <blockquote className="relative border-l-2 border-neutral-200 pl-5">
                  <span className="text-5xl font-serif text-black leading-none block select-none -mb-2">
                    &ldquo;
                  </span>
                  <p className="text-xl md:text-2xl font-display italic text-black leading-relaxed">
                    You know you&apos;ve gotten a really superb service when strangers stop
                    you and ask who your stylist is.
                  </p>
                </blockquote>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="pt-6 border-t border-neutral-100">
                  <p className="text-base uppercase tracking-[0.2em] text-black font-sans font-bold mb-4">
                    Certifications
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-3 py-1.5 border border-neutral-200 rounded-full text-xs font-sans text-neutral-900 tracking-wide"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="pb-14 md:pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-4">
              Philosophy
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-10">
              My Approach
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="group rounded-2xl border border-neutral-200 p-8 hover:border-neutral-400 hover:shadow-sm transition-all duration-300 h-full">
                  <span className="text-4xl font-serif text-neutral-500 block mb-4 group-hover:text-neutral-700 transition-colors">
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-serif font-bold text-neutral-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-neutral-600 font-sans text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="pb-14 md:pb-20">
        <div className="container-custom">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-4">
                  What I Do
                </p>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
                  Specializations
                </h2>
              </div>
              <Link href="/booking">
                <HoverBorderGradient
                  as="div"
                  containerClassName="rounded-full"
                  className="bg-black text-white px-8 py-3 font-sans text-sm uppercase tracking-[0.15em] font-medium inline-flex items-center gap-3"
                >
                  Book your appointment
                  <ArrowRight size={14} />
                </HoverBorderGradient>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specializations.map((spec, i) => (
              <ScrollReveal key={spec.title} delay={i * 0.08}>
                <div className="group rounded-2xl border border-neutral-200 p-7 hover:border-neutral-400 hover:shadow-sm transition-all duration-300 h-full">
                  <h3 className="text-base font-serif font-bold text-neutral-900 mb-4">
                    {spec.title}
                  </h3>
                  <ul className="space-y-2.5">
                    {spec.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-neutral-600 font-sans text-sm"
                      >
                        <span className="w-1 h-1 bg-neutral-300 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
