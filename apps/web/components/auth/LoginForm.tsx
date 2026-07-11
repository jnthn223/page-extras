'use client'

import { API_ENDPOINTS, requestMagicLink } from '@/lib/api'
import { getFirebaseAuth, signInWithGoogle } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Mail, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

export const LoginForm = () => {
  const router = useRouter()
  const auth = useMemo(() => getFirebaseAuth(), [])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [googleStatus, setGoogleStatus] = useState<'idle' | 'signing-in' | 'error'>('idle')
  const [googleError, setGoogleError] = useState<string | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) router.replace('/me')
    })
  }, [auth, router])

  const handleGoogleSignIn = async () => {
    setGoogleStatus('signing-in')
    setGoogleError(null)

    try {
      await signInWithGoogle()
      router.push('/me')
    } catch (error) {
      console.error(error)
      setGoogleStatus('error')
      setGoogleError(
        error instanceof Error
          ? error.message
          : 'Could not sign in with Google. Check your Firebase Auth setup.',
      )
    }
  }

  const handleMagicLinkSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return

    setStatus('sending')

    try {
      await requestMagicLink(email.trim())
      setStatus('sent')
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl">
      <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">Sign in</h2>
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
        Use Google with Firebase Auth or receive a magic link by email.
      </p>

      <button
        className="mb-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleStatus === 'signing-in'}
      >
        {googleStatus === 'signing-in' ? 'Signing in...' : 'Continue with Google'}
      </button>

      {googleStatus === 'error' ? (
        <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-muted-foreground">
          {googleError}
        </p>
      ) : null}

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        or
        <div className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-3" onSubmit={handleMagicLinkSubmit}>
        <label
          className="block text-xs font-medium text-muted-foreground"
          htmlFor="pageextras-email"
        >
          Email address
        </label>
        <input
          id="pageextras-email"
          className="h-10 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40"
          type="email"
          value={email}
          placeholder="you@example.com"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <button
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!email.trim() || status === 'sending'}
        >
          <Mail className="h-4 w-4" />
          {status === 'sending' ? 'Sending...' : 'Send magic link'}
        </button>
      </form>

      {status === 'sent' ? (
        <p className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3 text-xs text-muted-foreground">
          Check your email for a PageExtras sign-in link.
        </p>
      ) : null}
      {status === 'error' ? (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-muted-foreground">
          Could not request a magic link. Make sure the backend auth endpoint is running.
        </p>
      ) : null}

      <div className="mt-5 space-y-2 rounded-lg border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
        <div>
          Magic link endpoint:{' '}
          <span className="break-all text-foreground">{API_ENDPOINTS.magicLink}</span>
        </div>
      </div>
    </div>
  )
}
