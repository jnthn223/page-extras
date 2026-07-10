import { defineConfig } from 'wxt'

export default defineConfig({
  manifest: {
    name: 'PageExtras',
    description: 'A community discussion layer for every webpage.',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['http://*/*', 'https://*/*'],
    action: {
      default_title: 'PageExtras',
    },
  },
})
