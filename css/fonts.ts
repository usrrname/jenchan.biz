import { Inter, Noto_Serif, Shantell_Sans } from 'next/font/google'

export const shantell_sans = Shantell_Sans({
  subsets: ['latin'],
  adjustFontFallback: false,
  display: 'swap',
  style: ['normal', 'italic'],
  preload: true,
  variable: '--shantell-sans',
  axes: ['BNCE', 'INFM', 'SPAC'],
})

export const inter = Inter({
  weight: '400',
  adjustFontFallback: false,
  subsets: ['latin'],
  display: 'swap',
  variable: '--inter',
})

export const noto_serif = Noto_Serif({
  weight: ['400', '500', '700'],
  adjustFontFallback: false,
  subsets: ['latin'],
  display: 'swap',
  variable: '--noto-serif',
})