import { getCloudflareContext } from '@opennextjs/cloudflare'
// @ts-ignore
import type { Cloudflare } from '../../types/cloudflare-env'

const getDevToPublishedArticles = async () => {
  'use server'

  const context = (await getCloudflareContext({
    async: true
  })) as unknown as Cloudflare.Env

  const cache = await context.env.NEXT_INC_CACHE_R2_BUCKET

  if (cache) console.log(`cache exists for R2`)

  const cachedData = await cache?.get('devto-articles')
  if (cachedData) {
    const jsonData = await cachedData.json()
    console.info(`🔍 cached Dev.to articles found:`, jsonData)
    return jsonData as unknown as DevToArticle[]
  }
  if (!cachedData) {
    const endpoint = `https://dev.to/api/articles/me/published`
    const headers = new Headers()
    headers.append('api-key', context.env.NEXT_DEVTO_API_KEY)
    headers.append('accept', 'application/vnd.forem.api-v1+json')

    try {
      const res = await context.env.WORKER_SELF_REFERENCE?.fetch(endpoint, {
        headers
      })

      if (res?.status !== 200) {
        console.error('🚨 Dev.to API error:', res?.status, res?.statusText)
      }
      const data = await res?.json()
      console.log('🔍 data', data)
      await cache?.put('devto-articles', JSON.stringify(data), {
        httpMetadata: {
          cacheExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days
        }
      })
      return data as unknown as DevToArticle[]
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error in getDevToPublishedArticles: ${error.message}`)
      }
    }
  }
}
export default getDevToPublishedArticles
