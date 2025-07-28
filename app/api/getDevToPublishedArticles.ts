import { getCloudflareContext } from '@opennextjs/cloudflare'

const getDevToPublishedArticles = async () => {
  'use server'
  const { env } = await getCloudflareContext({
    async: true
  })

  const cache = env.NEXT_INC_CACHE_R2_BUCKET
  const cachedData = await cache?.get('devto-articles')
  if (cachedData) {
    console.info('🔍 cached Dev.to articles found')
    const jsonData = await cachedData.json()
    return jsonData as DevToArticle[]
  }

  const endpoint = `https://dev.to/api/articles/me/published`
  const headers = new Headers()
  headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
  headers.append('accept', 'application/vnd.forem.api-v1+json')

  try {
    const res = await env.WORKER_SELF_REFERENCE?.fetch(endpoint, {
      headers: headers,
      cache: 'force-cache'
    })
    if (res?.status !== 200) {
      console.error('🚨 Dev.to API error:', res?.status, res?.statusText)
    }
    const data = await res?.json()
    await cache?.put('devto-articles', JSON.stringify(data))
    return data as unknown as DevToArticle[]
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getDevToPublishedArticles: ${error.message}`)
    }
  }
}
export default getDevToPublishedArticles
