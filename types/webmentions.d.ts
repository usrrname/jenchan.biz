type WebMentionPostResponse = {
  links?: WebMentionPost[]
}

type WebMentionPost = {
  id: string
  data: WebMentionPostData
  activity: {
    type: 'like' | 'repost' | 'mention' | 'reply' | 'link' | 'bookmark'
  }
  rels: {
    canonical: URL
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
  source: URL | string
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
  source?: WebMentionPostData['source']
}

interface WebMentionReplies {
  author: WebMentionCommentAuthor
  content?: WebMentionPostData['content']
  url: WebMentionPostData['url']
  published?: WebMentionPostData['published']
  published_ts?: WebMentionPostData['published_ts']
  source?: WebMentionPostData['source']
}

interface WebMentionReaction {
  author: WebMentionCommentAuthor
  url: URL
  published?: WebMentionPostData['published']
  published_ts?: WebMentionPostData['published_ts']
  source?: WebMentionPostData['source']
}
