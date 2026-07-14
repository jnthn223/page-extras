# PageExtras Client

Frontend and browser extension for PageExtras, a community discussion layer for webpages.

## Live URLs

- Homepage: <https://pageextras.com>
- Privacy Policy: <https://pageextras.com/privacy>
- Terms of Service: <https://pageextras.com/terms>
- API: <https://api.pageextras.com>
- API health check: <https://api.pageextras.com/api/health>

## Apps

This repo contains two client apps:

- `apps/web` — Next.js web app hosted on Firebase Hosting
- `apps/extension` — WXT browser extension for Chrome

## Requirements

- Node.js
- npm
- Firebase CLI, for web deployment
- Chrome Web Store developer account, for extension publishing

## Install

```sh
npm install
```

## Environment

### Web app

Use `apps/web/.env.local` for local development and `apps/web/.env.production` for production builds.

Required values:

```sh
NEXT_PUBLIC_API_BASE_URL=https://api.pageextras.com
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-web-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pageextras-43525.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pageextras-43525
NEXT_PUBLIC_FIREBASE_APP_ID=<firebase-web-app-id>
```

### Extension

Use `apps/extension/.env.local`.

Production values:

```sh
WXT_PUBLIC_API_BASE_URL=https://api.pageextras.com
WXT_PUBLIC_WEB_APP_URL=https://pageextras.com
```

## Development

Run both apps:

```sh
npm run dev
```

Run only the web app:

```sh
npm run dev:web
```

Run only the extension:

```sh
npm run dev:extension
```

## Build

Build the web app:

```sh
npm run build:web
```

Build the extension:

```sh
npm run build:extension
```

Package the extension for Chrome Web Store upload:

```sh
npm run zip:extension
```

## Deployment

Deploy the web app to Firebase Hosting:

```sh
firebase deploy --only hosting
```

The production web app is served at:

```text
https://pageextras.com
```

The extension bundle bakes in environment values at build time, so rebuild and repackage the extension whenever `WXT_PUBLIC_API_BASE_URL` or `WXT_PUBLIC_WEB_APP_URL` changes.

## Chrome Web Store listing

Homepage URL:

```text
https://pageextras.com
```

Privacy Policy URL:

```text
https://pageextras.com/privacy
```

Terms URL:

```text
https://pageextras.com/terms
```

Short description:

```text
Add community discussions to any webpage.
```

Single purpose:

```text
PageExtras adds a community comment and discussion panel to webpages so users can view and create page-specific discussions.
```

## Notes

- The web app and extension both use Firebase Authentication.
- The API is hosted separately at `https://api.pageextras.com`.
- Do not commit real `.env` files or Firebase service account JSON files.
