import { useCallback, useEffect, useState } from "react";
import { PassObject } from "@/components/Scene";
import { Container, Eyebrow, Note, SealRing } from "@/components/ui";
import { gridLegend, ritualSteps, type GridState } from "@/data";
import { useReveal, useScrollProgress } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* Chapter 03 — The physical pass                                      */
/* ------------------------------------------------------------------ */

const callouts = [
  {
    code: "01",
    label: "Unique QR",
    body: "One code per pass. Replacement and reassignment rules will be defined before pilot use.",
  },
  {
    code: "02",
    label: "Human-readable asset code",
    body: "AP-7K3M9 — short enough to read out on a phone call.",
  },
  {
    code: "03",
    label: "Numbered issue",
    body: "01/50 keeps a physical box auditable against the software.",
  },
  {
    code: "04",
    label: "Durable identifier",
    body: "Planned for durable service use; material tests are still pending.",
  },
  {
    code: "05",
    label: "Safe public scan page",
    body: "Opens service information a stranger can safely see.",
  },
];

export function PhysicalPass() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="pass" ref={ref} className="relative overflow-hidden bg-ivory py-20 sm:py-28">
      <Container>
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[20ch]">
            <Eyebrow>Chapter 03 · The object</Eyebrow>
            <h2 className="font-display t-4 mt-5 text-deepviolet">
              A service record <span className="accent text-violet">with somewhere to live.</span>
            </h2>
          </div>
          <Note className="lg:text-right">
            Approved visual direction with a scannable demo QR overlay. Physical production specifications are not locked yet.
          </Note>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div className="reveal relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 m-auto aspect-square w-[76%] rounded-full bg-saffron/25"
            />
            <div className="relative mx-auto w-full max-w-[620px]">
              <PassObject tilt={-2} />
            </div>
            <div className="relative mt-7 flex flex-wrap justify-between gap-2">
              <span className="label text-violet/80">Physical dimensions · not yet locked</span>
              <span className="label text-violet/80">No provider name printed</span>
            </div>
          </div>

          <ul className="reveal self-center">
            {callouts.map((c) => (
              <li key={c.code} className="flex gap-5 border-t border-line py-5 last:border-b">
                <span className="label tnum shrink-0 pt-1 text-saffron">{c.code}</span>
                <div>
                  <h3 className="font-display text-[1.05rem] text-deepviolet">{c.label}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink/70">{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            ["/images/pass-stack-concept.webp", "Numbered pass stack", "Concept · issued sequence"],
            ["/images/pass-box-closed-concept.webp", "Closed 50-pass paperboard box", "Concept · closed pack"],
            ["/images/pass-peel-concept-fixed.webp", "ARANCH PASS peeling from its plain release liner; underside unprinted", "Concept · adhesive format"],
          ].map(([src, alt, caption]) => (
            <figure key={src} className="reveal image-frame clip-corner hairline group overflow-hidden bg-paper">
              <div className="overflow-hidden"><img src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)] group-hover:scale-[1.035]" /></div>
              <figcaption className="label border-t border-line px-4 py-3 text-violet">{caption}</figcaption>
            </figure>
          ))}
        </div>
        <Note className="mt-5">Additional product images are concept renders derived from the approved design. They are not photographs of a manufactured batch.</Note>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Standard and proposed premium material systems                       */
/* ------------------------------------------------------------------ */

const standardBenefits = [
  "Unique QR and human-readable asset code",
  "Numbered issue sequence",
  "Intended for everyday indoor service use",
  "Standard 50-pass provider pack",
];

const proBenefits = [
  "High-contrast QR with optional NFC tap target",
  "Graphite technical texture and saffron micro-registration",
  "Planned UV, moisture and abrasion-resistant laminate",
  "Planned tamper-evident construction for demanding surfaces",
  "Smaller 25-pass premium pack",
];

