import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import WebVitals from '@/components/WebVitals'
import siteMetadata from '@/data/siteMetadata'
import 'css/tailwind.css'
import { Metadata } from 'next'
import { GA } from 'pliny/analytics'
import { SearchConfig, SearchProvider } from 'pliny/search'
import 'pliny/search/algolia.css'
import React from 'react'
import 'remark-github-blockquote-alert/alert.css'
import { ThemeProviders } from './theme-providers'

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website'
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const basePath = process.env.BASE_PATH || ''
  const googleAnalyticsId = process.env.NEXT_GOOGLE_ANALYTICS_ID as string

  return (
    <html
      lang={siteMetadata.language}
      className="font-body scroll-smooth"
      suppressHydrationWarning
    >
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link
        rel="manifest"
        href={`${basePath}/static/favicons/site.webmanifest`}
      />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <link
        rel="webmention"
        href="https://webmention.io/jenchan.biz/webmention"
      />
      <link rel="pingback" href="https://webmention.io/jenchan.biz/xmlrpc" />
      <link
        className="h-feed"
        rel="alternate"
        type="application/rss+xml"
        href={`${basePath}/feed.xml`}
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="fediverse:creator" content="@jenc@mstdn.party" />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content="#fff"
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content="#000"
      />

      {googleAnalyticsId !== null && (
        <GA googleAnalyticsId={googleAnalyticsId as string} />
      )}
      <WebVitals />
      <body className="rave:bg-gradient-to-br rave:from-watermelon/10 rave:via-blueberry/10 rave:to-lime-punch/10 bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mb-auto" role="main">
                {children}
              </main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
