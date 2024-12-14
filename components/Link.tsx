/* eslint-disable jsx-a11y/anchor-has-content */
import Link, { LinkProps } from 'next/link'
import React, { FC } from 'react'

type CustomLinkProps = LinkProps<any> & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>

const CustomLink: FC<CustomLinkProps> = ({
  href,
  ...rest
}: CustomLinkProps) => {
  const isInternalLink = typeof href === 'string' && href.startsWith('/')
  const isAnchorLink = typeof href === 'string' && href.startsWith('#')

  if (isInternalLink) {
    return (
      <Link href={href as string} {...rest} className="break-words" />
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
      href={href as string}
      {...rest}
    />
  )
}

export default CustomLink
