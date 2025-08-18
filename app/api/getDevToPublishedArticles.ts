import { getCloudflareContext } from '@opennextjs/cloudflare'
// @ts-ignore
import type { CloudflareEnv } from '../../types/cloudflare-env'

const getDevToPublishedArticles = async () => {
  'use server'

  const context = (await getCloudflareContext({
    async: true
  })) as unknown as CloudflareEnv

  const cache = await context.env.NEXT_INC_CACHE_R2_BUCKET

  try {
    const endpoint = `https://dev.to/api/articles/me/published`
    const headers = new Headers()
    headers.append('api-key', context.env.NEXT_DEVTO_API_KEY)
    headers.append('accept', 'application/vnd.forem.api-v1+json')

    const res = await context.env.WORKER_SELF_REFERENCE?.fetch(endpoint, {
      headers
    })

    if (res?.status !== 200) {
      console.error('🚨 Dev.to API error:', res?.status, res?.statusText)
      return
    }
    const data = await res.json()
    console.log('🔍 response data', data)
    // don't store any errors
    if (res.error) return

    await cache?.put('incremental-cache/devto-articles', JSON.stringify(data), {
      httpMetadata: {
        cacheExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getDevToPublishedArticles: ${error.message}`)
    }
  }
}

export default getDevToPublishedArticles
