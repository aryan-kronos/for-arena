import { useEffect, useRef } from "react";

const upper = ["ATTACH", "RECORD", "SCAN", "REBOOK", "ONE ASSET CODE", "SERVICE HISTORY"];
const lower = ["PHYSICAL PASS", "DIGITAL RECORD", "CUSTOMER RETURNS", "PROVIDER STAYS VISIBLE"];

function RibbonText({ items, dark = false }: { items: string[]; dark?: boolean }) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="flex w-max items-center gap-7 px-6 sm:gap-10" aria-hidden="true">
      {repeated.map((item, index) => (
        <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-7 sm:gap-10">
          <span className="font-display text-[clamp(1rem,2.2vw,2rem)] font-extrabold tracking-[-0.025em] whitespace-nowrap">{item}</span>
          <span className={dark ? "h-2.5 w-2.5 rotate-45 bg-saffron" : "h-2.5 w-2.5 rotate-45 bg-deepviolet"} />
        </span>
      ))}
    </div>
  );
}

/** Two crossed ribbons driven only by page scroll. */
export function KineticRibbons() {
  const sectionRef = useRef<HTMLElement>(null);
  const upperTrackRef = useRef<HTMLDivElement>(null);
  const lowerTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const upperTrack = upperTrackRef.current;
    const lowerTrack = lowerTrackRef.current;
    if (!section || !upperTrack || !lowerTrack) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const render = () => {
      raf = 0;
      if (reduced) {
        upperTrack.style.transform = "translate3d(-24%,0,0)";
        lowerTrack.style.transform = "translate3d(-36%,0,0)";
        return;
      }
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
      const scrollShift = (progress - 0.5) * Math.min(window.innerWidth * 0.52, 620);
      upperTrack.style.transform = `translate3d(calc(-31% + ${scrollShift}px),0,0)`;
      lowerTrack.style.transform = `translate3d(calc(-31% + ${-scrollShift}px),0,0)`;
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(render); };
    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} aria-labelledby="ribbon-transition-title" className="relative h-[250px] overflow-hidden bg-paper sm:h-[310px]">
      <h2 id="ribbon-transition-title" className="sr-only">From the physical service pass to the digital service record</h2>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(77,22,136,.04)_1px,transparent_1px)] bg-[length:80px_100%]" />
      <div className="absolute top-[37%] -left-[12%] z-20 w-[124%] origin-center rotate-[-4.2deg] bg-deepviolet py-4 text-ivory shadow-[0_18px_45px_-28px_rgba(46,7,89,.8)] sm:py-5">
        <div ref={upperTrackRef} className="w-max will-change-transform"><RibbonText items={upper} dark /></div>
      </div>
      <div className="absolute top-[51%] -left-[12%] z-10 w-[124%] origin-center rotate-[5.2deg] border-y border-deepviolet/20 bg-saffron py-4 text-plum sm:py-5">
        <div ref={lowerTrackRef} className="w-max will-change-transform"><RibbonText items={lower} /></div>
      </div>
    </section>
  );
}
