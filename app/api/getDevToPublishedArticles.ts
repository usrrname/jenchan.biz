const getDevToPublishedArticles = async () => {
  'use server'
  const endpoint = `https://dev.to/api/articles/me/published`
  const headers = new Headers()
  headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
  headers.append('accept', 'application/vnd.forem.api-v1+json')

  try {
    const res = await fetch(endpoint, {
      headers: headers,
      cache: 'force-cache'
    })
    if (res.status !== 200) {
      console.error('🚨 Dev.to API error:', res.status, res.statusText)
    }
    return res.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getDevToPublishedArticles: ${error.message}`)
    }
  }
}
export default getDevToPublishedArticles
