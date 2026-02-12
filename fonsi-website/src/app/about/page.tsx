'use client'

import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import { ArrowRight } from 'lucide-react'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-16 md:pt-24 pb-6 bg-black">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-sans mb-6">
              The Artist
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white">
              Meet Cristal
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Story */}
      <section className="pt-6 pb-16 md:pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal direction="left">
              <div className="aspect-[3/4] bg-neutral-200 overflow-hidden rounded-2xl sticky top-24">
                <img
                  src="/images/cristal-headshot.jpg"
                  alt="Cristal - Hair Stylist & Makeup Artist"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div>
                <div className="space-y-6 text-neutral-500 font-sans leading-relaxed">
                  <p className="text-lg text-neutral-700">
                    &ldquo;You know you&apos;ve gotten a really superb service when strangers stop
                    you and ask you who your stylist is.&rdquo;
                  </p>

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

                {/* Credentials */}
                <div className="mt-10">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-500 font-sans mb-4">
                    Training & Certifications
                  </h3>
                  <div className="space-y-1 text-sm font-sans text-neutral-500">
                    <p>MAC Pro certified (multiple states)</p>
                    <p>OLAPLEX certified</p>
                    <p>Wella Professional</p>
                    <p>MOROCCANOIL certified</p>
                    <p>Licensed Cosmetologist, 10+ years</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-sans mb-6">
              How We Work
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-16">
              Our Approach
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200">
            {[
              {
                title: 'Client Care',
                desc: 'Every client is treated like family. We listen to your needs and work with you to create the look that makes you feel your best.',
              },
              {
                title: 'Excellence',
                desc: 'We use only premium products and the latest techniques. Continuous learning ensures you receive the highest quality service.',
              },
              {
                title: 'Artistry',
                desc: 'Beauty is an art form. We bring creativity, skill, and passion to every service, creating results that inspire confidence.',
              },
            ].map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <div className="bg-neutral-50 p-10 md:p-12">
                  <span className="text-neutral-300 font-sans text-xs block mb-6">
                    0{i + 1}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-neutral-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-neutral-500 font-sans text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Specializations */}
      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900 mb-12">
              Specializations
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div>
                <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-4">
                  Hair Services
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed mb-4">
                  Expert cuts, color, styling, and treatments including keratin and Olaplex.
                </p>
                <ul className="text-neutral-500 font-sans text-sm space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    Color correction and transformation
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    Bridal and special occasion styling
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    Advanced coloring techniques
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    Hair health treatments
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div>
                <h3 className="text-lg font-serif font-semibold text-neutral-900 mb-4">
                  Makeup & Beauty
                </h3>
                <p className="text-neutral-500 font-sans text-sm leading-relaxed mb-4">
                  Professional makeup application and beauty services for any occasion.
                </p>
                <ul className="text-neutral-500 font-sans text-sm space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    Bridal makeup and styling
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    Professional MAC cosmetics application
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                    On-site services available
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal>
            <div className="mt-16">
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
        </div>
      </section>
    </>
  )
}
