import Image from 'next/image'
import NextLink from 'next/link'
type MentionsProps = {
  title: string
  data: WebMentionReplies[] | WebMentionReaction[]
}

const WebMentions = ({ title, data }: MentionsProps) => {
  const isReply = title === 'Replies'
  const isMention = title === 'Mentions'
  const isLike = title === 'Likes'
  const isRepost = title === 'Reposts'

  const computedClass = isReply
    ? `in-reply-to`
    : isRepost
      ? `repost-of`
      : isLike
        ? `like-of`
        : ''

  return (
    <>
      <section className="w-auto">
        {data?.map((child, index) => (
          <>
            {/* Likes and Reposts */}
            <div className={computedClass}>
              <span className="text-left font-bold">{title}</span>

              <div className="space-x-2">
                <NextLink
                  href={child?.url}
                  target="_blank"
                  className="h-card u-url"
                >
                  <Image
                    src={child?.author?.photo}
                    alt={child?.author?.name}
                    className="h-12 w-12 rounded-full"
                  />
                </NextLink>
              </div>
            </div>
            {/* // Replies and Mentions */}
            <div className="flex flex-col space-y-2">
              {(title === 'Replies' || 'Mentions') && child?.published && (
                <div className="h-cite flex flex-row">
                  <div className="items-center space-x-2">
                    <NextLink
                      href={child?.url}
                      target="_blank"
                      className="h-card u-url"
                    >
                      <Image
                        src={child?.author?.photo}
                        alt={child?.author?.name}
                        className="h-12 w-12 rounded-full"
                      />
                    </NextLink>
                  </div>
                  <NextLink
                    className="p-author h-card text-sm text-gray-500 dark:text-gray-400"
                    href={child?.author.url}
                  >
                    {child?.author.name}
                  </NextLink>
                  <span className="dt-published text-sm text-gray-500 dark:text-gray-400">
                    <time dateTime={child?.published_ts} />
                  </span>
                  <div className="prose p-content max-w-full text-gray-500 italic dark:text-gray-400">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: child?.content
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </>
        ))}
      </section>
    </>
  )
}

export default WebMentions
