type WebMentionPostResponse = {
  links?: WebMentionPost[]
}

type WebMentionPost = {
  data: WebMentionPostData
  activity: {
    type: 'like' | 'repost' | 'mention' | 'reply' | 'link' | 'bookmark'
  }
  source: URL | string
  verified: boolean
  verified_date: string
  id: number
  private: boolean
  target: URL
}

type WebMentionPostData = {
  author: WebMentionCommentAuthor
  name: string | null
  url: URL
  content?: string
  published?: Date | number | null
  published_ts?: number | null
}

type WebMentionCommentAuthor = {
  name: string
  photo: string
  url: URL
}

interface WebMentionReplies {
  author: WebMentionCommentAuthor
  content?: WebMentionPostData['content']
  url: WebMentionPostData['url']
  published?: WebMentionPostData['published']
  published_ts?: WebMentionPostData['published_ts']
}

interface WebMentionReaction {
  author: WebMentionCommentAuthor
  url: URL
}
