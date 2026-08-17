import { useState } from "react";
import { Container, Eyebrow, Note } from "@/components/ui";
import { compareColumns, compareRows, privacyRows, roadmap, segments, type CompareValue } from "@/data";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

/* Section 10 — Public vs private ---------------------------------- */

export function PrivacyTable() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="privacy" ref={ref} className="bg-plum py-20 text-ivory sm:py-28">
      <Container>
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[18ch]">
            <Eyebrow tone="dark">Chapter 08 · Data boundaries</Eyebrow>
            <h2 className="font-display t-4 mt-5">
              Useful in public.
              <br />
              <span className="accent text-saffron">Protected by default.</span>
            </h2>
          </div>
          <Note tone="dark" className="lg:text-right">
            The architecture is privacy-led by design and remains subject to a production security
            review. We do not claim it is “100% secure”.
          </Note>
        </div>

        <div className="reveal mt-12 grid gap-5 md:grid-cols-2">
          <article className="clip-corner border border-saffron/35 bg-ivory/7 p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-ivory/15 pb-5">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-saffron text-plum">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="2.8" fill="currentColor"/></svg>
                </span>
                <div><p className="label text-saffron">Public projection</p><h3 className="font-display mt-1 text-xl font-bold">Visible after a scan</h3></div>
              </div>
              <span className="mono text-[10px] text-ivory/35">01</span>
            </div>
            <ul className="mt-3 space-y-2">
              {privacyRows.map((r, index) => (
                <li key={r.public} className="flex items-center gap-3 bg-plum/45 px-4 py-3.5 text-[14px]">
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-saffron/50 text-[11px] text-saffron">✓</span>
                  <span className="flex-1 text-ivory/85">{r.public}</span><span className="mono text-[9px] text-ivory/25">{String(index+1).padStart(2,"0")}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="clip-corner border border-ivory/20 bg-deepviolet/70 p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-ivory/15 pb-5">
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-ivory/30 text-ivory">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8"/></svg>
                </span>
                <div><p className="label text-ivory/55">Verified access</p><h3 className="font-display mt-1 text-xl font-bold">Kept behind authentication</h3></div>
              </div>
              <span className="mono text-[10px] text-ivory/35">02</span>
            </div>
            <ul className="mt-3 space-y-2">
              {privacyRows.map((r, index) => (
                <li key={r.private} className="flex items-center gap-3 bg-plum/55 px-4 py-3.5 text-[14px]">
                  <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory/55"><svg viewBox="0 0 16 16" className="h-3 w-3" fill="none"><path d="M4 7V5a4 4 0 0 1 8 0v2M3 7h10v7H3Z" stroke="currentColor" strokeWidth="1.4"/></svg></span>
                  <span className="flex-1 text-ivory/68">{r.private}</span><span className="mono text-[9px] text-ivory/25">{String(index+1).padStart(2,"0")}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div className="reveal mt-5 flex flex-col gap-3 border border-ivory/15 bg-ivory/5 px-5 py-4 text-[13px] text-ivory/65 sm:flex-row sm:items-center sm:justify-between">
          <span>A QR scan resolves to a deliberately limited public response—not a raw customer record.</span>
          <span className="mono shrink-0 text-[9px] tracking-[.12em] text-saffron uppercase">Public API projection</span>
        </div>
      </Container>
    </section>
  );
}

/* Section 11 — Category roadmap ----------------------------------- */

function CategoryGlyph({ i, active }: { i: number; active: boolean }) {
  return (
    <svg viewBox="0 0 180 130" className={cn("h-28 w-full transition-all duration-500", active ? "text-violet" : "text-violet/55")} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {i === 0 && <>
          <rect x="58" y="12" width="64" height="96" rx="10" />
          <rect x="70" y="25" width="40" height="28" rx="4" stroke="#F4AD08" />
          <path d="M72 77h36M72 88h25" opacity=".55" />
          <path className={active ? "water-drop" : ""} d="M90 57c-7 10-10 14-10 20a10 10 0 0 0 20 0c0-6-3-10-10-20Z" stroke="#F4AD08" />
          <circle className={active ? "icon-pulse" : ""} cx="90" cy="77" r="17" stroke="#F4AD08" opacity=".25" />
        </>}
        {i === 1 && <>
          <rect x="35" y="25" width="110" height="44" rx="7" />
          <path d="M45 43h90M50 57h80" opacity=".55" />
          {[56,90,124].map((x,index)=><path key={x} className={active ? `air-flow air-flow-${index}` : ""} d={`M${x} 78c-10 12 10 18 0 32`} stroke="#F4AD08" />)}
          <circle className={active ? "icon-pulse" : ""} cx="139" cy="31" r="5" fill="#F4AD08" stroke="none" />
        </>}
        {i === 2 && <>
          <g className={active ? "wheel-spin" : ""}><circle cx="48" cy="92" r="23"/><path d="M48 69v46M25 92h46M32 76l32 32M64 76l-32 32" opacity=".35"/></g>
          <g className={active ? "wheel-spin reverse" : ""}><circle cx="132" cy="92" r="23"/><path d="M132 69v46M109 92h46M116 76l32 32M148 76l-32 32" opacity=".35"/></g>
          <path d="M48 92 73 48h37l22 44M73 48l28 44H48M84 39h28" stroke="#F4AD08" />
          <path className={active ? "trace-run" : ""} d="M22 119h136" stroke="#F4AD08" strokeDasharray="6 8" />
        </>}
      </g>
    </svg>
  );
}

export function CategoryRoadmap() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="roadmap" ref={ref} className="bg-paper py-16 sm:py-20">
      <Container>
        <div className="max-w-[980px]">
          <Eyebrow>Chapter 09 · Roadmap</Eyebrow>
          <h2 className="font-display t-4 mt-5 text-deepviolet">
            Start with one service.{" "}
            <span className="accent text-violet">Build for every maintained asset.</span>
          </h2>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {roadmap.map((c, i) => (
            <article
              key={c.code}
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                "roadmap-card clip-corner relative overflow-hidden p-6 transition-[transform,box-shadow,background-color] duration-700 sm:p-7",
                c.tone === "first" ? "bg-ivory hairline" : "hairline bg-transparent",
                active === i && "roadmap-active -translate-y-1 bg-paper shadow-[0_22px_65px_-34px_rgba(77,22,136,.75)]",
              )}
            >
              <div className="mono flex items-center justify-between text-[10px] tracking-[0.16em] uppercase">
                <span className="text-violet">{c.code}</span>
                <span
                  className={cn(
                    "clip-corner-sm px-2 py-1",
                    c.tone === "first" ? "bg-saffron text-plum" : "border border-line text-muted",
                  )}
                >
                  {c.status}
                </span>
              </div>
              <CategoryGlyph i={i} active={active === i} />
              <h3 className="font-display mt-4 text-[1.45rem] text-deepviolet">{c.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink/70">{c.body}</p>
            </article>
          ))}
        </div>
        <Note className="mt-6">
          Only one category is intended for the first pilot. Nothing on this page should be read as
          all three being operational.
        </Note>
      </Container>
    </section>
  );
}

/* Section 12 — Comparison ----------------------------------------- */

function Mark({ v }: { v: CompareValue }) {
  const map = {
    yes: { t: "Yes", c: "border-saffron/40 bg-saffron text-plum", icon: "✓" },
    varies: { t: "Varies", c: "border-violet/20 bg-violet/5 text-violet", icon: "○" },
    no: { t: "No", c: "border-line bg-transparent text-muted", icon: "—" },
  }[v];
  return (
    <span className={cn("mono inline-flex min-w-[72px] items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] tracking-[0.08em] uppercase", map.c)}>
      <span aria-hidden="true" className="text-[11px] leading-none">{map.icon}</span>
      {map.t}
    </span>
  );
}

export function ComparisonTable() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative overflow-hidden bg-ivory py-20 sm:py-28">
      <Container className="relative">
        <div className="reveal max-w-[960px]">
          <Eyebrow>Chapter 10 · Positioning</Eyebrow>
          <h2 className="font-display t-4 mt-5 text-deepviolet">
            More useful than a static sticker.{" "}
            <span className="accent text-violet">Lighter than a full CRM.</span>
          </h2>
        </div>

        <div className="reveal scroll-x clip-corner hairline mt-12 -mx-5 bg-paper shadow-[0_28px_80px_-55px_rgba(46,7,89,.6)] sm:mx-0">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
            <caption className="sr-only">
              Comparison of notebook or WhatsApp, static number stickers, field-service CRMs and
              ARANCH PASS
            </caption>
            <thead>
              <tr>
                <th scope="col" className="w-[34%] border-b border-line px-5 py-5 align-bottom">
                  <span className="mono text-[10px] tracking-[0.16em] text-muted uppercase">
                    Capability
                  </span>
                </th>
                {compareColumns.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={cn(
                      "border-b border-line px-4 py-5 align-bottom",
                      i === compareColumns.length - 1 && "sticky right-0 z-10 border-saffron/30 bg-deepviolet",
                    )}
                  >
                    <span
                      className={cn(
                        "font-display block text-[13px] leading-tight",
                        i === compareColumns.length - 1 ? "text-ivory" : "text-muted",
                      )}
                    >
                      {c}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r) => (
                <tr key={r.label} className="group transition-colors hover:bg-saffron/10">
                  <th
                    scope="row"
                    className="border-b border-line px-5 py-5 text-[14px] font-medium leading-snug text-ink/85"
                  >
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={cn(
                        "border-b border-line px-4 py-4 transition-colors",
                        i === r.values.length - 1 && "sticky right-0 z-[1] border-saffron/25 bg-deepviolet group-hover:bg-violet",
                      )}
                    >
                      <Mark v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Note className="mt-5">
          Category-level positioning; individual products vary. Marks describe typical behaviour of
          a category, not any specific vendor.
        </Note>
      </Container>
    </section>
  );
}

