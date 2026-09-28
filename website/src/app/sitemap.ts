import type { MetadataRoute } from 'next';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '',
    'de/',
    'pokemon-tcg-scanner/',
    'pokemon-card-collection-tracker/',
  ].map((path) => ({ url: `https://mondextcg.com/${path}` }));
}
