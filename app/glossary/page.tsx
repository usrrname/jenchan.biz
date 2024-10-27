import GlossaryItem from '@/components/GlossaryItem'
import { genPageMetadata } from 'app/seo'
import { allGlossaryDefinitions } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
const POSTS_PER_PAGE = 25

export const metadata = genPageMetadata({ title: 'Glossary' })

export default function Page() {
    const definitions = allCoreContent(sortPosts(allGlossaryDefinitions))
    const pageNumber = 1

    const pagination = {
        currentPage: pageNumber,
        totalPages: Math.ceil(definitions.length / POSTS_PER_PAGE),
    }

    const sortedDefinitions = allGlossaryDefinitions.sort((a, b) => a.title.localeCompare(b.title))
    return (
        <div>
            <p className='my-6'>In my time across many dysfunctional setups, I've come up with the following terms to humor myself when things are inefficient or hard to figure out.</p>

            {sortedDefinitions.map((definition, index) => (
                <div className="border-l-gray-200" key={index}>
                    <GlossaryItem content={definition} key={definition.path} >
                        {definition.summary}
                    </GlossaryItem>
                </div>
            ))
            }
        </div >
    )
}
