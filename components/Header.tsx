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
    <header className={headerClass} role="navigation">
      <Link
        href="/"
        className="hidden h-6 text-2xl font-semibold sm:block"
        aria-label={siteMetadata.headerTitle}
      >
        <div className="flex items-center justify-between">
          <div className="mr-3"></div>

          <div className="hidden h-6 text-2xl font-semibold sm:block">
            <h1 className="font-headings rave:font-sans rave:hover:line-through font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {siteMetadata.headerTitle}
            </h1>
          </div>
        </div>
      </Link>
      <div className="mt-2 flex items-center space-x-4 sm:space-x-3">
        <div className="no-scrollbar max-w-auto hidden items-end space-x-4 overflow-x-auto sm:flex sm:space-x-3 md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-md hover:decoration-animate-wave hover:decoration-primary-400 hover:wavy dark:hover:decoration-primary-400 rave:hover:decoration-blueberry hidden py-3 font-medium text-gray-900 hover:underline hover:decoration-wavy hover:underline-offset-4 sm:block dark:text-gray-100"
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
