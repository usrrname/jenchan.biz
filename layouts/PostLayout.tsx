import CreativeCommonsNC from '@/components/CreativeCommonsNC'
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
  day: 'numeric'
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
  children
}: LayoutProps) {
  const { path, date, title, tags, readingTime, toc, summary } = content
  const basePath = path.split('/')[0]
  const devToArticle = await discussOnDevTo(path)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="h-entry">
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-10 text-center">
              <div className="p-name">
                <PageTitle>{title}</PageTitle>
              </div>
              <div className="p-summary hidden">{summary}</div>
              <div className="flex justify-between">
                <dl>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    <time dateTime={date} className="dt-published">
                      {new Date(date).toLocaleDateString(
                        siteMetadata.locale,
                        postDateTemplate
                      )}
                    </time>
                  </dd>
                </dl>
                <dl>
                  <dt className="sr-only">Reading Time</dt>
                  <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                    {readingTime.text}
                  </dd>
                </dl>
              </div>
            </div>
            <a
              className="u-bridgy-fed"
              href="https://fed.brid.gy/"
              hidden={true}
            >
              Bridgy
            </a>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700">
            <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Author</dt>
              <dd>
                <ul className="p-author h-cardflex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author) => (
                    <li
                      className="flex items-center space-x-2"
                      key={author.name}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <dl className="text-sm leading-5 font-medium whitespace-nowrap">
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
                      <h3 className="mb-3 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                        Contents
                      </h3>
                      <TOCInline
                        toc={toc}
                        ulClassName="list-none list-inside"
                        liClassName="rave:text-blueberry dark:text-secondary-500 text-secondary-500 hover:underline hover:decoration-underline-offset-3 hover:text-secondary-600 dark:hover:text-secondary-600 mb-3"
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
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert e-content max-w-none pt-10 pb-8">
                {children}
              </div>
              <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                {devToArticle && (
                  <Link
                    href={devToArticle}
                    rel="nofollow"
                    key={path}
                    className="u-syndication"
                  >
                    Discuss on Dev.to
                  </Link>
                )}
              </div>
            </div>
            <footer>
              <div className="divide-gray-200 text-sm leading-5 font-medium xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="p-category flex flex-wrap">
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
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
                          &larr; Previous
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
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
              <CreativeCommonsNC />
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
