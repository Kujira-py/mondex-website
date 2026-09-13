"use client";
import { useLocale } from "./locale";
import { useState } from "react";
import { ArrowUpRight, BookOpen, ChartNoAxesCombined, House, Layers, ScanLine, Search, Sparkles, Wifi, BatteryFull } from "lucide-react";
import { assets, demoCards, demoPokemon, ownedDemoCards } from "./data";
import { CardImage, DemoNote, Orbit, Tabs } from "./shared";
import { useDemo } from "./state";
function MiniDex() {
  const { t } = useLocale();
  const { discovered } = useDemo();
  return <div className="mini-dex">{demoPokemon.map(p => <div key={p.id}><span>#{String(p.id).padStart(3, "0")}</span><img src={assets.pokemon(p.id)} width="240" height="240" alt="" className={!p.found && !(p.id === 151 && discovered) ? "silhouette" : ""} loading="lazy" /><small>{p.found || p.id === 151 && discovered ? t(p.name) : t("Unentdeckt")}</small></div>)}</div>;
}
export default function AppPreview() {
  const { t, locale } = useLocale();
  const [tab, setTab] = useState<"Home" | "Pokédex" | "Binder">("Home");
  const stats = useDemo();
  return <div id="app-vorschau" className="app-preview" tabIndex={-1} aria-label={t("Interaktive App-Vorschau")}>
    <div className="phone"><div className="phone-camera" aria-hidden="true" /><div className="phone-status" aria-hidden="true"><span>9:41</span><span><Wifi size={13} /><BatteryFull size={17} /></span></div><div className="phone-brand"><span><Orbit />Mon<span>Dex</span></span><Search size={19} /><span className="demo-avatar">M</span></div>
      <div id="phone-panel" className="phone-content" role="tabpanel" aria-label={`${tab} ${t("Vorschau")}`}><div key={tab} className="panel-enter">
        {tab === "Home" && <><div className="mini-summary"><small>{t("DEINE SAMMLUNG")}</small><p><strong>{stats.cards.toLocaleString(locale === "en" ? "en-GB" : "de-DE")}</strong>{" "}{t("Karten")}</p><span>{stats.pokemon}{" "}{t("Pokémon · Deine Geschichten.")}</span></div><div className="mini-goal"><div className="mini-label">{t("WEITER SAMMELN")}{" "}<Sparkles size={13} /></div><div className="mini-goal-title"><strong>Kanto Living Dex</strong><span>{stats.kanto} <small>/ 151</small></span></div><div className="progress-track"><i style={{ width: `${stats.kanto / 151 * 100}%` }} /></div><div className="mini-goal-meta"><span>{151 - stats.kanto}{" "}{t("Pokémon fehlen")}</span><span>{t("Dein Dex")}{" "}<ArrowUpRight size={12} /></span></div><div className="mini-missing">{[149, 150, 151].map(id => <img key={id} className={id === 151 && stats.discovered ? "" : "silhouette"} src={assets.pokemon(id)} width="240" height="240" alt="" />)}<span>+5</span></div></div><div className="mini-recents"><strong>{t("Zuletzt hinzugefügt")}</strong><div>{(stats.discovered ? [demoCards[4], ...demoCards.slice(0, 2)] : demoCards.slice(0, 3)).map(card => <CardImage card={card} small eager key={card.id} />)}</div></div></>}
        {tab === "Pokédex" && <><div className="mini-heading"><h3>{t("Dein Pokédex.")}</h3><span>{stats.pokemon}{" "}{t("Pokémon entdeckt")}</span></div><MiniDex /></>}
        {tab === "Binder" && <><div className="mini-heading"><h3>{t("Deine Lieblingsstücke.")}</h3><span>{t("Signature · Demo-Seite 1 von 3")}</span></div><div className="mini-binder">{ownedDemoCards(stats.discovered).slice(0, 9).map(card => <div className="pocket" key={card.id}><CardImage card={card} small /></div>)}</div></>}
      </div></div>
      <div className="phone-nav" aria-hidden="true">{[{ icon: House, label: "Home" }, { icon: BookOpen, label: "Dex" }, { icon: ScanLine, label: "Scan" }, { icon: Layers, label: "Collection" }, { icon: ChartNoAxesCombined, label: "Portfolio" }].map(({ icon: Icon, label }) => <span key={label} className={label === (tab === "Pokédex" ? "Dex" : tab === "Binder" ? "Collection" : tab) ? "active" : ""}><Icon size={19} />{label}</span>)}</div><div className="phone-home" aria-hidden="true" />
    </div>
    <Tabs items={["Home", "Pokédex", "Binder"] as const} value={tab} onChange={setTab} label={t("App-Vorschau auswählen")} panelId="phone-panel" /><DemoNote />
  </div>;
}
