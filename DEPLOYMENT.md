# PageExtras Client Deployment

The client repo has two deployable pieces:

- `apps/web`: Next.js web app
- `apps/extension`: WXT browser extension

## Web App Environment

Set these in the web hosting platform:

```sh
NEXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
NEXT_PUBLIC_FIREBASE_API_KEY=<firebase-web-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pageextras-43525.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pageextras-43525
NEXT_PUBLIC_FIREBASE_APP_ID=<firebase-web-app-id>
```

Build:

```sh
npm run build:web
```

## Extension Environment

Set these before building the production extension:

```sh
WXT_PUBLIC_API_BASE_URL=https://api.your-domain.com
WXT_PUBLIC_WEB_APP_URL=https://your-web-domain.com
```

Build:

```sh
npm run build:extension
```

Package for store upload:

```sh
npm run zip:extension
```

The extension API and web URLs are baked into the extension bundle at build time.
