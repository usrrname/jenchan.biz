import dotenv from 'dotenv'
type Project = {
  title: string
  description: string
  href: string
  stars?: number
  organization?: string
  forks?: number
  watchers?: number
}
dotenv.config()
export const contributionsData: Project[] = [
  {
    title: 'calcom/cal.com',
    description: '',
    href: 'https://github.com/calcom/cal.com/pull/21065'
  },
  {
    title: 'devcycle/devcycle-docs',
    description: '',
    href: 'https://github.com/DevCycleHQ/devcycle-docs/pulls?q=is%3Apr+author%3Ausrrname+is%3Aclosed'
  },
  {
    title: 'rangle/radius',
    description: '',
    organization: 'rangle',
    href: 'https://github.com/rangle/radius/issues?q=is%3Aissue%20state%3Aclosed%20author%3Ausrrname'
  },
  {
    title: 'rangle/radius-workspace',
    description: '',
    href: 'https://github.com/rangle/radius-workspace/pulls?q=is%3Apr+author%3Ausrrname+is%3Aclosed'
  },
  {
    title: 'storybookjs/storybook',
    description: '',
    href: 'https://github.com/storybookjs/storybook/pulls?q=is%3Apr+is%3Aclosed+author%3Ausrrname'
  },
  {
    title: 'cloudflare/cloudflare-docs',
    description: '',
    href: 'https://github.com/cloudflare/cloudflare-docs/issues/15718'
  },
  {
    title: 'microsoft/fast',
    description: '',
    href: 'https://github.com/microsoft/fast/issues?q=is%3Aissue%20state%3Aclosed%20author%3Ausrrname'
  }
]

export const ossData: Project[] = [
  {
    title: '@usrrname/cursorrules',
    description: '',
    href: 'https://github.com/usrrname/cursorrules'
  },
  {
    title: '@curveball/a12n-server',
    description: 'A lightweight OAuth2.0 compliant authentication server',
    organization: 'curveball',
    href: 'https://github.com/curveball/a12n-server'
  },
  {
    title: '@curveball/next-a12n',
    description: '',
    organization: 'curveball',
    href: 'https://github.com/curveball/next-a12n'
  },
  {
    title: '@curveball/a12n-server-admin',
    organization: 'curveball',
    description: '',
    href: 'https://github.com/curveball/a12n-server-admin'
  }
]

export async function getGithubData(data: Project[]) {
  'use server'
  // Filter only projects with a GitHub href
  const githubProjects = data.filter((p) =>
    p.href?.startsWith('https://github.com/')
  )

  // Map to fetch star counts
  const results = await Promise.all(
    githubProjects.map(async (project) => {
      try {
        // Extract owner/repo from URL
        const match = project.href!.match(/github\.com\/([^/]+)\/([^/]+)/)
        if (!match) return { ...project, stars: null }
        const [, owner, repo] = match

        // Fetch repo data from GitHub API
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          {
            headers: {
              Accept: 'application/vnd.github.v3+json',
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
            },
            next: { revalidate: 3600 } // cache for 1 hour
          }
        )

        if (!res.ok) throw new Error('Failed to fetch')
        console.log(`res:`, res)
        const data = await res.json()
        console.log(`data:`, data)
        return {
          ...project,
          // @ts-ignore
          description: data?.description || '',
          // @ts-ignore
          stars: data?.stargazers_count || 0,
          // @ts-ignore
          forks: data?.forks_count || 0,
          // @ts-ignore
          watchers: data?.watchers_count || 0
        }
      } catch {
        return { ...project, stars: null }
      }
    })
  )

  return [...results]
}
