import ReactDOM from 'react-dom/client'
import { LogIn, LogOut, MessageCircle, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getAuthSession,
  signOutUser,
  subscribeToAuthSession,
  type AuthSession,
} from '../../utils/auth'
import './style.css'

const WEB_APP_URL =
  import.meta.env.WXT_PUBLIC_WEB_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

const EXTENSION_BUILD_LABEL = '0.1.1 auth diagnostics'

const openWebPage = (path: string) => {
  browser.tabs.create({ url: `${WEB_APP_URL}${path}` })
}

const Popup = () => {
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    getAuthSession().then(setSession)
    return subscribeToAuthSession(setSession)
  }, [])

  return (
    <main className="popup">
      <header>
        <div className="brand-mark">
          <MessageCircle size={18} />
        </div>
        <div>
          <h1>PageExtras</h1>
          <p>Community notes for the current page</p>
        </div>
      </header>

      <section>
        <span>{session ? 'Signed in' : 'Signed out'}</span>
        <strong>{session ? `@${session.user.username}` : 'Join PageExtras discussions'}</strong>
        <p>
          {session
            ? `${session.user.reputation.toLocaleString()} reputation`
            : 'Sign in to post, vote, reply, and report.'}
        </p>
      </section>

      <section className="diagnostics">
        <span>Extension build</span>
        <strong>{EXTENSION_BUILD_LABEL}</strong>
        <p>Firebase token: {session?.idToken ? 'present' : 'missing'}</p>
        {session?.projectId ? <p>Firebase project: {session.projectId}</p> : null}
        {session?.syncedAt ? (
          <p>Auth bridge sync: {new Date(session.syncedAt).toLocaleString()}</p>
        ) : null}
      </section>

      {session ? (
        <div className="popup-actions">
          <button type="button" onClick={() => openWebPage('/me')}>
            <User size={16} />
            Profile
          </button>
          <button type="button" onClick={() => openWebPage('/settings')}>
            <Settings size={16} />
            Settings
          </button>
          <button type="button" className="button-secondary" onClick={signOutUser}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      ) : (
        <div className="popup-actions">
          <button type="button" onClick={() => openWebPage('/login')}>
            <LogIn size={16} />
            Sign in
          </button>
        </div>
      )}
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />)
