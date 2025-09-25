import Image from 'next/image'
import NextLink from 'next/link'
// @ts-nocheck
type CommentProps = {
  /** URL of original post - for replies */
  url?: string
  child: WebMentionReplies | WebMentionReaction
  type: 'reply' | 'mention' | 'link'
}

const Comment = ({ child, type }: CommentProps) => {
  return (
    <div className="h-cite flex flex-row gap-x-3">
      <div className="flex w-[98px] flex-col items-center gap-y-2">
        <NextLink href={child?.url} target="_blank" className={`h-card u-url`}>
          <Image
            src={child?.author?.photo}
            alt={child?.author?.name}
            width={48}
            height={48}
            className="!mb-0 rounded-full"
          />
          <NextLink
            className="p-author text-sm text-gray-500 dark:text-gray-400"
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
              <time
                dateTime={new Date(child.published_ts).toLocaleDateString()}
              />
            </span>
          )}
        </div>
        {/* @ts-ignore */}
        {['reply', 'mention', 'link'].includes(type) && child?.content && (
          <div className="u-syndication p-content max-w-full text-gray-500 italic dark:text-gray-400">
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
