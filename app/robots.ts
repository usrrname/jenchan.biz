import siteMetadata from '@/data/siteMetadata'
import { MetadataRoute } from 'next'

const aiBots = [
  'AI2Bot',
  'Ai2Bot-Dolma',
  'Amazonbot',
  'anthropic-ai',
  'Applebot',
  'Applebot-Extended',
  'Brightbot 1.0',
  'Bytespider',
  'CCBot',
  'ChatGPT-User',
  'Claude-Web',
  'ClaudeBot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Crawlspace',
  'Diffbot',
  'DuckAssistBot',
  'FacebookBot',
  'FriendlyCrawler',
  'Google-Extended',
  'GoogleOther',
  'GoogleOther-Image',
  'GoogleOther-Video',
  'GPTBot',
  'iaskspider/2.0',
  'ICC-Crawler',
  'ImagesiftBot',
  'img2dataset',
  'ISSCyberRiskCrawler',
  'Kangaroo Bot',
  'Meta-ExternalAgent',
  'Meta-ExternalFetcher',
  'OAI-SearchBot',
  'omgili',
  'omgilibot',
  'PanguBot',
  'Perplexity‑User',
  'PetalBot',
  'Scrapy',
  'SemrushBot-OCOB',
  'SemrushBot-SWA',
  'Sidetrade indexer bot',
  'Timpibot',
  'VelenPublicWebCrawler',
  'Webzio-Extended',
  'YouBot',
]

const aiBotsRules = aiBots.map((bot) => ({
  userAgent: bot,
  disallow: '/',
}))
const robotsRules = [
  ...aiBotsRules,
  {
    userAgent: '*',
    allow: '/',
  },
]

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: robotsRules,
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  }
}
