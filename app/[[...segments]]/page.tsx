import { notFound } from "next/navigation";
import MarketingSite from "@/components/marketing/MarketingSite";
import FeaturePage from "@/components/marketing/FeaturePage";
import InfoPage, { type InfoPath } from "@/components/marketing/InfoPage";
import { featurePaths, pageMetadata, searchPages, type FeaturePath } from "@/components/marketing/seo";

type Props = { params: Promise<{ segments?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  // English is served without a prefix; "/en/" is kept so previously shared English links still resolve.
  return Object.keys(searchPages).flatMap(path => [[], ["de"], ["en"]].map(prefix => ({ segments: [...prefix, ...path.split("/").filter(Boolean)] })));
}
async function resolvePage({ params }: Props) {
  const { segments = [] } = await params;
  const prefixed = segments[0] === "de" || segments[0] === "en";
  const locale = segments[0] === "de" ? "de" : "en";
  const path = `/${(prefixed ? segments.slice(1) : segments).join("/")}`;
  if (!Object.hasOwn(searchPages, path)) notFound();
  return { path, locale } as const;
}
export async function generateMetadata(props: Props) {
  const { path, locale } = await resolvePage(props);
  return pageMetadata(path, locale);
}
export default async function Page(props: Props) {
  const { path, locale } = await resolvePage(props);
  if (path === "/") return <MarketingSite initialLocale={locale} />;
  if (featurePaths.includes(path as FeaturePath)) return <FeaturePage path={path as FeaturePath} initialLocale={locale} />;
  return <InfoPage path={path as InfoPath} initialLocale={locale} />;
}
