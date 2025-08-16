import { Blog } from '.contentlayer/generated/types'
import siteMetadata from '@/data/siteMetadata'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import dotenv from 'dotenv'
dotenv.config()

export default async function getWebMentionsPerPost(
  post: Blog
): Promise<WebMentionPostResponse> {
  const { env } = await getCloudflareContext({
    async: true
  })

  if (!env.NEXT_INC_CACHE_R2_BUCKET) {
    console.warn('⚠️ R2 bucket not available, skipping cache')
    return { links: [] }
  }
  const cache = env.NEXT_INC_CACHE_R2_BUCKET
  const cachedData = await cache?.get(`webmentions-${post.slug}`)
  if (cachedData) {
    console.info('🔍 cached webmentions found')
    const jsonData = await cachedData.json()
    return jsonData as unknown as WebMentionPostResponse
  }
  const url = siteMetadata.siteUrl
  const target = `${url}/blog/${post.slug}`

  const res = await env.WORKER_SELF_REFERENCE?.fetch(
    `https://webmention.io/api/mentions?target=${target}&token=${process.env.NEXT_WEBMENTION_TOKEN}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!res?.ok) throw new Error('Failed to fetch')
  const data = await res?.json()
  console.log('data', data)
  await cache?.put(`webmentions-${post.slug}`, JSON.stringify(data))
  return data as unknown as WebMentionPostResponse
}

export const parseWebMentionResults = (results: WebMentionPostResponse) => {
  const { links } = results
  console.log('links', links)
  if (!links?.length) return

  const mentions: WebMentionReplies[] = []
  let replies: WebMentionReplies[] = []
  const likes: WebMentionReaction[] = []
  const reposts: WebMentionReaction[] = []

  links?.forEach((mention) => {
    const { data, activity } = mention
    const { author, url, published, published_ts } = data
    let { content } = data
    const { name } = author
    // Ignore webmentions and promo from myself
    if (name === 'Jen Chan') return

    switch (activity.type) {
      case 'like':
      case 'bookmark':
        likes.push({
          author,
          url
        })
        break
      case 'repost':
        if (!content) content = `<a href="${url}" class="repost-of">${url}</a>`
        reposts.push({
          url,
          author
        })
        break
      case 'reply':
        if (!content)
          content = `<a href="${url}" class="in-reply-to">${url}</a>`
        replies.push({
          author,
          content,
          url,
          published,
          published_ts
        })
        break
      case 'link':
        if (!content) content = `<a href="${url}" class="link-of">${url}</a>`
        replies.push({
          author,
          content,
          url,
          published,
          published_ts
        })
        break
      case 'mention':
        if (!content) content = `<a href="${url}" class="mention-of">${url}</a>`
        mentions.push({
          author,
          content,
          url,
          published,
          published_ts
        })
        break
    }
  })

  if (replies.length > 0) {
    replies = replies.toSorted(
      (a, b) => (b.published_ts ?? 0) - (a.published_ts ?? 0)
    )
  }

  return { likes, mentions, replies, reposts, links }
}
