import ReactDOM from 'react-dom/client'
import { PageExtras } from '../../components/PageExtras'
import type { PageInfo } from '../../components/types'
import './style.css'

const getCurrentPage = (): PageInfo => ({
  title: document.title || 'Untitled page',
  domain: window.location.hostname,
  url: window.location.href,
})

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
        root.render(<PageExtras page={getCurrentPage()} />)

        return root
      },
      onRemove(root) {
        root?.unmount()
      },
    })

    ui.mount()
  },
})
