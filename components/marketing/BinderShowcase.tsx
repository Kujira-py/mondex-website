"use client";
import { useLocale } from "./locale";
import { useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { assets, binders, demoPokemon, motion, ownedDemoCards, type DemoCard } from "./data";
import { CardImage, DemoNote, Orbit } from "./shared";
import { useDemo, useDemoTransition } from "./state";
import CardViewer from "./CardViewer";
type Phase = "closed" | "opening" | "open" | "turning" | "closing";
export function BinderCover({ index }: { index: number }) {
  const { t } = useLocale();
  const binder = binders[index];
  return <div className={`binder-cover ${binder.id}`}><div className="cover-spine" /><div className="cover-top">MONDEX COLLECTION</div><div className="cover-center">{index === 0 ? <Orbit /> : index === 1 ? <><strong>KANTO</strong><span>001 — 151</span></> : <><span className="cover-subtitle">A FEW</span><strong>Favorites.</strong><span>TO KEEP CLOSE.</span></>}</div><div className="cover-bottom">{index === 0 ? "MonDex" : t(binder.detail)}</div></div>;
}
function BinderPage({ binder, page, second, onCard }: { binder: number; page: number; second?: boolean; onCard?: (card: DemoCard) => void }) {
  const { t } = useLocale();
  const { discovered } = useDemo();
  const owned = ownedDemoCards(discovered);
  return <div className="binder-page"><div className="binder-pockets">{Array.from({ length: 9 }, (_, index) => {
    const card = owned[(index + page * 3 + (second ? 6 : 0)) % owned.length];
    const pokemon = demoPokemon[(index + page * 3 + (second ? 3 : 0)) % demoPokemon.length];
    return binder === 1 ? <div className="pocket pokemon-pocket" key={index}><small>#{String(pokemon.id).padStart(3, "0")}</small><img width="240" height="240" src={assets.pokemon(pokemon.id)} alt={pokemon.found || pokemon.id === 151 && discovered ? t(pokemon.name) : t("Unentdeckt")} className={!pokemon.found && !(pokemon.id === 151 && discovered) ? "silhouette" : ""} loading="lazy" /></div> : <button type="button" className="pocket" key={index} aria-label={`${t(card.name)} ${t("größer ansehen")}`} onClick={() => onCard?.(card)}><CardImage card={card} small decorative /></button>;
  })}</div></div>;
}
export default function BinderShowcase() {
  const { t, href } = useLocale();
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<Phase>("closed");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [card, setCard] = useState<DemoCard | null>(null);
  const phaseRef = useRef<Phase>("closed");
  const targetPage = useRef<number | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const { ref: demoRef, run, cancel, reduced } = useDemoTransition();
  const busy = phase !== "closed" && phase !== "open";
  const changePhase = (value: Phase) => { phaseRef.current = value; setPhase(value); };
  const finish = () => {
    cancel();
    if (targetPage.current !== null) { setPage(targetPage.current); targetPage.current = null; }
    changePhase(phaseRef.current === "closing" ? "closed" : "open");
  };
  const open = () => {
    if (phaseRef.current !== "closed") return;
    changePhase("opening"); run(motion.binder + 100, finish);
  };
  const close = () => {
    if (phaseRef.current !== "open") return;
    changePhase("closing"); run(motion.binder + 100, finish);
  };
  const turn = (step: number) => {
    if (phaseRef.current !== "open" || page + step < 0 || page + step > 2) return;
    targetPage.current = page + step;
    setDirection(step); changePhase("turning"); run(motion.page + 100, finish);
  };
  const isTurning = phase === "turning";
  const leftPage = isTurning && direction < 0 ? page - 1 : page;
  const rightPage = isTurning && direction > 0 ? page + 1 : page;
  return <section id="binder" className="section binder-section" aria-labelledby="binder-title"><div className="container binder-heading"><h2 id="binder-title">{t("Eine Sammlung,")}<br />{t("die du gerne aufschlägst.")}</h2><p>{t("Ordne deine Lieblingskarten, fülle deinen Dex-Binder oder gestalte ein Album ganz nach deinen Vorstellungen.")}</p><a className="text-button feature-link" href={href("/digital-pokemon-card-binder")}>{t("Mehr über digitale Pokémon-Binder")}</a></div>
    <div className={`binder-stage phase-${phase}`} ref={demoRef} data-phase={phase}>
      <div className="binder-floor" aria-hidden="true" />
      <div className="binder-covers" inert={phase !== "closed"} aria-hidden={phase !== "closed"}>{binders.map((binder, index) => {
        const position = index === selected ? 0 : index === (selected + 1) % 3 ? 1 : -1;
        return <button type="button" className={`cover-choice ${index === selected ? "selected" : ""}`} style={{ "--position": position } as CSSProperties} key={binder.id} aria-label={`${binder.name} ${t("auswählen")}`} aria-pressed={selected === index} onClick={() => { setSelected(index); setPage(0); }}><BinderCover index={index} /><span className="cover-name">{binder.name}</span></button>;
      })}</div>
      <div className="binder-book" aria-label={`${binders[selected].name} Binder`} inert={phase !== "open"} aria-hidden={phase === "closed"}
        onTransitionEnd={event => { if (event.target === event.currentTarget && event.propertyName === "transform" && (phaseRef.current === "opening" || phaseRef.current === "closing")) finish(); }}
        onTouchStart={event => { swipe.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchCancel={() => { swipe.current = null; }}
        onTouchEnd={event => { if (!swipe.current) return; const dx = event.changedTouches[0].clientX - swipe.current.x; const dy = event.changedTouches[0].clientY - swipe.current.y; if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1); swipe.current = null; }}>
        <div className="binder-spread">
          <div className="binder-leaf left-page"><BinderPage binder={selected} page={leftPage} onCard={setCard} /></div>
          <div className="binder-leaf right-page"><BinderPage binder={selected} page={rightPage} second onCard={setCard} /></div>
        </div>
        <div className="binder-rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="opening-cover" aria-hidden="true" inert>
          <div className="cover-face cover-front"><BinderCover index={selected} /></div>
          <div className="cover-face cover-back binder-leaf"><BinderPage binder={selected} page={page} /></div>
        </div>
        {isTurning && !reduced && <div className={`turning-leaf ${direction > 0 ? "turn-forward" : "turn-backward"}`} aria-hidden="true" inert
          onAnimationEnd={event => { if (event.target === event.currentTarget && phaseRef.current === "turning") finish(); }}>
          <div className="turn-face turn-front binder-leaf"><BinderPage binder={selected} page={page} second={direction > 0} /></div>
          <div className="turn-face turn-back binder-leaf"><BinderPage binder={selected} page={page + direction} second={direction < 0} /></div>
        </div>}
      </div>
      <div className="binder-toolbar"><div className={`binder-open-controls ${phase === "closed" ? "is-active" : ""}`} inert={phase !== "closed"} aria-hidden={phase !== "closed"}><button type="button" className="button secondary" onClick={open}>{t("Binder öffnen")}{" "}<ArrowRight size={18} /></button></div><div className={`binder-reading-controls ${phase !== "closed" ? "is-active" : ""}`} inert={phase === "closed"} aria-hidden={phase === "closed"}><div className="page-controls"><button type="button" className="icon-button" aria-label={t("Vorherige Binder-Seite")} disabled={busy || page === 0} onClick={() => turn(-1)}><ChevronLeft size={20} /></button><span aria-live="polite">{t("Demo-Seite")}{" "}{page + 1}{" "}{t("von 3")}</span><button type="button" className="icon-button" aria-label={t("Nächste Binder-Seite")} disabled={busy || page === 2} onClick={() => turn(1)}><ChevronRight size={20} /></button></div><button type="button" className="text-button" disabled={busy} onClick={close}>{t("Binder schließen")}{" "}<X size={16} /></button></div></div>
    </div><DemoNote>{t("Drei Binder. Dein Stil. · Interaktive Demo mit Beispieldaten")}</DemoNote>{card && <CardViewer card={card} onClose={() => setCard(null)} />}
  </section>;
}
