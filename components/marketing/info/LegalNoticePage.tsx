"use client";
import type { ReactNode } from "react";
import { useLocale, type Locale } from "../locale";
import { COPYRIGHT_YEAR, Fill, InfoIntro, InfoSections, Mail, Out, Rows, operator, type InfoSection } from "./shared";

type LegalCopy = {
  label: string; title: string; intro: string;
  detailsTitle: string; fields: { name: string; address: string; email: string; phone: string; register: string; responsible: string };
  sections: InfoSection[];
};

const trademark: Record<Locale, ReactNode> = {
  en: <>Pokémon and all related names, characters and card images are trademarks of Nintendo, Creatures Inc., GAME FREAK inc. and The Pokémon Company. MonDex is an independent fan-made collector’s app and is not affiliated with, sponsored or endorsed by them.</>,
  de: <>Pokémon und alle damit verbundenen Namen, Figuren und Kartenbilder sind Marken von Nintendo, Creatures Inc., GAME FREAK inc. und The Pokémon Company. MonDex ist eine unabhängige, von Fans entwickelte Sammler-App und steht in keiner Verbindung zu diesen Unternehmen. Sie wird von ihnen weder gesponsert noch unterstützt.</>,
};

const copy: Record<Locale, LegalCopy> = {
  en: {
    label: "Legal Notice",
    title: "Legal Notice",
    intro: "Who’s behind MonDex, how to reach us, and a few things to know about the prices, grades and Pokémon content you see in the app and on this site.",
    detailsTitle: "Operator",
    fields: { name: "Operator", address: "Address", email: "Email", phone: "Phone", register: "Company register / UID / VAT", responsible: "Responsible for content" },
    sections: [
      { id: "prices", title: "Prices and grades", body: <>
        <p>Card prices in MonDex are market estimates from third-party sources, provided for information only. They aren’t financial or investment advice, and they aren’t an offer to buy or sell.</p>
        <p>Grade scores are uncalibrated estimates, not professional grading.</p>
      </> },
      { id: "trademarks", title: "Pokémon trademarks", body: <>
        <p>{trademark.en}</p>
        <p>Card data is provided by <Out href="https://pokemontcg.io/">pokemontcg.io</Out>.</p>
      </> },
      { id: "links", title: "Links to other websites", body: <p>We aren’t responsible for the content of websites we link to. Their operators are.</p> },
      { id: "copyright", title: "Copyright", body: <p>The text and design of this website and the MonDex name and logo: © <Fill>{COPYRIGHT_YEAR}</Fill> <Fill>{operator.name}</Fill>. Pokémon names and card images belong to their owners (see above).</p> },
      { id: "disputes", title: "Dispute resolution", body: <p><Fill>[EU online dispute resolution / consumer arbitration statement, if required where you operate.]</Fill></p> },
    ],
  },
  de: {
    label: "Impressum",
    title: "Impressum",
    intro: "Wer hinter MonDex steht, wie du uns erreichst, und was du über die Preise, Zustandsschätzungen und Pokémon-Inhalte in der App und auf dieser Website wissen solltest.",
    detailsTitle: "Betreiber",
    fields: { name: "Betreiber", address: "Anschrift", email: "E-Mail", phone: "Telefon", register: "Handelsregister / UID / USt-IdNr.", responsible: "Verantwortlich für den Inhalt" },
    sections: [
      { id: "prices", title: "Preise und Zustandsschätzungen", body: <>
        <p>Kartenpreise in MonDex sind Marktschätzungen aus Quellen Dritter und dienen nur zur Information. Sie sind keine Finanz- oder Anlageberatung und kein Angebot zum Kauf oder Verkauf.</p>
        <p>Grade-Werte sind unkalibrierte Schätzungen, keine professionelle Bewertung.</p>
      </> },
      { id: "trademarks", title: "Pokémon-Markenhinweis", body: <>
        <p>{trademark.de}</p>
        <p>Die Kartendaten stammen von <Out href="https://pokemontcg.io/">pokemontcg.io</Out>.</p>
      </> },
      { id: "links", title: "Links zu anderen Websites", body: <p>Für die Inhalte von Websites, auf die wir verlinken, sind wir nicht verantwortlich. Dafür sind deren Betreiber zuständig.</p> },
      { id: "copyright", title: "Urheberrecht", body: <p>Texte und Gestaltung dieser Website sowie Name und Logo von MonDex: © <Fill>{COPYRIGHT_YEAR}</Fill> <Fill>{operator.name}</Fill>. Pokémon-Namen und Kartenbilder gehören ihren Inhabern (siehe oben).</p> },
      { id: "disputes", title: "Streitbeilegung", body: <p><Fill>[Hinweis zur EU-Online-Streitbeilegung / Verbraucherschlichtung, falls dort, wo du tätig bist, erforderlich.]</Fill></p> },
    ],
  },
};

export default function LegalNoticePage() {
  const { locale } = useLocale();
  const c = copy[locale];
  const { fields } = c;
  const rows: [ReactNode, ReactNode][] = [
    [fields.name, <Fill key="name">{operator.name}</Fill>],
    [fields.address, <Fill key="address">{operator.address}</Fill>],
    [fields.email, <Mail key="email" />],
    ...(operator.phone ? [[fields.phone, <Fill key="phone">{operator.phone}</Fill>] as [string, ReactNode]] : []),
    ...(operator.register ? [[fields.register, <Fill key="register">{operator.register}</Fill>] as [string, ReactNode]] : []),
    [fields.responsible, <Fill key="responsible">{operator.responsible}</Fill>],
  ];
  return <>
    <InfoIntro label={c.label} title={c.title}><p>{c.intro}</p></InfoIntro>
    <section className="info-card" aria-labelledby="operator-title">
      <h2 id="operator-title">{c.detailsTitle}</h2>
      <Rows items={rows} />
    </section>
    <InfoSections sections={c.sections} />
  </>;
}
