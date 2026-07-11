import { Send, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { DiscussionComment } from './DiscussionComment'
import type { PageExtraComment, PageInfo } from './types'
import type { AuthSession } from '../utils/auth'

type DiscussionPanelProps = {
  isOpen: boolean
  page: PageInfo
  comments: PageExtraComment[]
  session: AuthSession | null
  backendStatus: 'syncing' | 'connected' | 'unavailable'
  backendError?: string
  onCreateComment?: (content: string, parentId?: string) => Promise<void>
  onUpdateComment?: (commentId: string, content: string) => Promise<void>
  onDeleteComment?: (commentId: string) => Promise<void>
  onVoteComment?: (commentId: string, value: -1 | 0 | 1) => Promise<void>
  onReportComment?: (commentId: string, reason: string) => Promise<void>
  onClose: () => void
}

type TabType = 'top' | 'new' | 'controversial'

export const DiscussionPanel = ({
  isOpen,
  page,
  comments,
  session,
  backendStatus,
  backendError,
  onCreateComment,
  onUpdateComment,
  onDeleteComment,
  onVoteComment,
  onReportComment,
  onClose,
}: DiscussionPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('top')
  const [newCommentText, setNewCommentText] = useState('')
  const [replyParentId, setReplyParentId] = useState<string | undefined>()
  const [isPostingComment, setIsPostingComment] = useState(false)
  const [mutationError, setMutationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sortedComments = useMemo(() => {
    const sorted = [...comments]

    if (activeTab === 'new') {
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    }

    if (activeTab === 'controversial') {
      return sorted.sort(
        (a, b) => Math.min(b.upvotes, b.downvotes) - Math.min(a.upvotes, a.downvotes),
      )
    }

    return sorted.sort((a, b) => b.upvotes - a.upvotes)
  }, [activeTab, comments])

  const handleReply = (parentId: string) => {
    setReplyParentId(parentId)
    setNewCommentText('')
    setMutationError(null)
    inputRef.current?.focus()
  }

  const handleSubmitComment = async () => {
    if (!session || !newCommentText.trim()) return

    if (!onCreateComment) {
      setNewCommentText('')
      setReplyParentId(undefined)
      return
    }

    setIsPostingComment(true)
    setMutationError(null)

    try {
      await onCreateComment(newCommentText.trim(), replyParentId)
      setNewCommentText('')
      setReplyParentId(undefined)
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Could not post comment')
    } finally {
      setIsPostingComment(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <button
        className="pe-backdrop"
        type="button"
        aria-label="Close PageExtras"
        onClick={onClose}
      />
      <aside className="pe-panel" aria-label="PageExtras discussion panel">
        <header className="pe-panel-header">
          <button className="pe-close-button" type="button" onClick={onClose}>
            <X size={18} />
          </button>

          <div className="pe-page-info">
            <span>PageExtras</span>
            <h2>{page.title}</h2>
            <p>{page.domain}</p>
          </div>

          <div className="pe-count-row">
            <strong>
              {comments.length} {comments.length === 1 ? 'Extra' : 'Extras'}
            </strong>
            <span>
              {backendStatus === 'connected'
                ? 'Backend connected'
                : backendStatus === 'syncing'
                  ? 'Syncing backend'
                  : 'Backend unavailable'}
            </span>
          </div>

          <nav className="pe-tabs" aria-label="Sort comments">
            {(['top', 'new', 'controversial'] as const).map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'is-active' : ''}
                type="button"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <div className="pe-comment-list">
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => (
              <DiscussionComment
                key={comment.id}
                comment={comment}
                canInteract={Boolean(session)}
                currentUserId={
                  onUpdateComment && onDeleteComment ? session?.user.id : undefined
                }
                onReply={handleReply}
                onUpdate={async (commentId, content) => {
                  if (onUpdateComment) await onUpdateComment(commentId, content)
                }}
                onDelete={async (commentId) => {
                  if (onDeleteComment) await onDeleteComment(commentId)
                }}
                onVote={async (commentId, value) => {
                  if (onVoteComment) await onVoteComment(commentId, value)
                }}
                onReport={async (commentId, reason) => {
                  if (onReportComment) await onReportComment(commentId, reason)
                }}
              />
            ))
          ) : (
            <div className="pe-empty-state">
              {backendStatus === 'unavailable'
                ? `Could not connect to the PageExtras backend.${backendError ? ` ${backendError}` : ''}`
                : 'No extras on this page yet.'}
            </div>
          )}
        </div>

        <footer className="pe-composer">
          <div className="pe-composer-header">
            <label htmlFor="pageextras-comment">
              {replyParentId ? 'Add a Reply' : 'Add an Extra'}
            </label>
            {session ? (
              <div className="pe-user-chip">
                <span>{session.user.initials}</span>
                @{session.user.username}
              </div>
            ) : (
              <div className="pe-user-chip pe-user-chip--muted">Signed out</div>
            )}
          </div>
          {replyParentId ? (
            <div className="pe-replying-to">
              <span>Replying to comment</span>
              <button
                type="button"
                disabled={isPostingComment}
                onClick={() => setReplyParentId(undefined)}
              >
                Cancel
              </button>
            </div>
          ) : null}
          <textarea
            id="pageextras-comment"
            ref={inputRef}
            rows={3}
            value={newCommentText}
            disabled={!session}
            placeholder={
              session ? 'Share your thoughts...' : 'Open the PageExtras web app and sign in to post.'
            }
            onChange={(event) => setNewCommentText(event.target.value)}
          />
          <button
            type="button"
            disabled={!session || !newCommentText.trim() || isPostingComment}
            onClick={handleSubmitComment}
          >
            <Send size={15} />
            {session
              ? isPostingComment
                ? 'Posting...'
                : replyParentId
                  ? 'Reply'
                  : 'Post'
              : 'Sign in required'}
          </button>
          {mutationError ? (
            <p className="pe-composer-error" role="alert">
              {mutationError}
            </p>
          ) : null}
        </footer>
      </aside>
    </>
  )
}
