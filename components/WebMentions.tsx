import NextLink from 'next/link'
type MentionsProps = {
    title: string
    data: WebMentionReplies[] | WebMentionLikes[] | WebMentionMentions[] | WebMentionReposts[]
}
const WebMentions = ({ title, data }: MentionsProps) => {

    return (
        <>
            <section className="w-auto">

                {data?.map((child, index) => (
                    <>
                        {/* Likes and Reposts */}
                        <div className="flex flex-row items-center gap-2 h-16">

                            <span className="text-left font-bold">{title}</span>

                            <div className="space-x-2">
                                <NextLink href={child?.url} target="_blank">
                                    <img
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
                                <div className="flex flex-row">
                                    <div className="items-center space-x-2">
                                        <NextLink href={child?.url} target="_blank">
                                            <img
                                                src={child?.author?.photo}
                                                alt={child?.author?.name}
                                                className="h-12 w-12 rounded-full"
                                            />
                                        </NextLink>
                                    </div>
                                    <NextLink
                                        className="text-sm text-gray-500 dark:text-gray-400"
                                        href={child?.author.url}
                                    >
                                        {child?.author.name}
                                    </NextLink>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        <time dateTime={child?.published_ts} />
                                    </span>
                                    <div className="prose max-w-full text-gray-500 dark:text-gray-400 italic">
                                        <div dangerouslySetInnerHTML={child?.content}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )
                )}
            </section >
        </>
    )
}

export default WebMentions
