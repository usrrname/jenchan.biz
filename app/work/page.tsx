import Card from '@/components/Card'
import { shantell_sans } from '@/css/fonts'
import projectsData from '@/data/projectsData'
import { genPageMetadata } from 'app/seo'
import React from 'react'

export const metadata = genPageMetadata({ title: 'Work' })

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1
            className={`${shantell_sans.variable} text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14`}
          >
            Work
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Stuff I worked on that's now on the internet.
            <br />
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
                meta={d?.meta}
                company={d?.company}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
