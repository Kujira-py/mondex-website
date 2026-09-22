'use client';

import { useState } from 'react';
import { useLanguage } from './Language';
import { livingDex } from '@/lib/living-dex';

export function DexExplorer() {
  const { copy, locale } = useLanguage();
  const [filter, setFilter] = useState(0);
  const [selectedId, setSelectedId] = useState(1);
  const visible = livingDex.filter((p) => filter === 0 || (filter === 1 ? p.owned : !p.owned));
  const selected = visible.find((p) => p.id === selectedId) ?? visible[0];
  const name = selected.name[locale];
  const owned = livingDex.filter((p) => p.owned).length;
  const moveTo = (id: string, block: ScrollLogicalPosition = 'start') => {
    const target = document.getElementById(id);
    target?.scrollIntoView({
      block,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  return (
    <div className="living-dex">
      <div className="living-dex-toolbar">
        <div className="dex-filter" role="group" aria-label={copy.dex.label}>
          {copy.dex.filters.map((label, i) => (
            <button key={label} aria-pressed={filter === i} onClick={() => setFilter(i)}>
              {label}
            </button>
          ))}
        </div>
        <p className="living-progress">
          <strong>
            {owned}
            <span> / {livingDex.length}</span>
          </strong>
          {locale === 'de' ? 'entdeckt · Beispielsammlung' : 'discovered · example collection'}
        </p>
      </div>
      <div className="living-dex-layout">
        <div
          className="living-grid"
          aria-label={locale === 'de' ? 'Pokémon auswählen' : 'Choose a Pokémon'}
        >
          {visible.map((p) => (
            <button
              key={p.id}
              id={`living-pokemon-${p.id}`}
              className={p.owned ? 'is-owned' : 'is-missing'}
              aria-pressed={selected.id === p.id}
              aria-controls="living-dex-detail"
              aria-label={copy.dex.view
                .replace('{name}', p.name[locale])
                .replace('{state}', p.owned ? copy.dex.owned : copy.dex.missing)}
              onClick={() => {
                setSelectedId(p.id);
                if (matchMedia('(max-width: 759px)').matches) moveTo('living-dex-detail');
              }}
            >
              <span className="living-number">#{String(p.id).padStart(3, '0')}</span>
              <img
                src={`/assets/pokemon-${p.id}.webp`}
                alt=""
                width="320"
                height="320"
                loading="lazy"
              />
              <span className="living-name">{p.name[locale]}</span>
              <span className="living-owned-dot" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div
          id="living-dex-detail"
          className="living-detail"
          role="region"
          aria-label={locale === 'de' ? 'Ausgewähltes Pokémon' : 'Selected Pokémon'}
        >
          <button
            className="living-back"
            onClick={() => {
              const id = `living-pokemon-${selected.id}`;
              document.getElementById(id)?.focus({ preventScroll: true });
              moveTo(id, 'center');
            }}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="m10 15 0-10m-5 5 5-5 5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {locale === 'de' ? 'Zurück zu den Pokémon' : 'Back to the Pokémon'}
          </button>
          <div className="living-detail-content" key={selected.id}>
            <div className="living-detail-heading">
              <span>#{String(selected.id).padStart(3, '0')}</span>
              <span className="living-detail-state">
                {selected.owned ? copy.dex.owned : copy.dex.next}
              </span>
            </div>
            <h3>{name}</h3>
            <div className="living-artwork">
              <img
                className="living-portrait"
                src={`/assets/pokemon-${selected.id}.webp`}
                alt={name}
                width="320"
                height="320"
              />
              <img
                className="living-matching-card"
                src={`/assets/card-${selected.card.id}.webp`}
                alt={`${selected.card.name} · ${selected.card.set} · ${selected.card.number}`}
                width="660"
                height="922"
              />
            </div>
            <div className="living-card-identity">
              <span>
                {locale === 'de' ? 'Eine Karte. Dein Pokémon.' : 'One card. Your Pokémon.'}
              </span>
              <strong>{selected.card.name}</strong>
              <p>
                {selected.card.set} · {selected.card.number}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="living-selection-status sr-only" role="status">
        {name} · {selected.card.set} · {selected.card.number}
      </p>
    </div>
  );
}
