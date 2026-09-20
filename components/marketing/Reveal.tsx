"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const revealWhenVisible = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.88 || rect.bottom < 0) return;
        setVisible(true);
        window.removeEventListener("scroll", revealWhenVisible);
        window.removeEventListener("resize", revealWhenVisible);
      });
    };
    revealWhenVisible();
    window.addEventListener("scroll", revealWhenVisible, { passive: true });
    window.addEventListener("resize", revealWhenVisible);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", revealWhenVisible);
      window.removeEventListener("resize", revealWhenVisible);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal-block ${className}`} data-visible={visible || undefined}>
      {children}
    </div>
  );
}
