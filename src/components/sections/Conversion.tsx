import { useId, useState, type FormEvent } from "react";
import { Wordmark } from "@/components/Header";
import { Container, Eyebrow, Note } from "@/components/ui";
import { faqs, footerLinks, site } from "@/data";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";
import { submitPilotLead } from "@/lib/pilotLead";
import { LocationFields, type LocationValue } from "@/components/LocationFields";

/* Section 17 — FAQ -------------------------------------------------- */

export function FAQ() {
  const ref = useReveal<HTMLElement>();
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <section id="faq" ref={ref} className="bg-paper py-20 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div className="reveal lg:sticky lg:top-24 lg:self-start">
            <Eyebrow>Chapter 15 · Questions</Eyebrow>
            <h2 className="font-display t-4 mt-5 text-deepviolet">
              Answered honestly, <span className="accent text-violet">including the unfinished parts.</span>
            </h2>
            <Note className="mt-6">
              If an answer would require a claim we cannot support today, it says so.
            </Note>
          </div>

          <div className="reveal">
            <ul className="border-t border-line">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q} className="border-b border-line">
                    <h3>
                      <button
                        type="button"
                        id={`${uid}-b-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`${uid}-p-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-start gap-4 py-5 text-left"
                      >
                        <span className="mono shrink-0 pt-1 text-[10px] text-violet">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 text-[16px] font-semibold text-deepviolet sm:text-[17px]">
                          {f.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-line text-violet transition-[transform,background-color,border-color,color] duration-300",
                            isOpen && "rotate-45 border-saffron bg-saffron text-plum",
                          )}
                        >
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`${uid}-p-${i}`}
                      role="region"
                      aria-labelledby={`${uid}-b-${i}`}
                      aria-hidden={!isOpen}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(.22,.68,.24,1)]",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-[68ch] pb-6 pr-2 pl-9 text-[15px] leading-[1.7] text-ink/75">{f.a}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Section 18 — Pilot form ------------------------------------------- */

type Stage = "one" | "two" | "done";

