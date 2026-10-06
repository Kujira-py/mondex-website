// The one place that decides how people get MonDex from this website.
//
// Until MonDex is on the App Store, every call to action is the launch list
// (one email on launch day). The day it is live, set APP_STORE_LIVE to true:
// the page then links the App Store, shows Apple's Smart App Banner and a QR
// code on wide screens, and the launch list stays for Android.
// Apple's official badges must be in public/assets/badges/ (app-store-en.svg,
// app-store-de.svg) before switching; verify-pages.mjs checks for them.

export const APP_STORE_ID = '6808037045';
export const APP_STORE_LIVE = false;

/** The App Store link, tagged with where on the page it was tapped (App Store Connect → Analytics → Campaigns). */
export function appStoreUrl(locale: 'en' | 'de', placement: string) {
  const store = locale === 'de' ? 'de' : 'us';
  return `https://apps.apple.com/${store}/app/id${APP_STORE_ID}?ct=${encodeURIComponent(`web-${placement}`)}`;
}
