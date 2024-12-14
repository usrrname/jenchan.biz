import { Blog } from '.contentlayer/generated/types'
import siteMetadata from '@/data/siteMetadata'
export const dynamic = 'force-static'

async function getWebMentionsPerPost(post: Blog) {
  'use server'
  const url = siteMetadata.siteUrl
  const res = await fetch(
    `https://webmention.io/api/mentions?per-page=200&target=${url}/blog/${post.slug}`,
    {
      next: { revalidate: 3600 * 24 }, // revalidate once a day
    }
  )
  return res.json()
}

export const parseWebMentionResults = (results: WebMentionPostResponse) => {
  const { links } = results

  if (!links.length) return

  const mentions: WebMentionReplies[] = []
  let replies: WebMentionReplies[] = []
  const likes: WebMentionReaction[] = []
  const reposts: WebMentionReaction[] = []

  links.forEach((mention) => {
    const { data, activity } = mention
    let { author, content, url, published, published_ts } = data
    const { name } = author
    // Ignore webmentions and promo from myself
    if (name === 'Jen Chan') return

    switch (activity.type) {
      case 'like':
      case 'bookmark':
        likes.push({
          author,
          url,
        })
        break
      case 'repost':
        reposts.push({
          url,
          author,
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
          published_ts,
        })
        break
      case 'mention':
        mentions.push({
          author,
          content,
          url,
          published,
          published_ts,
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

export default getWebMentionsPerPost
