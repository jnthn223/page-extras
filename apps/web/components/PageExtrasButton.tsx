'use client'

import { MessageCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { FC } from 'react'

interface PageExtrasButtonProps {
  count?: number
  hasDiscussions?: boolean
  onClick: () => void
}

export const PageExtrasButton: FC<PageExtrasButtonProps> = ({
  count = 0,
  hasDiscussions = false,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const displayText =
    count > 0
      ? `💬 ${count} ${count === 1 ? 'Extra' : 'Extras'}`
      : '✨ Join the discussion'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg border border-border/50 backdrop-blur-sm transition-all duration-300 ${
        hasDiscussions ? 'animate-pulse-subtle' : ''
      } ${
        isHovered
          ? 'bg-accent text-accent-foreground shadow-xl'
          : 'bg-card text-foreground border-border hover:border-border'
      }`}
      title="Open PageExtras discussion panel"
    >
      <div className="flex items-center gap-2">
        {count > 0 ? (
          <>
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{count}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Join</span>
          </>
        )}
      </div>
    </button>
  )
}