export function PassVariants() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="reveal grid gap-7 lg:grid-cols-[1fr_.8fr] lg:items-end">
          <div><Eyebrow>Material system · two directions</Eyebrow><h2 className="font-display t-4 mt-5 max-w-[18ch] font-extrabold text-deepviolet">One service identity. <span className="accent text-violet">Two levels of duty.</span></h2></div>
          <Note className="lg:text-right">ARANCH PASS PRO is a proposed premium specification. NFC, weather resistance, tamper behaviour and final materials require engineering and field tests before sale.</Note>
        </div>

        <figure className="reveal image-frame clip-corner hairline mt-12 overflow-hidden bg-paper">
          <div className="grid gap-px bg-line md:grid-cols-2">
            <div className="group overflow-hidden bg-paper p-5 sm:p-8"><img src="/images/aranch-pass-passport-seal.webp" alt="ARANCH PASS standard identifier." loading="lazy" className="aspect-[16/9] w-full object-contain transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)] group-hover:scale-[1.025]"/></div>
            <div className="group overflow-hidden bg-[#101113] p-5 sm:p-8"><img src="/images/aranch-pass-pro-master.webp" alt="ARANCH PASS PRO canonical matte-black identifier." loading="lazy" className="aspect-[16/9] w-full object-contain transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)] group-hover:scale-[1.025]"/></div>
          </div>
          <figcaption className="label flex flex-wrap justify-between gap-2 border-t border-line px-5 py-3 text-violet"><span>Standard · warm ivory</span><span>Pro · matte graphite</span></figcaption>
        </figure>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <article className="reveal clip-corner hairline flex flex-col p-6 sm:p-8">
            <div className="flex items-center justify-between"><span className="label text-violet">ARANCH PASS</span><span className="mono rounded-full border border-line px-3 py-1 text-[9px] text-muted uppercase">Standard</span></div>
            <h3 className="font-display mt-6 text-3xl font-extrabold text-deepviolet">Everyday service identity.</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-ink/70">The primary pilot direction: a clear physical way back for routine service relationships.</p>
            <ul className="mt-6 space-y-3">{standardBenefits.map((benefit)=><li key={benefit} className="flex gap-3 border-t border-line pt-3 text-[14px] text-ink/78"><span className="text-saffron">✓</span>{benefit}</li>)}</ul>
          </article>

          <article className="reveal clip-corner flex flex-col overflow-hidden bg-[#101113] text-ivory shadow-[0_30px_80px_-52px_rgba(0,0,0,.9)]">
            <div className="image-frame group overflow-hidden border border-transparent bg-[#101113] p-4"><img src="/images/aranch-pass-pro-master.webp" alt="Canonical concept render of the matte-black ARANCH PASS PRO premium service identifier." loading="lazy" className="aspect-[16/8] w-full object-contain transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)] group-hover:scale-[1.025]"/></div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-center justify-between"><span className="label text-saffron">ARANCH PASS PRO</span><span className="mono rounded-full border border-saffron/35 px-3 py-1 text-[9px] text-saffron uppercase">Proposed</span></div>
              <h3 className="font-display mt-6 text-3xl font-extrabold">For demanding surfaces.</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ivory/62">A higher-spec identity direction for outdoor, high-wear or premium provider deployments.</p>
              <ul className="mt-6 space-y-3">{proBenefits.map((benefit)=><li key={benefit} className="flex gap-3 border-t border-ivory/12 pt-3 text-[14px] text-ivory/78"><span className="text-saffron">◆</span>{benefit}</li>)}</ul>
              <figure className="image-frame group relative mt-7 h-[230px] overflow-hidden border border-ivory/12 bg-[#0b0c0e] sm:h-[280px]" aria-label="Concept stack of identical ARANCH PASS PRO identifiers">
                {[3,2,1,0].map((layer)=><img key={layer} src="/images/aranch-pass-pro-master.webp" alt={layer===0?"ARANCH PASS PRO canonical matte-black identifier in a repeated premium stack":""} aria-hidden={layer!==0} loading="lazy" className="absolute left-1/2 top-1/2 w-[78%] object-contain transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)]" style={{transform:`translate(-50%, calc(-50% + ${layer*12}px)) translateX(${layer*8}px) rotate(${layer*0.7}deg) scale(${1-layer*0.025})`,zIndex:10-layer}}/>)}
                <figcaption className="label absolute bottom-3 left-4 z-20 text-saffron">Same canonical Pro face · repeated pack sequence</figcaption>
              </figure>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            ["/images/aranch-pass-pro-stack.webp", "ARANCH PASS PRO canonical card repeated as a numbered stack", "Pro sequence · same face"],
            ["/images/aranch-pass-pro-print-sheet.webp", "ARANCH PASS PRO canonical design arranged on a production print sheet", "Pro print sheet · variable codes"],
            ["/images/aranch-pass-pro-pack.webp", "ARANCH PASS PRO pack containing the same matte-black card design", "Pro pack · 25 passes"],
          ].map(([src, alt, caption])=><figure key={src} className="image-frame group overflow-hidden border border-line bg-paper"><div className="overflow-hidden"><img src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)] group-hover:scale-[1.03]"/></div><figcaption className="label border-t border-line px-4 py-3 text-violet">{caption}</figcaption></figure>)}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 04 — The activation ritual                                  */
/* ------------------------------------------------------------------ */

