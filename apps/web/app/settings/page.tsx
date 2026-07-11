'use client'

import { SiteShell } from '@/components/site/SiteShell'
import { getFirebaseAuth } from '@/lib/firebase'
import {
  displayUsername,
  getPageExtrasProfile,
  normalizeUsername,
  savePageExtrasProfile,
  type PageExtrasProfile,
} from '@/lib/pageextras-profile'
import { onAuthStateChanged, type User } from 'firebase/auth'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<PageExtrasProfile | null>(null)
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')
  const [isLoading, setIsLoading] = useState(true)
  const auth = useMemo(() => getFirebaseAuth(), [])

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      const nextProfile = nextUser ? getPageExtrasProfile(nextUser) : null
      setProfile(nextProfile)
      setUsername(nextProfile?.username ?? '')
      setIsLoading(false)
    })
  }, [auth])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user || !profile) return

    const nextProfile = {
      ...profile,
      username: normalizeUsername(username),
    }

    savePageExtrasProfile(user, nextProfile)
    setProfile(nextProfile)
    setUsername(nextProfile.username)
    setStatus('saved')
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <p className="mb-3 text-sm font-semibold text-accent">Account settings</p>
          <h1 className="mb-4 text-3xl font-bold text-foreground">PageExtras settings</h1>
          <p className="mb-8 text-muted-foreground">
            Your Google account is private sign-in. Your public identity is the
            PageExtras username you choose here.
          </p>

          {isLoading ? (
            <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
              Loading settings...
            </div>
          ) : null}

          {!isLoading && !user ? (
            <div className="rounded-lg border border-border bg-secondary/40 p-4">
              <p className="mb-4 text-sm text-muted-foreground">
                Sign in before choosing your anonymous PageExtras username.
              </p>
              <Link
                className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                href="/login"
              >
                Go to login
              </Link>
            </div>
          ) : null}

          {user && profile ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-muted-foreground"
                  htmlFor="pageextras-username"
                >
                  Public username
                </label>
                <div className="flex rounded-lg border border-border bg-input focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/40">
                  <span className="flex h-11 items-center px-3 text-sm text-muted-foreground">
                    @
                  </span>
                  <input
                    id="pageextras-username"
                    className="h-11 min-w-0 flex-1 bg-transparent pr-3 text-sm text-foreground outline-none"
                    type="text"
                    value={username}
                    placeholder="choose_your_name"
                    autoComplete="off"
                    onChange={(event) => {
                      setUsername(normalizeUsername(event.target.value))
                      setStatus('idle')
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Letters, numbers, underscores, and hyphens only. Your Google name
                  and email are not used as your public identity.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Posting mode</span>
                  <strong className="text-sm text-foreground">Anonymous by default</strong>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Current public identity</span>
                  <strong className="break-all text-sm text-foreground">
                    {displayUsername(profile)}
                  </strong>
                </div>
              </div>

              <button
                className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                type="submit"
              >
                Save username
              </button>

              {status === 'saved' ? (
                <p className="text-sm text-muted-foreground">Username saved.</p>
              ) : null}
            </form>
          ) : null}
        </div>
      </section>
    </SiteShell>
  )
}
