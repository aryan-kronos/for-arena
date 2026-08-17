import { useEffect, useRef } from "react";

/**
 * Reveals a section as one coordinated group.
 *
 * The previous implementation observed every child independently. In tall grid
 * sections that left lower cards at opacity: 0 until their individual boxes
 * crossed the viewport threshold, which looked like cards disappearing while
 * scrolling. We now observe the section root once, then reveal all descendants
 * in a short stagger. A timeout is retained as a defensive fallback so content
 * can never remain permanently invisible if an observer/browser edge case
 * occurs.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));
    if (root.classList.contains("reveal")) nodes.unshift(root);
    if (!nodes.length) return;

    const revealAll = () => {
      nodes.forEach((node, index) => {
        node.style.transitionDelay = `${Math.min(index * 55, 275)}ms`;
        node.classList.add("is-in");
      });
    };

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    let revealed = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || revealed) return;
        revealed = true;
        revealAll();
        io.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 },
    );

    io.observe(root);

    // Content visibility must never depend indefinitely on animation JS.
    const fallback = window.setTimeout(() => {
      if (!revealed) {
        revealed = true;
        revealAll();
        io.disconnect();
      }
    }, 1400);

    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return ref;
}

/** Returns scroll progress (0..1) through the referenced element. */
export function useScrollProgress<T extends HTMLElement = HTMLElement>(
  onProgress: (p: number) => void,
) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = r.height + vh;
      const p = Math.min(1, Math.max(0, (vh - r.top) / total));
      onProgress(p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [onProgress]);
  return ref;
}
