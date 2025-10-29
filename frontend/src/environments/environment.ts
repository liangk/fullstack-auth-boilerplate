export const environment = {
  production: true,
  // Use relative API path so Netlify can proxy `/api/*` requests to the backend.
  // This keeps requests same-origin (lite.stackinsight.app) so cookies set by the server
  // are sent by the browser on subsequent requests.
  apiUrl: '/api'
};
