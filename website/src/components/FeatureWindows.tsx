'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PocketCollection, OfflineCollection } from './CollectionWindows';
import { gsap } from 'gsap';
import { addScanSweep } from '@/lib/scan-sweep';
import { useGSAP } from '@gsap/react';
import { useLanguage } from './Language';
import { Brand, Arrow } from './Primitives';
import { additionalCards, discoveryPokemon } from '@/lib/catalogue';
const scanCards = ['gardevoir', 'magikarp', 'suicune', 'sylveon'].map((id) =>
  additionalCards.find((c) => c.id === id)!,
);
gsap.registerPlugin(useGSAP);

function Phone({ dex = false, running }: { dex?: boolean; running: boolean }) {
  const { copy } = useLanguage();
  const t = copy.features;
  const ref = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useGSAP(
    () => {
      if (dex) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = ref.current!;
        const art = el.querySelectorAll('.scan-cycle-card');
        const matches = el.querySelectorAll('.scan-cycle-match');
        const beam = el.querySelector('.phone-scan-beam')!;
        gsap.set([...art, ...matches], { autoAlpha: 0 });
        const tl = gsap.timeline({ repeat: -1, paused: true });
        art.forEach((card, i) => {
          const at = i * 8;
          tl.fromTo(
            card,
            { autoAlpha: 0, y: 14, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.95, ease: 'power2.out' },
            at,
          )

            .fromTo(
              matches[i],
              { autoAlpha: 0, y: 5 },
              { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' },
              at + 4,
            )
            .to(
              [card, matches[i]],
              { autoAlpha: 0, y: -8, duration: 0.7, ease: 'sine.inOut' },
              at + 7.05,
            );
          addScanSweep(tl, beam, at + 1);
        });
        tl.to({}, { duration: 0.25 });
        timeline.current = tl;
        return () => {
          tl.kill();
          timeline.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  useEffect(() => {
    timeline.current?.paused(!running);
  }, [running]);
  return (
    <div
      ref={ref}
      className={`feature-phone ${dex ? 'phone-dex' : 'phone-scan'}`}
      data-running={running}
      aria-hidden="true"
    >
      <div className="phone-hardware">
        <span>9:41</span>
        <i />
        <span>▰</span>
      </div>
      <div className="phone-screen">
        <Brand />
        {dex ? (
          <>
            <h4>Pokédex</h4>
            <div className="phone-segments">
              <b>{t.all}</b>
              <span>{t.owned}</span>
              <span>{t.missing}</span>
            </div>
            <div className="phone-dex-viewport">
              <div
                className="phone-dex-track"
                style={{ animationPlayState: running ? 'running' : 'paused' }}
              >
                {[0, 1].map((group) => (
                  <div className="phone-dex-grid" key={group}>
                    {discoveryPokemon.map((p) => (
                      <div key={p.id}>
                        <small>#{String(p.id).padStart(3, '0')}</small>
                        <img
                          src={`/assets/pokemon-${p.id}.webp`}
                          alt=""
                          width="150"
                          height="150"
                          loading="lazy"
                        />
                        <span>{p.name}</span>
                        <i />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="phone-scan-label">
              <i />
              {t.capture}
            </div>
            <div className="phone-viewfinder">
              {scanCards.map((c, i) => (
                <img
                  key={c.id}
                  className="scan-cycle-card"
                  style={{ '--index': i } as CSSProperties}
                  src={`/assets/card-${c.id}.webp`}
                  alt=""
                  width="660"
                  height="922"
                  loading="lazy"
                />
              ))}
              <span className="phone-scan-beam scan-beam" />
            </div>
            <div className="phone-scan-results">
              {scanCards.map((c, i) => (
                <div
                  className="phone-scan-match scan-cycle-match"
                  key={c.id}
                  style={{ '--index': i } as CSSProperties}
                >
                  <i>✓</i>
                  <div>
                    <strong>{c.name}</strong>
                    <span>
                      {c.set} · {c.number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="phone-scan-modes">
              <span>Snap</span>
              <b>Auto</b>
              <span>Batch</span>
            </div>
          </>
        )}
        <div className="phone-home" />
      </div>
    </div>
  );
}
export function FeatureWindows() {
  const { copy } = useLanguage();
  const t = copy.features;
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false),
    [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => setReduced(media.matches);
    preference();
    media.addEventListener('change', preference);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    const observer = new IntersectionObserver(
      (entries) =>
        setVisible((previous) => ({
          ...previous,
          ...Object.fromEntries(
            entries.map((e) => [(e.target as HTMLElement).dataset.motion, e.isIntersecting]),
          ),
        })),
      { threshold: 0.08 },
    );
    root.current!.querySelectorAll('[data-motion]').forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      media.removeEventListener('change', preference);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  const running = (key: string) => !!visible[key] && !paused && !reduced && !hidden;
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cleanup = gsap.utils
          .toArray<HTMLElement>('.feature-window', root.current!)
          .map((surface) => {
            const rx = gsap.quickTo(surface, 'rotationX', { duration: 0.65, ease: 'power3.out' }),
              ry = gsap.quickTo(surface, 'rotationY', { duration: 0.65, ease: 'power3.out' }),
              lift = gsap.quickTo(surface, 'y', { duration: 0.65, ease: 'power3.out' });
            const move = (e: PointerEvent) => {
              if (e.pointerType !== 'mouse') return;
              const b = surface.getBoundingClientRect();
              rx((0.5 - (e.clientY - b.top) / b.height) * 3);
              ry(((e.clientX - b.left) / b.width - 0.5) * 3);
              lift(-5);
            };
            const leave = () => {
              rx(0);
              ry(0);
              lift(0);
            };
            surface.addEventListener('pointermove', move);
            surface.addEventListener('pointerleave', leave);
            return () => {
              surface.removeEventListener('pointermove', move);
              surface.removeEventListener('pointerleave', leave);
            };
          });
        return () => cleanup.forEach((fn) => fn());
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section className="features-section" id="features" ref={root} aria-labelledby="features-title">
      <div className="section-shell">
        <div className="features-heading">
          <div>
            <span className="eyebrow">{t.label}</span>
            <h2 id="features-title">
              {t.title}
              <br />
              <em>{t.accent}</em>
            </h2>
          </div>
          <p>{t.body}</p>
        </div>
        <div className="feature-stage">
          <div className="feature-grid">
            <a className="feature-window feature-scan" data-motion="scan" href="#scanner">
              <div className="feature-window-copy">
                <span className="feature-index">01 / {t.scanLabel}</span>
                <h3>{t.scanTitle}</h3>
                <p>{t.scanBody}</p>
              </div>
              <span className="feature-more">
                <Arrow />
              </span>
              <Phone running={running('scan')} />
            </a>
            <a className="feature-window feature-dex" data-motion="dex" href="#entdecken">
              <div className="feature-window-copy">
                <span className="feature-index">02 / Pokédex</span>
                <h3>{t.dexTitle}</h3>
                <p>{t.dexBody}</p>
              </div>
              <span className="feature-more">
                <Arrow />
              </span>
              <Phone dex running={running('dex')} />
            </a>
            <a className="feature-window feature-offline" data-motion="offline" href="#scanner">
              <div className="feature-window-copy">
                <span className="feature-index">03 / Offline</span>
                <h3>{t.offlineTitle}</h3>
                <p>{t.offlineBody}</p>
              </div>
              <span className="feature-more">
                <Arrow />
              </span>
              <OfflineCollection running={running('offline')} />
            </a>

            <article className="feature-window feature-binder" data-motion="binder">
              <div className="feature-window-copy">
                <span className="feature-index">04 / Binder</span>
                <h3>{t.binderTitle}</h3>
                <p>{t.binderBody}</p>
              </div>
              <PocketCollection running={running('binder')} />
            </article>
          </div>
        </div>
        <div className="features-footer">
          <span>{t.caption}</span>
          <button
            className="feature-motion-toggle"
            onClick={() => setPaused(!paused)}
            aria-pressed={paused}
          >
            {paused ? copy.product.railResume : copy.product.railPause}
            <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
