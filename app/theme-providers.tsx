'use client'

import siteMetadata from '@/data/siteMetadata'
import { ThemeProvider } from 'next-themes'
import React from 'react'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={siteMetadata.theme}
      enableSystem
    >
      {children}
    </ThemeProvider>
  )
}
