export type PageExtraComment = {
  id: string
  author: string
  reputation: number
  createdAt: string
  content: string
  upvotes: number
  downvotes: number
  replies?: PageExtraComment[]
}

export type PageInfo = {
  title: string
  domain: string
  url: string
}
