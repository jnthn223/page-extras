export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8080'

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  resolvePage: `${API_BASE_URL}/api/pages/resolve`,
  magicLink: `${API_BASE_URL}/api/auth/magic-link`,
}

export const requestMagicLink = async (email: string) => {
  const response = await fetch(API_ENDPOINTS.magicLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      redirectUrl: `${window.location.origin}/me`,
    }),
  })

  if (!response.ok) {
    throw new Error(`Magic link request failed: ${response.status}`)
  }
}
