import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wordmark } from "@/components/Header";
import { logoutPortal } from "@/lib/auth";
import { cn } from "@/utils/cn";

function DemoShell({
  role,
  tone,
  children,
}: {
  role: string;
  tone: "customer" | "provider" | "admin";
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${role} demo — ARANCH PASS`;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const previousContent = robots.content;
    robots.content = "noindex,nofollow";
    return () => {
      document.title = previousTitle;
      if (created) robots?.remove();
      else if (robots) robots.content = previousContent;
    };
  }, [role]);

  return (
    <div className={cn("min-h-screen", tone === "admin" ? "bg-[#0c0712] text-ivory" : "bg-paper text-ink")}>
      <header className={cn("border-b px-5 py-4 sm:px-8", tone === "admin" ? "border-ivory/15 bg-plum" : "border-line bg-paper")}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          <Wordmark tone={tone === "admin" ? "ivory" : "violet"} />
          <div className="flex items-center gap-3">
            <span className={cn("mono text-[10px] tracking-[0.16em] uppercase", tone === "admin" ? "text-saffron" : "text-violet")}>{role} · demo</span>
            <Link to="/" className={cn("mono border px-3 py-2 text-[10px] uppercase", tone === "admin" ? "border-ivory/20" : "border-line")}>Website</Link>
            {tone !== "customer" && <button onClick={()=>void logoutPortal().then(()=>navigate("/login",{replace:true}))} className={cn("mono border px-3 py-2 text-[10px] uppercase", tone === "admin" ? "border-ivory/20" : "border-line")}>Log out</button>}
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

type CustomerService = { date: string; type: string; summary: string; provider: string; nextDate?: string };
const customerServices: CustomerService[] = [
  { date: "2026-08-10", type: "Routine service", summary: "System inspected and sanitised. Flow and pressure checked.", provider: "Sample Aqua Services", nextDate: "2027-02-10" },
  { date: "2026-02-12", type: "Filter replacement", summary: "Sediment and carbon filters replaced.", provider: "Sample Aqua Services", nextDate: "2026-08-12" },
  { date: "2025-08-15", type: "Sanitisation", summary: "Storage tank and water path sanitised.", provider: "Sample Aqua Services", nextDate: "2026-02-15" },
  { date: "2025-02-18", type: "Installation", summary: "Purifier installed and initial water-quality checks recorded.", provider: "Sample Aqua Services", nextDate: "2025-08-18" },
];

export function CustomerDemo() {
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("all");
  const [exporting, setExporting] = useState(false);
  const filtered = customerServices.filter((service) => (!from || service.date >= from) && (!to || service.date <= to) && (type === "all" || service.type === type));

  const exportPdf = async (records: CustomerService[], scope: "filtered" | "all") => {
    if (from && to && from > to) { setAction("The From date must be earlier than the To date."); return; }
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const generated = new Date();
      const filterText = scope === "all" ? "All available service records" : `${type === "all" ? "All service types" : type} · ${from || "Beginning"} to ${to || "Latest"}`;

      const header = (continuation = false) => {
        pdf.setFillColor(46, 7, 89);pdf.rect(0, 0, pageWidth, 34, "F");
        pdf.setTextColor(247, 240, 216);pdf.setFont("helvetica", "bold");pdf.setFontSize(20);pdf.text("ARANCH PASS", 16, 15);
        pdf.setFont("helvetica", "normal");pdf.setFontSize(9);pdf.text(continuation ? "Service history · continued" : "Customer-safe service history", 16, 24);
        pdf.setFillColor(244, 173, 8);pdf.rect(pageWidth - 41, 0, 41, 34, "F");pdf.setTextColor(46, 7, 89);pdf.setFont("helvetica", "bold");pdf.setFontSize(10);pdf.text("AP-7K3M9", pageWidth - 20.5, 18, { align: "center" });
      };
      header();
      pdf.setTextColor(46, 7, 89);pdf.setFont("helvetica", "bold");pdf.setFontSize(15);pdf.text("Kitchen RO purifier", 16, 48);
      pdf.setFont("helvetica", "normal");pdf.setFontSize(9);pdf.setTextColor(85, 72, 90);pdf.text("Provider: Sample Aqua Services", 16, 56);pdf.text(`Export scope: ${filterText}`, 16, 62);pdf.text(`Generated: ${generated.toLocaleString("en-IN")}`, 16, 68);
      pdf.setFillColor(247, 240, 216);pdf.roundedRect(16, 75, 178, 16, 2, 2, "F");pdf.setTextColor(46, 7, 89);pdf.setFont("helvetica", "bold");pdf.text(`${records.length} record${records.length === 1 ? "" : "s"}`, 22, 85);pdf.setFont("helvetica", "normal");pdf.text("Private identity, payment and technician notes excluded", 55, 85);

      let y = 101;
      records.forEach((service, index) => {
        const summaryLines = pdf.splitTextToSize(service.summary, 160);
        const blockHeight = 31 + summaryLines.length * 4.5;
        if (y + blockHeight > pageHeight - 22) { pdf.addPage();header(true);y = 45; }
        pdf.setDrawColor(218, 207, 222);pdf.setLineWidth(.35);pdf.roundedRect(16, y, 178, blockHeight, 2, 2, "S");
        pdf.setFillColor(247, 240, 216);pdf.roundedRect(16, y, 178, 11, 2, 2, "F");
        pdf.setTextColor(46, 7, 89);pdf.setFont("helvetica", "bold");pdf.setFontSize(10);pdf.text(`${String(index + 1).padStart(2, "0")}  ${service.type}`, 21, y + 7);
        pdf.setFont("helvetica", "normal");pdf.setFontSize(8.5);pdf.setTextColor(88, 76, 92);pdf.text(service.date, 188, y + 7, { align: "right" });
        pdf.text(`Provider: ${service.provider}`, 21, y + 18);if (service.nextDate) pdf.text(`Next recommended: ${service.nextDate}`, 188, y + 18, { align: "right" });
        pdf.setFontSize(9);pdf.setTextColor(55, 48, 60);pdf.text(summaryLines, 21, y + 27);y += blockHeight + 5;
      });
      if (!records.length) { pdf.setTextColor(85, 72, 90);pdf.text("No service records match the selected filters.", 16, 110); }

      const pages = pdf.getNumberOfPages();
      for (let page = 1; page <= pages; page++) { pdf.setPage(page);pdf.setDrawColor(225, 218, 228);pdf.line(16, pageHeight - 15, 194, pageHeight - 15);pdf.setFontSize(7.5);pdf.setTextColor(120, 110, 120);pdf.text("ARANCH PASS · customer-safe export · verify records with the provider", 16, pageHeight - 9);pdf.text(`Page ${page} of ${pages}`, 194, pageHeight - 9, { align: "right" }); }
      pdf.setProperties({ title: "ARANCH PASS service history — AP-7K3M9", subject: filterText, author: "ARANCH PASS", creator: "ARANCH PASS customer portal" });
      pdf.save(`ARANCH-PASS-AP-7K3M9-${scope}-${generated.toISOString().slice(0,10)}.pdf`);
      setAction(`Exported ${records.length} customer-safe service record${records.length === 1 ? "" : "s"} as a structured PDF.`);
    } catch { setAction("The PDF could not be generated. Please try again."); }
    finally { setExporting(false); }
  };

  const exportCsv = () => {
    const escape = (value: string) => `"${value.split('"').join('""')}"`;
    const rows = [["Date","Service type","Provider","Public summary","Next recommended"], ...filtered.map(s=>[s.date,s.type,s.provider,s.summary,s.nextDate || ""])];
    const blob = new Blob([rows.map(row=>row.map(escape).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);const link=document.createElement("a");link.href=url;link.download=`ARANCH-PASS-AP-7K3M9-filtered-${new Date().toISOString().slice(0,10)}.csv`;link.click();URL.revokeObjectURL(url);setAction(`Exported ${filtered.length} record${filtered.length===1?"":"s"} as CSV.`);
  };

  return (
    <DemoShell role="Customer view" tone="customer">
      <main className="mx-auto max-w-[1080px] px-5 py-10 sm:px-8 sm:py-16">
        <div className="grid gap-5 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <div className="clip-corner overflow-hidden bg-deepviolet p-6 text-ivory">
              <p className="label text-saffron">Public service pass</p><h1 className="font-display mt-3 text-3xl font-bold">Kitchen RO purifier</h1><p className="mono mt-2 text-[12px] text-ivory/60">AP-7K3M9</p>
            </div>
            <section aria-labelledby="customer-service-summary" className="hairline mt-4 bg-white">
              <h2 id="customer-service-summary" className="sr-only">Service summary</h2>
              {[["Serviced by","Sample Aqua Services"],["Last service",customerServices[0].date],["Next recommended",customerServices[0].nextDate || "—"],["Available records",String(customerServices.length)]].map(([label,value])=><div key={label} className="flex flex-col gap-1 border-b border-line px-5 py-4 last:border-0 sm:flex-row sm:justify-between"><span className="mono text-[10px] tracking-[0.12em] text-muted uppercase">{label}</span><span className="text-[14px] font-semibold text-deepviolet sm:text-right">{value}</span></div>)}
            </section>
            <div className="mt-4 grid grid-cols-2 gap-3"><button onClick={()=>setAction("Demo only: a configured provider WhatsApp chat would open here.")} className="clip-corner-sm bg-saffron px-4 py-4 text-[12px] font-bold text-plum uppercase">WhatsApp</button><button onClick={()=>setAction("Demo only: the provider's verified public number would be called here.")} className="clip-corner-sm bg-deepviolet px-4 py-4 text-[12px] font-bold text-ivory uppercase">Call provider</button></div>
          </div>

          <section className="clip-corner hairline bg-white p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="label text-violet">Customer-safe history</p><h2 className="font-display mt-2 text-2xl font-bold text-deepviolet">Filter and export records</h2><p className="mt-2 text-[12px] text-muted">Showing {filtered.length} of {customerServices.length} records</p></div><div className="grid grid-cols-2 gap-2"><button type="button" onClick={()=>void exportPdf(filtered,"filtered")} disabled={exporting||!filtered.length} className="clip-corner-sm bg-deepviolet px-4 py-3 text-[10px] font-bold tracking-[.06em] text-ivory uppercase disabled:opacity-45">{exporting?"Preparing…":"Filtered PDF"}</button><button type="button" onClick={()=>void exportPdf(customerServices,"all")} disabled={exporting} className="clip-corner-sm bg-saffron px-4 py-3 text-[10px] font-bold tracking-[.06em] text-plum uppercase disabled:opacity-45">All PDF</button></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3"><label className="text-[11px] font-bold text-deepviolet">From date<input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="hairline mt-2 w-full px-3 py-3 text-[13px]"/></label><label className="text-[11px] font-bold text-deepviolet">To date<input type="date" value={to} onChange={e=>setTo(e.target.value)} className="hairline mt-2 w-full px-3 py-3 text-[13px]"/></label><label className="text-[11px] font-bold text-deepviolet">Service type<select value={type} onChange={e=>setType(e.target.value)} className="hairline mt-2 w-full px-3 py-3 text-[13px]"><option value="all">All services</option>{Array.from(new Set(customerServices.map(x=>x.type))).map(x=><option key={x}>{x}</option>)}</select></label></div><div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={()=>{setFrom("");setTo("");setType("all");setAction("Filters reset.")}} className="mono text-[10px] text-violet underline underline-offset-4">Reset filters</button><button type="button" onClick={exportCsv} disabled={!filtered.length} className="mono text-[10px] text-violet underline underline-offset-4 disabled:opacity-40">Export filtered CSV</button></div>
            <div className="mt-6 space-y-3">{filtered.map(service=><article key={`${service.date}-${service.type}`} className="clip-corner bg-ivory p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-display text-lg font-bold text-deepviolet">{service.type}</h3><time className="mono text-[10px] text-violet">{service.date}</time></div><p className="mt-2 text-[13px] leading-relaxed text-ink/70">{service.summary}</p><p className="mono mt-3 text-[9px] text-muted uppercase">Provider · {service.provider}</p></article>)}{!filtered.length&&<p className="border border-dashed border-line p-6 text-center text-[13px] text-muted">No records match this date range and service type.</p>}</div>
          </section>
        </div>
        {action&&<p role="status" className="hairline mt-4 bg-ivory px-4 py-3 text-[12px] text-violet">{action}</p>}
        <p className="mono mt-5 text-[10px] leading-relaxed text-muted">PUBLIC DEMO ONLY · EXPORTED PDF EXCLUDES CUSTOMER NAME, PHONE, ADDRESS, PAYMENT AND PRIVATE NOTES.</p>
      </main>
    </DemoShell>
  );
}

const providerStats = [["Active passes", "128"], ["Due in 30 days", "18"], ["Technicians", "7"], ["Pass stock", "42"]];

export function ProviderDemo() {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  return (
    <DemoShell role="Provider view" tone="provider">
      <main className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="label text-violet">Sample Aqua Services · demo tenant</p><h1 className="font-display mt-2 text-4xl font-bold text-deepviolet">Service operations</h1></div>
          <button onClick={()=>setShowServiceForm(v=>!v)} aria-expanded={showServiceForm} className="clip-corner-sm bg-saffron px-5 py-3 text-[12px] font-bold text-plum uppercase">{showServiceForm?"Close service form":"Scan / add service"}</button>
        </div>
        {showServiceForm&&<form onSubmit={e=>{e.preventDefault();setShowServiceForm(false);setSelectedCode("NEW-DEMO")}} className="clip-corner hairline mt-6 grid gap-3 bg-white p-5 sm:grid-cols-2"><label className="text-[12px] font-bold text-deepviolet">Asset code<input required defaultValue="AP-" className="hairline mt-2 w-full px-3 py-3 font-mono"/></label><label className="text-[12px] font-bold text-deepviolet">Service type<select className="hairline mt-2 w-full px-3 py-3"><option>Routine service</option><option>Filter replacement</option><option>Installation</option></select></label><label className="text-[12px] font-bold text-deepviolet sm:col-span-2">Public summary<textarea required className="hairline mt-2 min-h-24 w-full px-3 py-3"/></label><button className="clip-corner-sm bg-deepviolet px-4 py-3 text-[12px] font-bold text-ivory uppercase sm:col-span-2">Save demo service</button></form>}
        {selectedCode==="NEW-DEMO"&&<p role="status" className="hairline mt-4 bg-ivory px-4 py-3 text-[12px] text-violet">Demo service validated locally. No database record was created.</p>}
        <section aria-label="Provider statistics" className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {providerStats.map(([label, value]) => <div key={label} className="clip-corner hairline bg-ivory p-5"><div className="font-display text-4xl font-bold text-deepviolet">{value}</div><div className="mono mt-2 text-[10px] text-muted uppercase">{label}</div></div>)}
        </section>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <section className="clip-corner hairline bg-white"><div className="border-b border-line px-5 py-4"><h2 className="font-display text-xl font-bold text-deepviolet">Services due</h2></div>{["AP-7K3M9","AP-2R8QD","AP-9V4XL","AP-5B1TC"].map((code,i)=><div key={code} className="grid grid-cols-[1fr_auto] gap-4 border-b border-line px-5 py-4 last:border-0 sm:grid-cols-[.7fr_1fr_auto]"><span className="mono text-[12px] text-violet">{code}</span><span className="hidden text-[14px] sm:block">{i%2 ? "Filter replacement" : "Routine service"}</span><button onClick={()=>setSelectedCode(code)} className="mono text-[10px] text-deepviolet underline">Open</button></div>)}</section>
          <aside className="clip-corner bg-deepviolet p-6 text-ivory"><p className="label text-saffron">Technician activity</p><div className="mt-5 space-y-4">{["Aman · 12 records","Ravi · 9 records","Technician C · 6 records"].map(x=><div key={x} className="border-b border-ivory/15 pb-3 text-[14px]">{x}</div>)}</div></aside>
        </div>
        {selectedCode&&selectedCode!=="NEW-DEMO"&&<section className="clip-corner hairline mt-5 bg-ivory p-5"><div className="flex items-center justify-between"><div><p className="label text-violet">Selected asset</p><h2 className="font-display mt-2 text-2xl font-bold text-deepviolet">{selectedCode}</h2></div><button onClick={()=>setSelectedCode(null)} className="mono text-[10px] text-violet underline">Close</button></div><p className="mt-4 text-[14px] text-ink/70">Demo service history, customer-safe summary and next recommended date would load here from the tenant-protected API.</p></section>}
        <p className="mono mt-6 text-[10px] text-muted">DEMO DATA · NOT CONNECTED TO A LIVE PROVIDER TENANT</p>
      </main>
    </DemoShell>
  );
}

export function AdminDemo() {
  const [activePanel, setActivePanel] = useState("Overview");
  return (
    <DemoShell role="Platform / CEO view" tone="admin">
      <main className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-[.26fr_.74fr]">
          <aside className="clip-corner border border-ivory/15 bg-plum/60 p-5">
            <p className="label text-saffron">Platform administration</p>
            <nav className="mt-6 space-y-1">{["Overview","Pilot leads","Businesses","Pass inventory","Orders","Incidents","Audit log"].map(x=><button onClick={()=>setActivePanel(x)} key={x} className={cn("block w-full px-3 py-3 text-left text-[13px]",activePanel===x?"bg-saffron text-plum":"text-ivory/65 hover:bg-ivory/5")}>{x}</button>)}</nav>
          </aside>
          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="label text-saffron">Founder operations · restricted demo</p><h1 className="font-display mt-2 text-4xl font-bold">{activePanel}</h1></div><span className="mono text-[10px] text-ivory/45">NO PRODUCTION DATA</span></div>
            {activePanel!=="Overview"&&<p role="status" className="mt-5 border border-saffron/30 bg-saffron/10 px-4 py-3 text-[13px] text-ivory/75">{activePanel} selected. Production data and actions will be loaded only after authenticated admin APIs and audit logging are connected.</p>}
            <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">{[["Pilot leads","—"],["Active businesses","—"],["Issued passes","—"],["Open incidents","—"]].map(([a,b])=><div key={a} className="clip-corner border border-ivory/15 bg-ivory/5 p-5"><div className="font-display text-4xl font-bold text-saffron">{b}</div><div className="mono mt-2 text-[10px] text-ivory/55 uppercase">{a}</div></div>)}</section>
            <div className="mt-5 grid gap-5 xl:grid-cols-2"><section className="clip-corner border border-ivory/15 p-5"><h2 className="font-display text-xl font-bold">System health</h2><div className="mt-5 space-y-3">{["Auth and tenant isolation","Public scan API","Lead capture","Backups and restore","Audit-event pipeline"].map(x=><div key={x} className="flex items-center justify-between border-b border-ivory/10 pb-3 text-[13px]"><span>{x}</span><span className="mono text-[10px] text-saffron">NOT CONNECTED</span></div>)}</div></section><section className="clip-corner border border-ivory/15 p-5"><h2 className="font-display text-xl font-bold">Governance queue</h2><ul className="mt-5 space-y-3 text-[13px] text-ivory/70"><li>Review provider verification policy</li><li>Approve public data projection</li><li>Test pass replacement workflow</li><li>Publish privacy and retention policy</li></ul></section></div>
          </div>
        </div>
      </main>
    </DemoShell>
  );
}
