"use client";
import { useLocale } from "./locale";
import { useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { assets, demoPokemon, motion } from "./data";
import { DemoNote } from "./shared";
import { useDemo, useDemoTransition } from "./state";
export default function DexDiscoveryDemo() {
  const { t } = useLocale();
  const { discovered, setDiscovered, kanto } = useDemo();
  const [revealing, setRevealing] = useState(false);
  const { ref: demoRef, run, cancel } = useDemoTransition();
  const reveal = () => {
    if (discovered || revealing) return;
    setRevealing(true);
    run(motion.discovery, () => { setRevealing(false); setDiscovered(true); });
  };
  const reset = () => { cancel(); setRevealing(false); setDiscovered(false); };
  return <section id="entdecken" className="section container discovery-section" aria-labelledby="dex-title">
    <div className="section-copy"><h2 id="dex-title">{t("Aus Karten wird")}<br />{t("dein Pokédex.")}</h2><p>{t("Jede erste Karte eines Pokémon füllt eine Lücke in deinem Dex. Sieh, wen du schon gesammelt hast — und wer dir noch fehlt.")}</p><button type="button" className="button secondary" disabled={discovered || revealing} onClick={reveal}>{discovered ? t("Mew entdeckt") : revealing ? t("Eine neue Entdeckung …") : t("Entdeckung ausprobieren")}{discovered ? <Check size={18} /> : <ArrowRight size={18} />}</button><div className="discovery-feedback" role="status">{discovered ? <span><span className="status-dot" />{t("Ein neuer Eintrag für deinen Dex.")}</span> : <span>{t("Jede Lücke ist der Anfang einer Geschichte.")}</span>}</div></div>
    <div className="dex-demo" ref={demoRef}>
      <div className="dex-grid">{demoPokemon.map(p => {
        const target = p.id === 151;
        const found = p.found || target && discovered;
        return <div className={`dex-entry ${target && revealing ? "is-revealing" : ""} ${target && discovered ? "just-discovered" : ""}`} key={p.id}>
          <span className="dex-number">#{String(p.id).padStart(3, "0")}</span><div className="dex-art"><img src={assets.pokemon(p.id)} width="240" height="240" alt={found ? t(p.name) : `${t("Unentdecktes Pokémon")} ${p.id}`} loading="lazy" className={found ? "" : "silhouette"} />{target && revealing && <><img className="reveal-art" src={assets.pokemon(p.id)} width="240" height="240" alt="" /><i className="dex-scan-line" /></>}</div><span className={`dex-name ${!found ? "muted" : ""}`}>{found ? t(p.name) : t("Unentdeckt")}</span>{target && discovered && <span className="new-entry-dot" />}
        </div>;
      })}</div>
      <div className="dex-progress"><div><span>Kanto Living Dex</span><strong>{kanto}<small> / 151</small></strong></div><div className="progress-track"><i style={{ width: `${kanto / 151 * 100}%` }} /></div></div>
      <div className="demo-bottom"><DemoNote>{t("Discovery-Demo · Beispieldaten")}</DemoNote><button type="button" className="text-button reset" onClick={reset} disabled={!discovered && !revealing}><RotateCcw size={13} />{t("Zurücksetzen")}</button></div>
    </div>
  </section>;
}
