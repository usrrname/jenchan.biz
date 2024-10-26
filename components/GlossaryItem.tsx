import type { GlossaryDefinition } from 'contentlayer/generated'
import { CoreContent } from 'pliny/utils/contentlayer'
import { ReactNode } from 'react'

interface LayoutProps {
    content: CoreContent<GlossaryDefinition>
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
    const { title, body } = content

    return (
        <article>
            <div className="space-y-1 -pl-4 border-l border-solid dark:border-l-gray-400">
                <details className="prose max-w-none first:pt-0 last:pb-0 py-4 dark:prose-invert hover:cursor-pointer">
                    <summary className="text-md">{title}</summary>
                    <div className="pl-5 mt-2" dangerouslySetInnerHTML={{ __html: body.raw }} />
                </details>
            </div>
        </article>
    )
}
