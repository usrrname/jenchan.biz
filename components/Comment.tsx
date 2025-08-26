import Image from 'next/image'
import NextLink from 'next/link'
// @ts-nocheck
type CommentProps = {
  /** URL of original post - for replies */
  url?: string
  child: WebMentionReplies | WebMentionReaction
  type: 'reply' | 'mention'
}

const Comment = ({ child, type }: CommentProps) => {
  return (
    <div className="h-cite flex flex-row">
      <div className="items-center space-x-2">
        <NextLink href={child?.url} target="_blank" className={`h-card u-url`}>
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
      {child?.published_ts && (
        <span className="dt-published text-sm text-gray-500 dark:text-gray-400">
          <time dateTime={child.published_ts.toString()} />
        </span>
      )}
      {/* @ts-ignore */}
      {(type === 'reply' || type === 'mention') && child?.content && (
        <div className="u-syndication prose p-content max-w-full text-gray-500 italic dark:text-gray-400">
          <div
            dangerouslySetInnerHTML={{
              /* @ts-ignore */
              __html: child.content
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Comment
