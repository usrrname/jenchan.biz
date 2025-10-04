import { formatWebmentionDate } from '@/app/utils/formatWebmentionDate'
import WebMentionAvatar from './WebMentionAvatar'
// @ts-nocheck
type CommentProps = {
  /** URL of original post - for replies */
  url?: string
  child: WebMentionReply | WebMentionComment
  type: 'reply' | 'mention' | 'link'
  className: string
}

const Comment = ({ child, type, className }: CommentProps) => {

  const dateToFormat = child.published || child.published_ts || child.verified_date;
  const publishedDate = dateToFormat ? formatWebmentionDate(dateToFormat) : undefined;

  return (
    <div className={`h-cite flex flex-row gap-x-3 items-start ${className}`}>

      <WebMentionAvatar url={child?.url?.toString()} author={child?.author} withName={true} />

      <div className="flex flex-col">

        {publishedDate && (
          <time
            className="dt-published text-sm text-gray-500 dark:text-gray-400 raver:watermelon"
            dateTime={publishedDate}
          >
            {publishedDate}
          </time>
        )}

        {/* @ts-ignore */}
        {['reply', 'mention', 'link'].includes(type) && child?.content && (
          <div className="u-syndication p-content max-w-full text-gray-500 italic dark:text-gray-400 raver:watermelon">
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
