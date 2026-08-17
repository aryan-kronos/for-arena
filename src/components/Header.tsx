import { useEffect, useRef, useState } from "react";
import { nav } from "@/data";
import { InstallAppButton } from "@/components/InstallAppButton";
import { cn } from "@/utils/cn";

export function Wordmark({ className, tone = "ivory" }: { className?: string; tone?: "ivory" | "violet" }) {
  return (
    <span
      className={cn(
        "font-body text-[15px] font-extrabold tracking-[-0.02em] whitespace-nowrap sm:text-[17px]",
        tone === "ivory" ? "text-ivory" : "text-deepviolet",
        className,
      )}
    >
      ARANCH <span className="text-saffron">PASS</span>
    </span>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return () => { document.body.style.overflow = ""; };

    const menu = menuRef.current;
    const focusable = () =>
      Array.from(
        menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
      );
    window.requestAnimationFrame(() => focusable()[0]?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "bg-plum/95 border-b border-ivory/12 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)]",
        )}
      >
        <div className="mx-auto flex h-[62px] w-full max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <a href="#top" className="flex items-center gap-2.5" aria-label="ARANCH PASS — home">
            <img src="/favicon.svg" alt="" aria-hidden="true" className="h-8 w-8" />
            <Wordmark />
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="mono text-[11px] tracking-[0.16em] text-ivory/70 uppercase transition-colors hover:text-saffron"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="/customer" className="mono hidden text-[10px] tracking-[0.12em] text-ivory/65 uppercase hover:text-saffron xl:block">Customer</a>
            <a href="/login" className="mono hidden border border-ivory/20 px-3 py-2 text-[10px] tracking-[0.12em] text-ivory uppercase hover:border-saffron md:block">Login</a>
            <div className="hidden xl:block"><InstallAppButton /></div>
            <a
              href="#pilot"
              className="clip-corner-sm bg-saffron px-4 py-2.5 text-[11px] font-semibold tracking-[0.1em] text-plum uppercase transition-colors hover:bg-[#ffbe22] sm:px-5"
            >
              Join the pilot
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-10 w-10 place-items-center border border-ivory/25 text-ivory lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
                {open ? (
                  <g stroke="currentColor" strokeWidth="1.8">
                    <line x1="2" y1="2" x2="16" y2="12" />
                    <line x1="16" y1="2" x2="2" y2="12" />
                  </g>
                ) : (
                  <g stroke="currentColor" strokeWidth="1.8">
                    <line x1="1" y1="2" x2="17" y2="2" />
                    <line x1="1" y1="7" x2="17" y2="7" />
                    <line x1="1" y1="12" x2="17" y2="12" />
                  </g>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 top-[62px] bottom-0 z-40 transition-[visibility] duration-500 lg:hidden",
          open ? "visible" : "invisible",
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-plum/35 backdrop-blur-[2px] transition-opacity duration-500",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
        <aside
          ref={menuRef}
          id="mobile-menu"
          className={cn(
            "absolute top-0 right-0 h-full w-[min(88vw,390px)] overflow-y-auto border-l border-ivory/15 bg-plum text-ivory shadow-[-28px_0_80px_-45px_rgba(0,0,0,.75)] transition-transform duration-500 ease-[cubic-bezier(.22,.68,.24,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <nav aria-label="Mobile" className="flex flex-col px-6 py-5">
            <p className="label mb-2 text-saffron">Navigation</p>
            <a href="/customer" onClick={()=>setOpen(false)} className="flex items-baseline gap-4 border-b border-ivory/10 py-5"><span className="mono text-[10px] text-saffron">P1</span><span className="font-display text-2xl">Customer portal</span></a>
            <a href="/login" onClick={()=>setOpen(false)} className="flex items-baseline gap-4 border-b border-ivory/10 py-5"><span className="mono text-[10px] text-saffron">P2</span><span className="font-display text-2xl">Provider / CEO login</span></a>
            {nav.map((n, i) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-ivory/10 py-5">
                <span className="mono text-[10px] text-saffron">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-2xl">{n.label}</span>
              </a>
            ))}
            <div className="mt-5"><InstallAppButton /></div>
            <p className="mono mt-6 text-[11px] leading-relaxed tracking-[0.08em] text-ivory/50 uppercase">Pre-launch · concept and prototype stage</p>
          </nav>
        </aside>
      </div>
    </header>
  );
}
