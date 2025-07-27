import getDevToPublishedArticles from './getDevToPublishedArticles'

async function findDevToArticleByCanonicalUrl(
  slug: string
): Promise<DevToArticleStats | undefined> {
  'use server'

  const collection = new Set()
  try {
    const data = await getDevToPublishedArticles()
    if (!data || !Array.isArray(data)) return undefined
    data.find((article: DevToArticle) => {
      if (article.canonical_url?.includes(slug)) {
        collection.add({
          id: article.id,
          path: article.path,
          url: article.url,
          positive_reaction_count: article.positive_reactions_count,
          public_reaction_count: article.public_reactions_count,
          comments_count: article.comments_count
        })
      }
    })
    return [...collection][0] as DevToArticleStats
  } catch (error) {
    console.error('🚨 Dev.to API error:', error)
    // Return undefined instead of throwing - this allows the build to continue
    return undefined
  }
}

export default findDevToArticleByCanonicalUrl
