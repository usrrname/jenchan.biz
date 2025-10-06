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
  url?: URL
  content?: string
  published?: Date | number 
  published_ts?: number
  verified_date?: Date | number
}

type WebMentionCommentAuthor = {
  name: string
  photo: string
  url: URL
  source?: WebMentionPostData['source']
}

type WebMentionReply = WebMentionPostData;

type WebMentionComment = WebMentionPostData;

type WebMentionReaction = Pick<WebMentionPostData, 'id' | 'author' | 'url' | 'published' | 'published_ts' | 'source'>
