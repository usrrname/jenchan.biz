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
      <div className="flex flex-row space-x-2">
        {data?.map((child, index) => (
          <span className={`${className} my-0`} key={index}>
            <NextLink
              href={child?.url}
              target="_blank"
              className="h-card u-url"
            >
              <Image
                src={child?.author?.photo}
                alt={child?.author?.name}
                className="!my-0 h-12 w-12 rounded-full"
              />
            </NextLink>
          </span>
        ))}
      </div>
    </>
  )
}

const WebMentions = ({ data, url, type, title }: MentionsProps) => {

  const computedClass = (type: string) => {
    switch (type) {
      case 'reply':
        return 'in-reply-to'
      case 'repost':
        return 'repost-of'
      case 'like':
        return 'like-of'
      case 'link':
        return 'link-of'
      default:
        return ''
    }
  }

  return (
    <>
      <section className="flex w-auto flex-col">
        <p className="!my-2 text-left font-bold">{title}</p>
        {/* Likes and Reposts */}
        {(type === 'like' || type === 'repost') && (
          <WebMentionAvatarRow data={data} className={computedClass(type)} />
        )}

        {/* // Replies and Mentions */}
        {data?.map((child, index) => (
          <div key={index} className={`${computedClass}`}>
            {(type === 'reply' || type === 'mention') && child?.published && (
              <Comment
                child={{ ...child, source: child.source?.toString() }}
                url={url}
                type={type}
              />
            )}
          </div>
        ))}
      </section>
    </>
  )
}
export default WebMentions
