import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Award, Clock } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-overlay relative h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="container-custom text-center relative z-10">
          <div className="mb-6 inline-block">
            <div className="text-gold-500/70 text-sm uppercase tracking-widest font-sans font-semibold">
              Welcome to Luxury
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
            Fonsi
          </h1>
          <h2 className="text-2xl md:text-4xl font-serif text-gold-500 mb-8">
            by Cristal
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-sans">
            Experience luxury hair and makeup services in San Antonio. Book your appointment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-400 transition flex items-center justify-center gap-2 group"
            >
              Book Now
              <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
            </Link>
            <Link
              href="/services"
              className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-500/10 transition"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-dark-800 border-y border-gold-500/20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="relative h-96 bg-gradient-to-br from-gold-500/20 to-gold-500/5 rounded-lg overflow-hidden border border-gold-500/30">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="text-gold-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-400 font-sans">Image placeholder</p>
                  </div>
                </div>
              </div>
            </div>
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
                className="text-gold-500 font-sans font-semibold hover:text-gold-400 flex items-center gap-2 transition group"
              >
                Learn More
                <ArrowRight className="group-hover:translate-x-1 transition" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gold-500 mb-4">
              Our Services
            </h2>
            <p className="text-gray-400 font-sans text-lg max-w-2xl mx-auto">
              From hair cuts and color to bridal packages and makeup services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {['Hair Services', 'Bridal Packages', 'Makeup Artistry', 'Waxing'].map((service) => (
              <div
                key={service}
                className="bg-dark-700 border border-gold-500/30 rounded-lg p-6 hover:border-gold-500 hover:border-opacity-60 transition group cursor-pointer"
              >
                <h3 className="text-xl font-serif font-bold text-gold-500 group-hover:text-gold-400 transition">
                  {service}
                </h3>
                <p className="text-gray-400 text-sm font-sans mt-2">
                  Professional services tailored to your needs
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/services"
              className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 transition inline-flex items-center gap-2 group"
            >
              View All Services
              <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-gold-900/20 to-dark-900 border-y border-gold-500/20">
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
              className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-400 transition"
            >
              Book Your Appointment
            </Link>
            <a
              href="tel:2105517742"
              className="border-2 border-gold-500 text-gold-500 px-8 py-4 rounded-lg font-sans font-semibold text-lg hover:bg-gold-500/10 transition"
            >
              (210) 551-7742
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
