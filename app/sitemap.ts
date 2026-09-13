import type { MetadataRoute } from "next";
import { canonicalUrl, featurePaths } from "@/components/marketing/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", ...featurePaths].flatMap(path => (["de", "en"] as const).map(locale => ({ url: canonicalUrl(path, locale) })));
}
