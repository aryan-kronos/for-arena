import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Eyebrow, Note } from "@/components/ui";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";

const tabs = [
  { id: "tech", label: "Technician view" },
  { id: "scan", label: "Public scan page" },
  { id: "dash", label: "Provider dashboard" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function DemoChrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="clip-corner hairline overflow-hidden bg-paper">
      <div className="flex items-center justify-between border-b border-line bg-ivory px-4 py-2.5">
        <span className="mono text-[10px] tracking-[0.16em] text-violet uppercase">{title}</span>
        <span className="mono clip-corner-sm bg-saffron px-2 py-1 text-[9px] tracking-[0.16em] text-plum uppercase">
          Demo · mock data
        </span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  privateField,
  wide,
}: {
  label: string;
  value: string;
  privateField?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <div className="mono flex items-center gap-2 text-[9px] tracking-[0.16em] text-muted uppercase">
        {label}
        {privateField && (
          <span className="clip-corner-sm bg-deepviolet px-1.5 py-0.5 text-[8px] text-ivory">
            private
          </span>
        )}
      </div>
      <div className="hairline mt-1.5 bg-white px-3 py-2.5 text-[14px] text-ink/85">{value}</div>
    </div>
  );
}

function TechnicianView() {
  const [more, setMore] = useState(false);
  const [saved, setSaved] = useState("");
  return (
    <DemoChrome title="Record a service · AP-7K3M9">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Customer" value="Search or create — R. K. (saved)" />
        <Field label="Asset category" value="RO / water purifier" />
        <Field label="Service type" value="Filter replacement + sanitisation" />
        <Field label="Service date" value="Today" />
        <Field label="Amount paid" value="₹ ——" privateField />
        <Field label="Next recommended service" value="+ 6 months" />
        <Field label="Work summary (public)" value="Sediment and carbon filters replaced." wide />
        <Field label="Technician" value="Filled automatically from login" wide />
      </div>
      <button
        type="button"
        onClick={() => setMore((v) => !v)}
        aria-expanded={more}
        className="mono hairline mt-4 flex w-full items-center justify-between px-3 py-2.5 text-[11px] tracking-[0.14em] text-violet uppercase"
      >
        Add more details
        <span aria-hidden="true">{more ? "−" : "+"}</span>
      </button>
      {more && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Private notes" value="Pressure low at inlet — monitor." privateField />
          <Field label="Parts used" value="SED-10, CTO-10" />
          <Field label="Warranty reference" value="—" />
          <Field label="Attachment" value="Invoice image" privateField />
        </div>
      )}
      <div className="mono mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={()=>setSaved("Demo service validated. Nothing was stored.")} className="clip-corner-sm bg-saffron px-4 py-2.5 text-[11px] tracking-[0.12em] text-plum uppercase">
          Save service
        </button>
        <button type="button" onClick={()=>setSaved("Demo pass activation validated. No pass or database record was changed.")} className="clip-corner-sm hairline px-4 py-2.5 text-[11px] tracking-[0.12em] text-violet uppercase">
          Save & attach pass
        </button>
      </div>
      {saved&&<p role="status" className="mt-3 text-[12px] text-violet">{saved}</p>}
    </DemoChrome>
  );
}

