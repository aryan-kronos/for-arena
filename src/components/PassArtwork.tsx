import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/utils/cn";

export const PASS_IMAGE = "/images/aranch-pass-passport-seal.webp";
export const DEMO_ASSET_CODE = "AP-7K3M9";
export const DEMO_QR_VALUE = "ARANCH PASS DEMO | AP-7K3M9 | PRE-LAUNCH";

/**
 * Approved ARANCH PASS front artwork.
 *
 * The attached JPG is the visual source of truth. A real, deterministic QR is
 * placed over the QR region in the concept artwork so the website never shows
 * random QR-like noise. The current QR encodes an explicit pre-launch demo
 * string; it must be replaced with the production HTTPS asset URL before print.
 */
export function PassFrontArtwork({
  className = "",
  dieCut = true,
}: {
  className?: string;
  dieCut?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[1344/797] overflow-hidden bg-[#f4eed9]",
        dieCut && "notch",
        className,
      )}
      role="img"
      aria-label="ARANCH PASS pre-launch passport-seal design, issue 01 of 50, asset code AP-7K3M9."
    >
      <img
        src={PASS_IMAGE}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-center select-none"
      />

      {/* Real scannable demo QR, aligned over the concept image QR. */}
      <div
        className="absolute left-[60.65%] top-[27.4%] aspect-square w-[20.2%] bg-[#f7f0d8] p-[1.15%]"
        aria-hidden="true"
      >
        <QRCodeSVG
          value={DEMO_QR_VALUE}
          level="M"
          marginSize={0}
          bgColor="#F7F0D8"
          fgColor="#2E0759"
          className="block h-full w-full"
        />
      </div>
    </div>
  );
}

/** Reverse artwork used only by the interactive model. */
export function PassBackArtwork({
  className = "",
  dieCut = true,
}: {
  className?: string;
  dieCut?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[1344/797] overflow-hidden bg-deepviolet text-ivory",
        dieCut && "notch",
        className,
      )}
      role="img"
      aria-label="Reverse of ARANCH PASS: every service stays connected."
    >
      <svg viewBox="0 0 1344 797" className="block h-full w-full" aria-hidden="true">
        <rect width="1344" height="797" fill="#2E0759" />
        <path d="M62 58H1282V739H62Z" fill="none" stroke="#F4AD08" strokeWidth="4" />
        <path d="M92 88H1252V709H92Z" fill="none" stroke="rgba(247,240,216,.18)" strokeWidth="2" />
        <text x="112" y="150" fill="#F7F0D8" fontFamily="Archivo,Arial,sans-serif" fontSize="38" fontWeight="700" letterSpacing="8">ARANCH PASS</text>
        <text x="112" y="352" fill="#F7F0D8" fontFamily="Archivo,Arial,sans-serif" fontSize="96" fontWeight="800" letterSpacing="-3">EVERY SERVICE</text>
        <text x="112" y="458" fill="#F4AD08" fontFamily="Archivo,Arial,sans-serif" fontSize="96" fontWeight="800" letterSpacing="-3">STAYS CONNECTED.</text>
        <path d="M118 578H1226" stroke="rgba(247,240,216,.22)" strokeWidth="2" />
        <path d="M118 578H1226" stroke="#F4AD08" strokeWidth="5" strokeDasharray="14 20" />
        {[118, 487, 856, 1226].map((x) => (
          <g key={x}><circle cx={x} cy="578" r="15" fill="#2E0759" stroke="#F7F0D8" strokeWidth="3"/><circle cx={x} cy="578" r="6" fill="#F4AD08"/></g>
        ))}
        <text x="112" y="675" fill="rgba(247,240,216,.55)" fontFamily="IBM Plex Mono,monospace" fontSize="27" letterSpacing="4">ATTACH · RECORD · SCAN · REBOOK</text>
        <text x="1232" y="675" textAnchor="end" fill="rgba(247,240,216,.55)" fontFamily="IBM Plex Mono,monospace" fontSize="27">01/50</text>
      </svg>
    </div>
  );
}
