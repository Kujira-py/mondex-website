import { FeatureGuide } from '@/components/info/FeatureGuide';
import { GuideJsonLd, guideMetadata } from '@/components/info/GuideHead';

export const metadata = guideMetadata('scanner', 'de');
export default function Page() {
  return (
    <>
      <GuideJsonLd id="scanner" locale="de" />
      <FeatureGuide id="scanner" />
    </>
  );
}
