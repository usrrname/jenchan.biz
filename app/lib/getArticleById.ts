import { getCloudflareContext } from '@opennextjs/cloudflare'

// @ts-ignore
import type { Cloudflare } from '../../types/cloudflare-env'
import { validateArticleId } from './urlValidation'

export const runtime = 'edge'

const getArticleById = async (id: number) => {
  const validatedId = validateArticleId(id)
  const context = (await getCloudflareContext({
    async: true
  })) as unknown as Cloudflare.Env
  const endpoint = `https://dev.to/api/articles/${validatedId}`
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
