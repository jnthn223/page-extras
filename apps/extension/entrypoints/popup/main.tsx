import ReactDOM from 'react-dom/client'
import { MessageCircle, Settings } from 'lucide-react'
import './style.css'

const Popup = () => {
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
        <span>Current page</span>
        <strong>Discussion layer ready</strong>
      </section>

      <button type="button">
        <Settings size={16} />
        Settings
      </button>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Popup />)
