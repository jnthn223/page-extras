export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    console.info('PageExtras extension installed')
  })

  browser.runtime.onMessage.addListener((message) => {
    if (
      !message ||
      typeof message !== 'object' ||
      message.type !== 'PAGEEXTRAS_BACKEND_REQUEST'
    ) {
      return undefined
    }

    const request = message as {
      type: 'PAGEEXTRAS_BACKEND_REQUEST'
      url: string
      init?: {
        method?: string
        headers?: Record<string, string>
        body?: string
      }
    }

    return fetch(request.url, {
      method: request.init?.method,
      headers: request.init?.headers,
      body: request.init?.body,
    }).then(async (response) => ({
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      body: await response.text(),
    }))
  })
})
