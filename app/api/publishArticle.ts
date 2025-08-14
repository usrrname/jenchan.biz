import siteMetadata from '@/data/siteMetadata'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { Blog } from 'contentlayer/generated'
// @ts-ignore
import type { Cloudflare } from '../../types/cloudflare-env'

async function publishArticle(article: Blog) {
  'use server'
  const context = (await getCloudflareContext({ async: true })) as {
    env: Cloudflare.Env
  }
  const { env } = context as unknown as Cloudflare.Env
  console.log(env)
  const headers = new Headers()
  headers.append('api-key', `${env.NEXT_DEVTO_API_KEY}`)
  headers.append('content-type', 'application/json')

  const requestBody = {
    method: 'POST',
    headers
  }
  const articleToPublish = {
    title: article.title,
    description: article.summary,
    main_image: article.images[0],
    published: article.draft ? false : true,
    body_markdown: article.body.raw,
    tags: [...article.tags],
    series: article.series ?? '',
    canonical_url: siteMetadata.siteUrl + `/${article.slug}`
  } as Partial<DevToArticle>

  try {
    await fetch(`https://dev.to/api/articles`, {
      ...requestBody,
      body: JSON.stringify({
        article: articleToPublish
      })
    })
  } catch (error) {
    throw Error(`${error.status} Error publishing article to Dev.to:`, error)
  }
}

export default publishArticle
