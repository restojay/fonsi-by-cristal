import { Award, Heart, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
            About Cristal
          </h1>
          <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
            The passion and expertise behind Fonsi
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
            {/* Image Placeholder */}
            <div className="relative h-96 bg-gradient-to-br from-gold-500/20 to-gold-500/5 rounded-lg overflow-hidden border border-gold-500/30">
              <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-transparent" />
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="text-gold-500 mx-auto mb-4" size={48} />
                  <p className="text-gray-400 font-sans">Photo of Cristal</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl font-serif font-bold text-gold-500 mb-6">
                Cristal's Story
              </h2>
              <div className="space-y-4 text-gray-300 font-sans text-lg mb-8">
                <p>
                  With over a decade of experience in the beauty industry, Cristal has built
                  Fonsi into one of San Antonio's premier luxury beauty destinations. Her passion
                  for hair artistry and makeup begins with understanding each client's unique vision
                  and bringing it to life.
                </p>
                <p>
                  What started as a dream to create a space where clients feel pampered, confident,
                  and beautiful has become a thriving studio beloved by the San Antonio community.
                  Cristal's commitment to excellence and continuous learning ensures that every
                  client receives the highest quality service.
                </p>
                <p>
                  From bridal transformations to everyday glam, color corrections to special occasion
                  styling, Cristal's expertise spans the full spectrum of beauty services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <h2 className="text-4xl font-serif font-bold text-gold-500 mb-12 text-center">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500/60 transition">
              <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                <Heart className="text-gold-500" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">Client Care</h3>
              <p className="text-gray-300 font-sans">
                Every client is treated like family. We listen to your needs and work with you
                to create the perfect look that makes you feel confident and beautiful.
              </p>
            </div>

            <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500/60 transition">
              <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                <Award className="text-gold-500" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">Excellence</h3>
              <p className="text-gray-300 font-sans">
                We're committed to using only premium products and the latest techniques.
                Your satisfaction is our priority.
              </p>
            </div>

            <div className="bg-dark-700 border border-gold-500/30 rounded-lg p-8 hover:border-gold-500/60 transition">
              <div className="inline-block p-4 bg-gold-500/10 rounded-lg mb-4">
                <Sparkles className="text-gold-500" size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-gold-500 mb-3">Artistry</h3>
              <p className="text-gray-300 font-sans">
                Beauty is an art form. We bring creativity, skill, and passion to every
                service, creating transformations that inspire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-4xl font-serif font-bold text-gold-500 mb-12 text-center">
            Specializations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-800 border border-gold-500/30 rounded-lg p-6">
              <h3 className="text-xl font-serif font-bold text-gold-500 mb-3">Hair Services</h3>
              <p className="text-gray-300 font-sans mb-4">
                Expert cuts, color, styling, and treatments including keratin and Olaplex.
              </p>
              <ul className="text-gray-400 font-sans text-sm space-y-2">
                <li>• Color correction and transformation</li>
                <li>• Bridal and special occasion styling</li>
                <li>• Advanced coloring techniques</li>
                <li>• Hair health treatments</li>
              </ul>
            </div>

            <div className="bg-dark-800 border border-gold-500/30 rounded-lg p-6">
              <h3 className="text-xl font-serif font-bold text-gold-500 mb-3">Makeup & Beauty</h3>
              <p className="text-gray-300 font-sans mb-4">
                Professional makeup application and beauty services for any occasion.
              </p>
              <ul className="text-gray-400 font-sans text-sm space-y-2">
                <li>• Bridal makeup and styling</li>
                <li>• Professional makeup application</li>
                <li>• MAC cosmetics expertise</li>
                <li>• On-site services available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dark-800 border-t border-gold-500/20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif font-bold text-gold-500 mb-4">
            Experience the Difference
          </h2>
          <p className="text-gray-300 font-sans text-lg mb-8 max-w-2xl mx-auto">
            Schedule your appointment with Cristal today and discover why clients keep coming back
          </p>
          <a
            href="/booking"
            className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 transition inline-block"
          >
            Book Your Appointment
          </a>
        </div>
      </section>
    </>
  )
}
