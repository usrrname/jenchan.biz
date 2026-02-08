import getGithubData, {
  contributionsData,
  ossData
} from '@/app/lib/getGithubData'
import { validateUrl } from '@/app/lib/urlValidation'
import { ForkIcon } from '@/components/icons'
import { genPageMetadata } from 'app/seo'
import Link from 'next/link'
export const metadata = genPageMetadata({ title: 'Projects' })

// Only allow github.com and https protocol for outbound links.
function getSafeHref(href: string | undefined, allowedDomains: string[]): string | undefined {
  if (!href) return undefined;
  try {
    validateUrl(href, allowedDomains);
    if (allowedDomains.includes(href) && href.startsWith('https://')) {
      return href;
    }
  } catch {
    // fall through
  }
  return undefined;
}

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
        <div className="container flex flex-col justify-between gap-6 py-12 sm:flex-row">
          <div className="flex flex-col gap-4 border-gray-200 pb-4 dark:border-gray-700">
            <p className="text-lg leading-7 text-neutral-500 dark:text-gray-400">
              Maintaining
            </p>
            {projectData.map((d) => (
              <div key={d.title}>
                {getSafeHref(d.href, ['github.com']) ? (
                  <Link
                    href={new URL(getSafeHref(d.href, ['github.com']) ?? '')}
                    className="text-lg leading-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <p className="text-lg leading-7 text-blue-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      {d.title}
                    </p>
                  </Link>
                ) : (
                  <p className="text-lg leading-7 text-blue-800 dark:text-gray-400">
                    {d.title}
                  </p>
                )}
                <p className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {d.description}
                </p>
                <div className="flex flex-row items-center gap-2">
                  {d?.stars && d?.stars > 0 && (
                    <span className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {d.stars} ⭐️
                    </span>
                  )}

                  {d?.forks && d?.forks > 0 && (
                    <span className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {d.forks} <ForkIcon className="inline-block h-4 w-4" />
                    </span>
                  )}
                  {d?.watchers && d?.watchers > 0 && (
                    <span className="text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {d.watchers} 👀
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 border-gray-200 pb-4 dark:border-gray-700">
            <p className="text-lg leading-7 text-neutral-500 dark:text-gray-400">
              Contributions
            </p>
            {contributions.map((d) => (
              <div key={d?.title}>
                {getSafeHref(d.href, ['github.com']) ? (
                  <Link
                    href={new URL(getSafeHref(d.href, ['github.com']) ?? '')}
                    className="text-lg leading-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <p className="text-lg leading-7 text-blue-800 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      {d.title}
                    </p>
                  </Link>
                ) : (
                  <p className="text-lg leading-7 text-blue-800 dark:text-gray-400">
                    {d.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
