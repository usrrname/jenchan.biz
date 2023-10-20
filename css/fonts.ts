import { Shantell_Sans, Inter } from 'next/font/google'

export const shantell_sans = Shantell_Sans({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  preload: true,
  variable: '--shantell-sans',
  axes: ['BNCE', 'INFM', 'SPAC'],
})

export const inter = Inter({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--inter',
})
