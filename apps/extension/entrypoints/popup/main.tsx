import ReactDOM from 'react-dom/client'
import { LogIn, LogOut, MessageCircle, Settings, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  getAuthSession,
  signInDemoUser,
  signOutDemoUser,
  subscribeToAuthSession,
  type AuthSession,
} from '../../utils/auth'
import './style.css'

const WEB_APP_URL = 'http://localhost:3000'

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
        <strong>{session ? session.user.displayName : 'Join PageExtras discussions'}</strong>
        <p>
          {session
            ? `${session.user.reputation.toLocaleString()} reputation`
            : 'Sign in to post, vote, reply, and report.'}
        </p>
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
          <button type="button" className="button-secondary" onClick={signOutDemoUser}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      ) : (
        <div className="popup-actions">
          <button type="button" onClick={signInDemoUser}>
            <LogIn size={16} />
            Demo sign in
          </button>
          <button
            type="button"
            className="button-secondary"
            onClick={() => openWebPage('/login')}
          >
            Open login page
          </button>
        </div>
      )}
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />)
