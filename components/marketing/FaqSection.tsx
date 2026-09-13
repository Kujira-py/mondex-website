"use client";
import { useLocale } from "./locale";
import { useState } from "react";
import { Plus } from "lucide-react";
import { faqs } from "./data";
export default function FaqSection() {
  const { t } = useLocale();
  const [open, setOpen] = useState<number | null>(null);
  return <section id="fragen" className="section container faq-section" aria-labelledby="faq-title"><div><h2 id="faq-title">{t("Noch neugierig?")}</h2><p>{t("Ein paar Antworten")}<br />{t("vor der nächsten Entdeckung.")}</p></div><div className="faq-list">{faqs.map((faq, index) => <div className={`faq-item ${open === index ? "is-open" : ""}`} key={t(faq.question)}><h3><button type="button" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}>{t(faq.question)}<Plus size={20} /></button></h3><div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} inert={open !== index} aria-hidden={open !== index}><div><p>{t(faq.answer)}</p></div></div><noscript><p>{t(faq.answer)}</p></noscript></div>)}</div></section>;
}