/* Section 13 — Provider segments ---------------------------------- */

export function ProviderSegments() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="providers" ref={ref} className="relative overflow-hidden bg-paper py-20 text-[#7782B0] sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 right-6 font-display text-[clamp(10rem,24vw,24rem)] font-black leading-none text-[#7782B0]/[.055]">11</div>
      <Container className="relative">
        <div className="reveal max-w-[920px]">
          <Eyebrow className="text-[#7782B0]">Chapter 11 · Who it is for</Eyebrow>
          <h2 className="font-display t-4 mt-5 font-extrabold text-[#7782B0]">
            Built around how service work <span className="accent text-[#59648F]">actually ends.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-px border border-[#7782B0]/35 bg-[#7782B0]/20 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((s) => (
            <article
              key={s.code}
              className="group bg-[#F3F0D6] p-6 transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(.22,.68,.24,1)] hover:-translate-y-0.5 hover:bg-[#7782B0]/[.09] sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-[10px] tracking-[0.18em] text-[#59648F]">{s.code}</span>
                <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 border border-[#7782B0]/55 bg-transparent transition-colors duration-500 group-hover:bg-[#7782B0]" />
              </div>
              <h3 className="font-display mt-6 text-[1.35rem] font-bold text-[#6672A2]">{s.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#59648F]/85">{s.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
