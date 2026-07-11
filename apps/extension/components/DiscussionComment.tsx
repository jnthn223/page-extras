import { Check, Edit3, Flag, Reply, Trash2, X, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import type { PageExtraComment } from './types'

type DiscussionCommentProps = {
  comment: PageExtraComment
  level?: number
  canInteract: boolean
  currentUserId?: string
  onReply: (parentId: string) => void
  onUpdate: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
  onVote: (commentId: string, value: -1 | 0 | 1) => Promise<void>
  onReport: (commentId: string, reason: string) => Promise<void>
}

const formatRelativeTime = (value: string) => {
  const elapsedMs = Date.now() - new Date(value).getTime()
  const elapsedMinutes = Math.max(1, Math.round(elapsedMs / 60000))

  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`

  const elapsedHours = Math.round(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours}h ago`

  return `${Math.round(elapsedHours / 24)}d ago`
}

const getReputationBadge = (reputation: number) => {
  if (reputation >= 1000) return 'Top contributor'
  if (reputation >= 500) return 'Trusted'
  return null
}

export const DiscussionComment = ({
  comment,
  level = 0,
  canInteract,
  currentUserId,
  onReply,
  onUpdate,
  onDelete,
  onVote,
  onReport,
}: DiscussionCommentProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [isSaving, setIsSaving] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isReporting, setIsReporting] = useState(false)
  const [hasReported, setHasReported] = useState(false)
  const badge = getReputationBadge(comment.reputation)
  const canManage = Boolean(currentUserId && comment.authorId === currentUserId)

  const handleSave = async () => {
    if (!editText.trim()) return

    setIsSaving(true)

    try {
      await onUpdate(comment.id, editText.trim())
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleVote = async (nextVote: 'up' | 'down') => {
    const resolvedVote = userVote === nextVote ? null : nextVote
    const value = resolvedVote === 'up' ? 1 : resolvedVote === 'down' ? -1 : 0

    setIsVoting(true)
    setUserVote(resolvedVote)

    try {
      await onVote(comment.id, value)
    } catch (error) {
      setUserVote(userVote)
      throw error
    } finally {
      setIsVoting(false)
    }
  }

  const handleReport = async (reason: string) => {
    setIsReporting(true)

    try {
      await onReport(comment.id, reason)
      setHasReported(true)
      setShowReport(false)
    } finally {
      setIsReporting(false)
    }
  }

  return (
    <article
      className="pe-comment"
      style={{ marginLeft: level > 0 ? Math.min(level * 14, 42) : 0 }}
    >
      <div className="pe-comment-card">
        <header className="pe-comment-header">
          <div className="pe-avatar" aria-hidden="true">
            {comment.author.charAt(0)}
          </div>
          <div className="pe-comment-meta">
            <div>
              <strong>{comment.author}</strong>
              {badge ? <span>{badge}</span> : null}
            </div>
            <time>{formatRelativeTime(comment.createdAt)}</time>
          </div>
          <button
            className="pe-icon-button"
            type="button"
            title="Report"
            disabled={!canInteract || isReporting || hasReported}
            onClick={() => setShowReport((current) => !current)}
          >
            <Flag size={15} />
          </button>
        </header>

        {isEditing ? (
          <div className="pe-edit-form">
            <textarea
              value={editText}
              rows={3}
              disabled={isSaving}
              onChange={(event) => setEditText(event.target.value)}
            />
            <div>
              <button
                type="button"
                disabled={!editText.trim() || isSaving}
                onClick={handleSave}
              >
                <Check size={13} />
                Save
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => {
                  setEditText(comment.content)
                  setIsEditing(false)
                }}
              >
                <X size={13} />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="pe-comment-content">{comment.content}</p>
        )}

        <footer className="pe-comment-actions">
          <div className="pe-vote-group">
            <button
              className={userVote === 'up' ? 'is-active' : ''}
              type="button"
              title="Upvote"
              disabled={!canInteract || isVoting}
              onClick={() => void handleVote('up')}
            >
              <ThumbsUp size={13} />
            </button>
            <span>{comment.upvotes}</span>
            <button
              className={userVote === 'down' ? 'is-destructive' : ''}
              type="button"
              title="Downvote"
              disabled={!canInteract || isVoting}
              onClick={() => void handleVote('down')}
            >
              <ThumbsDown size={13} />
            </button>
          </div>

          <button
            className="pe-reply-button"
            type="button"
            disabled={!canInteract}
            onClick={() => onReply(comment.id)}
          >
            <Reply size={13} />
            Reply
          </button>
          {canManage ? (
            <>
              <button
                className="pe-reply-button"
                type="button"
                disabled={isEditing}
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={13} />
                Edit
              </button>
              <button
                className="pe-reply-button"
                type="button"
                disabled={isEditing}
                onClick={() => void onDelete(comment.id)}
              >
                <Trash2 size={13} />
                Delete
              </button>
            </>
          ) : null}
        </footer>

        {showReport ? (
          <div className="pe-report-menu">
            {['Spam', 'Harassment', 'Off topic', 'Other'].map((reason) => (
              <button
                key={reason}
                type="button"
                disabled={!canInteract || isReporting}
                onClick={() => void handleReport(reason)}
              >
                {reason}
              </button>
            ))}
          </div>
        ) : null}
        {hasReported ? <p className="pe-report-confirmation">Report sent</p> : null}
      </div>

      {comment.replies?.map((reply) => (
        <DiscussionComment
          key={reply.id}
          comment={reply}
          level={level + 1}
          canInteract={canInteract}
          currentUserId={currentUserId}
          onReply={onReply}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onVote={onVote}
          onReport={onReport}
        />
      ))}
    </article>
  )
}
