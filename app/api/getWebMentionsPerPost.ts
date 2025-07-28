import { Blog } from '.contentlayer/generated/types'
import siteMetadata from '@/data/siteMetadata'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export default async function getWebMentionsPerPost(
  post: Blog
): Promise<WebMentionPostResponse> {
  const { env } = await getCloudflareContext({
    async: true
  })
  const cache = env.NEXT_INC_CACHE_R2_BUCKET
  const cachedData = await cache?.get(`webmentions-${post.slug}`)
  console.log('cachedData', cachedData?.text())
  if (!cachedData) {
    const url = siteMetadata.siteUrl
    const res = await env.WORKER_SELF_REFERENCE?.fetch(
      `https://webmention.io/api/mentions?per-page=200&target=${url}/blog/${post.slug}`
    )
    if (!res?.ok) throw new Error('Failed to fetch')
    const data = await res?.json()
    console.log('data', data)
    await cache?.put(`webmentions-${post.slug}`, JSON.stringify(data))
    return data as unknown as WebMentionPostResponse
  }
  return cachedData as unknown as WebMentionPostResponse
}

export const parseWebMentionResults = (results: WebMentionPostResponse) => {
  const { links } = results

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
        reposts.push({
          url,
          author
        })
        break
      case 'reply':
      case 'link':
        if (!content) content = `<a href="${url}">${url}</a>`

        replies.push({
          author,
          content,
          url,
          published,
          published_ts
        })
        break
      case 'mention':
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

  return { likes, mentions, replies, reposts }
}
