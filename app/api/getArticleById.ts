import { getCloudflareContext } from '@opennextjs/cloudflare'
// @ts-ignore

const getArticleById = async (id: number) => {
  'use server'
  const context = await getCloudflareContext({ async: true })
  const endpoint = `https://dev.to/api/articles/${id}`
  const headers = new Headers()
  headers.append('api-key', `${context.env?.NEXT_DEVTO_API_KEY as string}`)
  headers.append('accept', 'application/vnd.forem.api-v1+json')
  try {
    const res = await context?.env?.WORKER_SELF_REFERENCE.fetch(endpoint, {
      headers: headers,
      cache: 'force-cache'
    })
    return res.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getArticleById: ${error.message}`)
    }
  }
}
export default getArticleById
