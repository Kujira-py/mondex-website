import { FeatureGuide } from '@/components/info/FeatureGuide';
import { GuideJsonLd, guideMetadata } from '@/components/info/GuideHead';

export const metadata = guideMetadata('value', 'de');
export default function Page() {
  return (
    <>
      <GuideJsonLd id="value" locale="de" />
      <FeatureGuide id="value" />
    </>
  );
}
