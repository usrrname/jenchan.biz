import { contributionsData, getGithubData, ossData } from '@/app/api/getGithubData'
import ForkIcon from '@/components/icons'
import { genPageMetadata } from 'app/seo'
import Link from 'next/link'

export const metadata = genPageMetadata({ title: 'Projects' })

export default async function Projects() {
    const projectData = await getGithubData(ossData)
    const contributions = await getGithubData(contributionsData)
    return (
        <>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <h1 className="font-headings text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
                        Open Source
                    </h1>
                    <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
                        Projects I maintain or contributed to.
                        <br />
                    </p>
                </div>
                <div className="container py-12 px-4 flex flex-col gap-4 sm:flex-row">
                    <div className="flex flex-col border-gray-200 dark:border-gray-700 pb-4 gap-4">
                        <p className="text-lg leading-7 text-neutral-500 dark:text-gray-400">
                            Maintaining
                        </p>
                        {projectData.map((d) => (
                            <div key={d.title}>
                                <Link href={d.href || ''} className="text-lg leading-7 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                    <p className="text-lg leading-7 text-blue-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                        {d.title}
                                    </p>
                                </Link>
                                <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                                    {d.description}
                                </p>
                                <div className="flex flex-row gap-2 items-center">

                                    {d.stars > 0 && (
                                        <span className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                                            {d.stars} ⭐️
                                        </span>
                                    )}

                                    {d.forks > 0 && (
                                        <span className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                                            {d.forks} <ForkIcon className="w-4 h-4 inline-block" />
                                        </span>
                                    )}
                                    {d.watchers > 0 && (
                                        <span className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                                            {d.watchers} 👀
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-4 border-gray-200 dark:border-gray-700 pb-4">
                        <p className="text-lg leading-7 text-neutral-500 dark:text-gray-400">
                            Contributions
                        </p>
                        {contributions.map((d) => (
                            <div key={d.title}>
                                <Link href={d.href || ''} className="text-lg leading-7 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                    <p className="text-lg leading-7 text-blue-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                        {d.title}
                                    </p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </>
    )
}
