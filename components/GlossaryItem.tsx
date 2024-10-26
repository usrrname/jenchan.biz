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
            <div className="space-y-1 pb-10 dark:border-gray-700">
                <div className="pt-10">
                    <details className="prose max-w-none py-4 dark:prose-invert hover:cursor-pointer">
                        <summary className="text-md">{title}</summary>
                        <div className="mt-2" dangerouslySetInnerHTML={{ __html: body.raw }} />
                    </details>
                </div>
            </div>
        </article>
    )
}
