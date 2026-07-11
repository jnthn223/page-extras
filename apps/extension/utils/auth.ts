export type AuthUser = {
  id: string
  username: string
  initials: string
  reputation: number
}

export type AuthSession = {
  user: AuthUser
  idToken: string
  projectId?: string
  syncedAt?: string
}

const AUTH_STORAGE_KEY = 'pageextras.authSession'

export const getAuthSession = async (): Promise<AuthSession | null> => {
  const result = await browser.storage.local.get(AUTH_STORAGE_KEY)
  const session = result[AUTH_STORAGE_KEY] as AuthSession | undefined

  if (!session?.idToken) {
    if (session) await browser.storage.local.remove(AUTH_STORAGE_KEY)
    return null
  }

  return session
}

export const setAuthSession = async (session: AuthSession) => {
  await browser.storage.local.set({ [AUTH_STORAGE_KEY]: session })
}

export const signOutUser = async () => {
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