function ScanView() {
  const [action, setAction] = useState("");
  return (
    <DemoChrome title="Public scan · what anyone sees">
      <div className="mx-auto max-w-[400px]">
        <div className="clip-corner bg-deepviolet p-5 text-ivory">
          <p className="mono text-[9px] tracking-[0.2em] text-saffron uppercase">Serviced by</p>
          <p className="font-display mt-1.5 text-[1.5rem]">Sample Aqua Services</p>
          <p className="mono mt-1 text-[11px] text-ivory/60">Provider · public contact shown</p>
        </div>
        <dl className="mt-3 grid gap-px bg-line">
          {[
            ["Asset", "RO purifier · kitchen unit"],
            ["Asset code", "AP-7K3M9"],
            ["Last service", "Recorded by provider"],
            ["Next recommended", "Set at last service"],
            ["Work summary", "Sediment and carbon filters replaced."],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-wrap justify-between gap-2 bg-paper px-3 py-3">
              <dt className="mono text-[10px] tracking-[0.14em] text-muted uppercase">{k}</dt>
              <dd className="text-right text-[14px] text-ink/85">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={()=>setAction("Demo only: verified provider WhatsApp would open here.")} className="mono clip-corner-sm bg-saffron px-3 py-3 text-center text-[11px] tracking-[0.1em] text-plum uppercase">
            WhatsApp
          </button>
          <button type="button" onClick={()=>setAction("Demo only: verified provider phone number would be called here.")} className="mono clip-corner-sm bg-deepviolet px-3 py-3 text-center text-[11px] tracking-[0.1em] text-ivory uppercase">
            Call provider
          </button>
        </div>
        {action&&<p role="status" className="hairline mt-3 px-3 py-2.5 text-[11px] text-violet">{action}</p>}
        <p className="mono hairline mt-3 px-3 py-2.5 text-[10px] leading-relaxed tracking-[0.06em] text-muted">
          Full history? Verify as the customer (planned: OTP). No customer name, phone, address or
          amount is shown on a public scan.
        </p>
      </div>
    </DemoChrome>
  );
}

function DashboardView() {
  const stats = [
    ["Active passes", "—"],
    ["Services due", "—"],
    ["Technicians", "—"],
    ["Passes in stock", "—"],
  ];
  const events = [
    ["AP-7K3M9", "Filter replacement", "Technician A"],
    ["AP-2R8QD", "Installation", "Technician B"],
    ["AP-9V4XL", "Sanitisation", "Technician A"],
  ];
  return (
    <DemoChrome title="Provider dashboard">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map(([k, v]) => (
          <div key={k} className="hairline clip-corner-sm bg-ivory px-3 py-4">
            <div className="font-display text-[1.7rem] text-deepviolet">{v}</div>
            <div className="mono mt-1 text-[9px] tracking-[0.14em] text-muted uppercase">{k}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="hairline clip-corner-sm">
          <div className="mono border-b border-line px-3 py-2 text-[9px] tracking-[0.16em] text-violet uppercase">
            Recent service events
          </div>
          <ul>
            {events.map(([code, type, who]) => (
              <li
                key={code}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-3 last:border-b-0"
              >
                <span className="mono text-[11px] text-violet">{code}</span>
                <span className="text-[13px] text-ink/80">{type}</span>
                <span className="mono text-[10px] text-muted uppercase">{who}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hairline clip-corner-sm">
          <div className="mono border-b border-line px-3 py-2 text-[9px] tracking-[0.16em] text-violet uppercase">
            Rebooking requests
          </div>
          <ul className="p-3">
            {["Scan → WhatsApp", "Scan → call back", "Scan → due reminder"].map((r) => (
              <li key={r} className="mono flex items-center gap-2 py-2 text-[12px] text-ink/70">
                <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-saffron" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DemoChrome>
  );
}

export function SystemViews() {
  const ref = useReveal<HTMLElement>();
  const [tab, setTab] = useState<TabId>("tech");
  const uid = useId();

  return (
    <section id="system" ref={ref} className="bg-ivory py-20 sm:py-28">
      <Container>
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-[18ch]">
            <Eyebrow>Chapter 07 · The software</Eyebrow>
            <h2 className="font-display t-4 mt-5 text-deepviolet">
              One physical pass.
              <br />
              <span className="accent text-violet">Three simple views.</span>
            </h2>
          </div>
          <Note className="lg:text-right">
            Coded front-end prototypes with mock data. Nothing is saved and no live records exist.
          </Note>
        </div>

        <div className="reveal mt-10">
          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            <Link to="/customer-demo" className="clip-corner-sm hairline px-4 py-3 text-center text-[11px] font-bold tracking-[0.1em] text-violet uppercase hover:bg-paper">Open customer demo</Link>
            <Link to="/provider-demo" className="clip-corner-sm hairline px-4 py-3 text-center text-[11px] font-bold tracking-[0.1em] text-violet uppercase hover:bg-paper">Open provider demo</Link>
            <Link to="/admin-demo" className="clip-corner-sm bg-deepviolet px-4 py-3 text-center text-[11px] font-bold tracking-[0.1em] text-ivory uppercase hover:bg-violet">Open platform / CEO demo</Link>
          </div>
          <div role="tablist" aria-label="Software views" className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                id={`${uid}-${t.id}-tab`}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                aria-controls={`${uid}-${t.id}-panel`}
                onClick={() => setTab(t.id)}
                className={cn(
                  "mono clip-corner-sm px-4 py-3 text-[11px] tracking-[0.12em] uppercase transition-colors",
                  tab === t.id
                    ? "bg-deepviolet text-ivory"
                    : "hairline bg-transparent text-violet hover:bg-violet/8",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tabs.map((t) => (
              <div
                key={t.id}
                role="tabpanel"
                id={`${uid}-${t.id}-panel`}
                aria-labelledby={`${uid}-${t.id}-tab`}
                hidden={tab !== t.id}
              >
                {t.id === "tech" && <TechnicianView />}
                {t.id === "scan" && <ScanView />}
                {t.id === "dash" && <DashboardView />}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
