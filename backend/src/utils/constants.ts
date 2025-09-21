export const ACCESS_TOKEN_COOKIE = process.env.ACCESS_TOKEN_COOKIE || 'access_token';
export const REFRESH_TOKEN_COOKIE = process.env.REFRESH_TOKEN_COOKIE || 'refresh_token';
export const IS_PROD = process.env.NODE_ENV === 'production';
export const SKIP_EMAIL_VERIFICATION = process.env.SKIP_EMAIL_VERIFICATION === 'true';
