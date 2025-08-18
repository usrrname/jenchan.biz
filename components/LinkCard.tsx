import Image from 'next/image'
import React from 'react'
interface LinkCardProps {
  author?: string
  title: string
  image: string
  description: string
  date?: string
  url: string
}

const LinkCard: React.FC<LinkCardProps> = ({
  author,
  title,
  image,
  description,
  date,
  url
}) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="!text-decoration-none inline-block overflow-hidden rounded-lg shadow-md transition-shadow duration-200 ease-in-out hover:shadow-lg"
    >
      {image && (
        <Image
          src={image}
          className="!m-0 h-48 w-full object-cover"
          loading="lazy"
          alt={`${title}`}
        />
      )}
      <div className="p-4">
        <p className="text-lg font-semibold">{title}</p>
        {author && <p className="mb-2 text-sm text-gray-600">{author}</p>}
        <p className="mb-2 text-sm text-gray-600">{description}</p>
        {date && <p className="text-xs text-gray-500">{date}</p>}
      </div>
    </a>
  )
}

export default LinkCard
