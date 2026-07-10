import ReactDOM from 'react-dom/client'
import { MessageCircle } from 'lucide-react'
import './style.css'

const getCurrentPage = () => ({
  title: document.title || 'Untitled page',
  domain: window.location.hostname,
  url: window.location.href,
})

const PageExtrasContent = () => {
  const page = getCurrentPage()

  return (
    <div className="pageextras-shell">
      <button className="pageextras-button" type="button" title="Open PageExtras">
        <MessageCircle size={18} />
        <span>PageExtras</span>
      </button>
      <aside className="pageextras-panel" aria-label="PageExtras discussion preview">
        <div>
          <p className="pageextras-kicker">Current page</p>
          <h1>{page.title}</h1>
          <p>{page.domain}</p>
        </div>
        <div className="pageextras-empty">
          <strong>No extras loaded yet</strong>
          <span>Next step: connect this shell to the discussion components.</span>
        </div>
      </aside>
    </div>
  )
}

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'pageextras-overlay',
      position: 'inline',
      anchor: 'body',
      onMount(container) {
        const app = document.createElement('div')
        container.append(app)

        const root = ReactDOM.createRoot(app)
        root.render(<PageExtrasContent />)

        return root
      },
      onRemove(root) {
        root?.unmount()
      },
    })

    ui.mount()
  },
})
