import { useId, type ReactNode } from "react";
import { cn } from "@/utils/cn";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "label flex items-center gap-3",
        tone === "light" ? "text-violet/85" : "text-saffron",
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block h-[7px] w-[7px] shrink-0 rotate-45 bg-saffron" />
      {children}
    </p>
  );
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "dark" | "outlineLight";
  className?: string;
  type?: "button" | "submit";
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: BtnProps) {
  const base =
    "clip-corner-sm inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[13px] font-semibold tracking-[0.06em] uppercase transition-[transform,background-color,color] duration-200 active:translate-y-[1px]";
  const styles = {
    primary: "bg-saffron text-plum hover:bg-[#ffbe22]",
    dark: "bg-deepviolet text-ivory hover:bg-violet",
    ghost: "hairline bg-transparent text-violet hover:bg-violet/6",
    outlineLight: "hairline-dark bg-transparent text-ivory hover:bg-ivory/10",
  }[variant];
  const cls = cn(base, styles, className);
  if (href)
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function SectionLabel({
  index,
  title,
  tone = "light",
}: {
  index: string;
  title: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "mono flex items-center gap-3 border-t pt-3 text-[10px] tracking-[0.22em] uppercase",
        tone === "light" ? "border-line text-muted" : "border-ivory/20 text-ivory/55",
      )}
    >
      <span className={tone === "light" ? "text-violet" : "text-saffron"}>{index}</span>
      <span>{title}</span>
    </div>
  );
}

/** Circular passport-seal ring device. Decorative. */
export function SealRing({
  className,
  text = "ARANCH PASS · SERVICE IDENTITY · ",
  tone = "violet",
  spin = true,
}: {
  className?: string;
  text?: string;
  tone?: "violet" | "ivory" | "saffron";
  spin?: boolean;
}) {
  const color =
    tone === "violet" ? "#4D1688" : tone === "ivory" ? "rgba(247,240,216,0.85)" : "#F4AD08";
  // useId guarantees the <textPath> reference is unique per instance.
  const id = `seal${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" fill="none" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="100" cy="100" r="60" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="0.1 7"
        opacity="0.5"
      />
      <g className={spin ? "seal-spin" : undefined}>
        <text fill={color} fontSize="12" letterSpacing="3.2" style={{ fontFamily: "var(--font-mono)" }}>
          <textPath href={`#${id}`}>{text.repeat(3)}</textPath>
        </text>
      </g>
    </svg>
  );
}

/** Trace line: service event → asset → provider */
export function TraceLine({ className, tone = "violet" }: { className?: string; tone?: "violet" | "ivory" }) {
  const c = tone === "violet" ? "#4D1688" : "rgba(247,240,216,0.7)";
  return (
    <svg viewBox="0 0 600 40" className={className} aria-hidden="true" focusable="false">
      <line x1="8" y1="20" x2="592" y2="20" stroke={c} strokeWidth="1" opacity="0.35" />
      <line x1="8" y1="20" x2="592" y2="20" stroke="#F4AD08" strokeWidth="2" className="trace-dash" />
      {[8, 300, 592].map((x) => (
        <g key={x}>
          <circle cx={x} cy="20" r="7" fill="none" stroke={c} strokeWidth="1.5" />
          <circle cx={x} cy="20" r="2.5" fill="#F4AD08" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Deliberate placeholder frame for photography that does not exist yet.
 * The exact future filename is printed so it can be swapped in directly.
 */
/**
 * PlannedShot — an honest, designed frame for photography that does not exist
 * yet because the thing it would show has not been manufactured yet.
 *
 * It never fakes a photograph. It states the brief and the file that will
 * replace it, so the page stays complete without inventing evidence.
 */
export function PlannedShot({
  path,
  brief,
  ratio = "aspect-[3/2]",
  tone = "light",
  className,
}: {
  path: string;
  brief: string;
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <figure
      className={cn(
        "clip-corner relative overflow-hidden",
        ratio,
        light ? "hairline bg-ivory" : "hairline-dark bg-deepviolet",
        className,
      )}
    >
      <div className="grain absolute inset-0 opacity-70" aria-hidden="true" />

      {/* registration marks — a print-production frame, not a photo mock */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 300 200"
      >
        <g
          stroke={light ? "rgba(77,22,136,0.28)" : "rgba(247,240,216,0.28)"}
          strokeWidth="0.6"
        >
          <line x1="0" y1="100" x2="300" y2="100" strokeDasharray="3 5" />
          <line x1="150" y1="0" x2="150" y2="200" strokeDasharray="3 5" />
          <rect x="18" y="18" width="264" height="164" fill="none" strokeDasharray="6 6" />
        </g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 pb-14 text-center">
        <span
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full border",
            light ? "border-violet/35 text-violet" : "border-ivory/35 text-ivory/70",
          )}
          aria-hidden="true"
        >
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
            <rect x="0.75" y="2.75" width="16.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="9" cy="9" r="3.4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6 2.5 7.2 0.75h3.6L12 2.5" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </span>
        <p
          className={cn(
            "max-w-[34ch] text-[13px] leading-relaxed",
            light ? "text-ink/65" : "text-ivory/65",
          )}
        >
          {brief}
        </p>
      </div>

      <figcaption
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3",
          light
            ? "border-t border-line bg-paper/90 text-muted"
            : "border-t border-ivory/15 bg-plum/80 text-ivory/55",
        )}
      >
        <span className="label truncate">{path}</span>
        <span className={cn("label", light ? "text-violet" : "text-saffron")}>
          To be shot
        </span>
      </figcaption>
    </figure>
  );
}

export function Note({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mono max-w-[62ch] text-[11px] leading-relaxed tracking-[0.04em]",
        tone === "light" ? "text-muted" : "text-ivory/55",
        className,
      )}
    >
      {children}
    </p>
  );
}
