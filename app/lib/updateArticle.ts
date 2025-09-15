import siteMetadata from '@/data/siteMetadata'
import { Blog } from 'contentlayer/generated'

const updateArticle = async (id: number, article: Blog) => {
  'use server'
  const endpoint = `https://dev.to/api/articles/${id}`

  const payload = {
    title: article.title,
    description: article.summary,
    main_image: article.images[0],
    published: article.draft ? false : true,
    body_markdown: article.body.raw,
    tags: [...article.tags],
    series: article.series ?? '',
    canonical_url: siteMetadata.siteUrl + `/${article.slug}`
  } as Partial<DevToArticle>

  const headers = new Headers()
  headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
  headers.append('content-type', 'application/json')
  try {
    const res = await fetch(endpoint, {
      headers: headers,
      body: JSON.stringify({
        article: payload
      })
    })
    return res.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error updating article:`, error)
    }
  }
}
export default updateArticle
