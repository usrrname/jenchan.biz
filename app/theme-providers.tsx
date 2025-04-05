'use client'

import { inter, noto_serif, shantell_sans } from '@/css/fonts'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProvider } from 'next-themes'
import React from 'react'
export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={siteMetadata.theme}
      enableSystem
      themes={['light', 'dark', 'rave']}
    >
      <style jsx global>{`
        :root {
          --font-sans: ${shantell_sans.style.fontFamily};
          --font-serif: ${noto_serif.style.fontFamily};
          --font-body: ${inter.style.fontFamily};
        }`}
      </style>
      {children}
    </ThemeProvider>
  )
}
