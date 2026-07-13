'use client'

import { AuthBridge } from '@/components/auth/AuthBridge'
import { getFirebaseAuth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import Link from 'next/link'
import { useEffect, useMemo, useState, type ReactNode } from 'react'

type SiteShellProps = {
  children: ReactNode
}

export const SiteShell = ({ children }: SiteShellProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const auth = useMemo(() => getFirebaseAuth(), [])

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setIsLoading(false)
    })
  }, [auth])

  const handleSignOut = async () => {
    await signOut(auth)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <AuthBridge />
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link className="text-sm font-bold text-foreground" href="/">
            PageExtras
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {isLoading ? null : user ? (
              <>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/me"
                >
                  Profile
                </Link>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/settings"
                >
                  Settings
                </Link>
                <button
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="/login"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      {children}
      <footer className="border-t border-border bg-card/70">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 PageExtras. Built for better web discussions.</p>
          <div className="flex gap-4">
            <Link className="transition-colors hover:text-foreground" href="/privacy">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-foreground" href="/terms">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
