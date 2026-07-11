import ReactDOM from 'react-dom/client'
import { PageExtras } from '../../components/PageExtras'
import type { PageInfo } from '../../components/types'
import { setAuthSession, signOutUser, type AuthSession } from '../../utils/auth'
import './style.css'

const WEB_APP_ORIGIN = new URL(
  import.meta.env.WXT_PUBLIC_WEB_APP_URL ?? 'http://localhost:3000',
).origin

const getCurrentPage = (): PageInfo => ({
  title: document.title || 'Untitled page',
  domain: window.location.hostname,
  url: window.location.href,
})

const isAuthSession = (value: unknown): value is AuthSession => {
  if (!value || typeof value !== 'object') return false

  const session = value as AuthSession
  return (
    typeof session.user?.id === 'string' &&
    typeof session.user.username === 'string' &&
    typeof session.user.initials === 'string' &&
    typeof session.idToken === 'string'
  )
}

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    window.addEventListener('message', (event) => {
      if (event.origin !== WEB_APP_ORIGIN) return

      const data = event.data as {
        source?: string
        type?: string
        session?: unknown
      }

      if (data.source !== 'pageextras-web') return

      if (data.type === 'PAGEEXTRAS_AUTH_SESSION' && isAuthSession(data.session)) {
        void setAuthSession(data.session)
      }

      if (data.type === 'PAGEEXTRAS_AUTH_SIGN_OUT') {
        void signOutUser()
      }
    })

    window.postMessage(
      {
        source: 'pageextras-extension',
        type: 'PAGEEXTRAS_AUTH_REQUEST',
      },
      window.location.origin,
    )

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
