import { Button, Container, Eyebrow, Note, PlannedShot } from "@/components/ui";
import { offers, photographyBrief, principles, site, transparency } from "@/data";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

/* Section 14 — Offer architecture --------------------------------- */

function OfferGlyph({ index, featured }: { index: number; featured: boolean }) {
  return <svg viewBox="0 0 120 80" className="mt-5 h-20 w-full" aria-hidden="true"><g fill="none" stroke={featured?"#F4AD08":"#4D1688"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{index===0&&<><rect x="15" y="12" width="90" height="56" rx="5"/><path d="M15 26h90M29 42h26M29 53h42"/><circle cx="89" cy="48" r="9"/></>}{index===1&&<><rect x="24" y="20" width="72" height="44" rx="7"/><path d="M35 20v44M47 20v44" opacity=".35"/><rect x="59" y="30" width="25" height="25"/><path className="offer-trace" d="M10 72h100" strokeDasharray="6 8"/></>}{index===2&&<><rect x="12" y="18" width="45" height="45" rx="6"/><rect x="63" y="18" width="45" height="45" rx="6"/><path d="M57 40h6"/><path d="m28 42 7 7 13-17M75 31h21M75 41h15M75 51h18"/></>}</g></svg>;
}

export function OfferArchitecture() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[20ch]">
            <Eyebrow>Chapter 12 · Offer architecture</Eyebrow>
            <h2 className="font-display t-4 mt-5 text-deepviolet">
              Three ways this <span className="accent text-violet">may be bought.</span>
            </h2>
          </div>
          <Note className="lg:text-right">
            {site.pricingLabel}. No figures are published yet — they would be invented.
          </Note>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {offers.map((o, index) => (
            <article
              key={o.code}
              className={cn(
                "reveal offer-card clip-corner group relative flex flex-col overflow-hidden p-6 transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(.22,.68,.24,1)] will-change-transform hover:shadow-[0_24px_64px_-44px_rgba(46,7,89,.58)] sm:p-8",
                o.featured
                  ? "bg-deepviolet text-ivory lg:-translate-y-3 lg:hover:-translate-y-4"
                  : "hairline bg-ivory hover:-translate-y-1 hover:border-violet/30",
              )}
            >
              <div className="mono flex items-center justify-between text-[10px] tracking-[0.16em] uppercase">
                <span className={o.featured ? "text-saffron" : "text-violet"}>{o.code}</span>
                {o.featured && (
                  <span className="clip-corner-sm bg-saffron px-2 py-1 text-plum">Pilot focus</span>
                )}
              </div>
              <OfferGlyph index={index} featured={o.featured} />
              <h3
                className={cn(
                  "font-display mt-6 text-[1.6rem]",
                  o.featured ? "text-ivory" : "text-deepviolet",
                )}
              >
                {o.title}
              </h3>
              <p className={cn("mt-2 text-[14px]", o.featured ? "text-ivory/70" : "text-muted")}>
                {o.lede}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {o.items.map((it) => (
                  <li key={it} className="flex gap-3 text-[14px] leading-relaxed">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron"
                    />
                    <span className={o.featured ? "text-ivory/85" : "text-ink/80"}>{it}</span>
                  </li>
                ))}
              </ul>
              <div
                className={cn(
                  "mono mt-7 border-t pt-4 text-[10px] tracking-[0.14em] uppercase",
                  o.featured ? "border-ivory/20 text-ivory/55" : "border-line text-muted",
                )}
              >
                {site.pricingVisible ? o.price : "Pricing not published yet"}
              </div>
              <a href="#pilot" className={cn("clip-corner-sm mt-5 px-4 py-3 text-center text-[11px] font-bold tracking-[.08em] uppercase",o.featured?"bg-saffron text-plum":"bg-deepviolet text-ivory")}>Register interest</a>
            </article>
          ))}
        </div>

        <Note className="mt-6">
          {site.pricingVisible
            ? "Displayed pricing is controlled by deployment environment variables and should be treated according to the published pilot terms."
            : "Pricing is deliberately not shown. When it exists it will be set per active asset, branch and automation — not by counting technicians."}
        </Note>
      </Container>
    </section>
  );
}

/* Section 15 — Mission and principles ------------------------------ */

function ContinuityDiagram() {
  const nodes = [
    { n: "01", title: "Job", body: "Service completed" },
    { n: "02", title: "Record", body: "History appended" },
    { n: "03", title: "Asset", body: "Pass stays attached" },
    { n: "04", title: "Return", body: "Provider found again" },
  ];
  return (
    <div className="clip-corner border border-ivory/20 bg-deepviolet/55 p-5 sm:p-7">
      <div className="flex items-center justify-between border-b border-ivory/15 pb-4">
        <span className="label text-saffron">Service continuity</span>
        <span className="mono text-[10px] text-ivory/45">SYSTEM PRINCIPLE</span>
      </div>
      <div className="relative mt-7 grid gap-3 sm:grid-cols-2">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 220" preserveAspectRatio="none">
          <path d="M96 55H304M304 55V165H96M96 165V55" fill="none" stroke="#F4AD08" strokeWidth="2" strokeDasharray="5 7" />
        </svg>
        {nodes.map((node) => (
          <div key={node.n} className="relative bg-plum px-4 py-5">
            <span className="mono text-[10px] text-saffron">{node.n}</span>
            <h3 className="font-display mt-2 text-[1.05rem] font-bold text-ivory">{node.title}</h3>
            <p className="mt-1 text-[12px] text-ivory/55">{node.body}</p>
          </div>
        ))}
      </div>
      <p className="mono mt-5 text-[10px] leading-relaxed text-ivory/45">NO ROTATING SEAL · NO REPEATED PRODUCT IMAGE · ONE OPERATIONAL LOOP</p>
    </div>
  );
}

