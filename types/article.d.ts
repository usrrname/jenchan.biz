type DevToUser = {
  name: string
  username: string
  twitter_username: string | null
  github_username: string | null
  user_id: number
  website_url: string | null
  profile_image: string
  profile_image_90: string
}

type DevToArticleStats = {
  type_of: string
  id: number
  title: string
  description: string
  published: boolean
  published_at: string
  slug: string
  path: string
  url: string
  comments_count: number
  public_reactions_count: number
  page_views_count: number
  published_timestamp: string
  body_markdown: string
  positive_reactions_count: number
  cover_image: string | null
  tag_list: string[]
  canonical_url: string | null
  reading_time_minutes: number
  user: DevToUser
}

type DevToArticle = {
  type_of?: string
  id?: number
  date?: Date
  title: string
  description: string
  published?: boolean
  published_at?: string
  main_image?: string
  cover_image?: string | null
  tags?: string[]
  tag_list?: string[]
  series?: string
  slug: string
  path?: string
  url?: string
  canonical_url?: string
  body_markdown: string
  organization_id?: number
  comments_count?: number
  public_reactions_count?: number
  positive_reactions_count?: number
  page_views_count?: number
  published_timestamp?: string
  reading_time_minutes?: number
  user?: DevToUser
}
