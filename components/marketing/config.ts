// Called from the browser so the API's per-IP rate limit applies to each visitor. Override with NEXT_PUBLIC_MONDEX_API_URL at build time.
export const MONDEX_API_URL = (process.env.NEXT_PUBLIC_MONDEX_API_URL || "https://mondex-api.onrender.com").replace(/\/$/, "");
export const WAITLIST_ENDPOINT = `${MONDEX_API_URL}/api/v1/waitlist`;
