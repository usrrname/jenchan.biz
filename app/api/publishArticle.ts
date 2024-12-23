import siteMetadata from '@/data/siteMetadata'
import { Blog } from 'contentlayer/generated'

async function publishArticle(article: Blog) {
  'use server'

  const headers = new Headers()
  headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
  headers.append('content-type', 'application/json')

  const requestBody = {
    method: 'POST',
    headers,
  }
  const articleToPublish = {
    title: article.title,
    description: article.summary,
    main_image: article.images[0],
    published: article.draft ? false : true,
    body_markdown: article.body.raw,
    tags: [...article.tags],
    series: article.series ?? '',
    canonical_url: siteMetadata.siteUrl + `/${article.slug}`,
  } as Partial<DevToArticle>

  try {
    await fetch(`https://dev.to/api/articles`, {
      ...requestBody,
      body: JSON.stringify({
        article: articleToPublish,
      }),
    })
  } catch (error) {
    throw Error(`${error.status} Error publishing article to Dev.to:`, error)
  }
}

export default publishArticle
