import { FeatureGuide } from '@/components/info/FeatureGuide';
import { GuideJsonLd, guideMetadata } from '@/components/info/GuideHead';

export const metadata = guideMetadata('value', 'en');
export default function Page() {
  return (
    <>
      <GuideJsonLd id="value" locale="en" />
      <FeatureGuide id="value" />
    </>
  );
}
