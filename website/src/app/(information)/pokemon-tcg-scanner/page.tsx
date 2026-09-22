import type { Metadata } from 'next';
export const metadata: Metadata = { alternates: { canonical: '/pokemon-tcg-scanner/' } };
import { FeatureGuide } from '@/components/info/FeatureGuide';
export default function Page() {
  return <FeatureGuide path="/pokemon-tcg-scanner" />;
}
