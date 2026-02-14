import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Analytics } from '@vercel/analytics/react'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://fonsibycristal.com'),
  title: 'Fonsi by Cristal | Hair Salon & Makeup Studio San Antonio',
  description:
    'Hair salon and makeup studio in San Antonio, TX. Professional hair cuts, color, styling, bridal services, and makeup. By appointment only.',
  keywords:
    'hair salon, makeup studio, hair color, bridal services, San Antonio, Texas',
  authors: [{ name: 'Fonsi by Cristal' }],
  robots: 'index, follow',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Fonsi by Cristal | Hair Salon & Makeup Studio',
    description:
      'Hair salon and makeup studio offering professional hair services and makeup in San Antonio, TX.',
    url: 'https://fonsibycristal.com',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fonsi by Cristal',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Bebas+Neue&family=Bodoni+Moda+SC:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-neutral-600 font-sans antialiased">
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
