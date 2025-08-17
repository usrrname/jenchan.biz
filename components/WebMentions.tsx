import Image from 'next/image'
import NextLink from 'next/link'
import Comment from './Comment'
type MentionsProps = {
  title: string
  data: WebMentionReplies[] | WebMentionReaction[] | WebMentionPost[]
  /** URL of original post - for replies */
  url?: string
  type: 'reply' | 'mention' | 'like' | 'repost' | 'link'
}

const WebMentionAvatarRow = ({
  data,
  className
}: {
  data: WebMentionReplies[] | WebMentionReaction[] | WebMentionPost[]
  className: string
}) => {
  return (
    <>
      <div className="flex flex-row items-start space-x-2">
        {data?.map((child, index) => (
          <span key={index}>
            {/* Likes and Reposts */}
            <div className={`${className}`}>
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
          </span>
        ))}
      </div>
    </>
  )
}

const WebMentions = ({ data, url, type, title }: MentionsProps) => {
  const isReply = type === 'reply'
  const isMention = type === 'mention'
  const isLike = type === 'like'
  const isRepost = type === 'repost'
  const isLink = type === 'link'

  const computedClass = isReply
    ? `in-reply-to`
    : isRepost
      ? `repost-of`
      : isLike
        ? `like-of`
        : isLink
          ? 'link-of'
          : ''

  return (
    <>
      <section className="w-auto">
        <p className="my-0 text-left font-bold">{title}</p>
        {/* Likes and Reposts */}
        {(isLike || isRepost) && (
          <WebMentionAvatarRow data={data} className={computedClass} />
        )}

        {/* // Replies and Mentions */}
        {data?.map((child, index) => (
          <div key={index} className={`flex flex-col ${computedClass}`}>
            {(isReply || isMention) && child?.published && (
              <Comment
                child={child}
                url={url}
                type={isReply ? 'reply' : 'mention'}
              />
            )}
          </div>
        ))}
      </section>
    </>
  )
}
export default WebMentions
