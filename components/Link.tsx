/* eslint-disable jsx-a11y/anchor-has-content */
import Link, { LinkProps } from 'next/link'
import { FC } from 'react'

type CustomLinkProps = LinkProps<any> & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

const CustomLink: FC<CustomLinkProps> = ({
  href,
  ...rest
}: CustomLinkProps) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return (
      <Link href={href} {...rest} className="break-words" />
    )
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a
      className="break-words"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      {...rest}
    />
  )
}

export default CustomLink
