"use client";
import { useLocale } from "./locale";
import { useRef, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Orbit } from "./shared";
export default function WaitlistForm() {
  const { t } = useLocale();
  const form = useRef<HTMLFormElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<"idle" | "invalid" | "demo">("idle");
  return <section id="vormerken" className="section container waitlist-section" aria-labelledby="launch-title"><Orbit /><h2 id="launch-title">{t("Deine nächste Entdeckung")}<br />{t("beginnt mit deiner Sammlung.")}</h2><p>{t("Lass dich informieren, wenn MonDex verfügbar ist.")}</p>
    <form ref={form} className="waitlist-form" noValidate onSubmit={event => { event.preventDefault(); if (!input.current?.value.trim() || !input.current.validity.valid) { setState("invalid"); input.current?.focus(); return; } setState("demo"); input.current.value = ""; }}>
      <label htmlFor="launch-email">{t("E-Mail-Adresse")}</label><div className="email-field"><input ref={input} id="launch-email" type="email" required autoComplete="email" placeholder={t("du@beispiel.de")} aria-invalid={state === "invalid"} aria-describedby="form-note form-feedback" onInput={() => { if (state !== "idle") setState("idle"); }} /><ArrowUpRight size={19} aria-hidden="true" /></div>
      <button type="button" className="button primary" onClick={() => form.current?.requestSubmit()}>{t("Zum Launch vormerken")}<ArrowUpRight size={18} /></button>
      <p id="form-note" className="form-note">{t("Formular-Demo · Deine E-Mail-Adresse wird nicht gespeichert.")}</p><div id="form-feedback" className={`form-feedback ${state}`} role="status">{state === "invalid" ? t("Bitte gib eine gültige E-Mail-Adresse ein.") : state === "demo" ? <><Check size={17} /><span>{t("Demo abgeschlossen — deine E-Mail-Adresse wurde nicht gespeichert.")}</span></> : null}</div>
    </form>
  </section>;
}
