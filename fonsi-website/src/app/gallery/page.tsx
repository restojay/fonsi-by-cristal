import { Sparkles } from 'lucide-react'

export default function GalleryPage() {
  const galleryPlaceholders = Array.from({ length: 12 }, (_, i) => i + 1)

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-dark-800 to-dark-900 border-b border-gold-500/20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gold-500 mb-4">
            Gallery
          </h1>
          <p className="text-gray-300 font-sans text-lg max-w-2xl mx-auto">
            See the beautiful transformations our clients have experienced
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryPlaceholders.map((item) => (
              <div
                key={item}
                className="relative overflow-hidden rounded-lg bg-dark-800 border border-gold-500/30 aspect-square group cursor-pointer hover:border-gold-500/60 transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-500/5 group-hover:from-gold-500/30 group-hover:to-gold-500/10 transition" />
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="text-gold-500 mx-auto mb-4 group-hover:scale-110 transition" size={48} />
                    <p className="text-gray-400 font-sans">Gallery Image {item}</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-dark-800 border-t border-gold-500/20">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-serif font-bold text-gold-500 mb-4">
            Ready to Join Our Gallery?
          </h2>
          <p className="text-gray-300 font-sans text-lg mb-8 max-w-2xl mx-auto">
            Book your appointment today and become one of our beautiful transformations
          </p>
          <a
            href="/booking"
            className="bg-gold-500 text-dark-900 px-8 py-4 rounded-lg font-sans font-semibold hover:bg-gold-400 transition inline-block"
          >
            Book Now
          </a>
        </div>
      </section>
    </>
  )
}
