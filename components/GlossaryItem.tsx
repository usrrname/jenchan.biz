import type { GlossaryDefinition } from 'contentlayer/generated'
import React, { ReactNode } from 'react'

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

    return (
        <article>
            <div className="-pl-4 space-y-1 border-l border-solid dark:border-l-gray-400">

                <details className="prose max-w-none py-4 dark:prose-invert first:pt-0 last:pb-0 hover:cursor-pointer">

                    <summary className="text-md text-gray-600 dark:text-gray-400 text-decoration-none z-1">{title}</summary>

                    <div className="text-sm mt-2 pb-5 pl-5 md:max-w-[768px] lg:max-w-[900px]"
                        dangerouslySetInnerHTML={{ __html: body.raw }}
                    />
                </details>
            </div>
        </article>
    )
}
