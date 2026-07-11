import { useEffect, useState } from 'react'
import { DiscussionPanel } from './DiscussionPanel'
import { PageExtrasButton } from './PageExtrasButton'
import type { PageExtraComment, PageInfo } from './types'
import {
  getAuthSession,
  subscribeToAuthSession,
  type AuthSession,
} from '../utils/auth'
import {
  createBackendComment,
  deleteBackendComment,
  getBackendComments,
  reportBackendComment,
  resolveBackendPage,
  updateBackendComment,
  voteBackendComment,
} from '../utils/api'

type PageExtrasProps = {
  page: PageInfo
}

export const PageExtras = ({ page }: PageExtrasProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [comments, setComments] = useState<PageExtraComment[]>([])
  const [backendPageId, setBackendPageId] = useState<string | null>(null)
  const [backendError, setBackendError] = useState<string | undefined>()
  const [backendStatus, setBackendStatus] = useState<
    'syncing' | 'connected' | 'unavailable'
  >('syncing')

  useEffect(() => {
    getAuthSession().then(setSession)
    return subscribeToAuthSession(setSession)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadComments = async () => {
      setBackendStatus('syncing')
      setBackendError(undefined)

      try {
        const backendPage = await resolveBackendPage(page)
        const backendComments = await getBackendComments(backendPage.id)

        if (!isMounted) return

        setBackendPageId(backendPage.id)
        setComments(backendComments)
        setBackendStatus('connected')
      } catch (error) {
        console.info('PageExtras backend unavailable.', error)

        if (!isMounted) return

        setBackendPageId(null)
        setComments([])
        setBackendError(error instanceof Error ? error.message : String(error))
        setBackendStatus('unavailable')
      }
    }

    loadComments()

    return () => {
      isMounted = false
    }
  }, [page])

  const handleCreateComment = async (content: string, parentId?: string) => {
    if (!backendPageId) return

    await createBackendComment({
      pageId: backendPageId,
      content,
      parentId,
    })

    setComments(await getBackendComments(backendPageId))
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    if (!backendPageId) return

    await updateBackendComment({
      pageId: backendPageId,
      commentId,
      content,
    })

    setComments(await getBackendComments(backendPageId))
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!backendPageId) return

    await deleteBackendComment({
      pageId: backendPageId,
      commentId,
    })

    setComments(await getBackendComments(backendPageId))
  }

  const handleVoteComment = async (commentId: string, value: -1 | 0 | 1) => {
    if (!backendPageId) return

    await voteBackendComment({
      pageId: backendPageId,
      commentId,
      value,
    })

    setComments(await getBackendComments(backendPageId))
  }

  const handleReportComment = async (commentId: string, reason: string) => {
    if (!backendPageId) return

    await reportBackendComment({
      pageId: backendPageId,
      commentId,
      reason,
    })
  }

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
        backendStatus={backendStatus}
        backendError={backendError}
        onCreateComment={backendPageId ? handleCreateComment : undefined}
        onUpdateComment={backendPageId ? handleUpdateComment : undefined}
        onDeleteComment={backendPageId ? handleDeleteComment : undefined}
        onVoteComment={backendPageId ? handleVoteComment : undefined}
        onReportComment={backendPageId ? handleReportComment : undefined}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  )
}
