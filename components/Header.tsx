'use server'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import MobileNav from './MobileNav'
import SearchButton from './SearchButton'
import ThemeSwitch from './ThemeSwitch'

const Header = () => {
  let headerClass =
    'flex items-center w-full bg-transparent dark:bg-gray-950 justify-between py-10'

  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link
        href="/"
        className="font-headings rave:font-sans rave:hover:line-through hidden h-6 text-2xl font-semibold sm:block"
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
        <div className="no-scrollbar mt-1 hidden max-w-40 items-end space-x-4 overflow-x-auto sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-md hover:decoration-animate-wave hidden py-3 font-medium text-gray-900  hover:underline hover:decoration-primary-400 hover:decoration-wavy hover:underline-offset-4 dark:text-gray-100 dark:hover:decoration-primary-400 sm:block rave:hover:decoration-primary-500"
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
