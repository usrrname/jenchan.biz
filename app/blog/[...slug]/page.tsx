import { components } from '@/components/MDXComponents'
import WebMentions from '@/components/WebMentions'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import getDevToPublishedArticles from 'app/api/devToPosts'
import type { Authors, Blog } from 'contentlayer/generated'
import { allAuthors, allBlogs } from 'contentlayer/generated'
import 'css/prism.css'
import 'katex/dist/katex.css'
import { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import {
  allCoreContent,
  coreContent,
  sortPosts,
} from 'pliny/utils/contentlayer'
const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

async function getWebMentionsPerPost(post: Blog) {
  const url = siteMetadata.siteUrl
  const res = await fetch(
    `https://webmention.io/api/mentions?per-page=200&target=${url}/blog/${post.slug}`,
    {
      next: { revalidate: 3600 * 24 }, // revalidate once a day
    }
  )
  return res.json()
}

const parseWebMentionResults = (results: WebMentionPostResponse) => {
  const { links } = results

  if (!links.length) return

  const mentions: WebMentionReplies[] = []
  const replies: WebMentionReplies[] = []
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

  return { likes, mentions, replies, reposts }
}

type DevToArticleStats = {
  id: number;
  path: string;
  url: string;
  positive_reaction_count: number;
  public_reaction_count: number;
  comments_count: number;
};

async function findDevToArticleByCanonicalUrl(slug: string): Promise<DevToArticleStats | undefined> {
  'use server'

  const collection = new Set()

  await getDevToPublishedArticles().then((data) => {

    data.find((article) => {
      if (article.canonical_url.includes(slug)) {
        collection.add({
          id: article.id,
          path: article.path,
          url: article.url,
          positive_reaction_count: article.positive_reaction_count,
          public_reaction_count: article.public_reactions_count,
          comments_count: article.comments_count,
        })
      }
    })
  })
  return [...collection][0] as DevToArticleStats
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  if (!post) {
    return
  }

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const generateStaticParams = async () => {
  const paths = allBlogs.map((p: Blog) => ({ slug: p.slug.split('/') }))
  return paths
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const post = allBlogs.find((p) => p.slug === slug) as Blog

  const devToArticle = await findDevToArticleByCanonicalUrl(post.slug)

  const webmentionsForPost = await getWebMentionsPerPost(post)
  const results = parseWebMentionResults(webmentionsForPost)
  const { likes, mentions, replies, reposts } = results || {}

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  const Layout = layouts[post.layout || defaultLayout]

  return (
    <>
      <meta name="og:published_at" content={post.date} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={mainContent}
        authorDetails={authorDetails}
        next={next}
        prev={prev}
      >
        <MDXLayoutRenderer
          code={post.body.code}
          components={components}
          toc={post.toc}
        />

        {devToArticle && (<>
          {devToArticle.comments_count > 0 ? (<span className="font-semibold">📝&nbsp;&nbsp;{devToArticle.comments_count} comments&nbsp;&nbsp;•&nbsp;&nbsp;</span>) : null}
          {devToArticle.positive_reaction_count > 0 ? (<span className="font-semibold ">💖🔥🦄 {devToArticle.positive_reaction_count}&nbsp;&nbsp;•&nbsp;&nbsp;</span>) : null}
          {devToArticle.public_reaction_count > 0 ? (<span className="font-semibold ">{devToArticle.public_reaction_count} total reactions</span>) : null}
          &nbsp;at <NextLink href={devToArticle.url}>Dev.to</NextLink>
        </>)}
        {likes && <WebMentions data={likes} title="Likes" />}
        {reposts && <WebMentions data={reposts} title="Reposts" />}
        {mentions && <WebMentions data={mentions} title="Mentions" />}
        {replies && <WebMentions data={replies} title="Replies" />}
      </Layout>
    </>
  )
}
