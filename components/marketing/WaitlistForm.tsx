"use client";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { useLocale } from "./locale";
import { Orbit } from "./shared";
import { WAITLIST_ENDPOINT } from "./config";

type Platform = "ios" | "android";
type FormError = "email" | "rate-limit" | "server" | null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_TIMEOUT_MS = 15_000;
const platforms: [Platform, string][] = [["ios", "iPhone"], ["android", "Android"]];
const subscribeToNothing = () => () => {};

// A campaign tag from the URL is more useful than the placement, so it wins when present.
const signupSource = (placement: string) => (new URLSearchParams(window.location.search).get("utm_campaign")?.trim() || placement).slice(0, 64);

export function WaitlistForm({ source }: { source: string }) {
  const { t } = useLocale();
  const id = useId();
  // Until hydration a submit would fall back to a GET navigation with the email in the URL, so the button stays disabled.
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<FormError>(null);
  const inFlight = useRef(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => { if (submitted) confirmation.current?.focus(); }, [submitted]);

  const rejectEmail = () => { setError("email"); emailInput.current?.focus(); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const address = email.trim();
    if (!EMAIL_PATTERN.test(address)) return rejectEmail();
    inFlight.current = true;
    setSubmitting(true);
    setError(null);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          email: address,
          name: name.trim().slice(0, 120) || undefined,
          platform: platform ?? undefined,
          source: signupSource(source),
          locale: navigator.language?.slice(0, 16) || undefined,
          website: honeypot.current?.value ?? "",
        }),
      });
      // 200 covers new, already-listed and honeypot signups alike; never reveal which.
      if (response.ok) setSubmitted(true);
      else if (response.status === 422) rejectEmail();
      else setError(response.status === 429 ? "rate-limit" : "server");
    } catch {
      setError("server");
    } finally {
      window.clearTimeout(timeout);
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (submitted) return <div ref={confirmation} className="waitlist-confirmation" role="status" tabIndex={-1}><Check size={20} aria-hidden="true" /><p>{t("Du stehst auf der Liste! Wir schreiben dir, sobald MonDex verfügbar ist.")}</p></div>;

  const emailErrorId = `${id}-email-error`, feedbackId = `${id}-feedback`, noteId = `${id}-note`;
  return <form className="waitlist-form" noValidate onSubmit={submit} aria-busy={submitting}>
    <div className="waitlist-field">
      <label htmlFor={`${id}-email`}>{t("E-Mail-Adresse")}</label>
      <input ref={emailInput} id={`${id}-email`} name="email" type="email" inputMode="email" required autoComplete="email" autoCapitalize="off" spellCheck={false} placeholder={t("du@beispiel.de")} value={email} aria-invalid={error === "email"} aria-describedby={emailErrorId} onChange={event => { setEmail(event.target.value); if (error === "email") setError(null); }} />
      <p id={emailErrorId} className="field-error" aria-live="polite">{error === "email" ? t("Bitte gib eine gültige E-Mail-Adresse ein.") : null}</p>
    </div>
    <div className="waitlist-field">
      <label htmlFor={`${id}-name`}>{t("Vorname")} <span>{t("(optional)")}</span></label>
      <input id={`${id}-name`} name="name" type="text" autoComplete="given-name" maxLength={120} value={name} onChange={event => setName(event.target.value)} />
    </div>
    <fieldset className="platform-choice" aria-describedby={`${id}-platform-hint`}>
      <legend>{t("Ich nutze")} <span>{t("(optional)")}</span></legend>
      <div>{platforms.map(([value, label]) => <label key={value}><input type="radio" name="platform" value={value} checked={platform === value} onChange={() => setPlatform(value)} /><span>{label}</span></label>)}</div>
      <p id={`${id}-platform-hint`} className="field-hint">{t("MonDex startet zuerst auf dem iPhone.")}</p>
    </fieldset>
    <div className="waitlist-trap" aria-hidden="true"><input ref={honeypot} name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" defaultValue="" /></div>
    {/* aria-disabled rather than disabled while sending, so keyboard focus stays on the button. */}
    <button type="submit" className="button primary" disabled={!hydrated} aria-disabled={submitting} aria-describedby={`${feedbackId} ${noteId}`}>{submitting ? <>{t("Wird gesendet …")}<LoaderCircle className="spin" size={18} aria-hidden="true" /></> : <>{t("Zum Launch vormerken")}<ArrowUpRight size={18} aria-hidden="true" /></>}</button>
    <p id={noteId} className="form-note">{t("Wir schreiben dir nur zum Launch von MonDex.")}</p>
    <p id={feedbackId} className="form-feedback" role="alert">{error === "rate-limit" ? t("Zu viele Versuche – bitte versuche es in einer Minute erneut.") : error === "server" ? t("Etwas ist schiefgelaufen. Bitte versuche es erneut.") : null}</p>
  </form>;
}

export default function WaitlistSection({ source }: { source: string }) {
  const { t } = useLocale();
  return <section id="vormerken" className="section container waitlist-section" aria-labelledby="launch-title"><Orbit /><h2 id="launch-title">{t("Deine nächste Entdeckung")}<br />{t("beginnt mit deiner Sammlung.")}</h2><p>{t("Lass dich informieren, wenn MonDex verfügbar ist.")}</p>
    <WaitlistForm source={source} />
  </section>;
}
