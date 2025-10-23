# Vercel Deployment (Frontend)

Deploy the Angular frontend of StackInsight Auth Lite to Vercel.

## Overview

Option A) Use Vercel as a static host only (frontend calls backend directly)

Option B) Use Vercel rewrites to proxy `/api` to your backend

Both work. Choose one approach and keep it consistent with your environment settings.

---

## Prerequisites

- Vercel account and CLI installed
- Repo connected to Vercel
- Backend deployed (Railway/Render/etc.) with HTTPS URL

---

## Option A: Direct Backend URL (Recommended)

1) Set `frontend/src/environments/environment.ts` to your backend origin:
```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain/api'
};
```

2) Remove or ignore `vercel.json` rewrites.

3) Configure Vercel project:
- Framework Preset: "Other"
- Build Command: `npm run build`
- Output Directory: `dist/frontend`
- Install Command: `npm ci` (default)

4) Deploy.

---

## Option B: Vercel Proxy Rewrites

1) Keep `vercel.json` like this (example):
```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://your-backend-host/api/:path*" }
  ]
}
```

2) Set `environment.ts` to point to the same-origin `/api` path:
```ts
export const environment = {
  production: true,
  apiUrl: '/api'
};
```

3) Configure Vercel project:
- Framework Preset: "Other"
- Build Command: `npm run build`
- Output Directory: `dist/frontend`

4) Deploy.

---

## CORS and Cookies

- With Option A, configure backend CORS to allow your Vercel domain; frontend uses `withCredentials: true`.
- With Option B, requests are same-origin (`/api`), avoiding CORS issues.

## Assets & Base Href

- Ensure `<base href="/">` in `frontend/src/index.html` (already set)
- Angular SPA is served as static files; 404s should fall back to `index.html` (Vercel handles this by default)

## Troubleshooting

- 404 on deep links: ensure SPA fallback is enabled (default on Vercel)
- Cookies missing: must be HTTPS and `withCredentials: true`
- Mixed content: make sure backend URL uses `https://`
- Wrong output dir: must be `dist/frontend`

## Rollbacks

- Use Vercel dashboard to promote a previous deployment

## Notes

- Keep a single source of truth for API origin (either rewrites or direct URL)
- For custom domains, set them on both frontend and backend
