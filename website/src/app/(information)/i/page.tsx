import type { Metadata } from 'next';
// An invitation link, mondextcg.com/i/<code>: GitHub Pages serves 404.html for
// the code's path, whose first script sends it here as /i/?code=<code>
// (scripts/prepare-pages.mjs). Personal links, so never indexed.
export const metadata: Metadata = {
  alternates: { canonical: '/i/' },
  robots: { index: false, follow: false },
};
export { default } from '@/components/info/InvitePage';
