import { Blog } from '.contentlayer/generated/types'
import siteMetadata from '@/data/siteMetadata'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import dotenv from 'dotenv'
dotenv.config()

export default async function GET(
  post: Blog
): Promise<WebMentionPostResponse | undefined> {

    const {env} = await getCloudflareContext({
      async: true
    })
  
    // const cache = await env.NEXT_INC_CACHE_R2_BUCKET
    // if (!cache) {
    //   console.error('❌ R2 cache not available')
    //   return;
    // }
  
  const url = siteMetadata.siteUrl
  const target = `${url}/blog/${post.slug}`
  const trailingSlashTarget = `${url}/blog/${post.slug}/`

  try {

    // const cachedData = await cache?.get(`webmentions-${post.slug}`)
    // const jsonData = await cachedData?.json() as WebMentionPostResponse

    // if (jsonData?.links?.length && jsonData?.links?.length > 0) {
    //   console.info(`✅ cache hit: webmentions found for ${post.slug}`)
    //   return jsonData as unknown as WebMentionPostResponse
    // }

    // Extract fetch logic into a reusable function
    const fetchWebMentions = async (targetUrl: string) => {
      return env.WORKER_SELF_REFERENCE?.fetch(
        `https://webmention.io/api/mentions?target=${targetUrl}&token=${process.env.NEXT_WEBMENTION_TOKEN}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Fetch webmentions for both URL variations in parallel
    const [response, responseWithTrailingSlash] = await Promise.all([
      fetchWebMentions(target),
      fetchWebMentions(trailingSlashTarget)
    ])

    if (!response?.ok || !responseWithTrailingSlash?.ok) {
      throw new Error('Failed to fetch webmentions')
    }
    
    const [data, dataTrailingSlash] = await Promise.all([
      response.json() as Promise<WebMentionPostResponse>,
      responseWithTrailingSlash.json() as Promise<WebMentionPostResponse>
    ])

    const allLinks = [...(data?.links || []), ...(dataTrailingSlash?.links || [])
    ]

    // Remove duplicates using a Map with ID as key
    const uniqueLinks = Array.from(
      new Map(allLinks.map(link => [link.id, link])).values()
    )
    
    if (uniqueLinks.length > 0) {
      await env.NEXT_INC_CACHE_R2_BUCKET?.put(`webmentions-${post.slug}`, JSON.stringify({ links: uniqueLinks }), {
        httpMetadata: {
          contentType: 'application/json',
          cacheExpiry: new Date(Date.now() + 300 * 1000), // 5 minutes
        }
      })
      
      return { links: uniqueLinks } as WebMentionPostResponse
    }
  } catch (error) {
    console.error('❌ Error in getWebMentionsPerPost:', error)
  }
}

export const parseWebMentionResults = (results: WebMentionPostResponse) => {
  const { links } = results

  if (!links?.length) return

  const mentions: WebMentionComment[] = []
  let replies: WebMentionReply[] = []
  const likes: WebMentionReaction[] = []
  const reposts: WebMentionReaction[] = []
  const bookmarks: WebMentionReaction[] = []

  links?.forEach((mention) => {
    const { data, activity } = mention
    const { author, url, published, published_ts, source, verified_date } = data
    let { content } = data
    const { name } = author

    // Ignore webmentions and promo from myself
    if (name === 'Jen Chan' || name === '422 Unprocessable Entity') return

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
          name,
          author,
          content,
          url,
          source,
          published,
          published_ts,
          verified_date
        })
        break
      case 'mention':
      case 'link':
        if (!content)
          content = `<a href="${url}" class="${activity.type}-of">${url}</a>`
        mentions.push({
          name,
          author,
          content,
          url,
          source,
          published,
          published_ts,
          verified_date
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
