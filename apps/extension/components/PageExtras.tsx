import { useMemo, useState } from 'react'
import { getDemoComments } from './demo-comments'
import { DiscussionPanel } from './DiscussionPanel'
import { PageExtrasButton } from './PageExtrasButton'
import type { PageInfo } from './types'

type PageExtrasProps = {
  page: PageInfo
}

export const PageExtras = ({ page }: PageExtrasProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const comments = useMemo(() => getDemoComments(page), [page])

  return (
    <div className="pe-root">
      <PageExtrasButton
        count={comments.length}
        hasDiscussions={comments.length > 0}
        onClick={() => setIsPanelOpen(true)}
      />
      <DiscussionPanel
        isOpen={isPanelOpen}
        page={page}
        comments={comments}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}
