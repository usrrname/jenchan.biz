import {
  getDeploymentId,
  initOpenNextCloudflareForDev
} from '@opennextjs/cloudflare'
import { createContentlayerPlugin } from 'next-contentlayer2'
initOpenNextCloudflareForDev()

const withBundleAnalyzer = { enabled: process.env.ANALYZE === 'true' }

// Use createContentlayerPlugin instead of withContentlayer
const withContentlayer = createContentlayerPlugin({
  configPath: './contentlayer.config.ts'
})

if (process.env.NODE_ENV === 'development') {
  await initOpenNextCloudflareForDev()
}

// You might need to insert additional domains in script-src if you are using external services
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.cloudflareinsights.com  *.googletagmanager.com *.google-analytics.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'self' *.s3.amazonaws.com *.cloudflare.com;
  connect-src *;
  font-src 'self';
  frame-src stackblitz.com codepen.io codesandbox.io youtube.com;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'X-Robots-Tag',
    value: 'noai, noml, noimageai'
  }
]

const output = process.env.EXPORT ? 'export' : 'standalone'
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  output,
  basePath,
  deploymentId: getDeploymentId(),
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    dirs: ['app', 'components', 'layouts', 'scripts']
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['webmention.io', 'dev.to', 'github.com']
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: '*.webmention.io'
      },
      {
        protocol: 'https',
        hostname: '*.imgflip.com'
      },
      {
        protocol: 'https',
        hostname: '*.cloudflare.com'
      },
      {
        protocol: 'https',
        hostname: '*.mstdn.party'
      }
    ],
    unoptimized
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ]
  },
  /**
   * @param {NextJsWebpackConfig} config
   * @param options
   * @returns {NextJsWebpackConfig}
   */
  webpack: (config, context) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    // Suppress contentlayer2 webpack warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      (warning) => {
        return (
          warning.module &&
          warning.module.resource &&
          warning.module.resource.includes('@contentlayer2/core') &&
          warning.message &&
          warning.message.includes('Parsing of') &&
          warning.message.includes('for build dependencies failed')
        )
      }
    ]

    return config
  }
}

// Export the config wrapped with contentlayer
export default withContentlayer(nextConfig)
