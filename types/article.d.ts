type DevToArticleStats = {
  id: number
  path: string
  url: string
  positive_reaction_count: number
  public_reaction_count: number
  comments_count: number
}

type DevToArticle = {
  date?: Date
  title: string
  description: string
  main_image: string
  tags: string[]
  series?: string
  slug: string
  canonical_url?: string
  body_markdown: string
  organization_id?: number
}
