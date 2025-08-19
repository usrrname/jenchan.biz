import { getCloudflareContext } from '@opennextjs/cloudflare'

export const runtime = 'edge'

async function findDevToArticleByCanonicalUrl(
  slug: string
): Promise<DevToArticleStats | undefined> {
  const context = await getCloudflareContext({
    async: true
  })
  const collection = new Set()
  try {
    const R2Cache = context.env.NEXT_INC_CACHE_R2_BUCKET
    const cachedResults = await R2Cache?.get('incremental-cache/devto-articles')
    const data: DevToArticle[] | undefined = await cachedResults?.json()

    if (!data) {
      console.info('No published devto articles found in R2 cache :(')
      return
    }

    data.find((article: DevToArticle) => {
      if (article.canonical_url?.includes(slug)) {
        collection.add({
          id: article.id,
          path: article.path,
          url: article.url,
          positive_reactions_count: article.positive_reactions_count,
          public_reactions_count: article.public_reactions_count,
          comments_count: article.comments_count
        })
      }
    })
    return [...collection][0] as DevToArticleStats
  } catch (error) {
    console.error(
      `findDevToArticleByCanonicalUrl: unable to find article for ${slug}`,
      error
    )
    // Return undefined instead of throwing - this allows the build to continue
    return undefined
  }
}

export default findDevToArticleByCanonicalUrl
