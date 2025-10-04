import Image from 'next/image'
import NextLink from 'next/link'

type WebMentionAvatarProps = {
    url?: URL | string
    author: {
        photo: string
        name: string
        url: URL | string
    }
    className?: string
    withName?: boolean
}

const WebMentionAvatar = ({ url, author, className = '', withName = false }: WebMentionAvatarProps) => {
    return (
        <NextLink
            href={url || ''}
            target="_blank"
            className={`h-card u-url ${className}`}
        >
            <Image
                src={author.photo}
                alt={author.name}
                className="!my-0 h-12 w-12 rounded-full"
                width={48}
                height={48}
            />

            {withName && (
                <NextLink
                    className="mt-2 p-author text-sm text-gray-500 dark:text-gray-400"
                    href={author?.url?.toString() ?? ''}
                >
                    {author.name}
                </NextLink>
            )}
        </NextLink>
    )
}

export default WebMentionAvatar
