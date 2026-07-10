import { useEffect, useMemo, useState } from 'react'
import { getDemoComments } from './demo-comments'
import { DiscussionPanel } from './DiscussionPanel'
import { PageExtrasButton } from './PageExtrasButton'
import type { PageInfo } from './types'
import {
  getAuthSession,
  subscribeToAuthSession,
  type AuthSession,
} from '../utils/auth'

type PageExtrasProps = {
  page: PageInfo
}

export const PageExtras = ({ page }: PageExtrasProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [session, setSession] = useState<AuthSession | null>(null)
  const comments = useMemo(() => getDemoComments(page), [page])

  useEffect(() => {
    getAuthSession().then(setSession)
    return subscribeToAuthSession(setSession)
  }, [])

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
        session={session}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}