function StepDiagram({ index, active }: { index: number; active: boolean }) {
  const stroke = active ? "#4D1688" : "rgba(77,22,136,0.55)";
  return (
    <svg viewBox="0 0 160 120" className="h-24 w-full" aria-hidden="true">
      <g className={active ? `ritual-svg-active ritual-svg-${index}` : undefined} stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round">
        {index === 0 && (
          <>
            <path d="M24 58 h94 v46 h-94 z" />
            <path d="M24 68 h94" opacity="0.4" />
            <g transform="rotate(-10 96 40)">
              <rect x="62" y="18" width="70" height="42" rx="7" fill="#F7F0D8" />
              <circle cx="114" cy="39" r="11" stroke="#F4AD08" />
            </g>
          </>
        )}
        {index === 1 && (
          <>
            <rect x="52" y="12" width="56" height="96" rx="10" />
            <rect x="66" y="32" width="28" height="28" rx="3" stroke="#F4AD08" />
            <path d="M66 78 h28 M66 88 h17" opacity="0.5" />
          </>
        )}
        {index === 2 && (
          <>
            <rect x="24" y="20" width="112" height="80" rx="6" />
            <path d="M38 42 h50 M38 58 h74 M38 74 h38" opacity="0.55" />
            <circle cx="116" cy="76" r="13" stroke="#F4AD08" />
            <path d="M110 76 l4.5 5 l9 -11" stroke="#F4AD08" />
          </>
        )}
        {index === 3 && (
          <>
            <rect x="32" y="12" width="96" height="96" rx="8" />
            <path d="M32 34 h96" opacity="0.4" />
            <rect x="58" y="56" width="48" height="30" rx="5" fill="#F4AD08" stroke="#4D1688" />
            <circle cx="82" cy="71" r="7" stroke="#2E0759" />
          </>
        )}
      </g>
    </svg>
  );
}

