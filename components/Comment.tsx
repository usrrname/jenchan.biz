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
      <div className="flex flex-col items-start gap-y-2">
        <NextLink href={child?.url} target="_blank" className={`h-card u-url`}>
          <Image
            src={child?.author?.photo}
            alt={child?.author?.name}
            width={32}
            height={32}
            className="my-0 h-8 w-8 rounded-full"
          />
          <NextLink
            className="p-author h-card text-sm text-gray-500 dark:text-gray-400"
            href={child?.source?.toString() ?? ''}
          >
            {child?.author.name}
          </NextLink>
        </NextLink>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row">
          {child?.published_ts && (
            <span className="dt-published text-sm text-gray-500 dark:text-gray-400">
              <time dateTime={new Date(child.published_ts).toISOString()} />
            </span>
          )}
        </div>
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
    </div>
  )
}

export default Comment
