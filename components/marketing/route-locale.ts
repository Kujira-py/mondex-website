import type { Locale } from "./locale";
export type WebsitePageProps = { searchParams: Promise<{ lang?: string | string[] }> };
export async function routeLocale(props: WebsitePageProps): Promise<Locale> { return (await props.searchParams).lang === "en" ? "en" : "de"; }
