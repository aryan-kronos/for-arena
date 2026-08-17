import { useEffect, useRef, useState } from "react";

const VIDEO = "/video/aranch-pass-standard-film.mp4";
const POSTER = "/video/aranch-pass-standard-poster.webp";
let playedDuringThisPageLoad = false;

/** Muted decorative hero film. It plays once after each full page refresh. */
export function HeroBackgroundFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (playedDuringThisPageLoad) return;
    playedDuringThisPageLoad = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reduced || saveData) return;
    const win = window as Window & { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (win.requestIdleCallback) {
      const id = win.requestIdleCallback(() => setLoad(true), { timeout: 700 });
      return () => win.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setLoad(true), 260);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!load || !ready || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    void videoRef.current.play().catch(() => undefined);
  }, [load, ready]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img src={POSTER} alt="" className={`absolute inset-0 h-full w-full object-cover grayscale-[10%] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-[0.46]"}`} />
      {load && <video ref={videoRef} src={VIDEO} muted playsInline preload="metadata" poster={POSTER} onCanPlay={() => setReady(true)} className={`absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000 grayscale-[8%] ${ready ? "opacity-[0.60]" : ""}`} />}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(243,240,214,.95)_0%,rgba(243,240,214,.78)_46%,rgba(243,240,214,.22)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(244,173,8,.14),transparent_36%)]" />
    </div>
  );
}
