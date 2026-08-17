import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/video/aranch-pass-standard-film.mp4";
const POSTER_SRC = "/video/aranch-pass-standard-poster.webp";

/** Loads the MP4 only near the viewport (or after explicit play). */
export function LazyProductFilm() {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = typeof navigator !== "undefined" && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const observer = new IntersectionObserver(([entry]) => setNearViewport(Boolean(entry?.isIntersecting)), { rootMargin: "260px 0px", threshold: 0.05 });
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (nearViewport && !reduced && !saveData) setShouldLoad(true);
  }, [nearViewport, reduced, saveData]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    if (nearViewport && !reduced) {
      void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [nearViewport, reduced, shouldLoad, ready]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) { videoRef.current?.pause(); setPlaying(false); }
      else if (nearViewport && ready && !reduced) void videoRef.current?.play().then(() => setPlaying(true)).catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [nearViewport, ready, reduced]);

  const toggle = async () => {
    if (!shouldLoad) { setShouldLoad(true); return; }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { await video.play(); setPlaying(true); }
    else { video.pause(); setPlaying(false); }
  };

  return (
    <figure ref={frameRef} className="image-frame clip-corner group relative overflow-hidden border border-ivory/20 bg-paper">
      <img src={POSTER_SRC} alt="ARANCH PASS Standard pass and 50-pass box product-film poster." className="block aspect-video h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
      {shouldLoad && <video ref={videoRef} src={VIDEO_SRC} muted playsInline loop preload="none" poster={POSTER_SRC} onCanPlay={() => setReady(true)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`} />}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum/55 via-transparent to-transparent" />
      <button type="button" onClick={() => void toggle()} className="absolute bottom-5 left-5 z-10 flex items-center gap-3 bg-paper/95 px-4 py-3 text-[11px] font-bold tracking-[.08em] text-deepviolet uppercase backdrop-blur-sm" aria-label={playing ? "Pause ARANCH PASS product film" : "Play ARANCH PASS product film"}>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-saffron text-plum">{playing ? <svg viewBox="0 0 20 20" className="h-3.5 w-3.5"><path d="M6 4h3v12H6zm5 0h3v12h-3z" fill="currentColor"/></svg> : <svg viewBox="0 0 20 20" className="h-3.5 w-3.5"><path d="m6 4 10 6-10 6z" fill="currentColor"/></svg>}</span>
        {playing ? "Pause film" : "Play product film"}
      </button>
      <figcaption className="label absolute right-4 bottom-4 text-paper/70">8 sec · muted · lazy loaded</figcaption>
    </figure>
  );
}
