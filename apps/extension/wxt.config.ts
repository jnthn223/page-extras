import { defineConfig } from 'wxt'

export default defineConfig({
  dev: {
    server: {
      port: 3001,
      origin: 'http://localhost:3001',
      strictPort: true,
    },
  },
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
