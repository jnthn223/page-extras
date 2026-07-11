'use client'

import { SiteShell } from '@/components/site/SiteShell'
import { getFirebaseAuth } from '@/lib/firebase'
import {
  displayUsername,
  getPageExtrasProfile,
  type PageExtrasProfile,
} from '@/lib/pageextras-profile'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<PageExtrasProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const auth = useMemo(() => getFirebaseAuth(), [])

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setProfile(nextUser ? getPageExtrasProfile(nextUser) : null)
      setIsLoading(false)
    })
  }, [auth])

  useEffect(() => {
    if (!user) return undefined

    const syncProfile = () => setProfile(getPageExtrasProfile(user))
    window.addEventListener('storage', syncProfile)
    window.addEventListener('pageextras-profile-change', syncProfile)

    return () => {
      window.removeEventListener('storage', syncProfile)
      window.removeEventListener('pageextras-profile-change', syncProfile)
    }
  }, [user])

  const handleSignOut = async () => {
    await signOut(auth)
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-6 py-12">
        {isLoading ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading profile...
          </div>
        ) : null}

        {!isLoading && !user ? (
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <p className="mb-2 text-sm font-semibold text-accent">Signed out</p>
            <h1 className="mb-3 text-3xl font-bold text-foreground">
              Sign in to view your profile.
            </h1>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Firebase handles sign-in privately. Your public PageExtras identity is
              separate and anonymous.
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
          <>
            <div className="mb-8 rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-2xl font-bold text-accent">
                    {profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-accent">
                      Anonymous PageExtras profile
                    </p>
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile.username || 'Choose a username'}
                    </h1>
                    <p className="text-muted-foreground">{displayUsername(profile)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    ['0', 'Reputation'],
                    ['0', 'Extras'],
                    ['0', 'Threads'],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3"
                    >
                      <div className="text-xl font-bold text-accent">{value}</div>
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_320px]">
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-4 text-xl font-bold text-foreground">Recent activity</h2>
                <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
                  No activity yet.
                </div>
              </section>

              <aside className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-3 text-xl font-bold text-foreground">Profile status</h2>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                  Google sign-in is only used to keep your account secure. Your public
                  posts use this separate PageExtras username.
                </p>
                <div className="mb-4 rounded-lg bg-accent/10 p-4 text-sm text-muted-foreground">
                  Public identity:{' '}
                  <span className="text-foreground">{displayUsername(profile)}</span>
                </div>
                <Link
                  className="mb-3 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
                  href="/settings"
                >
                  Edit username
                </Link>
                <button
                  className="block h-10 rounded-lg bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </aside>
            </div>
          </>
        ) : null}
      </section>
    </SiteShell>
  )
}
