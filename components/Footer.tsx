import { SocialIcon } from '@/components/social-icons'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  return (
    <footer role="contentinfo">
      <link href="https://github.com/usrrname" rel="me authn" />
      <div className="mt-16 mb-8 flex flex-col items-center">
        <div className="flex space-x-4">
          <SocialIcon kind="rss" href={`/feed.xml`} size={6} />
          <SocialIcon kind="github" href={siteMetadata.github} size={6} />
          <SocialIcon kind="linkedin" href={siteMetadata.linkedin} size={6} />
          <SocialIcon kind="mastodon" href={siteMetadata.mastodon} size={6} />
          <SocialIcon kind="devto" href={siteMetadata.devto} size={6} />
          <SocialIcon kind="bluesky" href={siteMetadata.bluesky} size={6} />
        </div>
      </div>
    </footer>
  )
}
