import { ReactNode } from 'react'
interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {

  const computedStyles = {
    fontWeight: 488,
    fontVariationSettings: `"BNCE" 65, "INFM" 45`,
  }


  return (
    <h1 className="font-headings capitalize text-5xl leading-9 tracking-tight font-stretch-extra-condensed dark:font-stretch-extra-condensed text-gray-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 dark:text-secondary-100 rave:font-normal rave:font-sans rave:font-stretch-normal"
      style={computedStyles}
    >
      {children}
    </h1>
  )
}
