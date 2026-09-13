"use client";
import { useLocale } from "./locale";
import { useState } from "react";
import { ArrowUpRight, Eye, EyeOff, Heart, Plus } from "lucide-react";
import { baseStats, binders, demoCards, ownedDemoCards, type DemoCard } from "./data";
import { CardImage, DemoNote, Tabs } from "./shared";
import { useDemo } from "./state";
import { BinderCover } from "./BinderShowcase";
import CardViewer from "./CardViewer";
type Tab = "Cards" | "Sets" | "Binders" | "Lists";
export default function CollectionPreview() {
  const { t, locale } = useLocale();
  const [tab, setTab] = useState<Tab>("Cards");
  const [card, setCard] = useState<DemoCard | null>(null);
  const stats = useDemo();
  return <section className="section container collection-section" aria-labelledby="collection-title"><div className="section-intro"><h2 id="collection-title">{t("Alles an seinem Platz.")}</h2><p>{t("Karten, Sets, Binder und Listen: Organisiere deine Sammlung so, wie du sammelst.")}</p></div>
    <div className="collection-demo"><div className="collection-demo-header"><h3>{t("Deine Sammlung")}<span>{stats.cards.toLocaleString(locale === "en" ? "en-GB" : "de-DE")}{" "}{t("Karten")}</span></h3><Tabs items={["Cards", "Sets", "Binders", "Lists"] as const} value={tab} onChange={setTab} label={t("Sammlungsansicht")} panelId="collection-panel" /></div>
      <div className="collection-panel" id="collection-panel" role="tabpanel" aria-label={`${tab} Demo`}><div className={`panel-enter collection-${tab.toLowerCase()}`} key={tab}>
        {tab === "Cards" && ownedDemoCards(stats.discovered).slice(0, 6).map(c => <button type="button" className="collection-card" key={c.id} onClick={() => setCard(c)} aria-label={`${t(c.name)} ${t("größer ansehen")}`}><CardImage card={c} small decorative /><strong>{t(c.name)}</strong><span>{c.set} · {c.number}</span></button>)}
        {tab === "Sets" && [{ name: "151", subtitle: "Scarlet & Violet", count: 187, total: 207, index: 0 }, { name: "Evolving Skies", subtitle: "Sword & Shield", count: 86, total: 237, index: 7 }, { name: "Brilliant Stars", subtitle: "Sword & Shield", count: 124, total: 216, index: 6 }].map(set => <div className="collection-set" key={set.name}><CardImage card={demoCards[set.index]} small /><div><small>{set.subtitle}</small><h4>{set.name}</h4><div className="progress-track"><i style={{ width: `${set.count / set.total * 100}%` }} /></div><span>{set.count} / {set.total}{" "}{t("Karten")}</span></div></div>)}
        {tab === "Binders" && binders.map((b, index) => <a href="#binder" className="collection-binder" key={b.id}><BinderCover index={index} /><span>{b.name}<ArrowUpRight size={16} /></span><small>{t("Binder-Demo ansehen")}</small></a>)}
        {tab === "Lists" && <><div className="wishlist-preview"><div className="wishlist-heading"><Heart size={20} /><span>{t("Die fehlen noch.")}</span></div><h4>{t("Deine Wunschliste")}</h4><p>{baseStats.wishlist}{" "}{t("Karten, auf die du dich freust.")}</p><div className="wishlist-cards">{demoCards.slice(7, 10).map(c => <CardImage small card={c} key={c.id} />)}</div></div><div className="list-preview-rows">{[{ title: "Zum Tauschen", count: "12 Karten", card: demoCards[3] }, { title: "Zum Graden", count: "6 Karten", card: demoCards[1] }, { title: "Meine nächste Entdeckung", count: "8 Karten", card: demoCards[10] }].map(list => <div className="list-preview-row" key={t(list.title)}><CardImage small card={list.card} /><div><strong>{t(list.title)}</strong><span>{t(list.count)}</span></div></div>)}<span className="list-preview-hint"><Plus size={16} />{t("Raum für deine eigenen Listen.")}</span></div></>}
      </div></div><DemoNote>{t("Sammlungsansichten · Beispieldaten")}</DemoNote>
    </div>{card && <CardViewer card={card} onClose={() => setCard(null)} />}
  </section>;
}
export function PortfolioPreview() {
  const { t, locale } = useLocale();
  const [hidden, setHidden] = useState(false);
  return <section className="container portfolio-section" aria-labelledby="portfolio-title"><div><h2 id="portfolio-title">{t("Und den Wert im Blick.")}</h2><p>{t("Marktwerte sind eine Perspektive auf deine Sammlung.")}<br />{t("Nicht der Grund, sie zu lieben.")}</p><span className="portfolio-motto">{t("Karten zuerst. Preise danach.")}</span></div><div className="portfolio-preview"><div className="portfolio-topline"><span>{t("Deine Sammlung · Beispielwert")}</span><button type="button" className="icon-button" aria-label={hidden ? t("Werte anzeigen") : t("Werte ausblenden")} aria-pressed={hidden} onClick={() => setHidden(!hidden)}>{hidden ? <Eye size={19} /> : <EyeOff size={19} />}</button></div><div className="portfolio-value" aria-live="polite">{hidden ? <span className="hidden-value">{t("Deine Lieblingsstücke.")}</span> : <><strong>{locale === "en" ? "8,420" : "8.420"}<span>{locale === "en" ? ".00 €" : ",00 €"}</span></strong><svg viewBox="0 0 200 70" aria-label={t("Beispielhafter Wertverlauf")} role="img"><path d="M2 60L16 55L25 59L37 48L45 51L59 39L67 42L79 32L88 38L104 27L117 32L126 21L140 26L153 15L165 19L181 8L196 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></>}</div><span className="demo-note">{hidden ? t("Werte ausgeblendet. Die Sammlung bleibt.") : t("Demodaten · Keine aktuellen Marktpreise")}</span></div></section>;
}
