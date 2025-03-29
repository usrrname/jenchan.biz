import React from 'react'
import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href, meta, company }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${imgSrc && 'h-full'} overflow-hidden rounded-md border-2 border-gray-300 border-opacity-60 dark:border-gray-700`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-60"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-60"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        {company && (
          <p className="font-small text-gray-500 dark:text-gray-400">
            {company}
          </p>
        )}
        <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">
          {description}
        </p>
        {href && (
          <Link
            href={href}
            className="hover:text-underline mb-3 text-base font-medium leading-6 text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label={`Link to ${title}`}
          >
            Learn more &rarr;
          </Link>
        )}

        {meta && meta?.links?.length > 0 ? (
          <h3 className="font-medium">{meta.title}</h3>
        ) : null}
        {meta?.links?.map(
          (p: { title: string; href: string }, index: number) => (
            <span key={p.title + index}>
              <Link
                href={p.href}
                className="hover:semibold prose font-medium leading-6 text-orange-400 hover:text-orange-600 hover:underline dark:hover:text-orange-300"
                aria-label={`Link to ${p.title}`}
              >
                {p.title}
              </Link>{' '}
              {index < meta.links.length - 1 && '•'}{' '}
            </span>
          )
        )}
      </div>
    </div>
  </div>
)

export default Card
