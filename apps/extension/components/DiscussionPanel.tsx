import { Send, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { DiscussionComment } from './DiscussionComment'
import type { PageExtraComment, PageInfo } from './types'

type DiscussionPanelProps = {
  isOpen: boolean
  page: PageInfo
  comments: PageExtraComment[]
  onClose: () => void
}

type TabType = 'top' | 'new' | 'controversial'

export const DiscussionPanel = ({
  isOpen,
  page,
  comments,
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
              onReply={handleReply}
            />
          ))}
        </div>

        <footer className="pe-composer">
          <label htmlFor="pageextras-demo-comment">Add an Extra</label>
          <textarea
            id="pageextras-demo-comment"
            ref={inputRef}
            rows={3}
            value={newCommentText}
            placeholder="Share your thoughts..."
            onChange={(event) => setNewCommentText(event.target.value)}
          />
          <button type="button" disabled={!newCommentText.trim()}>
            <Send size={15} />
            Demo post
          </button>
        </footer>
      </aside>
    </>
  )
}
