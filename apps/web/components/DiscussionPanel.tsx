'use client'

import { X, Send } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import type { FC } from 'react'
import { DiscussionComment } from './DiscussionComment'

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

interface DiscussionPanelProps {
  isOpen: boolean
  onClose: () => void
  pageTitle: string
  pageDomain: string
  comments: Comment[]
}

type TabType = 'top' | 'new' | 'controversial'

export const DiscussionPanel: FC<DiscussionPanelProps> = ({
  isOpen,
  onClose,
  pageTitle,
  pageDomain,
  comments,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('top')
  const [newCommentText, setNewCommentText] = useState('')
  const [sortedComments, setSortedComments] = useState<Comment[]>(comments)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let sorted = [...comments]
    switch (activeTab) {
      case 'top':
        sorted.sort((a, b) => b.upvotes - a.upvotes)
        break
      case 'new':
        sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case 'controversial':
        sorted.sort((a, b) => {
          const scoreA = Math.min(a.upvotes, a.downvotes)
          const scoreB = Math.min(b.upvotes, b.downvotes)
          return scoreB - scoreA
        })
        break
    }
    setSortedComments(sorted)
  }, [activeTab, comments])

  const handleSubmitComment = async () => {
    if (!newCommentText.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)

    setNewCommentText('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleReply = (parentId: string) => {
    if (inputRef.current) {
      inputRef.current.focus()
      setNewCommentText(`@reply-${parentId} `)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 z-30 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-96 bg-background border-l border-border shadow-2xl z-40 flex flex-col overflow-hidden ${
          isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right'
        }`}
      >
        {/* Header */}
        <div className="bg-card border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-start justify-between mb-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Page info */}
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-foreground text-balance mb-1">
              {pageTitle}
            </h2>
            <p className="text-xs text-muted-foreground">{pageDomain}</p>
          </div>

          {/* Comment count */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
            <span className="text-sm font-medium text-foreground">
              💬 {comments.length} {comments.length === 1 ? 'Extra' : 'Extras'}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 -mx-6 px-6">
            {(['top', 'new', 'controversial'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-medium px-3 py-2 rounded-lg transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Comments section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {sortedComments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-4xl mb-3">💭</div>
              <p className="text-sm font-medium text-foreground mb-1">
                No Extras yet
              </p>
              <p className="text-xs text-muted-foreground">
                Start the conversation
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedComments.map((comment) => (
                <DiscussionComment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>

        {/* Input section */}
        <div className="bg-card border-t border-border px-6 py-4 shrink-0">
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Add an Extra
          </label>
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  handleSubmitComment()
                }
              }}
              placeholder="Share your thoughts..."
              className="flex-1 px-3 py-2 text-sm rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent resize-none"
              rows={2}
            />
          </div>
          <button
            onClick={handleSubmitComment}
            disabled={!newCommentText.trim() || isLoading}
            className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-medium"
          >
            <Send className="w-4 h-4" />
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </>
  )
}