export function ActivationRitual() {
  const ref = useReveal<HTMLElement>();
  const sequence = [0, 1, 2, 3, 2, 1];
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), { threshold: 0.08 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setSequenceIndex((index) => (index + 1) % sequence.length), 1400);
    return () => window.clearInterval(timer);
  }, [inView, sequence.length]);
  const active = hovered ?? sequence[sequenceIndex];
  return (
    <section id="ritual" ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="reveal grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Eyebrow>Chapter 04 · The activation ritual</Eyebrow>
            <h2 className="font-display t-4 mt-5 max-w-[17ch] text-deepviolet">
              Under a minute to give the service{" "}
              <span className="accent text-violet">a memory.</span>
            </h2>
          </div>
          <Note>
            Workflow target for the pilot; final timing will be tested with technicians. Nothing
            here has been measured in the field yet.
          </Note>
        </div>

        <ol className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li aria-hidden="true" className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-1/2 z-0 hidden -translate-y-1/2 lg:block">
            <div className="h-[1.5px] w-full bg-violet/15" />
            <div
              className="absolute top-1/2 h-[2px] w-12 -translate-x-1/2 -translate-y-1/2 bg-saffron shadow-[0_0_8px_#f4ad08] transition-[left] duration-700 ease-[cubic-bezier(.22,.68,.24,1)]"
              style={{ left: `${(active / 3) * 100}%` }}
            />
          </li>
          {ritualSteps.map((s, i) => (
            <li key={s.n} className="relative z-10">
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                className={cn(
                  "clip-corner h-full border bg-ivory p-5 transition-[transform,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(.22,.68,.24,1)] sm:p-6",
                  active === i
                    ? "ritual-card-active border-deepviolet bg-ivory shadow-[0_22px_55px_-34px_rgba(46,7,89,.85)]"
                    : "border-line",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="label tnum text-violet">{s.n}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 rotate-45 transition-colors",
                      active === i ? "bg-saffron" : "bg-violet/25",
                    )}
                  />
                </div>
                <StepDiagram index={i} active={active === i} />
                <h3 className="font-display t-1 mt-4 text-deepviolet">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 05 — The 50-pass box                                        */
/* ------------------------------------------------------------------ */

const boxCodes = ["AP-7K3M9", "AP-2R8QD", "AP-9V4XL", "AP-5B1TC", "AP-3H6NZ", "AP-8M2WK"];

export function PassBox() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative overflow-hidden bg-deepviolet py-20 text-ivory sm:py-28">
      <SealRing
        className="pointer-events-none absolute -bottom-40 -left-32 w-[460px] opacity-20"
        tone="ivory"
        text="FIFTY PASSES · ONE BOX · "
      />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <div className="reveal">
            <Eyebrow tone="dark">Chapter 05 · The box</Eyebrow>
            <h2 className="font-display t-4 mt-5 max-w-[17ch]">
              Fifty completed jobs,{" "}
              <span className="accent text-saffron">ready to stay connected.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] leading-relaxed text-ivory/75">
              Each box contains a numbered set of unique service passes. Every QR and asset code is
              issued individually; the provider activates them as work is completed.
            </p>

            <div className="mt-8 flex items-center gap-5">
              <span className="font-display tnum t-5 text-saffron">01</span>
              <span className="h-12 w-px bg-ivory/25" />
              <span className="label text-ivory/60">/ 50 issued</span>
            </div>

            <ul className="mt-8 flex flex-wrap gap-2">
              {boxCodes.map((c) => (
                <li key={c} className="label clip-corner-sm hairline-dark px-3 py-1.5 text-ivory/70">
                  {c}
                </li>
              ))}
              <li className="label px-3 py-1.5 text-ivory/40">+ 44 more</li>
            </ul>

            <div className="hairline-dark mt-10 p-4">
              <Note tone="dark">
                Packaging concept shown as a drawn rendering. Final material, dimensions and print
                production are still being tested.
              </Note>
            </div>
          </div>

          <div className="reveal">
            <figure className="image-frame clip-corner group overflow-hidden border border-ivory/20 bg-paper p-3 sm:p-5">
              <div className="overflow-hidden"><img src="/images/aranch-pass-fifty-box.webp" alt="Approved ARANCH PASS paperboard box concept containing fifty numbered service passes." draggable={false} loading="lazy" className="block h-auto w-full select-none transition-transform duration-700 ease-[cubic-bezier(.22,.68,.24,1)] group-hover:scale-[1.025]"/></div>
            </figure>
            <p className="label mt-3 text-ivory/45">Approved box direction · concept image, not a production batch</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter 06 — Activation grid                                        */
/* ------------------------------------------------------------------ */

const stateStyles: Record<GridState, string> = {
  issued: "border-line bg-transparent text-muted",
  activated: "border-violet bg-violet text-ivory",
  due: "border-saffron bg-saffron text-plum",
  rebooked: "border-deepviolet bg-paper text-deepviolet",
};

function stateFor(i: number, p: number): GridState {
  const reach = p * 62 - 4;
  if (i > reach) return "issued";
  if (i > reach - 10) return "activated";
  if (i % 7 === 3) return "due";
  if (i % 5 === 0) return "rebooked";
  return "activated";
}

export function ActivationGrid() {
  const [p, setP] = useState(0);
  const onProgress = useCallback((v: number) => setP(v), []);
  const ref = useScrollProgress<HTMLElement>(onProgress);
  const cells = Array.from({ length: 50 }, (_, i) => i + 1);
  const narrative = [
    { code: "01/50", label: "issued" },
    { code: "12/50", label: "activated" },
    { code: "31/50", label: "due soon" },
    { code: "50/50", label: "ready for the next box" },
  ];

  return (
    <section ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>Chapter 06 · Activation grid</Eyebrow>
            <h2 className="font-display t-4 mt-5 max-w-[16ch] text-deepviolet">
              Physical passes, <span className="accent text-violet">tracked as software states.</span>
            </h2>
            <p className="mt-5 max-w-[44ch] leading-relaxed text-ink/75">
              Every pass in a box has a state. As jobs are completed the box empties and the
              dashboard fills — the same fifty identifiers, seen from two sides.
            </p>

            <ul className="mt-8 grid gap-3">
              {gridLegend.map((l) => (
                <li key={l.state} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={cn("mt-1.5 h-3.5 w-3.5 shrink-0 border", stateStyles[l.state])}
                  />
                  <span className="text-[14px] text-ink/80">
                    <span className="font-semibold text-deepviolet">{l.label}</span>
                    <span className="text-muted"> — {l.hint}</span>
                  </span>
                </li>
              ))}
            </ul>

            <Note className="mt-8">
              Illustrative demo states. These are not real customer records and no live data is
              shown anywhere on this page.
            </Note>
          </div>

          <div>
            <div className="clip-corner hairline bg-ivory p-4 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="label text-violet">Box A · 50 passes</span>
                <span className="label text-muted">Demo</span>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10 sm:gap-2.5">
                {cells.map((n) => {
                  const st = stateFor(n, p);
                  return (
                    <div
                      key={n}
                      title={`${String(n).padStart(2, "0")}/50 · ${st}`}
                      className={cn(
                        "mono tnum clip-corner-sm flex aspect-[5/3] items-center justify-center border text-[9px] transition-colors duration-500",
                        stateStyles[st],
                      )}
                    >
                      {String(n).padStart(2, "0")}
                    </div>
                  );
                })}
              </div>
            </div>

            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {narrative.map((n) => (
                <li
                  key={n.code}
                  className="hairline flex items-center justify-between px-3 py-2.5"
                >
                  <span className="label tnum text-violet">{n.code}</span>
                  <span className="label text-muted">{n.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
