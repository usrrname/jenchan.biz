import getDevToPublishedArticles from './getDevToPublishedArticles'

async function findDevToArticleByCanonicalUrl(
  slug: string
): Promise<DevToArticleStats | undefined> {
  'use server'

  const collection = new Set()
  try {
    const data = await getDevToPublishedArticles()
    if (!data) return
    data.find((article) => {
      if (article.canonical_url.includes(slug)) {
        collection.add({
          id: article.id,
          path: article.path,
          url: article.url,
          positive_reaction_count: article.positive_reaction_count,
          public_reaction_count: article.public_reactions_count,
          comments_count: article.comments_count,
        })
      }
    })
    return [...collection][0] as DevToArticleStats
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error in findDevToArticleByCanonicalUrl: ${error.message}`
      )
    }
  }
}

export default findDevToArticleByCanonicalUrl
