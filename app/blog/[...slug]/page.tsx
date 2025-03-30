import { components } from '@/components/MDXComponents'
import WebMentions from '@/components/WebMentions'
import siteMetadata from '@/data/siteMetadata'
import PostBanner from '@/layouts/PostBanner'
import PostLayout from '@/layouts/PostLayout'
import PostSimple from '@/layouts/PostSimple'
import findDevToArticleByCanonicalUrl from 'app/api/findArticleByCanonicalUrl'
import getWebMentionsPerPost, {
  parseWebMentionResults,
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
  sortPosts,
} from 'pliny/utils/contentlayer'

export const dynamic = 'force-static'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
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

async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<BlogPostProps | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = allBlogs.find((p) => p.slug === slug) as Blog

  // Filter out drafts in production
  const sortedCoreContents = allCoreContent(sortPosts(allBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (!post || postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]

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

  const devToArticle = await findDevToArticleByCanonicalUrl(post?.slug)
  if (!devToArticle) {
    const webmentionsForPost = await getWebMentionsPerPost(post)
    const results = parseWebMentionResults(webmentionsForPost)

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
      layout: post.layout || defaultLayout,
      post: post,
      mainContent,
      jsonLd,
      authorDetails,
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
      webmentions: results,
      article: devToArticle,
      prev: prev,
      next: next,
    }
  }

  // Add return for devToArticle case
  return {
    title: post.title,
    description: post.summary,
    layout: post.layout || defaultLayout,
    post: post,
    mainContent,
    jsonLd,
    authorDetails,
    prev: prev,
    next: next,
    article: devToArticle,
    webmentions: undefined
  }
}

async function generateStaticParams() {
  return allBlogs.map((p) => ({
    slug: p.slug.split('/').map((name) => decodeURI(name)),
  }))
}

export default async function Page(props: {
  params: Promise<{ slug: string[] }>
}) {
  const metadata = await generateMetadata(await props)
  if (!metadata) {
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
    webmentions,
  } = metadata

  let articleUrl: string | undefined = undefined
  if (article) articleUrl = article?.url

  const Layout = layouts[
    post.layout || defaultLayout
  ] as React.ComponentType<any>

  const { likes, mentions, replies, reposts } = webmentions || {}

  return (
    <>
      <meta name="og:author" content={siteMetadata.author} />
      <meta name="og:type" content="article" />
      <meta name="og:title" content={post?.title} />
      <meta name="og:description" content={post?.summary} />
      <meta name="og:published_at" content={post?.date} />
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
          readingTime={post.readingTime}
        />
        <hr className="my-4" />
        {article && (
          <>
            {article.comments_count > 0 ? (
              <>
                <NextLink
                  href={articleUrl!}
                  className="font-bold no-underline hover:bg-yellow-200 "
                >
                  📝 {article.comments_count} comments
                </NextLink>
                {`  •  `}
              </>
            ) : (
              void 0
            )}
            {article.public_reaction_count > 0 ? (
              <NextLink
                href={articleUrl!}
                className="font-bold no-underline hover:bg-yellow-200"
              >
                💖🔥🦄 {article.public_reaction_count} reactions
              </NextLink>
            ) : null}
            &nbsp;on{' '}
            <NextLink href={articleUrl!} className="no-underline">
              Dev.to
            </NextLink>
          </>
        )}
        {likes && <WebMentions data={likes} title="Likes" />}
        {reposts && <WebMentions data={reposts} title="Reposts" />}
        {mentions && <WebMentions data={mentions} title="Mentions" />}
        {replies && <WebMentions data={replies} title="Replies" />}
      </Layout>
    </>
  )
}
