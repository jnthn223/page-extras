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
  onClose: () => void
}

type TabType = 'top' | 'new' | 'controversial'

export const DiscussionPanel = ({
  isOpen,
  page,
  comments,
  session,
  onClose,
}: DiscussionPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('top')
  const [newCommentText, setNewCommentText] = useState('')
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
    setNewCommentText(`@reply-${parentId} `)
    inputRef.current?.focus()
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
      <aside className="pe-panel" aria-label="PageExtras demo discussion panel">
        <header className="pe-panel-header">
          <button className="pe-close-button" type="button" onClick={onClose}>
            <X size={18} />
          </button>

          <div className="pe-page-info">
            <span>PageExtras demo</span>
            <h2>{page.title}</h2>
            <p>{page.domain}</p>
          </div>

          <div className="pe-count-row">
            <strong>
              {comments.length} {comments.length === 1 ? 'Extra' : 'Extras'}
            </strong>
            <span>Demo data for this page</span>
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
          {sortedComments.map((comment) => (
            <DiscussionComment
              key={comment.id}
              comment={comment}
              canInteract={Boolean(session)}
              onReply={handleReply}
            />
          ))}
        </div>

        <footer className="pe-composer">
          <div className="pe-composer-header">
            <label htmlFor="pageextras-demo-comment">Add an Extra</label>
            {session ? (
              <div className="pe-user-chip">
                <span>{session.user.initials}</span>
                {session.user.displayName}
              </div>
            ) : (
              <div className="pe-user-chip pe-user-chip--muted">Signed out</div>
            )}
          </div>
          <textarea
            id="pageextras-demo-comment"
            ref={inputRef}
            rows={3}
            value={newCommentText}
            disabled={!session}
            placeholder={
              session ? 'Share your thoughts...' : 'Sign in from the popup to post.'
            }
            onChange={(event) => setNewCommentText(event.target.value)}
          />
          <button type="button" disabled={!session || !newCommentText.trim()}>
            <Send size={15} />
            {session ? 'Demo post' : 'Sign in required'}
          </button>
        </footer>
      </aside>
    </>
  )
}
