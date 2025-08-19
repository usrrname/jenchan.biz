import { getCloudflareContext } from '@opennextjs/cloudflare'

import dotenv from 'dotenv'
// @ts-ignore
import type { CloudflareEnv } from '../../types/cloudflare-env'

export const runtime = 'edge'

dotenv.config()

/**
 * Fetches all published articles
 * uses @link https://developers.forem.com/api/v1#tag/articles/operation/getUserPublishedArticles
 * @returns Promise<void>
 */
const getDevToPublishedArticles = async () => {
  try {
    const context = (await getCloudflareContext({
      async: true
    })) as unknown as CloudflareEnv

    const cache = await context.env.NEXT_INC_CACHE_R2_BUCKET
    if (!cache) {
      console.error('❌ R2 cache not available')
      return null
    }

    console.log('✅ R2 cache bucket available:', cache)

    const cachedResults = await cache.get('incremental-cache/devto-articles')
    if (cachedResults !== null) {
      console.log('✅ R2 cache HIT - returning cached data')
      return cachedResults as R2ObjectBody
    }

    console.log('❌ R2 cache MISS - fetching from API')

    const endpoint = `https://dev.to/api/articles/me/published`
    const headers = new Headers()
    headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
    headers.append('accept', 'application/vnd.forem.api-v1+json')
    headers.append('Content-Type', 'application/json')

    const res = await context.env.WORKER_SELF_REFERENCE?.fetch(endpoint, {
      headers,
      method: 'GET',
      cache: 'force-cache'
    })

    if (!res || res.status !== 200) {
      console.error('🚨 Dev.to API error:', res?.status, res?.statusText)
      return null
    }

    const data = await res.json()

    // Early return: don't store any errors
    if (data.error || res.error) {
      console.error('API response contains error:', data.error || res.error)
      return null
    }

    // Add timeout to cache operation
    console.log('✅ Storing data in R2 cache...')
    const cachePromise = cache.put(
      'incremental-cache/devto-articles',
      JSON.stringify(data),
      {
        httpMetadata: {
          cacheExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        }
      }
    )

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Cache operation timeout')), 10000)
    )

    await Promise.race([cachePromise, timeoutPromise])
    console.log('✅ Data stored in R2 cache successfully')

    return data
  } catch (error) {
    console.error('❌ Error in getDevToPublishedArticles:', error)
    // Return null instead of throwing to prevent worker crashes
    return null
  }
}

export default getDevToPublishedArticles
