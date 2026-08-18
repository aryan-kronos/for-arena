import { InteractivePass } from "@/components/InteractivePass";
import { HeroBackgroundFilm } from "@/components/HeroBackgroundFilm";
import { QrIcon } from "@/components/icons";

import { Button, Container, Eyebrow, Note, SealRing, TraceLine } from "@/components/ui";
import { bandItems, manifestoLines } from "@/data";
import { useReveal } from "@/hooks/useReveal";

export function Hero() {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-paper pt-[104px] pb-16 sm:pt-[132px] sm:pb-24"
    >
      <HeroBackgroundFilm />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="mx-auto h-full w-full max-w-[1240px] px-5 sm:px-8 lg:px-12">
          <div className="grid h-full grid-cols-4 lg:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`border-l border-line/40 ${i > 3 ? "hidden lg:block" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <Container className="relative">
        <div className="reveal max-w-[760px]">
            <Eyebrow>Physical service identity · built for India</Eyebrow>

            <h1 className="font-display t-6 mt-7 text-deepviolet">
              Every service
              <br />
              should leave
              <br />
              <span className="accent relative inline-block text-violet">
                a way back.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 320 12"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-[9px] w-full"
                >
                  <path
                    d="M2 8 C 80 2, 240 2, 318 8"
                    stroke="#F4AD08"
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="lede mt-9 max-w-[50ch] text-ink/75">
              ARANCH PASS gives every serviced asset a unique physical identity — so technicians
              can record the job, and customers can find the original provider again.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="#pilot">Join the pilot</Button>
              <Button href="#system" variant="ghost">
                See the system →
              </Button>
            </div>

            <a href="/customer" className="clip-corner group mt-5 flex max-w-[560px] items-center gap-4 bg-deepviolet p-4 text-ivory transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-violet sm:p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center bg-saffron text-plum sm:h-14 sm:w-14"><QrIcon width={27} height={27}/></span>
              <span className="min-w-0 flex-1"><span className="label block text-saffron">No account required</span><span className="mt-1 block text-[16px] font-bold sm:text-[18px]">Open the customer portal</span><span className="mt-0.5 block text-[12px] text-ivory/60">Scan a QR code or check an asset code</span></span>
              <span aria-hidden="true" className="text-2xl text-saffron transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <div className="mt-9 max-w-[520px]">
              <TraceLine className="h-8 w-full" />
              <p className="label mt-3 text-muted">
                Pre-launch · First pilots being designed · No customer app required
              </p>
            </div>
          </div>

      </Container>
    </section>
  );
}

