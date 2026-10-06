import { FeatureGuide } from '@/components/info/FeatureGuide';
import { GuideJsonLd, guideMetadata } from '@/components/info/GuideHead';

export const metadata = guideMetadata('collection', 'de');
export default function Page() {
  return (
    <>
      <GuideJsonLd id="collection" locale="de" />
      <FeatureGuide id="collection" />
    </>
  );
}
