import { components } from '@/components/MDXComponents'
import WebMentions from '@/components/WebMentions'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import findDevToArticleByCanonicalUrl from 'app/api/findArticleByCanonicalUrl'
import getWebMentionsPerPost, {
  parseWebMentionResults
} from 'app/api/getWebMentionsPerPost'
import type { Authors, Blog } from 'contentlayer/generated'
import { allAuthors, allBlogs } from 'contentlayer/generated'
import 'css/prism.css'
import 'katex/dist/katex.css'
import { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import {
  CoreContent,
  allCoreContent,
  coreContent,
  sortPosts
} from 'pliny/utils/contentlayer'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner
}

interface BlogPostProps extends Metadata {
  post: Blog
  layout: string
  mainContent: CoreContent<Blog>
  jsonLd: JSON
  prev: CoreContent<Blog>
  next: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  webmentions:
    | {
        likes: WebMentionReaction[]
        mentions: WebMentionReplies[]
        replies: WebMentionReplies[]
        reposts: WebMentionReaction[]
      }
    | undefined
  article?: DevToArticleStats
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug)

  if (!post) {
    return {}
  }

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })
  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img
    }
  })

  return {
    title: post.title,
    description: post.summary,
    authors: authors.map((author) => ({ name: author })),
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: `${siteMetadata.siteUrl}/blog/${slug}`,
      images: ogImages,
      authors: authors
    },
    alternates: {
      canonical: `${siteMetadata.siteUrl}/blog/${slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList
    }
  }
}

async function getBlogPostData(
  slug: string
): Promise<BlogPostProps | undefined> {
  const post = allBlogs.find((p) => p.slug === slug) as Blog

  if (!post) {
    return undefined
  }

  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]

  const authorList = post?.authors || ['default']
  const authorDetails = authorList.map((author) => {
    const authorResults = allAuthors.find((p) => p.slug === author)
    return coreContent(authorResults as Authors)
  })

  const mainContent = coreContent(post)
  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => ({
    '@type': 'Person',
    name: author.name
  }))

  const devToArticle = await findDevToArticleByCanonicalUrl(post?.slug)
  const webmentionsForPost = await getWebMentionsPerPost(post)
  const results = webmentionsForPost
    ? parseWebMentionResults(webmentionsForPost)
    : undefined

  return {
    layout: post.layout || defaultLayout,
    post,
    mainContent,
    jsonLd,
    authorDetails,
    webmentions: results,
    article: devToArticle,
    prev,
    next
  }
}

export async function generateStaticParams() {
  return allBlogs.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name))
  }))
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>
}) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const postData = await getBlogPostData(slug)

  if (!postData) {
    return notFound()
  }

  const {
    post,
    mainContent,
    prev,
    next,
    article,
    jsonLd,
    authorDetails,
    webmentions
  } = postData

  let articleUrl: string | undefined = undefined
  if (article) articleUrl = article?.url

  const Layout = layouts[
    post.layout || defaultLayout
  ] as React.ComponentType<any>

  const { likes, mentions, replies, reposts } = webmentions || {}

  // Safely handle jsonLd
  const safeJsonLd = jsonLd ? JSON.stringify(jsonLd) : '{}'

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd }}
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
          readingTime={post.readingTime}
        />
        <hr className="my-4" />
        {article && (
          <>
            {article.comments_count && article.comments_count > 0 && (
              <>
                <NextLink
                  href={articleUrl!}
                  className="font-bold no-underline hover:bg-yellow-200"
                >
                  📝 {article.comments_count} comments
                </NextLink>
                {`  •  `}
              </>
            )}
            {article.public_reactions_count &&
              article.public_reactions_count > 0 && (
                <NextLink
                  href={articleUrl!}
                  rel="syndication"
                  data-webmention-target={`${siteMetadata.siteUrl}/blog/${post.slug}`}
                  className="font-bold no-underline hover:bg-yellow-200"
                >
                  💖🔥🦄 {article.public_reactions_count}&nbsp;
                  {article.public_reactions_count === 1
                    ? 'reaction'
                    : 'reactions'}
                </NextLink>
              )}
            &nbsp;on&nbsp;
            <NextLink
              href={articleUrl!}
              className="u-syndication no-underline"
              data-webmention-target={`${siteMetadata.siteUrl}/blog/${post.slug}`}
            >
              Dev.to
            </NextLink>
          </>
        )}
        <div className="mt-3 space-y-2">
          {likes && likes.length > 0 && (
            <WebMentions data={likes} title="Likes" type="like" />
          )}
          {reposts && reposts.length > 0 && (
            <WebMentions data={reposts} title="Reposts" type="repost" />
          )}
          {mentions && mentions.length > 0 && (
            <WebMentions data={mentions} title="Mentions" type="mention" />
          )}
          {replies && replies.length > 0 && (
            <WebMentions data={replies} title="Replies" type="reply" />
          )}
        </div>
      </Layout>
    </>
  )
}
