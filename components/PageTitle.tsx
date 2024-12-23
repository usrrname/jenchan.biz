import { shantell_sans } from '@/css/fonts'
import React, { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1
      className={`${shantell_sans.variable} text-3xl leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14`}
      style={{
        fontWeight: 488,
        fontVariationSettings: `"BNCE" 65, "INFM" 45`,
      }}
    >
      {children}
    </h1>
  )
}
