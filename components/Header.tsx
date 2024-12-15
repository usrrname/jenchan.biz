'use server'
import { shantell_sans } from '@/css/fonts'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import React from 'react'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import ThemeSwitch from './ThemeSwitch'

const Header = () => {
  let headerClass =
    'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'

  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link
        href="/"
        className={`${shantell_sans.className} hidden h-6 text-2xl font-semibold sm:block`}
        style={{
          fontVariationSettings: `"BNCE" 2, ""INFM" 30`,
        }}
        aria-label={siteMetadata.headerTitle}
      >
        <div className="flex items-center justify-between">
          <div className="mr-3"></div>

            <div className="hidden h-6 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
          </div>
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-end space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96 mt-1">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hidden font-medium text-md text-gray-900 hover:underline hover:underline-offset-4  hover:decoration-animate-wave hover:decoration-wavy dark:text-gray-100 sm:block hover:decoration-green-400 dark:hover:decoration-cyan-400 py-3"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
