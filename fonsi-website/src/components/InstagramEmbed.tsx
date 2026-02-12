'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}

interface InstagramEmbedProps {
  postUrls: string[]
}

export default function InstagramEmbed({ postUrls }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Process embeds once the script is loaded
    const timer = setTimeout(() => {
      if (window.instgrm) {
        window.instgrm.Embeds.process()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [postUrls])

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {postUrls.map((url, index) => (
        <div key={index} className="flex justify-center">
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{
              background: '#1a202c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              margin: 0,
              maxWidth: '540px',
              minWidth: '280px',
              width: '100%',
            }}
          />
        </div>
      ))}
    </div>
  )
}
