import { useEffect, useRef, useState } from "react";
import { PassBackArtwork, PassFrontArtwork } from "@/components/PassArtwork";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
  /** thickness of the pass edge in px */
  depth?: number;
  /** Show interactive control presets (Front, Back, Spin, Reset) */
  showControls?: boolean;
};

const REST_Y = -14;
const REST_X = 6;
const MAX_Y = 62;

/**
 * Interactive 3D ARANCH PASS.
 * - autoplay oscillation (never edge-on)
 * - cursor-follow tilt on desktop
 * - pointer/touch drag, eased return to rest, autoplay resumes
 * - quick view controls (Front, Back, Orbit, Reset)
 * - reduced motion: static angled view
 */
export function InteractivePass({ className = "", depth = 8, showControls = false }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [activeView, setActiveView] = useState<"auto" | "front" | "back">("auto");

  const setTargetAngleRef = useRef<((targetX: number, targetY: number, mode: "auto" | "front" | "back") => void) | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    const stage = stageRef.current;
    if (!card || !stage) return;

    if (reduced) {
      card.style.transform = `rotateX(${REST_X}deg) rotateY(${REST_Y}deg)`;
      return;
    }

    let raf = 0;
    let running = false;
    let visible = false;
    let t = 0;
    let rotY = REST_Y;
    let rotX = REST_X;
    let targetY = REST_Y;
    let targetX = REST_X;
    let dragging = false;
    let released = 0; // timestamp of release
    let hovering = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragBaseY = 0;
    let dragBaseX = 0;
    let pointerYOffset = 0;
    let pointerXOffset = 0;
    let mode: "auto" | "front" | "back" = "auto";

    setTargetAngleRef.current = (tx: number, ty: number, newMode: "auto" | "front" | "back") => {
      mode = newMode;
      targetX = tx;
      targetY = ty;
      released = performance.now();
      setActiveView(newMode);
    };

    const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

    const tick = () => {
      if (!running) return;
      t += 0.016;
      if (!dragging) {
        if (mode === "auto") {
          const settling = performance.now() - released < 1400;
          if (settling || hovering) {
            targetY = REST_Y + pointerYOffset;
            targetX = REST_X + pointerXOffset;
          } else {
            // gentle automatic oscillation around rest
            targetY = REST_Y + Math.sin(t * 0.55) * 16 + pointerYOffset;
            targetX = REST_X + Math.sin(t * 0.38) * 3 + pointerXOffset;
          }
        }
        const ease = mode === "auto" ? 0.08 : 0.1;
        rotY += (targetY - rotY) * ease;
        rotX += (targetX - rotX) * ease;
      }
      card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) start(); else stop();
    }, { threshold: 0.05 });
    const onVisibility = () => { if (visible && !document.hidden) start(); else stop(); };
    observer.observe(stage);
    document.addEventListener("visibilitychange", onVisibility);

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      mode = "auto";
      setActiveView("auto");
      card.classList.add("is-dragging");
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragBaseY = rotY;
      dragBaseX = rotX;
      card.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        rotY = clamp(dragBaseY + (e.clientX - dragStartX) * 0.45, -170, 170);
        rotX = clamp(dragBaseX - (e.clientY - dragStartY) * 0.22, -34, 34);
        card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        e.preventDefault();
      } else if (e.pointerType === "mouse" && hovering && mode === "auto") {
        const r = stage.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        pointerYOffset = clamp(nx * 34, -MAX_Y, MAX_Y);
        pointerXOffset = clamp(-ny * 14, -20, 20);
      }
    };
    const endDrag = (e?: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      released = performance.now();
      pointerYOffset = 0;
      pointerXOffset = 0;
      card.classList.remove("is-dragging");
      if (e) card.releasePointerCapture?.(e.pointerId);
    };
    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
      pointerYOffset = 0;
      pointerXOffset = 0;
      released = performance.now();
    };

    card.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      card.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div ref={stageRef} className={`pass-stage relative select-none ${className}`}>
      <div
        ref={cardRef}
        className="pass-3d relative aspect-[1344/797] w-full"
        style={{ transform: `rotateX(${REST_X}deg) rotateY(${REST_Y}deg)` }}
        aria-hidden="true"
      >
        {/* A thin stack of matching die-cut layers produces a closed, visible edge
            instead of a disconnected front/back slab. */}
        {Array.from({ length: Math.max(3, Math.round(depth) + 1) }, (_, index) => {
          const z = -depth / 2 + (index / Math.max(1, Math.round(depth))) * depth;
          return (
            <div
              key={index}
              className="notch absolute inset-0 bg-[#d8cfb7] shadow-[inset_0_0_0_1px_rgba(46,7,89,0.08)]"
              style={{ transform: `translateZ(${z}px)` }}
            />
          );
        })}

        <div
          className="pass-face notch overflow-hidden bg-[#F4EED9] shadow-[0_30px_60px_-30px_rgba(46,7,89,0.55)]"
          style={{ transform: `translateZ(${depth / 2 + 0.25}px)` }}
        >
          <PassFrontArtwork className="h-full w-full" dieCut={false} />
        </div>
        <div
          className="pass-face notch overflow-hidden bg-deepviolet"
          style={{ transform: `rotateY(180deg) translateZ(${depth / 2 + 0.25}px)` }}
        >
          <PassBackArtwork className="h-full w-full" dieCut={false} />
        </div>
      </div>

      {showControls && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => setTargetAngleRef.current?.(0, 0, "front")}
            aria-label="View front face"
            className={cn(
              "mono flex h-8 w-8 items-center justify-center border text-[10px] font-bold transition-colors",
              activeView === "front" ? "border-saffron bg-saffron text-plum" : "border-ivory/20 bg-plum/90 text-ivory/80 hover:border-saffron hover:text-saffron",
            )}
          >
            F
          </button>
          <button
            type="button"
            onClick={() => setTargetAngleRef.current?.(0, 180, "back")}
            aria-label="View reverse face"
            className={cn(
              "mono flex h-8 w-8 items-center justify-center border text-[10px] font-bold transition-colors",
              activeView === "back" ? "border-saffron bg-saffron text-plum" : "border-ivory/20 bg-plum/90 text-ivory/80 hover:border-saffron hover:text-saffron",
            )}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => setTargetAngleRef.current?.(REST_X, REST_Y, "auto")}
            aria-label="Resume auto orbit"
            className={cn(
              "mono flex h-8 w-8 items-center justify-center border text-[11px] font-bold transition-colors",
              activeView === "auto" ? "border-saffron bg-saffron text-plum" : "border-ivory/20 bg-plum/90 text-ivory/80 hover:border-saffron hover:text-saffron",
            )}
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
}
