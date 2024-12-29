const getArticleById = async (id: number) => {
  'use server'
  const endpoint = `https://dev.to/api/articles/${id}`

  const headers = new Headers()
  headers.append('api-key', `${process.env.NEXT_DEVTO_API_KEY}`)
  headers.append('accept', 'application/vnd.forem.api-v1+json')
  try {
    const res = await fetch(endpoint, {
      headers: headers,
      cache: 'force-cache',
    })
    return res.json()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in getArticleById: ${error.message}`)
    }
  }
}
export default getArticleById
