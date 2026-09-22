'use client';

import dynamic from 'next/dynamic';
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Arrow } from './Primitives';
import { useLanguage } from './Language';
import { featuredCards, newController, type SceneController } from '@/lib/scene-state';
import { initialCards, posterTransform, DEPTH_ORDER } from '@/lib/card-motion';
import orbitPoster from '@/lib/orbit-poster.json';
import { storyBeats, storyDuration, chapterTransitions, chapterStops } from '@/lib/story-timing';
const desktopPoster = initialCards(false);
const mobilePoster = initialCards(true);
const nextStoryTargets = ['#reise', '#ankommen', '#ueberblick', '#features'];

gsap.registerPlugin(ScrollTrigger, useGSAP);
const ProductScene = dynamic(() => import('./ProductScene'), { ssr: false });
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function Showcase() {
  const { copy } = useLanguage();
  const chapters = copy.chapters;
  const root = useRef<HTMLElement>(null);
  const scrollCue = useRef<HTMLAnchorElement>(null);
  const controller = useRef<SceneController>(newController());
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [webglFailure, setWebglFailure] = useState(false);
  const mode =
    webglAvailable === null
      ? 'pending'
      : reducedMotion || !webglAvailable || webglFailure
        ? 'static'
        : 'animated';
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(-1);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => {
    setWebglFailure(true);
    setReady(false);
  }, []);
  const select = useCallback((i: number) => {
    if (!controller.current.motionEnabled) return;
    const next = controller.current.selected === i ? -1 : i;
    controller.current.selected = next;
    setSelected(next);
    controller.current.invalidate();
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setup = () => setReducedMotion(media.matches);
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    const available = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    const id = requestAnimationFrame(() => {
      setup();
      setWebglAvailable(available);
    });
    media.addEventListener('change', setup);
    return () => {
      cancelAnimationFrame(id);
      media.removeEventListener('change', setup);
    };
  }, []);
  useEffect(() => {
    controller.current.motionEnabled = motionEnabled && !reducedMotion;
    if (motionEnabled && !reducedMotion) controller.current.invalidate();
  }, [motionEnabled, reducedMotion]);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const panels = el.querySelectorAll<HTMLElement>('.story-chapter');
      if (mode !== 'animated') {
        panels.forEach((panel) => {
          gsap.set(panel, { clearProps: 'all' });
          panel.inert = false;
        });
        return;
      }
      const render = () => {
        if (controller.current.motionEnabled && controller.current.visible && !document.hidden)
          controller.current.invalidate();
      };
      gsap.set(panels, { autoAlpha: 0, y: 22 });
      gsap.set(panels[0], { autoAlpha: 1, y: 0 });
      controller.current.progress = 0;
      const anchors = el.querySelectorAll<HTMLElement>('.journey-anchor');
      const placeAnchors = () => {
        const distance = el.offsetHeight - window.innerHeight;
        const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        gsap.set(anchors, {
          top: (i: number) => (distance * chapterStops[i]) / storyDuration + offset,
        });
      };
      let activeChapter = -1;
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onUpdate: function () {
          // Follow the rendered timeline, not the unsmoothed scroll position.
          const c = chapterTransitions.filter((at) => this.time() >= at + 0.32).length;
          if (c !== activeChapter) {
            activeChapter = c;
            el.dataset.chapter = String(c);
            scrollCue.current?.setAttribute('href', nextStoryTargets[c]);
            panels.forEach((p, i) => (p.inert = i !== c));
          }
          render();
        },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.35,
          invalidateOnRefresh: true,
          onRefresh: placeAnchors,
        },
      });
      storyBeats.forEach((beat) => tl.to(controller.current, { ...beat }));
      chapterTransitions.forEach((at, out) => {
        const incoming = out + 1;
        tl.to(panels[out], { autoAlpha: 0, y: -22, duration: 0.35 }, at);
        tl.fromTo(
          panels[incoming],
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.45, immediateRender: false },
          at + 0.32,
        );
      });
      placeAnchors();
      const observer = new IntersectionObserver(([entry]) => {
        controller.current.visible = entry.isIntersecting;
        if (entry.isIntersecting) render();
      });
      observer.observe(el);
      const visibility = () => {
        if (!document.hidden) render();
      };
      document.addEventListener('visibilitychange', visibility);
      document.fonts.ready.then(() => {
        if (el.isConnected) ScrollTrigger.refresh();
      });
      render();
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', visibility);
        panels.forEach((p) => (p.inert = false));
      };
    },
    { scope: root, dependencies: [mode], revertOnUpdate: true },
  );
  return (
    <section
      ref={root}
      className={`showcase ${mode === 'animated' ? 'is-animated' : ''} ${mode === 'static' ? 'is-static' : ''} ${ready ? 'scene-ready' : ''}`}
      id="produkt"
      data-chapter="0"
      data-motion={motionEnabled ? 'running' : 'paused'}
      aria-label={copy.story.label}
    >
      <span className="journey-anchor anchor-scan" id="reise" />
      <span className="journey-anchor anchor-collect" id="ankommen" />
      <span className="journey-anchor anchor-portfolio" id="ueberblick" />
      <div
        className="story-stage"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || !controller.current.motionEnabled) return;
          const r = e.currentTarget.getBoundingClientRect();
          controller.current.pointer = {
            x: ((e.clientX - r.left) / r.width - 0.5) * 2,
            y: -((e.clientY - r.top) / r.height - 0.5) * 2,
          };
          if (controller.current.visible) controller.current.invalidate();
        }}
        onPointerLeave={() => {
          controller.current.pointer = { x: 0, y: 0 };
          controller.current.hover = -1;
          controller.current.invalidate();
        }}
      >
        <div className="stage-horizon" aria-hidden="true" />
        <div className="scene-poster" aria-hidden="true">
          <picture>
            <source
              media="(max-width: 1000px)"
              srcSet={mode === 'static' ? '/assets/orbit.svg' : '/assets/orbit-first-mobile.webp'}
            />
            <img
              className="poster-orbit"
              src={mode === 'static' ? '/assets/orbit.svg' : '/assets/orbit-first-desktop.webp'}
              alt=""
              width="450"
              height="450"
              fetchPriority="high"
              style={
                Object.fromEntries(
                  Object.entries(orbitPoster).flatMap(([device, pose]) =>
                    Object.entries(pose).map(([key, value]) => [
                      `--orbit-${key}-${device}`,
                      `${value}cqh`,
                    ]),
                  ),
                ) as CSSProperties
              }
            />
          </picture>
          {featuredCards.map((card, i) => (
            <img
              className={`poster-card poster-${i}`}
              style={
                {
                  '--poster-desktop': posterTransform(desktopPoster[i]),
                  '--poster-mobile': posterTransform(mobilePoster[i]),
                  '--poster-order': DEPTH_ORDER.indexOf(i as 0 | 1 | 2 | 3 | 4) + 1,
                } as CSSProperties
              }
              key={card.id}
              src={`/assets/card-${card.id}.webp`}
              alt=""
              width="660"
              height="922"
              fetchPriority={i === 2 ? 'high' : 'auto'}
            />
          ))}
        </div>
        {mode === 'animated' && (
          <div className="scene-canvas" aria-hidden="true">
            <SceneBoundary onFailure={onFailure}>
              <ProductScene
                controller={controller}
                onReady={onReady}
                onFailure={onFailure}
                onSelect={select}
              />
            </SceneBoundary>
          </div>
        )}
        <div className="chapter-container section-shell">
          {chapters.map((chapter, i) => (
            <article key={i} className={`story-chapter chapter-${i}`}>
              <div className="chapter-copy">
                <span className="eyebrow">{chapter.label}</span>
                {i === 0 ? (
                  <h1>
                    {chapter.title}
                    <br />
                    <em>{chapter.accent}</em>
                  </h1>
                ) : (
                  <h2>
                    {chapter.title}
                    <br />
                    <em>{chapter.accent}</em>
                  </h2>
                )}
                <p>{chapter.body}</p>
                <a className={i === 0 ? 'button primary' : 'text-link'} href={chapter.href}>
                  {chapter.link}
                  <Arrow />
                </a>
              </div>
              {i === 3 && (
                <div className="story-insight" aria-label={copy.product.storyLabel}>
                  <span>Pokémon 151</span>
                  <strong>
                    6 <small>/ 207</small>
                  </strong>
                  <div className="insight-progress">
                    <span />
                  </div>
                  <p>{copy.product.storyProgress}</p>
                  <small>{copy.product.exampleCollection}</small>
                </div>
              )}
              {i > 0 && (
                <img
                  className="static-story-card"
                  src={`/assets/card-${i === 3 ? 'charizard' : 'mew'}.webp`}
                  alt={copy.card.alt.replace('{name}', i === 3 ? 'Charizard ex' : 'Mew ex')}
                  width="660"
                  height="922"
                  loading="lazy"
                />
              )}
            </article>
          ))}
        </div>
        <div className="hero-card-controls">
          <div className="card-selector" aria-label={copy.story.selector}>
            {featuredCards.map((card, i) => (
              <button
                key={card.id}
                aria-label={copy.card.view.replace('{name}', card.name)}
                aria-pressed={selected === i}
                onClick={() => select(i)}
              >
                <span
                  style={{ background: ['#422740', '#d8b542', '#dc98c4', '#d0906c', '#697b86'][i] }}
                />
              </button>
            ))}
          </div>
          <p aria-live="polite">
            {selected >= 0 ? (
              <>
                <strong>{featuredCards[selected].name}</strong>
                <span>{featuredCards[selected].set}</span>
              </>
            ) : (
              <>
                <span className="pointer-hint">{copy.story.pointerHint}</span>
                <span className="touch-hint">{copy.story.touchHint}</span>
              </>
            )}
          </p>
        </div>
        <div className="story-bottom section-shell">
          <a ref={scrollCue} className="scroll-cue" href="#reise">
            <span>{copy.story.scroll}</span>
            <Arrow />
          </a>
          <div className="story-stations" aria-label={copy.story.stationsLabel}>
            <a href="#produkt">{copy.story.stations[0]}</a>
            <a href="#reise">{copy.story.stations[1]}</a>
            <a href="#ankommen">{copy.story.stations[2]}</a>
            <a href="#ueberblick">{copy.story.stations[3]}</a>
          </div>
          <div className="motion-control">
            {reducedMotion || webglAvailable === false || webglFailure ? (
              <span>{copy.story.static}</span>
            ) : (
              <button
                onClick={() => {
                  setMotionEnabled((enabled) => !enabled);
                }}
              >
                {!motionEnabled ? copy.story.motionOn : copy.story.motionOff}
                <span aria-hidden="true">{!motionEnabled ? '▶' : 'Ⅱ'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export { DexExplorer } from './LivingDex';

export {
  CollectionExplorer,
  ScannerDemo,
  PortfolioExplorer,
  CardDiscoveryRail,
} from './ProductDemos';
