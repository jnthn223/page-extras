import type { User } from 'firebase/auth'

export type PageExtrasProfile = {
  username: string
  postingMode: 'anonymous'
}

const PROFILE_STORAGE_PREFIX = 'pageextras.profile.'

const defaultProfile: PageExtrasProfile = {
  username: '',
  postingMode: 'anonymous',
}

export const profileStorageKey = (user: User) => `${PROFILE_STORAGE_PREFIX}${user.uid}`

export const getPageExtrasProfile = (user: User): PageExtrasProfile => {
  const storedProfile = window.localStorage.getItem(profileStorageKey(user))
  if (!storedProfile) return defaultProfile

  try {
    return {
      ...defaultProfile,
      ...(JSON.parse(storedProfile) as Partial<PageExtrasProfile>),
    }
  } catch {
    return defaultProfile
  }
}

export const savePageExtrasProfile = (user: User, profile: PageExtrasProfile) => {
  window.localStorage.setItem(profileStorageKey(user), JSON.stringify(profile))
  window.dispatchEvent(new CustomEvent('pageextras-profile-change'))
}

export const normalizeUsername = (username: string) =>
  username
    .trim()
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 24)

export const displayUsername = (profile: PageExtrasProfile) =>
  profile.username ? `@${profile.username}` : 'Username not set'
