import MarketingSite from "@/components/marketing/MarketingSite";
import { routeLocale, type WebsitePageProps } from "@/components/marketing/route-locale";
export default async function Page(props: WebsitePageProps) { return <MarketingSite initialLocale={await routeLocale(props)} />; }
export async function generateMetadata(props: WebsitePageProps) { return (await routeLocale(props)) === "en" ? { title: "MonDex — Your cards. Your MonDex.", description: "Discover your personal Pokédex, create digital binders and keep your collection in view. Explore interactive MonDex product demos." } : {}; }
