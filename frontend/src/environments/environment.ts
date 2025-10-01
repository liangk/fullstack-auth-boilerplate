export const environment = {
  production: true,
  // Uses Vercel proxy to backend (see vercel.json)
  // This makes cookies same-origin, avoiding SameSite=None issues
  apiUrl: '/api'
};
