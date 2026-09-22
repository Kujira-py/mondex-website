import type { Metadata } from 'next';
export const metadata: Metadata = { alternates: { canonical: '/digital-pokemon-card-binder/' } };
import { FeatureGuide } from '@/components/info/FeatureGuide';
export default function Page() {
  return <FeatureGuide path="/digital-pokemon-card-binder" />;
}
