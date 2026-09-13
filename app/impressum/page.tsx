import InfoPage from "@/components/marketing/InfoPage";
import { routeLocale, type WebsitePageProps } from "@/components/marketing/route-locale";
export default async function Page(props: WebsitePageProps) { return <InfoPage initialLocale={await routeLocale(props)} title="Impressum" paragraphs={["Die Angaben zum Betreiber und die erforderlichen Kontaktdaten wurden für diesen Prototyp noch nicht bereitgestellt.", "Diese Seite ist noch kein vollständiges Impressum. Die endgültigen Angaben müssen vor der Veröffentlichung ergänzt werden."]} />; }
