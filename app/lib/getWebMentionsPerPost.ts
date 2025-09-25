import { Blog } from '.contentlayer/generated/types'
import siteMetadata from '@/data/siteMetadata'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import dotenv from 'dotenv'
dotenv.config()

export default async function getWebMentionsPerPost(
  post: Blog
): Promise<WebMentionPostResponse | undefined> {
  const { env } = await getCloudflareContext({
    async: true
  })

  if (!env.NEXT_INC_CACHE_R2_BUCKET) {
    console.warn('⚠️ R2 bucket not available, skipping cache')
    return
  }
  const cache = env.NEXT_INC_CACHE_R2_BUCKET
  const cachedData = await cache?.get(`webmentions-${post.slug}`)
  const jsonData = await cachedData?.json() as WebMentionPostResponse

  if (jsonData?.links?.length && jsonData?.links?.length > 0) {
      console.info(`✅ cache hit: webmentions found for ${post.slug}`)
      return jsonData as unknown as WebMentionPostResponse
    }

  console.log(`❌ R2 cache MISS - fetching webmentions for ${post.slug} from webmention.io API`)
  try {
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

    if (!res?.ok) throw new Error('Failed to fetch webmentions')
    
    const data = await res?.json() as WebMentionPostResponse
    
    if (data?.links?.length && data?.links?.length > 0) {
    await cache?.put(`webmentions-${post.slug}`, JSON.stringify(data), {
      httpMetadata: {
        contentType: 'application/json',
        cacheExpiry: new Date(Date.now() + 300 * 1000) // 5 minutes
      }
    })
    
      return data as unknown as WebMentionPostResponse
    }
  } catch (error) {
    console.error('❌ Error in getWebMentionsPerPost:', error)
  }
}

export const parseWebMentionResults = (results: WebMentionPostResponse) => {
  const { links } = results

  if (!links?.length) return

  const mentions: WebMentionReplies[] = []
  let replies: WebMentionReplies[] = []
  const likes: WebMentionReaction[] = []
  const reposts: WebMentionReaction[] = []
  const bookmarks: WebMentionReaction[] = []

  links?.forEach((mention) => {
    const { data, activity } = mention
    const { author, url, published, published_ts, source } = data
    let { content } = data
    const { name } = author
    // Ignore webmentions and promo from myself
    if (name === 'Jen Chan' ) return

    switch (activity.type) {
      case 'like':
         likes.push({
          author,
          url,
          source
         })
        break
      case 'bookmark':
        bookmarks.push({
          source,
          author,
          url
        })
        break
      case 'repost':
        if (!content) content = `<a href="${url}" class="repost-of">${url}</a>`
        reposts.push({
          source,
          url,
          author
        })
        break
      case 'reply':
        if (!content)
          content = `<a href="${url}" class="${activity.type}-of">${url}</a>`

        replies.push({
          author,
          content,
          url,
          source,
          published,
          published_ts
        })
        break
      case 'mention':
      case 'link':
        if (!content)
          content = `<a href="${url}" class="${activity.type}-of">${url}</a>`
        mentions.push({
          author,
          content,
          url,
          source,
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

  return { likes, mentions, replies, reposts, bookmarks }
}