export function TraceBand() {
  const row = [...bandItems, ...bandItems, ...bandItems, ...bandItems];
  return (
    <section aria-label="The ARANCH PASS service loop" className="bg-deepviolet py-5 sm:py-6">
      <div className="overflow-hidden">
        <div className="marquee-track items-center gap-8 px-4">
          {row.map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-8">
              <span className="font-display t-2 text-ivory whitespace-nowrap">{item}</span>
              <span aria-hidden="true" className="flex items-center gap-2">
                <span className="h-[6px] w-[6px] rotate-45 bg-saffron" />
                <span className="label tnum text-ivory/40">
                  {String((i % 50) + 1).padStart(2, "0")}/50
                </span>
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProblemManifesto() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative overflow-hidden bg-plum py-20 text-ivory sm:py-28">
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="reveal">
            <Eyebrow tone="dark">Chapter 01 · The problem</Eyebrow>
            <h2 className="font-display t-5 mt-7 max-w-[17ch]">
              The job gets completed.
              <br />
              <span className="accent text-ivory/45">The connection gets lost.</span>
            </h2>
          </div>
          <div className="reveal relative flex flex-col justify-between overflow-hidden clip-corner border border-ivory/20 bg-[#110221] p-6 sm:p-8 shadow-[0_32px_100px_-36px_rgba(0,0,0,0.9)]">
            {/* Technical blueprint dot grid */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(247,240,216,0.07)_1px,transparent_1px)] [background-size:22px_22px]"
            />

            {/* Corner optical registration brackets */}
            <div aria-hidden="true" className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-saffron/40" />
            <div aria-hidden="true" className="pointer-events-none absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-saffron/40" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-saffron/40" />
            <div aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-saffron/40" />

            {/* Rotating SealRing watermark */}
            <SealRing
              tone="saffron"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] opacity-[0.11]"
            />

            {/* Multi-layered radiant golden aura */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,173,8,0.26)_0%,rgba(77,22,136,0.2)_45%,transparent_75%)] blur-[38px]"
            />

            {/* Stage header bar */}
            <div className="relative mb-2 flex items-center justify-between border-b border-ivory/10 pb-3">
              <span className="mono flex items-center gap-2 text-[9px] tracking-[0.2em] text-saffron uppercase">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
                Physical Decal Inspection
              </span>
              <span className="mono text-[9px] tracking-[0.14em] text-ivory/45 uppercase">
                01/50 · AP-7K3M9
              </span>
            </div>

            {/* Interactive 3D Model */}
            <div className="relative py-5 sm:py-7">
              <InteractivePass className="mx-auto w-full max-w-[480px]" />
            </div>

            {/* Stage footer bar */}
            <div className="relative mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-ivory/10 pt-3">
              <span className="label flex items-center gap-2 text-saffron">
                <span className="inline-block h-1.5 w-1.5 rotate-45 bg-saffron" />
                The physical way back
              </span>
              <span className="mono text-[10px] tracking-[0.14em] text-ivory/45 uppercase">
                Interactive model
              </span>
            </div>
          </div>
        </div>

        <ol className="mt-14 border-t border-ivory/15 sm:mt-16">
          {manifestoLines.map((line, i) => (
            <li
              key={line}
              className="reveal flex items-baseline gap-5 border-b border-ivory/15 py-6 sm:gap-10 sm:py-8"
            >
              <span className="label tnum shrink-0 text-saffron">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="t-3 leading-[1.25] text-ivory/90">{line}</span>
            </li>
          ))}
        </ol>

        <div className="reveal mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <p className="font-display t-3 text-saffron">
            ARANCH PASS keeps a way back <span className="accent">attached to the asset itself.</span>
          </p>
          <Note tone="dark">
            No statistics are shown in this section on purpose. We have not run a field study yet,
            and we will not publish numbers we cannot source.
          </Note>
        </div>
      </Container>
    </section>
  );
}

export function TwoSides() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="reveal max-w-[44ch]">
          <Eyebrow>Chapter 02 · Two sides, one pass</Eyebrow>
          <h2 className="font-display t-4 mt-5 text-deepviolet">
            The same pass does <span className="accent text-violet">two different jobs.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <article className="reveal clip-corner hairline flex flex-col bg-ivory p-6 sm:p-9">
            <span className="label text-violet">Side A · Provider</span>
            <h3 className="font-display t-3 mt-5 text-deepviolet">
              The technician finishes the job.
            </h3>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-ink/75">
              Scan the pass, record the service and set the next recommended date. The asset is now
              connected to the provider’s system.
            </p>
            <div className="clip-corner hairline mt-8 bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="label text-violet">Service recorded</span>
                <span className="mono text-[11px] text-muted">AP-7K3M9</span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Pass claimed", "Job saved", "Next date set"].map((item, index) => (
                  <div key={item} className="clip-corner-sm bg-ivory px-3 py-4">
                    <span className="mono text-[10px] text-saffron">0{index + 1}</span>
                    <p className="mt-2 text-[12px] leading-snug text-ink/75">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="reveal clip-corner flex flex-col bg-deepviolet p-6 text-ivory sm:p-9">
            <span className="label text-saffron">Side B · Customer</span>
            <h3 className="font-display t-3 mt-5">The customer needs help again.</h3>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-ivory/75">
              Scan the same pass, see safe service information and contact the original provider
              without searching from zero.
            </p>
            <div className="clip-corner hairline-dark mt-8 bg-plum/65 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-ivory/15 pb-3">
                <span className="label text-saffron">Public scan</span>
                <span className="mono text-[11px] text-ivory/55">AP-7K3M9</span>
              </div>
              <dl className="mt-4 space-y-3 text-[13px]">
                <div className="flex justify-between gap-4"><dt className="text-ivory/50">Last service</dt><dd>Recorded by provider</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ivory/50">Next service</dt><dd>Recommended date</dd></div>
              </dl>
              <div className="clip-corner-sm mt-5 bg-saffron px-4 py-3 text-center text-[12px] font-bold tracking-[0.08em] text-plum uppercase">
                Contact original provider
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}
