import { getCloudflareContext } from '@opennextjs/cloudflare'
// @ts-ignore
import dotenv from 'dotenv'
import type { CloudflareEnv } from '../../types/cloudflare-env'
dotenv.config()

const getDevToPublishedArticles = async () => {
  'use server'

  const { env } = (await getCloudflareContext({
    async: true
  })) as unknown as CloudflareEnv

  const cache = await env.NEXT_INC_CACHE_R2_BUCKET

  try {
    const endpoint = `https://dev.to/api/articles/me/published`
    const headers = new Headers()
    headers.append('api-key', env.NEXT_DEVTO_API_KEY)
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
    console.log('🔍 response data', data)

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
