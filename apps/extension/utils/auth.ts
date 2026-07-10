export type AuthUser = {
  id: string
  username: string
  displayName: string
  initials: string
  reputation: number
}

export type AuthSession = {
  user: AuthUser
}

const AUTH_STORAGE_KEY = 'pageextras.demoSession'

export const demoUser: AuthUser = {
  id: 'demo-user-alex',
  username: 'alexchen',
  displayName: 'Alex Chen',
  initials: 'A',
  reputation: 1250,
}

export const getAuthSession = async (): Promise<AuthSession | null> => {
  const result = await browser.storage.local.get(AUTH_STORAGE_KEY)
  return (result[AUTH_STORAGE_KEY] as AuthSession | undefined) ?? null
}

export const signInDemoUser = async () => {
  const session: AuthSession = { user: demoUser }
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: session })
  return session
}

export const signOutDemoUser = async () => {
  await browser.storage.local.remove(AUTH_STORAGE_KEY)
}

export const subscribeToAuthSession = (callback: (session: AuthSession | null) => void) => {
  const listener = (
    changes: Record<string, Browser.storage.StorageChange>,
    areaName: string,
  ) => {
    if (areaName !== 'local' || !changes[AUTH_STORAGE_KEY]) return

    callback((changes[AUTH_STORAGE_KEY].newValue as AuthSession | undefined) ?? null)
  }

  browser.storage.onChanged.addListener(listener)
  return () => browser.storage.onChanged.removeListener(listener)
}
