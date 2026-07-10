'use client'

import { useState } from 'react'
import type { FC } from 'react'
import { PageExtrasButton } from './PageExtrasButton'
import { DiscussionPanel } from './DiscussionPanel'

interface Comment {
  id: string
  author: string
  avatar: string
  reputation: number
  timestamp: string
  content: string
  upvotes: number
  downvotes: number
  replies?: Comment[]
}

interface PageExtrasProps {
  pageTitle?: string
  pageDomain?: string
  initialComments?: Comment[]
}

export const PageExtras: FC<PageExtrasProps> = ({
  pageTitle = 'Current Page',
  pageDomain = 'example.com',
  initialComments = [],
}) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [comments] = useState<Comment[]>(initialComments)

  return (
    <>
      <PageExtrasButton
        count={comments.length}
        hasDiscussions={comments.length > 0}
        onClick={() => setIsPanelOpen(true)}
      />
      <DiscussionPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        pageTitle={pageTitle}
        pageDomain={pageDomain}
        comments={comments}
      />
    </>
  )
}
