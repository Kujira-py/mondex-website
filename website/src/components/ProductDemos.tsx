'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { addScanSweep } from '@/lib/scan-sweep';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HoloCard } from './HoloCard';
import { SetDiscoveryRail } from './SetDiscoveryRail';
import { additionalCards } from '@/lib/catalogue';
import { Arrow, Brand } from './Primitives';
import { useLanguage } from './Language';
import { discoveryCards, demoHistory, demoHoldings } from '@/lib/product-demo';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const collectionCards = [
  'magikarp',
  'gardevoir',
  'lugia',
  'leafeon',
  'houndour',
  'rayquaza',
  'dialga',
  'giratina',
  'blaziken',
].map((id) => additionalCards.find((c) => c.id === id)!);

export function CollectionExplorer() {
  const { copy, locale } = useLanguage();
  const [mode, setMode] = useState(0);
  const [selected, setSelected] = useState(2);
  const [placed, setPlaced] = useState(false);
  const [filled, setFilled] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const initial = useRef(true);
  const layoutState = useRef({ mode: 0, placed: false });
  const arrangement = useRef<gsap.core.Timeline | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  // Fixed-size layout layers prevent a width mutation before a transition.
  // GSAP samples the in-flight transforms on interruption; selection and foil live inside.
  const arrange = useCallback((animate = true) => {
    if (!art.current) return;
    const { mode, placed } = layoutState.current;
    arrangement.current?.kill();
    const tl = gsap.timeline();
    arrangement.current = tl;
    const w = art.current.clientWidth;
    const mobile = w < 650;
    const nodes = art.current.querySelectorAll<HTMLElement>('.collection-card-layout');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    nodes.forEach((node, i) => {
      let x = 0,
        y = 0,
        scale = 1,
        rotation = 0;
      if (mode === 0) {
        const width = Math.min(mobile ? 110 : 182, w / (mobile ? 3.25 : 6.2));
        scale = width / 190;
        x = (i - 2.5) * width * (mobile ? 0.58 : 0.9);
        y = Math.abs(i - 2.5) * (mobile ? 13 : 18) - 15;
        rotation = (i - 2.5) * 6;
      } else if (mode === 1) {
        const width = Math.min(mobile ? 92 : 140, w / (mobile ? 3.7 : 7));
        scale = width / 190;
        x = mobile ? ((i % 3) - 1) * width * 1.18 : (i - 2.5) * width * 1.14;
        y = mobile ? (Math.floor(i / 3) - 0.5) * width * 1.55 : 0;
      } else if (mode === 2) {
        const width = mobile ? Math.min(66, (w - 100) / 3.5) : 100;
        scale = width / 190;
        x = ((i % 3) - 1) * width * 1.16 - (mobile ? 35 : 85);
        y = (Math.floor(i / 3) - 1) * width * 1.53;
        if (i === 8 && !placed) {
          x = mobile ? w / 2 - 38 : 250;
          y = mobile ? 0 : 10;
          rotation = 7;
          scale *= 1.2;
        }
      } else {
        const width = mobile ? 48 : 82;
        scale = width / 190;
        x = mobile ? -w / 2 + 42 : i < 3 ? -w * 0.31 : w * 0.08;
        y = mobile ? (i - 2.5) * 62 : ((i % 3) - 1) * 145;
        rotation = 0;
      }
      const visible = i < 6 || mode === 2;
      node.inert = !visible;
      const vars = {
        x,
        y,
        scale,
        rotation,
        autoAlpha: visible ? 1 : 0,
        duration: animate && !reduced ? 0.78 : 0,
        ease: 'power3.inOut',
        overwrite: true,
      };
      gsap.set(node, { xPercent: -50, yPercent: -50 });
      if (i === 8 && placed && mode === 2 && animate && !reduced) {
        tl.to(
          node,
          { y: Number(gsap.getProperty(node, 'y')) - 20, rotation: 0, duration: 0.2 },
          0,
        ).to(node, { ...vars, duration: 0.75, onComplete: () => setFilled(true) }, 0.2);
      } else
        tl.to(
          node,
          {
            ...vars,
            onComplete: i === 8 && placed && mode === 2 ? () => setFilled(true) : undefined,
          },
          0,
        );
    });
    art.current.style.setProperty(
      '--binder-width',
      `${mobile ? Math.min(66, (w - 100) / 3.5) * 3.55 : 360}px`,
    );
    art.current.style.setProperty(
      '--binder-height',
      `${mobile ? Math.min(66, (w - 100) / 3.5) * 4.82 : 486}px`,
    );
    art.current.style.setProperty('--binder-offset', `${mobile ? -35 : -85}px`);
  }, []);
  useLayoutEffect(() => {
    layoutState.current = { mode, placed };
    arrange(!initial.current);
    initial.current = false;
    // Killing the entire timeline also cancels queued insertion steps and callbacks.
    return () => {
      arrangement.current?.kill();
    };
  }, [mode, placed, arrange]);
  useEffect(() => {
    const stage = art.current;
    if (!stage) return;
    let width = stage.clientWidth;
    const observer = new ResizeObserver(() => {
      if (stage.clientWidth === width) return;
      width = stage.clientWidth;
      arrange(false);
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [arrange]);
  const chooseMode = (next: number) => {
    setMode(next);
    setPlaced(false);
    setFilled(false);
    if (next !== 2 && selected > 5) setSelected(2);
  };
  const reset = () => {
    setFilled(false);
    setPlaced(false);
  };
  return (
    <div className="collection-explorer" ref={root}>
      <div className="collection-tabs" role="tablist" aria-label={copy.collection.label}>
        {copy.collection.modes.map((m, i) => (
          <button
            key={i}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`collection-tab-${i}`}
            role="tab"
            aria-selected={mode === i}
            aria-controls="collection-panel"
            tabIndex={mode === i ? 0 : -1}
            onClick={() => chooseMode(i)}
            onKeyDown={(e) => {
              const next =
                e.key === 'ArrowRight'
                  ? (i + 1) % 4
                  : e.key === 'ArrowLeft'
                    ? (i + 3) % 4
                    : e.key === 'Home'
                      ? 0
                      : e.key === 'End'
                        ? 3
                        : -1;
              if (next < 0) return;
              e.preventDefault();
              chooseMode(next);
              tabs.current[next]?.focus();
            }}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div
        className="collection-panel"
        id="collection-panel"
        role="tabpanel"
        aria-labelledby={`collection-tab-${mode}`}
        tabIndex={0}
      >
        <div className="collection-stage" ref={art} data-layout={mode} data-complete={filled}>
          <div className="binder-page" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          {collectionCards.map((card, i) => (
            <div
              key={card.id}
              data-card-id={card.id}
              className={`collection-card-layout ${selected === i ? 'is-selected' : ''}`}
              style={{ zIndex: i === 8 ? 12 : selected === i ? 10 : 9 - i }}
            >
              <div className="collection-selection">
                <HoloCard
                  id={card.id}
                  name={card.name}
                  pressed={selected === i}
                  tilt={5}
                  onClick={() => {
                    setSelected(i);
                    if (mode === 2 && i === 8) setPlaced(true);
                  }}
                />
              </div>
              <span className="collection-list-label">
                {card.name}
                <small>
                  {card.set} · {card.number}
                </small>
              </span>
            </div>
          ))}
          {mode === 2 && (
            <div className="binder-controls">
              <div aria-live="polite">
                <strong>{filled ? '9' : '8'} / 9</strong> <span>{copy.product.filled}</span>
              </div>
              <button className="binder-add" onClick={placed ? reset : () => setPlaced(true)}>
                {placed ? copy.product.replay : copy.product.add}
                <Arrow />
              </button>
              <p>{filled ? copy.product.complete : copy.product.empty}</p>
            </div>
          )}
        </div>
        <div className="collection-caption">
          <div>
            <span className="eyebrow">{copy.collection.modes[mode].detail}</span>
            <h3>{copy.collection.modes[mode].title}</h3>
            <p>{copy.collection.modes[mode].body}</p>
            <div className="collection-caption-actions">
              <button onClick={() => chooseMode(1)}>
                {locale === 'de' ? 'Sets erkunden' : 'Explore sets'} ↗
              </button>
              <button onClick={() => chooseMode(2)}>
                {locale === 'de' ? 'Binder ausprobieren' : 'Try the binder'} ↗
              </button>
            </div>
          </div>
          <div className="selected-card-detail">
            <img
              src={`/assets/card-${collectionCards[selected].id}.webp`}
              width="96"
              height="134"
              alt=""
            />
            <div className="selected-card" aria-live="polite">
              <span>{copy.collection.focus}</span>
              <strong>{collectionCards[selected].name}</strong>
              <small>
                {collectionCards[selected].set}
                <br />
                {collectionCards[selected].number}
              </small>
              <small>
                {locale === 'de' ? 'Illustration von' : 'Illustrated by'}{' '}
                {collectionCards[selected].artist}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScannerDemo() {
  const { copy } = useLanguage();
  const [step, setStep] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const sweep = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP({ scope: root });
  // eslint-disable-next-line react-hooks/refs -- called from effects, not during render.
  const transition = contextSafe((animate = true) => {
    const el = root.current;
    if (!el) return;
    const mobile = el.querySelector('.scan-art')!.clientWidth < 450;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = animate && !reduced ? 0.8 : 0;
    const target = el.querySelector<HTMLElement>('.scan-target')!;
    const preview = el.querySelector<HTMLElement>('.scan-collection')!;
    const row = el.querySelector<HTMLElement>('.new-row')!;
    const landing = {
      x: -preview.offsetWidth / 2 + 18 + 20,
      y: -153 + row.offsetTop + row.offsetHeight / 2,
      scale: 40 / target.offsetWidth,
      rotation: 0,
    };
    sweep.current?.kill();
    gsap.set(el.querySelector('.scan-light'), { autoAlpha: 0, top: '2%' });
    gsap.killTweensOf(target);
    const poses = [
      { x: 0, y: 0, scale: 1, rotation: -5 },
      { x: mobile ? -108 : -153, y: -22, scale: mobile ? 0.57 : 0.65, rotation: -3 },
      landing,
    ];
    gsap.to(target, {
      ...poses[step],
      xPercent: -50,
      yPercent: -50,
      duration,
      ease: 'power3.inOut',
      overwrite: true,
    });
    gsap.to(el.querySelector('.scan-corners'), { opacity: step === 0 ? 1 : 0, duration: 0.25 });
    gsap.to(el.querySelector('.scan-result'), {
      autoAlpha: step === 1 ? 1 : 0,
      y: step === 1 ? 0 : 12,
      duration: reduced ? 0 : 0.4,
      delay: step === 1 && animate ? 0.25 : 0,
      overwrite: true,
    });
    gsap.to(el.querySelector('.scan-collection'), {
      autoAlpha: step === 2 ? 1 : 0,
      y: step === 2 ? 0 : 12,
      duration: reduced ? 0 : 0.4,
      overwrite: true,
    });
    gsap.to(el.querySelector('.scan-added-label'), {
      opacity: step === 2 ? 1 : 0,
      duration: reduced ? 0 : 0.3,
      delay: step === 2 && animate ? 0.65 : 0,
      overwrite: true,
    });
  });
  // eslint-disable-next-line react-hooks/refs -- called by ScrollTrigger or an interaction effect.
  const scan = contextSafe(() => {
    if (!root.current || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = root.current.querySelector('.scan-target');
    const line = root.current.querySelector('.scan-light');
    gsap.killTweensOf([target, line]);
    gsap.fromTo(
      target,
      { y: 24, rotation: -10 },
      { y: 0, rotation: -5, duration: 0.8, ease: 'power3.out' },
    );
    sweep.current?.kill();
    if (line) sweep.current = addScanSweep(gsap.timeline(), line, 0.55);
  });
  useGSAP(
    () => {
      transition(false);
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top 72%',
        once: true,
        onEnter: scan,
      });
      return () => {
        trigger.kill();
        sweep.current?.kill();
      };
    },
    { scope: root },
  );
  useGSAP(
    () => {
      transition(!first.current);
      if (!first.current && step === 0) scan();
      first.current = false;
    },
    { scope: root, dependencies: [step] },
  );
  return (
    <div className="scan-demo" ref={root} data-step={step}>
      <div className="scan-art" id="scan-visual">
        <div className="scan-orbit" aria-hidden="true" />
        <div className="scan-target">
          <HoloCard
            id="mew"
            name="Mew ex"
            tilt={4}
            onClick={() => setStep((step + 1) % 3)}
            pressed={step === 2}
          />
          <div className="scan-corners" aria-hidden="true" />
          <div className="scan-sweep-window" aria-hidden="true">
            <div className="scan-light scan-beam" />
          </div>
        </div>
        {/* Faithful web presentation of ScanReview: match identity, printing, explicit confirmation. */}
        <div className="scan-result" inert={step !== 1}>
          <span className="app-eyebrow">{copy.product.result}</span>
          <h3>Mew ex</h3>
          <p>Pokémon 151 · #205/165</p>
          <div className="scan-printing">
            <span>{copy.product.variant}</span>
            <strong>{copy.product.holo}</strong>
          </div>
          <button className="app-confirm" onClick={() => setStep(2)}>
            {copy.product.confirm}
            <Arrow />
          </button>
        </div>
        <div className="scan-collection" inert={step !== 2}>
          <div className="scan-collection-heading">
            <Brand />
            <span>{copy.product.recently}</span>
          </div>
          {['pikachu', 'bulbasaur'].map((id, i) => (
            <div className="scan-collection-row" key={id}>
              <img src={`/assets/card-${id}.webp`} alt="" width="40" height="56" loading="lazy" />
              <span>
                {i === 0 ? 'Pikachu' : 'Bulbasaur'}
                <small>Pokémon 151 · Holo</small>
              </span>
            </div>
          ))}
          <div className="scan-collection-row new-row">
            <span className="incoming-card-space" />
            <span>
              Mew ex<small>Pokémon 151 · Holo</small>
            </span>
            <span className="scan-added-label" aria-hidden="true">
              ✓
            </span>
          </div>
        </div>
        <div className="scan-status" aria-live="polite">
          <span className="status-dot" />
          {step === 2 ? copy.product.added : copy.scanner.status[step]}
        </div>
      </div>
      <div className="scan-steps">
        <span className="eyebrow">{copy.scanner.label}</span>
        {copy.scanner.steps.map(([title, body], i) => (
          <button
            key={i}
            className={step === i ? 'is-active' : ''}
            aria-pressed={step === i}
            aria-controls="scan-visual"
            onClick={() => setStep(i)}
          >
            <span className="step-number">0{i + 1}</span>
            <span>
              <strong>{title}</strong>
              <span>{body}</span>
            </span>
            <Arrow />
          </button>
        ))}
        <p className="scan-mobile-description" aria-live="polite">
          {copy.scanner.steps[step][1]}
        </p>
        <p className="demo-caption">{copy.product.scannerDemo}</p>
      </div>
    </div>
  );
}

export function CardDiscoveryRail() {
  const { copy } = useLanguage();
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);
  const flags = useRef({ visible: false, focus: false, manual: false });
  const sync = () => {
    const f = flags.current;
    const running = f.visible && !f.focus && !f.manual && !document.hidden;
    loop.current?.paused(!running);
    if (root.current) root.current.dataset.running = String(running && !!loop.current);
  };
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 760px) and (prefers-reduced-motion: no-preference)', () => {
        const track = root.current!.querySelector<HTMLElement>('.discovery-track')!;
        const group = track.querySelector<HTMLElement>('.discovery-group')!;
        const rebuild = () => {
          const phase = loop.current?.progress() ?? 0;
          loop.current?.kill();
          const width = group.offsetWidth;
          loop.current = gsap.fromTo(
            track,
            { x: 0 },
            { x: -width, duration: width / 30, repeat: -1, ease: 'none', paused: true },
          );
          loop.current.progress(phase);
          sync();
        };
        rebuild();
        const observer = new ResizeObserver(rebuild);
        observer.observe(group);
        return () => {
          observer.disconnect();
          loop.current?.kill();
          loop.current = null;
          gsap.set(track, { clearProps: 'transform' });
        };
      });
      const observer = new IntersectionObserver(
        ([e]) => {
          flags.current.visible = e.isIntersecting;
          sync();
        },
        { threshold: 0.05 },
      );
      observer.observe(root.current!);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
        mm.revert();
      };
    },
    { scope: root },
  );
  return (
    <section
      className="discovery-section"
      id="discovery"
      ref={root}
      aria-labelledby="discovery-title"
    >
      <div className="discovery-heading section-shell">
        <div>
          <h2 id="discovery-title">
            {copy.product.railTitle}
            <br />
            <em>{copy.product.railAccent}</em>
          </h2>
          <p>{copy.product.railBody}</p>
        </div>
        <button
          className="rail-pause"
          aria-pressed={paused}
          onClick={() => {
            flags.current.manual = !paused;
            setPaused(!paused);
            sync();
          }}
        >
          {paused ? copy.product.railResume : copy.product.railPause}
          <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
        </button>
      </div>
      <div className="discovery-window" aria-label={copy.product.railLabel}>
        <div
          className="discovery-track"
          onFocusCapture={(e) => {
            // Pointer hovering/clicking keeps the belt moving. Keyboard focus stays stable.
            flags.current.focus = e.target.matches(':focus-visible');
            sync();
            if (flags.current.focus && loop.current) {
              const item = e.target.closest<HTMLElement>('.discovery-item');
              const index = Number(item?.dataset.index ?? 0);
              loop.current.progress(index / discoveryCards.length);
            }
          }}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              flags.current.focus = false;
              sync();
            }
          }}
        >
          {[0, 1].map((group) => (
            <div
              className={`discovery-group ${group ? 'is-clone' : ''}`}
              key={group}
              aria-hidden={group ? true : undefined}
            >
              {discoveryCards.map((card, i) => (
                <div
                  className={`discovery-item ${selected === card.id ? 'is-selected' : ''}`}
                  key={card.id}
                  data-index={i}
                >
                  <div className="discovery-hover">
                    <HoloCard
                      {...card}
                      pressed={selected === card.id}
                      tilt={4.5}
                      tabIndex={group ? -1 : 0}
                      onClick={() => setSelected(selected === card.id ? null : card.id)}
                    />
                  </div>
                  <div className="discovery-card-caption">
                    <strong>{card.name}</strong>
                    <span>
                      {card.set} · {card.number}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <SetDiscoveryRail paused={paused} />
    </section>
  );
}

export function PortfolioExplorer() {
  const { copy, locale } = useLanguage();
  const [active, setActive] = useState(0);
  const [point, setPoint] = useState(demoHistory.length - 1);
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const money = (value: number) =>
    new Intl.NumberFormat(locale === 'de' ? 'de-DE' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  const date = (value: Date) =>
    new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
      value,
    );
  const floor = Math.min(...demoHistory.map((p) => p.value)),
    ceiling = Math.max(...demoHistory.map((p) => p.value));
  const coords = demoHistory.map((p, i) => ({
    x: 16 + (i / (demoHistory.length - 1)) * 428,
    y: 154 - ((p.value - floor) / Math.max(1, ceiling - floor)) * 124,
  }));
  const path = coords.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  const first = demoHistory[0].value;
  useGSAP(
    () => {
      const node = line.current!;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const length = node.getTotalLength();
        gsap.fromTo(
          node,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  const inspect = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' && e.buttons !== 1) return;
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - r.left) / r.width;
    setPoint(
      Math.round(Math.max(0, Math.min(1, (ratio * 460 - 16) / 428)) * (demoHistory.length - 1)),
    );
  };
  return (
    <div className="portfolio-explorer" ref={root}>
      {/* PortfolioProfile's value, change, history, period and holdings, adapted for the web. */}
      <div className="portfolio-preview">
        <div className="portfolio-app-heading">
          <Brand />
          <span>{copy.product.overview}</span>
        </div>
        <div className="portfolio-preview-title">
          <h3>{copy.product.portfolio}</h3>
          <span>{copy.product.demo}</span>
        </div>
        <span className="app-eyebrow">{copy.product.collectionValue}</span>
        <div className="portfolio-total">{money(demoHistory[point].value)}</div>
        <div className="portfolio-value-date">
          {date(demoHistory[point].date)} ·{' '}
          {point === demoHistory.length - 1
            ? locale === 'de'
              ? 'Aktueller Schätzwert'
              : 'Latest estimate'
            : locale === 'de'
              ? 'Historischer Monatswert'
              : 'Historical monthly value'}
        </div>
        <p className={`portfolio-change ${demoHistory[point].value < first ? 'is-negative' : ''}`}>
          {demoHistory[point].value >= first ? '+' : ''}
          {money(demoHistory[point].value - first)} (
          {(((demoHistory[point].value - first) / first) * 100).toFixed(1)}%){' '}
          <span>{copy.product.change}</span>
        </p>
        <div className="chart-heading">
          <span>{copy.product.history}</span>
          <span className="chart-period">{copy.product.period}</span>
        </div>
        <div className="chart-readout" aria-live="off">
          <span>{date(demoHistory[point].date)}</span>
          <strong>{money(demoHistory[point].value)}</strong>
        </div>
        <div
          className="portfolio-chart"
          role="slider"
          tabIndex={0}
          aria-label={copy.product.chartLabel}
          aria-valuemin={0}
          aria-valuemax={demoHistory.length - 1}
          aria-valuenow={point}
          aria-valuetext={`${date(demoHistory[point].date)}: ${money(demoHistory[point].value)}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            inspect(e);
          }}
          onPointerMove={inspect}
          onKeyDown={(e) => {
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
            e.preventDefault();
            setPoint((p) =>
              e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? demoHistory.length - 1
                  : Math.max(
                      0,
                      Math.min(demoHistory.length - 1, p + (e.key === 'ArrowLeft' ? -1 : 1)),
                    ),
            );
          }}
        >
          <svg viewBox="0 0 460 180" aria-hidden="true">
            <defs>
              <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#b19af9" stopOpacity=".18" />
                <stop offset="1" stopColor="#b19af9" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[40, 95, 150].map((y) => (
              <path key={y} d={`M16,${y}H444`} className="chart-grid" />
            ))}
            <path d={`${path} L444,168 L16,168 Z`} fill="url(#chart-area)" />
            <path
              ref={line}
              d={path}
              fill="none"
              stroke="#b19af9"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d={`M${coords[point].x},20V168`} className="chart-marker-line" />
            <circle
              cx={coords[point].x}
              cy={coords[point].y}
              r="4"
              fill="#cbb9ff"
              stroke="#0d0e12"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="chart-dates">
          <span>{date(demoHistory[0].date)}</span>
          <span>{date(demoHistory.at(-1)!.date)}</span>
        </div>
        <p className="chart-hint">{copy.product.chartHint}</p>
        <p className="portfolio-note">{copy.product.chartNote}</p>
        <div className="portfolio-holdings">
          <span>{copy.product.holdings}</span>
          <div>
            {demoHoldings.map((card) => (
              <div key={card.id}>
                <img
                  src={`/assets/card-${card.id}.webp`}
                  width="38"
                  height="53"
                  alt={card.name}
                  loading="lazy"
                />
                <span>
                  {card.name}
                  <small>{card.number}</small>
                  <strong>{money(card.values.at(-1)!)}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="portfolio-price-source">
          {locale === 'de'
            ? 'Ungefähre Beispielpreise · gerundete Werte in USD · je eine ungegradete Karte.'
            : 'Approximate example prices · rounded values in USD · one ungraded card of each.'}
        </p>
      </div>
      <div className="portfolio-accordion">
        {copy.portfolio.map((entry, i) => (
          <div className="portfolio-entry" key={i}>
            <h3>
              <button
                aria-expanded={active === i}
                aria-controls={`portfolio-detail-${i}`}
                onClick={() => setActive(i)}
              >
                {entry.label}
                <span aria-hidden="true">{active === i ? '−' : '+'}</span>
              </button>
            </h3>
            <div id={`portfolio-detail-${i}`} hidden={active !== i}>
              <p>{entry.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
