import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { QrIcon } from "@/components/icons";

export function QrScannerModal({ onResult }: { onResult: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const resultRef = useRef(onResult);
  resultRef.current = onResult;

  useEffect(() => {
    if (!open || !videoRef.current) return;
    let cancelled = false;
    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        if (cancelled) return;
        scanner.stop();
        setOpen(false);
        resultRef.current(result.data);
      },
      {
        preferredCamera: "environment",
        returnDetailedScanResult: true,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 12,
      },
    );
    scannerRef.current = scanner;
    setStatus("Requesting camera access…");
    void scanner.start().then(() => setStatus("Point the camera at an ARANCH PASS QR code.")).catch((error: unknown) => {
      setStatus(error instanceof Error ? `Camera unavailable: ${error.message}` : "Camera access was not available. Upload a QR image instead.");
    });
    return () => {
      cancelled = true;
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
  }, [open]);

  const close = () => {
    scannerRef.current?.stop();
    setOpen(false);
  };

  const scanFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus("Reading QR image…");
    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
      setOpen(false);
      resultRef.current(result.data);
    } catch {
      setStatus("No readable QR code was found in that image.");
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="clip-corner-sm flex items-center justify-center gap-2 bg-saffron px-6 py-4 text-[12px] font-bold tracking-[.06em] text-plum uppercase">
        <QrIcon width={18} height={18} /> Scan QR code
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-plum/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Scan ARANCH PASS QR code">
          <div className="clip-corner w-full max-w-[540px] overflow-hidden bg-paper text-ink shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4"><div><p className="label text-violet">Customer scanner</p><h2 className="font-display mt-1 text-xl font-bold text-deepviolet">Scan the physical pass</h2></div><button type="button" onClick={close} className="grid h-9 w-9 place-items-center border border-line text-violet" aria-label="Close scanner"><svg viewBox="0 0 20 20" className="h-4 w-4"><path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></button></div>
            <div className="relative aspect-[4/3] overflow-hidden bg-black"><video ref={videoRef} muted playsInline className="h-full w-full object-cover"/><div className="pointer-events-none absolute inset-[14%] border-2 border-saffron"><span className="absolute -top-0.5 -left-0.5 h-7 w-7 border-t-4 border-l-4 border-saffron"/><span className="absolute -top-0.5 -right-0.5 h-7 w-7 border-t-4 border-r-4 border-saffron"/><span className="absolute -bottom-0.5 -left-0.5 h-7 w-7 border-b-4 border-l-4 border-saffron"/><span className="absolute -right-0.5 -bottom-0.5 h-7 w-7 border-r-4 border-b-4 border-saffron"/></div></div>
            <div className="p-5"><p aria-live="polite" className="text-[13px] leading-relaxed text-muted">{status}</p><label className="clip-corner-sm hairline mt-4 flex cursor-pointer items-center justify-center gap-2 px-5 py-3 text-[11px] font-bold text-violet uppercase"><input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => void scanFile(event.target.files?.[0])}/>Upload QR image</label><p className="mono mt-4 text-[9px] leading-relaxed text-muted uppercase">Camera frames are processed on this device for QR detection. This demo does not upload or store camera video.</p></div>
          </div>
        </div>
      )}
    </>
  );
}
