"use client";
import { useLocale } from "./locale";
import { useState } from "react";
import { Check, ScanLine } from "lucide-react";
import { demoCards, motion } from "./data";
import { CardImage, DemoNote, Tabs } from "./shared";
import { useDemoTransition } from "./state";
type Profile = "Standard" | "Holo" | "Metallic";
export default function ScanReactionDemo() {
  const { t } = useLocale();
  const [profile, setProfile] = useState<Profile>("Holo");
  const [phase, setPhase] = useState<"idle" | "recognizing" | "reacting" | "complete">("idle");
  const { ref: demoRef, run, cancel } = useDemoTransition();
  const card = profile === "Metallic" ? demoCards[4] : profile === "Standard" ? demoCards[0] : demoCards[1];
  const change = (value: Profile) => { cancel(); setPhase("idle"); setProfile(value); };
  const start = () => {
    if (phase === "recognizing" || phase === "reacting") return;
    setPhase("recognizing");
    run(120, () => { setPhase("reacting"); run(motion[profile.toLowerCase() as "standard" | "holo" | "metallic"] - 120, () => setPhase("complete")); });
  };
  return <section className="section container scan-section" aria-labelledby="scan-title"><div className="section-copy"><h2 id="scan-title">{t("Schnell erfasst.")}<br /><span className="muted-heading">{t("Besonders, wenn")}<br className="desktop-break" />{" "}{t("es besonders ist.")}</span></h2><p>{t("Füge Karten zu deiner Sammlung hinzu und sieh direkt, was sich verändert. Neue Dex-Einträge, Fortschritt für dein Set und kleine Reaktionen, die zur Karte passen.")}</p><div className="scan-explanation"><ScanLine size={20} /><span>{t("Ein kleiner Moment.")}<br />{t("Für deine nächste Lieblingskarte.")}</span></div></div>
    <div className={`scan-demo profile-${profile.toLowerCase()} scan-${phase}`} ref={demoRef}><div className="scan-art-stage" id="scan-panel" role="tabpanel" aria-label={`${profile} ${t("Effektvorschau")}`}><div className="scan-card" key={profile}><CardImage card={card} /><div className="scan-surface" aria-hidden="true"><i className="foil-reflection" /><i className="metal-edge" /></div><span className="scan-corner top-left" /><span className="scan-corner top-right" /><span className="scan-corner bottom-left" /><span className="scan-corner bottom-right" />{phase === "complete" && <span className="scan-confirm"><Check size={18} /></span>}</div></div>
      <div className="scan-result" role="status">{phase === "complete" ? <><strong>{t(card.name)}</strong><span>{card.set}{" "}{t("· Demo erkannt")}</span></> : <><strong>{profile === "Standard" ? t("Der Anfang einer Sammlung.") : profile === "Holo" ? t("Finde das Licht.") : t("Ein besonderer Glanz.")}</strong><span>{t("Effektprofil auswählen und ausprobieren.")}</span></>}</div>
      <Tabs items={["Standard", "Holo", "Metallic"] as const} value={profile} onChange={change} label="Scan-Effektprofil" panelId="scan-panel" /><button type="button" className="button secondary" disabled={phase === "recognizing" || phase === "reacting"} onClick={start}><ScanLine size={18} />{t("Scan-Demo starten")}</button><DemoNote>{t("Interaktive Demo — keine Kameraaufnahme.")}</DemoNote><p className="material-note">{t("Stilisierte Lichteffekte auf Katalogbildern.")}<br />{t("Keine exakte Nachbildung des Karten-Finishs.")}</p>
    </div>
  </section>;
}
