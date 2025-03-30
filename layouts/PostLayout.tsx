import Image from '@/components/Image'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import findDevToArticleByCanonicalUrl from 'app/api/findArticleByCanonicalUrl'
import type { Authors, Blog } from 'contentlayer/generated'
import TOCInline from 'pliny/ui/TOCInline'
import { CoreContent } from 'pliny/utils/contentlayer'
import { ReactNode } from 'react'

const discussOnTwitter = (slug) => {
  return `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${slug}`)}`
}
const discussOnDevTo = async (path) => {
  const result = await findDevToArticleByCanonicalUrl(
    `${path.split('blog/')[1]}`
  )
  return result?.url
}

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default async function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
}: LayoutProps) {
  const { path, date, title, tags, readingTime, toc } = content
  const basePath = path.split('/')[0]
  const devToArticle = await discussOnDevTo(path)
  const discussOnTwitterLink = discussOnTwitter(path)
  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-10 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
              <div className="flex justify-between">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(
                        siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </dl>
                <dl>
                  <dt className="sr-only">Reading Time</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    {readingTime.text}
                  </dd>
                </dl>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author, index) => (
                    <li
                      className="flex items-center space-x-2"
                      key={`${author.name}-${index}`}
                    >
                      {author!.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">
                          {author.name}
                        </dd>
                      </dl>
                    </li>
                  ))}
                  {toc && (
                    <li>
                      <span className="sr-only">Table of Contents</span>
                      <h3 className="mb-3 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Contents
                      </h3>
                      <TOCInline
                        toc={toc}
                        ulClassName="list-none list-inside"
                        liClassName="dark:text-secondary-200 text-slate-500 hover:underline hover:decoration-underline-offset-3 hover:text-slate-600 dark:hover:text-secondary-500 mb-3"
                        asDisclosure={false}
                        collapse={false}
                        fromHeading={1}
                        toHeading={2}
                      />
                    </li>
                  )}
                </ul>
              </dd>
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">
                {children}
              </div>
              <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">

                {devToArticle && (
                  <Link href={devToArticle} rel="nofollow" key={path}>
                    Discuss on Dev.to
                  </Link>
                )}
              </div>
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          &larr; Previous
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next &rarr;
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
