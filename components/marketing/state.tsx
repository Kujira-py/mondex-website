"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { baseStats } from "./data";
const DemoContext = createContext({ discovered: false, setDiscovered: (() => {}) as (value: boolean) => void, cards: baseStats.cards, pokemon: baseStats.pokemon, kanto: baseStats.kanto });
export function DemoProvider({ children }: { children: ReactNode }) {
  const [discovered, setDiscovered] = useState(false);
  const delta = Number(discovered);
  return <DemoContext.Provider value={{ discovered, setDiscovered, cards: baseStats.cards + delta, pokemon: baseStats.pokemon + delta, kanto: baseStats.kanto + delta }}>{children}</DemoContext.Provider>;
}
export const useDemo = () => useContext(DemoContext);
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}
// Settle offscreen transitions; never leave a half-open binder in a hidden tab.
export function useDemoTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completion = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();
  const cancel = useCallback(() => { if (timer.current) clearTimeout(timer.current); timer.current = null; completion.current = null; }, []);
  const finish = useCallback(() => { const callback = completion.current; cancel(); callback?.(); }, [cancel]);
  const run = (duration: number, callback: () => void) => { cancel(); completion.current = callback; timer.current = setTimeout(finish, reduced ? 30 : duration); };
  useEffect(() => {
    const settle = () => { for (let step = 0; step < 4 && completion.current; step++) finish(); };
    const stopWhenHidden = () => { if (document.hidden) settle(); };
    document.addEventListener("visibilitychange", stopWhenHidden);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) settle(); });
    if (ref.current) observer.observe(ref.current);
    return () => { cancel(); observer.disconnect(); document.removeEventListener("visibilitychange", stopWhenHidden); };
  }, [cancel, finish]);
  return { ref, run, cancel, reduced };
}