export function MissionPrinciples() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="mission" ref={ref} className="relative overflow-hidden bg-plum py-20 text-ivory sm:py-28">
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="reveal">
            <Eyebrow tone="dark">Chapter 13 · Why we are building it</Eyebrow>
            <h2 className="font-display t-5 mt-6 max-w-[16ch]">
              Completed work should not become{" "}
              <span className="accent text-saffron">a lost customer.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] leading-relaxed text-ivory/70">
              The service ends. The connection stays. That single idea decides what we build, what
              we refuse to build, and what a stranger is allowed to see when they scan a pass.
            </p>
          </div>
          <div className="reveal">
            <ContinuityDiagram />
          </div>
        </div>

        <div className="mt-16 grid gap-px border-t border-ivory/18 md:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <div key={p.n} className="reveal border-b border-ivory/15 py-7 pr-6 lg:border-r lg:pl-6 lg:first:pl-0">
              <span className="mono text-[11px] text-saffron">{p.n}</span>
              <h3 className="font-display mt-4 text-[1.25rem]">{p.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ivory/68">{p.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Founder ----------------------------------------------------------- */

export function FounderSection() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="founder" ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="reveal grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <div>
            <Eyebrow>Founder</Eyebrow>
            <p className="mono mt-5 text-[12px] tracking-[0.16em] text-violet uppercase">Aryan · Founder & CEO</p>
          </div>
          <div>
            <h2 className="font-display t-4 max-w-[20ch] font-bold text-deepviolet">
              Building the system behind the physical pass.
            </h2>
            <p className="mt-6 max-w-[62ch] leading-relaxed text-ink/75">
              Aryan is the founder and CEO of ARANCH PASS. He is leading the product, software and early pilot design around one principle: completed service work should leave customers a reliable way back to the original provider.
            </p>
            <a href="/founder/" className="mono mt-6 inline-block text-[11px] tracking-[0.12em] text-violet uppercase underline underline-offset-4">Open founder profile →</a>
            <Note className="mt-5">Verified professional profile links and a formal company identity will be added only after the profiles and operating entity are ready for public use.</Note>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Section 16 — Pre-launch transparency ----------------------------- */

export function PrelaunchTransparency() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="transparency" ref={ref} className="bg-ivory py-20 sm:py-28">
      <Container>
        <div className="reveal max-w-[24ch]">
          <Eyebrow>Chapter 14 · Where we actually are</Eyebrow>
          <h2 className="font-display t-4 mt-5 text-deepviolet">
            We do not have reviews yet.{" "}
            <span className="accent text-violet">The pilot has not started.</span>
          </h2>
        </div>

        <p className="reveal mt-7 max-w-[62ch] text-[16px] leading-[1.7] text-ink/80 sm:text-[17px]">
          ARANCH PASS is currently a product and system concept being prepared for field
          validation. The pass and box shown here are approved design directions. Material tests,
          technician timing, provider adoption and repeat-service results still need to be proven.
        </p>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="reveal clip-corner bg-paper hairline p-6 sm:p-8">
            <h3 className="mono text-[11px] tracking-[0.2em] text-violet uppercase">What exists</h3>
            <ul className="mt-5">
              {transparency.exists.map((t) => (
                <li key={t} className="flex items-start gap-3 border-t border-line py-3.5 text-[15px]">
                  <span aria-hidden="true" className="mt-0.5 text-saffron">
                    ✓
                  </span>
                  <span className="text-ink/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal clip-corner bg-paper hairline p-6 sm:p-8">
            <h3 className="mono text-[11px] tracking-[0.2em] text-violet uppercase">
              What remains
            </h3>
            <ul className="mt-5">
              {transparency.remains.map((t) => (
                <li key={t} className="flex items-start gap-3 border-t border-line py-3.5 text-[15px]">
                  <span
                    aria-hidden="true"
                    className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-line text-[9px] text-muted"
                  >
                    ○
                  </span>
                  <span className="text-ink/75">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="reveal mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <PlannedShot
            path={photographyBrief[0].path}
            ratio="aspect-square"
            brief={photographyBrief[0].note}
          />
          <PlannedShot
            path={photographyBrief[1].path}
            ratio="aspect-square"
            brief={photographyBrief[1].note}
          />
          <div className="clip-corner bg-deepviolet p-6 text-ivory sm:p-8">
            <h3 className="font-display t-2">Want to be in the first group?</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ivory/70">
              Pilot providers get early access, direct input on the workflow and honest updates —
              including the parts that do not work.
            </p>
            <Button href="#pilot" className="mt-6">
              Apply for the first pilot
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
