import Image from 'next/image'
import NextLink from 'next/link'
import Comment from './Comment'
type MentionsProps = {
  title: string
  data: WebMentionReplies[] | WebMentionReaction[]
  /** URL of original post - for replies */
  url?: string
}

const WebMentions = ({ title, data, url }: MentionsProps) => {
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
              {(isReply || isMention) && child?.published && (
                <Comment
                  child={child}
                  url={url}
                  type={isReply ? 'reply' : 'mention'}
                />
              )}
            </div>
          </>
        ))}
      </section>
    </>
  )
}

export default WebMentions
