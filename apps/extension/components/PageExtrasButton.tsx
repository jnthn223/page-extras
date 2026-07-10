import { MessageCircle, Sparkles } from 'lucide-react'

type PageExtrasButtonProps = {
  count: number
  hasDiscussions: boolean
  onClick: () => void
}

export const PageExtrasButton = ({
  count,
  hasDiscussions,
  onClick,
}: PageExtrasButtonProps) => {
  return (
    <button
      className={`pe-floating-button ${hasDiscussions ? 'pe-floating-button--active' : ''}`}
      type="button"
      title="Open PageExtras demo discussion"
      onClick={onClick}
    >
      {count > 0 ? <MessageCircle size={18} /> : <Sparkles size={18} />}
      <span>{count > 0 ? `${count} Extras` : 'Join'}</span>
    </button>
  )
}
