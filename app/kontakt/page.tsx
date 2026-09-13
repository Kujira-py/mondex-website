import InfoPage from "@/components/marketing/InfoPage";
import { routeLocale, type WebsitePageProps } from "@/components/marketing/route-locale";
export default async function Page(props: WebsitePageProps) { return <InfoPage initialLocale={await routeLocale(props)} title="Kontakt" paragraphs={["Die offiziellen Kontaktdaten von MonDex werden hier vor der Veröffentlichung ergänzt.", "Für diesen Prototyp wurde noch keine Kontaktadresse bereitgestellt. Es gibt deshalb derzeit kein Kontaktformular."]} />; }
