import { Flag, Reply, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import type { PageExtraComment } from './types'

type DiscussionCommentProps = {
  comment: PageExtraComment
  level?: number
  canInteract: boolean
  onReply: (parentId: string) => void
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
  onReply,
}: DiscussionCommentProps) => {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [showReport, setShowReport] = useState(false)
  const badge = getReputationBadge(comment.reputation)

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
            disabled={!canInteract}
            onClick={() => setShowReport((current) => !current)}
          >
            <Flag size={15} />
          </button>
        </header>

        <p className="pe-comment-content">{comment.content}</p>

        <footer className="pe-comment-actions">
          <div className="pe-vote-group">
            <button
              className={userVote === 'up' ? 'is-active' : ''}
              type="button"
              title="Upvote"
              disabled={!canInteract}
              onClick={() => setUserVote((current) => (current === 'up' ? null : 'up'))}
            >
              <ThumbsUp size={13} />
            </button>
            <span>{comment.upvotes + (userVote === 'up' ? 1 : 0)}</span>
            <button
              className={userVote === 'down' ? 'is-destructive' : ''}
              type="button"
              title="Downvote"
              disabled={!canInteract}
              onClick={() =>
                setUserVote((current) => (current === 'down' ? null : 'down'))
              }
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
        </footer>

        {showReport ? (
          <div className="pe-report-menu">
            {['Spam', 'Harassment', 'Off topic', 'Other'].map((reason) => (
              <button
                key={reason}
                type="button"
                disabled={!canInteract}
                onClick={() => setShowReport(false)}
              >
                {reason}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {comment.replies?.map((reply) => (
        <DiscussionComment
          key={reply.id}
          comment={reply}
          level={level + 1}
          canInteract={canInteract}
          onReply={onReply}
        />
      ))}
    </article>
  )
}