export function PilotForm() {
  const ref = useReveal<HTMLElement>();
  const uid = useId();
  const [stage, setStage] = useState<Stage>("one");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [stored, setStored] = useState(false);
  const [location, setLocation] = useState<LocationValue>({ pincode: "", city: "", district: "", state: "", postOffice: "" });

  const validContact = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || /^[+\d][\d\s-]{7,15}$/.test(v.trim());

  const submitStageOne = (e: FormEvent) => {
    e.preventDefault();
    if (!validContact(contact)) {
      setError("Enter a valid phone number or email address so we can reach you.");
      return;
    }
    setError(null);
    /**
     * INTEGRATION BOUNDARY
     * No backend is connected. Nothing is stored or transmitted.
     * Replace this block with a POST to your endpoint, and record
     * consent timestamp + source server-side.
     */
    setStage("two");
  };

  const sendLead = async (details?: {
    name?: string;
    businessName?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    postOffice?: string;
    serviceCategory?: string;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitPilotLead({
        contact: contact.trim(),
        ...details,
        source: "website-pilot-form",
        consentTextVersion: "2026-08-17",
      });
      setStored(result.stored);
      setStage("done");
    } catch {
      setError("We could not submit this right now. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitStageTwo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await sendLead({
      name: String(form.get("name") ?? "").trim() || undefined,
      businessName: String(form.get("business") ?? "").trim() || undefined,
      city: location.city || undefined,
      district: location.district || undefined,
      state: location.state || undefined,
      pincode: location.pincode || undefined,
      postOffice: location.postOffice || undefined,
      serviceCategory: String(form.get("category") ?? "").trim() || undefined,
    });
  };

  const inputCls =
    "hairline w-full bg-paper px-4 py-3.5 text-[15px] text-ink placeholder:text-muted/60 focus:border-violet";
  const labelCls = "mono mb-2 block text-[10px] tracking-[0.16em] text-ivory/60 uppercase";

  return (
    <section id="pilot" ref={ref} className="relative overflow-hidden bg-paper pb-20 text-ink sm:pb-28">
      <div className="relative min-h-[430px] overflow-hidden sm:min-h-[520px]">
        <img src="/images/pilot-conversion-hero.webp" alt="Concept render of numbered ARANCH PASS service passes feeding into the approved fifty-pass paperboard box." className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,.98)_0%,rgba(255,253,247,.9)_38%,rgba(255,253,247,.18)_72%,rgba(255,253,247,0)_100%)]" />
        <Container className="relative flex min-h-[430px] items-center py-16 sm:min-h-[520px]">
          <div className="reveal max-w-[680px]">
            <Eyebrow>Chapter 16 · The pilot list</Eyebrow>
            <h2 className="font-display t-5 mt-6 max-w-[13ch] font-extrabold text-deepviolet">
              Be first to put <span className="accent text-violet">a way back</span> on every job.
            </h2>
            <p className="mt-6 max-w-[48ch] text-[16px] leading-relaxed text-ink/72">Pilot progress, physical prototype updates and the first provider-testing opportunities—sent directly, without fake urgency.</p>
            <p className="label mt-7 text-violet/65">Concept image · final production materials may change</p>
          </div>
        </Container>
      </div>

      <Container className="relative -mt-10 sm:-mt-16">
        <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr] lg:items-stretch">
          <aside className="reveal clip-corner border border-line bg-ivory p-6 sm:p-8">
            <p className="label text-violet">What joining means</p>
            <h3 className="font-display mt-3 text-2xl font-bold text-deepviolet">First access, clearly explained.</h3>
            <ul className="mt-6 space-y-4">
              {["Prototype and material-test updates","Invitation to provider workflow testing","Full pilot terms before any payment"].map((item,index)=><li key={item} className="flex gap-3 border-t border-line pt-4 text-[14px] text-ink/75"><span className="mono text-[10px] text-saffron">0{index+1}</span><span>{item}</span></li>)}
            </ul>
            <p className="mono mt-8 text-[10px] leading-relaxed text-muted uppercase">No spam · no purchased lists · unsubscribe anytime</p>
          </aside>

          <div className="reveal clip-corner bg-deepviolet p-6 text-ivory shadow-[0_28px_80px_-48px_rgba(46,7,89,.8)] sm:p-9">
            {stage === "one" && (
              <form onSubmit={submitStageOne} noValidate>
                <p className="label text-saffron">Join the pilot list</p>
                <h3 className="font-display mt-3 text-[1.7rem] font-bold">Where should we reach you?</h3>
                <label htmlFor={`${uid}-contact`} className={`${labelCls} mt-6`}>Phone or email</label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input id={`${uid}-contact`} name="contact" type="text" inputMode="text" autoComplete="off" value={contact} onChange={(e)=>setContact(e.target.value)} aria-invalid={!!error} aria-describedby={error?`${uid}-err`:`${uid}-consent`} placeholder="you@example.com or 98XXXXXXXX" className={inputCls}/>
                  <button type="submit" className="clip-corner-sm bg-saffron px-7 py-4 text-[12px] font-bold tracking-[.08em] text-plum uppercase hover:bg-[#ffbe22]">Join the pilot</button>
                </div>
                {error&&<p id={`${uid}-err`} role="alert" className="mt-3 text-[13px] text-saffron">{error}</p>}
                <div className="relative my-5 flex items-center gap-4"><span className="h-px flex-1 bg-ivory/15"/><span className="mono text-[9px] text-ivory/40 uppercase">or</span><span className="h-px flex-1 bg-ivory/15"/></div>
                {site.whatsappHref ? <a href={site.whatsappHref} className="clip-corner-sm flex w-full items-center justify-center gap-2 border border-ivory/25 px-6 py-3.5 text-[12px] font-bold text-ivory uppercase hover:bg-ivory/10"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="1.7"/><path d="M8.3 8.2c.3 3 2 5 5.2 6.3l1.5-1.4 2 .9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>Join on WhatsApp</a> : <button type="button" onClick={()=>setError("The ARANCH PASS WhatsApp number has not been configured in this preview yet.")} className="clip-corner-sm flex w-full items-center justify-center gap-2 border border-ivory/25 px-6 py-3.5 text-[12px] font-bold text-ivory uppercase hover:bg-ivory/10"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" stroke="currentColor" strokeWidth="1.7"/><path d="M8.3 8.2c.3 3 2 5 5.2 6.3l1.5-1.4 2 .9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>Join on WhatsApp</button>}
                <p id={`${uid}-consent`} className="mono mt-5 text-[10px] leading-relaxed text-ivory/45">Launch and pilot news only. By joining, you agree to receive ARANCH PASS product updates. Unsubscribe anytime.</p>
              </form>
            )}

            {stage === "two" && (
              <form onSubmit={submitStageTwo}>
                <p className="label text-saffron">Step 2 of 2 · optional</p><h3 className="font-display mt-3 text-[1.6rem] font-bold">Tell us about the business</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-2"><div><label htmlFor={`${uid}-name`} className={labelCls}>Your name</label><input id={`${uid}-name`} name="name" className={inputCls} autoComplete="name"/></div><div><label htmlFor={`${uid}-biz`} className={labelCls}>Business name</label><input id={`${uid}-biz`} name="business" className={inputCls} autoComplete="organization"/></div><div><label htmlFor={`${uid}-cat`} className={labelCls}>Service category</label><select id={`${uid}-cat`} name="category" className={inputCls} defaultValue=""><option value="" disabled>Select</option><option>RO / water purifier</option><option>AC servicing</option><option>Two-wheeler</option><option>Other maintained asset</option></select></div></div>
                <div className="mt-4 bg-paper p-4 text-ink"><LocationFields value={location} onChange={setLocation}/></div>
                {error&&<p role="alert" className="mt-4 text-[13px] text-saffron">{error}</p>}
                <button type="submit" disabled={submitting} className="clip-corner-sm mt-6 w-full bg-saffron px-6 py-4 text-[12px] font-bold tracking-[.08em] text-plum uppercase disabled:cursor-wait disabled:opacity-60">{submitting?"Submitting…":"Finish"}</button>
                <button type="button" disabled={submitting} onClick={()=>void sendLead()} className="mono mt-3 w-full py-2 text-[10px] tracking-[.12em] text-ivory/55 uppercase underline underline-offset-4">Skip optional details</button>
              </form>
            )}

            {stage === "done" && <div role="status" aria-live="polite"><span className="mono bg-saffron px-2 py-1 text-[9px] text-plum uppercase">Prototype</span><h3 className="font-display mt-5 text-[1.7rem] font-bold">{stored?"Your pilot interest was submitted.":"The form is not connected yet."}</h3><p className="mt-4 text-[14px] leading-relaxed text-ivory/70">{stored?"Thank you. We will use these details only for ARANCH PASS product and pilot updates.":<>No server endpoint is configured in this build, so nothing was transmitted or stored. Contact <span className="mono text-saffron">{site.contactEmail}</span> once a real inbox is published.</>}</p><button type="button" onClick={()=>{setStage("one");setContact("")}} className="mono mt-6 text-[10px] text-ivory/60 uppercase underline">Start again</button></div>}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Footer ------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="bg-plum pt-16 pb-10 text-ivory">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Wordmark className="text-[22px]" />
            <p className="font-display mt-5 max-w-[18ch] text-[1.5rem] text-ivory/90">
              {site.positioning}
            </p>
            <p className="mono mt-5 text-[11px] leading-relaxed tracking-[0.1em] text-ivory/45 uppercase">
              {site.stage}
            </p>
            <p className="mono mt-4 text-[12px] text-ivory/55">{site.contactEmail}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="mono text-[10px] tracking-[0.2em] text-saffron uppercase">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-[14px] text-ivory/65 transition-colors hover:text-ivory"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mono mt-14 max-w-[80ch] border-t border-ivory/15 pt-6 text-[11px] leading-relaxed text-ivory/50">
          ARANCH PASS is in pre-launch development. Product visuals may show design concepts; final
          materials and features may change after field testing. Refund, cancellation and shipping
          policies will be published if and when payments or physical orders are enabled.
        </p>
        <p className="mono mt-4 text-[11px] tracking-[0.12em] text-ivory/40 uppercase">
          © {new Date().getFullYear()} ARANCH PASS
        </p>
      </Container>
    </footer>
  );
}
