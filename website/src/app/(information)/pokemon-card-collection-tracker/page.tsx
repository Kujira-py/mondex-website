import { FeatureGuide } from '@/components/info/FeatureGuide';
import { GuideJsonLd, guideMetadata } from '@/components/info/GuideHead';

export const metadata = guideMetadata('collection', 'en');
export default function Page() {
  return (
    <>
      <GuideJsonLd id="collection" locale="en" />
      <FeatureGuide id="collection" />
    </>
  );
}
