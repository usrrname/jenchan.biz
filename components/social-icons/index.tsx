import {
  Bluesky,
  DevTo,
  Facebook,
  Github,
  Linkedin,
  Mail,
  Mastodon,
  Rss,
  Twitter,
  X,
  Youtube
} from './icons'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  devto: DevTo,
  rss: Rss,
  // threads: Threads,
  // instagram: Instagram,
  // medium: Medium,
  bluesky: Bluesky
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (
    !href ||
    (kind === 'mail' &&
      !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  )
    return null

  const isFediverse = kind === 'mastodon' || kind === 'bluesky'
  const isGithub = kind === 'github'

  const SocialSvg = components[kind]

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel={isFediverse || isGithub ? 'me' : 'noopener noreferrer'}
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`hover:text-primary-500 dark:hover:text-primary-400 rave:hover:text-primary-500 fill-current text-gray-700 dark:text-gray-200 h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
