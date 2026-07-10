'use client'

import { Flag, ThumbsDown, ThumbsUp, Reply } from 'lucide-react'
import { useState } from 'react'
import type { FC } from 'react'

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

interface DiscussionCommentProps {
  comment: Comment
  level?: number
  onReply: (parentId: string) => void
}

const getReputationBadge = (reputation: number) => {
  if (reputation >= 1000) return '⭐⭐'
  if (reputation >= 500) return '⭐'
  return ''
}

export const DiscussionComment: FC<DiscussionCommentProps> = ({
  comment,
  level = 0,
  onReply,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [showReport, setShowReport] = useState(false)

  const marginLeft = level > 0 ? `ml-${Math.min(level * 2, 8)}` : ''

  return (
    <div
      className={`${marginLeft} mb-4 animate-fade-in`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-3 rounded-lg transition-colors duration-200 ${
        isHovered ? 'bg-secondary' : 'bg-card'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent">
              {comment.author.charAt(0).toUpperCase()}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-foreground">
                {comment.author}
              </span>
              {getReputationBadge(comment.reputation) && (
                <span className="text-xs">{getReputationBadge(comment.reputation)}</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {comment.timestamp}
            </span>
          </div>
          {isHovered && (
            <button
              onClick={() => setShowReport(!showReport)}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Report"
            >
              <Flag className="w-4 h-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Content */}
        <p className="text-sm text-foreground mb-3 leading-relaxed">
          {comment.content}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1">
            <button
              onClick={() => setUserVote(userVote === 'up' ? null : 'up')}
              className={`p-1 rounded transition-colors ${
                userVote === 'up'
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Upvote"
            >
              <ThumbsUp className="w-3 h-3" />
            </button>
            <span className="text-xs font-medium text-muted-foreground px-1">
              {comment.upvotes + (userVote === 'up' ? 1 : 0)}
            </span>
            <button
              onClick={() => setUserVote(userVote === 'down' ? null : 'down')}
              className={`p-1 rounded transition-colors ${
                userVote === 'down'
                  ? 'text-destructive'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Downvote"
            >
              <ThumbsDown className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => onReply(comment.id)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Reply className="w-3 h-3" />
            Reply
          </button>
        </div>

        {/* Report menu */}
        {showReport && (
          <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground border border-border">
            <p className="mb-2">Report as:</p>
            <div className="space-y-1">
              {['Spam', 'Harassment', 'Inappropriate', 'Other'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setShowReport(false)
                  }}
                  className="block w-full text-left hover:text-foreground px-2 py-1 rounded hover:bg-border/50 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <DiscussionComment
              key={reply.id}
              comment={reply}
              level={level + 1}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
}
