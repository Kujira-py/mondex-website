"use client";
import { useLocale } from "./locale";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { CardImage } from "./shared";
import { type DemoCard } from "./data";
export default function CardViewer({ card, onClose }: { card: DemoCard | null; onClose: () => void }) {
  const { t } = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!card) return;
    const trigger = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; trigger?.focus({ preventScroll: true }); };
  }, [card]);
  return <dialog className="card-viewer" ref={dialog} aria-labelledby="viewer-title" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onClose={onClose}>
    {card && <div className="viewer-content"><button type="button" className="icon-button viewer-close" onClick={onClose} aria-label={t("Kartenansicht schließen")}><X /></button><CardImage card={card} eager /><h2 id="viewer-title">{t(card.name)}</h2><p>{card.set} · {card.number}</p><span className="demo-note">{t("Katalogbild · Demo-Karte")}</span></div>}
  </dialog>;
}
