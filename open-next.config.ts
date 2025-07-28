import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import stableIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

export default defineCloudflareConfig({
  incrementalCache: stableIncrementalCache
})
