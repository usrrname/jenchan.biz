import Comment from './Comment'
import WebMentionAvatar from './WebMentionAvatar'
type MentionsProps = {
  title: string
  data: WebMentionReply[] | WebMentionReaction[] | WebMentionComment[]
  /** URL of original post - for replies */
  url?: string
  type: 'reply' | 'mention' | 'like' | 'repost' | 'link' | 'bookmark'
}

const WebMentionAvatarRow = ({
  data,
  className
}: {
    data: WebMentionReply[] | WebMentionReaction[] | WebMentionComment[]
  className: string
}) => {
  return (
    <>
      <div className="flex flex-row space-x-2">
        {data?.map((child, index) => (
          <span className={`${className} my-0`} key={index}>
            <WebMentionAvatar
              url={child?.url}
              author={child?.author}
            />
          </span>
        ))}
      </div>
    </>
  )
}

const WebMentions = ({ data, url, type, title }: MentionsProps) => {

  const computedClass = (type: string) => {
    switch (type) {
      case 'mention':
        return 'mention-of'
      case 'reply':
        return 'in-reply-to'
      case 'repost':
        return 'repost-of'
      case 'like':
        return 'like-of'
      case 'link':
        return 'link-of'
      case 'bookmark':
        return 'bookmark-of'
      default:
        return ''
    }
  }

  return (
    <>
      <section className="flex w-auto flex-col gap-y-3">
        <p className="!my-2 text-left font-bold">{title}</p>
        {/* Likes and Reposts */}
        {['like', 'repost', 'bookmark'].includes(type) && (
          <WebMentionAvatarRow data={data} className={computedClass(type)} />
        )}

        {/* // Replies and Mentions */}
        {data?.map((child, index) => (
          <>
            {['reply', 'mention', 'link'].includes(type) && child?.published && (
              <Comment
                child={{ ...child, source: child.source?.toString() }}
                url={url}
                type={type as 'reply' | 'mention' | 'link'}
                key={`${child.name}-${index}`}
                className={computedClass(type)}
              />
            )}
          </>
        ))}
      </section>
    </>
  )
}
export default WebMentions
