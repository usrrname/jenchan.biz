import { getCloudflareContext } from '@opennextjs/cloudflare'
import dotenv from 'dotenv' // @ts-ignore
import type { CloudflareEnv } from '../../types/cloudflare-env'
dotenv.config()

/**
 * Fetches all published articles
 * uses @link https://developers.forem.com/api/v1#tag/articles/operation/getUserPublishedArticles
 * @returns Promise<void>
 */
const getDevToPublishedArticles = async () => {
  'use server'

  const { env } = (await getCloudflareContext({
    async: true
  })) as unknown as CloudflareEnv

  const cache = await env.NEXT_INC_CACHE_R2_BUCKET
  if (cache.get('incremental-cache/devto-articles') !== null) {
    console.log(`R2 cache exists`)
    return
  }

  try {
    const endpoint = `https://dev.to/api/articles/me/published`
    const headers = new Headers()
    headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
    headers.append('accept', 'application/vnd.forem.api-v1+json')
    headers.append('Content-Type', 'application/json')

    const res = await env.WORKER_SELF_REFERENCE?.fetch(endpoint, {
      headers,
      method: 'GET',
      cache: 'force-cache'
    })

    if (res?.status !== 200) {
      return console.error('🚨 Dev.to API error:', res?.status, res?.statusText)
    }
    const data = await res.json()

    // Early return: don't store any errors
    if (data.error || res.error) return

    await cache?.put('incremental-cache/devto-articles', JSON.stringify(data), {
      httpMetadata: {
        cacheExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error in getDevToPublishedArticles: ${error.message}`,
        error
      )
    }
  }
}

export default getDevToPublishedArticles
