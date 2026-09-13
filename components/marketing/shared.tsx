"use client";
import { useLocale } from "./locale";
import { useId, type KeyboardEvent, type ReactNode } from "react";
import { assets, type DemoCard } from "./data";
export function Orbit({ className = "" }: { className?: string }) {
   return <img className={`orbit ${className}`} src={assets.orbit} width="28" height="28" alt="" />; }
export function Brand({ href = "/#top" }: { href?: string }) {
  const { t, href: localHref } = useLocale(); return <a className="brand" href={localHref(href)} aria-label={t("MonDex – Startseite")}><Orbit /><span>Mon<span className="brand-dex">Dex</span></span></a>; }
export function CardImage({ card, small = false, eager = false, decorative = false }: { card: DemoCard; small?: boolean; eager?: boolean; decorative?: boolean }) {
  const { t } = useLocale();
  return <img className="card-image" src={assets.card(card.id, small)} srcSet={`${assets.card(card.id, true)} 240w, ${assets.card(card.id)} 640w`} sizes={small ? "140px" : "(max-width: 767px) 75vw, 320px"} alt={decorative ? "" : `${t(card.name)} · ${card.set} · ${card.number}`} width="733" height="1024" loading={eager ? "eager" : "lazy"} decoding="async" draggable={false} />;
}
export function DemoNote({ children = "Interaktive Produktdemo · Beispieldaten" }: { children?: ReactNode }) {
  const { t } = useLocale(); return <p className="demo-note">{typeof children === "string" ? t(children) : children}</p>; }
export function Tabs<T extends string>({ items, value, onChange, label, panelId }: { items: readonly T[]; value: T; onChange: (value: T) => void; label: string; panelId: string }) {
  const { t } = useLocale();
  const id = useId();
  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = event.key === "ArrowRight" ? (index + 1) % items.length : event.key === "ArrowLeft" ? (index - 1 + items.length) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); onChange(items[next]); document.getElementById(`${id}-${next}`)?.focus();
  };
  return <div className="demo-tabs" role="tablist" aria-label={t(label)}>{items.map((item, index) => <button type="button" role="tab" id={`${id}-${index}`} aria-selected={value === item} aria-controls={panelId} tabIndex={value === item ? 0 : -1} onKeyDown={event => onKey(event, index)} onClick={() => onChange(item)} key={item}>{t(item)}</button>)}</div>;
}
