import type { PageExtraComment, PageInfo } from '../components/types'
import { normalizePageUrl } from './normalize-page-url'
import { getAuthSession, signOutUser } from './auth'

const DEFAULT_API_BASE_URL = 'http://localhost:8080'

export const API_BASE_URL =
  import.meta.env.WXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_API_BASE_URL

type BackendPage = {
  id: string
  normalizedUrl?: string
  canonicalUrl?: string
  domain?: string
  title?: string | null
}

type BackendComment = {
  id: string
  authorId?: string
  author?: string
  authorDisplayName?: string
  authorName?: string
  authorReputation?: number
  reputation?: number
  createdAt?: string
  created_at?: string
  content: string
  upvotes?: number
  downvotes?: number
  score?: number
  replies?: BackendComment[]
}

type PageResponse = BackendPage | { page: BackendPage }

type CommentsResponse =
  | BackendComment[]
  | {
      comments: BackendComment[]
    }

type BackendRequestResponse = {
  ok: boolean
  status: number
  statusText: string
  body: string
}

const requestBackend = async (path: string, init?: RequestInit) => {
  const method = init?.method?.toUpperCase() ?? 'GET'
  const requiresAuth = method !== 'GET' && !(method === 'POST' && path === '/api/pages')
  const session = requiresAuth ? await getAuthSession() : null

  if (requiresAuth && !session?.idToken) {
    throw new Error(
      'No Firebase session reached the extension. Keep the PageExtras web app open, refresh it, then retry.',
    )
  }
  const headers = {
    'Content-Type': 'application/json',
    ...(session?.idToken ? { Authorization: `Bearer ${session.idToken}` } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  }

  const response = (await browser.runtime.sendMessage({
    type: 'PAGEEXTRAS_BACKEND_REQUEST',
    url: `${API_BASE_URL}${path}`,
    init: {
      method: init?.method,
      headers,
      body: typeof init?.body === 'string' ? init.body : undefined,
    },
  })) as BackendRequestResponse

  if (!response.ok) {
    if (response.status === 401 && requiresAuth) {
      await signOutUser()
      let detail = response.body

      try {
        const errorBody = JSON.parse(response.body) as {
          message?: string
          code?: string
          expectedProjectId?: string
          tokenAudience?: string | null
          tokenIssuer?: string | null
          tokenSubjectPresent?: boolean
          firebaseError?: string | null
          firebaseCause?: string | null
        }
        detail = [
          [errorBody.message, errorBody.code].filter(Boolean).join(' — '),
          errorBody.expectedProjectId ? `expectedProjectId=${errorBody.expectedProjectId}` : '',
          errorBody.tokenAudience ? `tokenAudience=${errorBody.tokenAudience}` : '',
          errorBody.tokenIssuer ? `tokenIssuer=${errorBody.tokenIssuer}` : '',
          typeof errorBody.tokenSubjectPresent === 'boolean'
            ? `tokenSubjectPresent=${errorBody.tokenSubjectPresent}`
            : '',
          errorBody.firebaseError ? `firebaseError=${errorBody.firebaseError}` : '',
          errorBody.firebaseCause ? `firebaseCause=${errorBody.firebaseCause}` : '',
        ]
          .filter(Boolean)
          .join(' | ')
      } catch {
        // Preserve a non-JSON backend response for diagnostics.
      }

      throw new Error(
        `Authentication failed${detail ? `: ${detail}` : '. The API received no valid Firebase principal.'}`,
      )
    }

    throw new Error(
      `Backend request failed: ${response.status} ${response.statusText}${
        response.body ? ` - ${response.body}` : ''
      }`,
    )
  }

  return response
}

const requestJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await requestBackend(path, init)

  return JSON.parse(response.body) as T
}

const mapComment = (comment: BackendComment): PageExtraComment => ({
  id: comment.id,
  authorId: comment.authorId,
  author:
    comment.authorDisplayName ??
    comment.authorName ??
    comment.author ??
    'PageExtras user',
  reputation: comment.authorReputation ?? comment.reputation ?? 0,
  createdAt: comment.createdAt ?? comment.created_at ?? new Date().toISOString(),
  content: comment.content,
  upvotes: comment.upvotes ?? Math.max(comment.score ?? 0, 0),
  downvotes: comment.downvotes ?? Math.max(-(comment.score ?? 0), 0),
  replies: comment.replies?.map(mapComment),
})

export const resolveBackendPage = async (page: PageInfo) => {
  const normalizedUrl = normalizePageUrl(page.url)

  const payload = {
    url: page.url,
    canonicalUrl: page.url,
    normalizedUrl,
    domain: page.domain,
    title: page.title,
  }

  const response = await requestJson<PageResponse>('/api/pages', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return 'page' in response ? response.page : response
}

export const getBackendComments = async (pageId: string, sort = 'top') => {
  const response = await requestJson<CommentsResponse>(
    `/api/comments?pageId=${encodeURIComponent(pageId)}&sort=${encodeURIComponent(sort)}`,
  )

  const comments = Array.isArray(response) ? response : response.comments
  return comments.map(mapComment)
}

export const createBackendComment = async ({
  pageId,
  content,
  parentId,
}: {
  pageId: string
  content: string
  parentId?: string
}) => {
  const session = await getAuthSession()
  const response = await requestJson<BackendComment>(
    '/api/comments',
    {
      method: 'POST',
      body: JSON.stringify({
        pageId,
        content,
        parentId,
        authorDisplayName: session?.user.username,
      }),
    },
  )

  return mapComment(response)
}

export const updateBackendComment = async ({
  pageId,
  commentId,
  content,
}: {
  pageId: string
  commentId: string
  content: string
}) => {
  const response = await requestJson<BackendComment>(
    `/api/comments/${encodeURIComponent(commentId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ pageId, content }),
    },
  )

  return mapComment(response)
}

export const deleteBackendComment = async ({
  pageId,
  commentId,
}: {
  pageId: string
  commentId: string
}) => {
  await requestBackend(
    `/api/comments/${encodeURIComponent(commentId)}?pageId=${encodeURIComponent(pageId)}`,
    { method: 'DELETE' },
  )
}

export const voteBackendComment = async ({
  pageId,
  commentId,
  value,
}: {
  pageId: string
  commentId: string
  value: -1 | 0 | 1
}) => {
  await requestBackend(`/api/comments/${encodeURIComponent(commentId)}/vote`, {
    method: 'POST',
    body: JSON.stringify({ pageId, value }),
  })
}

export const reportBackendComment = async ({
  pageId,
  commentId,
  reason,
}: {
  pageId: string
  commentId: string
  reason: string
}) => {
  await requestBackend(`/api/comments/${encodeURIComponent(commentId)}/reports`, {
    method: 'POST',
    body: JSON.stringify({ pageId, reason }),
  })
}
