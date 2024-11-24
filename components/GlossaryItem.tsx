import type { GlossaryDefinition } from 'contentlayer/generated'
import { ReactNode } from 'react'

interface LayoutProps {
  content: GlossaryDefinition
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function GlossaryItem({
  content,
  next,
  prev,
  children,
}: LayoutProps) {
  const { title, body, slug } = content

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
  }

  return (
    <article>
      <div className="-pl-4 space-y-1 border-l border-solid dark:border-l-gray-400">
        <details className="prose max-w-none py-4 dark:prose-invert first:pt-0 last:pb-0 hover:cursor-pointer">
          <summary className="text-md">{title}</summary>
          <div
            className="mt-2 pl-5"
            dangerouslySetInnerHTML={{ __html: body.raw }}
          />
        </details>
      </div>
    </article>
  )
}
