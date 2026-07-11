'use client'

import { getFirebaseAuth, getFirebaseProjectId } from '@/lib/firebase'
import { getPageExtrasProfile } from '@/lib/pageextras-profile'
import { onIdTokenChanged, type User } from 'firebase/auth'
import { useEffect, useMemo } from 'react'

const getInitials = (username: string) =>
  username
    .split(/[_-\s]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?'

const postUserSession = async (user: User) => {
  const profile = getPageExtrasProfile(user)
  const username = profile.username || 'anonymous'
  const idToken = await user.getIdToken(true)

  window.postMessage(
    {
      source: 'pageextras-web',
      type: 'PAGEEXTRAS_AUTH_SESSION',
      session: {
        idToken,
        projectId: getFirebaseProjectId(),
        syncedAt: new Date().toISOString(),
        user: {
          id: user.uid,
          username,
          initials: getInitials(username),
          reputation: 0,
        },
      },
    },
    window.location.origin,
  )
}

export const AuthBridge = () => {
  const auth = useMemo(() => getFirebaseAuth(), [])

  useEffect(() => {
    let currentUser: User | null = null

    const syncUser = () => {
      if (currentUser) postUserSession(currentUser)
    }

    const handleExtensionMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      const data = event.data as { source?: string; type?: string }
      if (
        data.source === 'pageextras-extension' &&
        data.type === 'PAGEEXTRAS_AUTH_REQUEST'
      ) {
        syncUser()
      }
    }

    const unsubscribe = onIdTokenChanged(auth, (user) => {
      currentUser = user

      if (user) {
        postUserSession(user)
      } else {
        window.postMessage(
          {
            source: 'pageextras-web',
            type: 'PAGEEXTRAS_AUTH_SIGN_OUT',
          },
          window.location.origin,
        )
      }
    })

    window.addEventListener('pageextras-profile-change', syncUser)
    window.addEventListener('message', handleExtensionMessage)

    return () => {
      unsubscribe()
      window.removeEventListener('pageextras-profile-change', syncUser)
      window.removeEventListener('message', handleExtensionMessage)
    }
  }, [auth])

  return null
}
