import SocialIcon from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'
import Link from './Link'

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          {/* <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={6} /> */}
          <SocialIcon kind="rss" href={`./feed.xml`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          {/* <SocialIcon kind="facebook" href={siteMetadata.facebook} size={6} />
          <SocialIcon kind="youtube" href={siteMetadata.youtube} size={6} /> */}
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="mastodon" href={siteMetadata.mastodon} size={6} />
          <SocialIcon kind="devto" href={siteMetadata.devto} size={6} />
        </div>
        <div className="mb-8 text-xs text-gray-500 dark:text-gray-400">
          Made with{' '}
          <Link
            href="https://github.com/timlrx/tailwind-nextjs-starter-blog"
            className="font-small font-mono hover:underline"
          >
            @timlrx/tailwind-nextjs-starter-blog
          </Link>
        </div>
      </div>
    </footer>
  )
}
