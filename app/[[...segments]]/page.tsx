import { notFound } from "next/navigation";
import MarketingSite from "@/components/marketing/MarketingSite";
import FeaturePage from "@/components/marketing/FeaturePage";
import InfoPage from "@/components/marketing/InfoPage";
import { featurePaths, pageMetadata, searchPages, type FeaturePath } from "@/components/marketing/seo";
import { infoContent } from "@/components/marketing/info-content";

type Props = { params: Promise<{ segments?: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(searchPages).flatMap(path => [[], ["en"]].map(prefix => ({ segments: [...prefix, ...path.split("/").filter(Boolean)] })));
}
async function resolvePage({ params }: Props) {
  const { segments = [] } = await params;
  const locale = segments[0] === "en" ? "en" : "de";
  const path = `/${(locale === "en" ? segments.slice(1) : segments).join("/")}`;
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
  return <InfoPage {...infoContent[path]} pagePath={path} initialLocale={locale} />;
}
