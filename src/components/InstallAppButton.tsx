import { useEffect, useState } from "react";
import { DownloadIcon } from "@/components/icons";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function InstallAppButton({ compact = false }: { compact?: boolean }) {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [iosEligible, setIosEligible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIosEligible(ios && !standalone);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setPromptEvent(null);
      setIosEligible(false);
      setShowIosHelp(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent && !iosEligible) return null;

  const install = async () => {
    if (promptEvent) {
      await promptEvent.prompt();
      await promptEvent.userChoice;
      setPromptEvent(null);
    } else {
      setShowIosHelp(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void install()}
        className={compact
          ? "grid h-10 w-10 place-items-center border border-ivory/25 text-ivory hover:border-saffron"
          : "mono flex items-center gap-2 border border-ivory/20 px-3 py-2 text-[10px] tracking-[0.12em] text-ivory uppercase hover:border-saffron"}
        aria-label="Install ARANCH PASS app"
      >
        <DownloadIcon width={16} height={16} />
        {!compact && <span>Install</span>}
      </button>
      {showIosHelp && (
        <div role="dialog" aria-modal="true" aria-label="Install on iPhone or iPad" className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-[440px] border border-saffron/40 bg-plum p-5 text-ivory shadow-2xl">
          <p className="font-display text-lg font-bold">Install on iPhone or iPad</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ivory/70">In Safari, tap the Share button, then choose <strong className="text-ivory">Add to Home Screen</strong>.</p>
          <button type="button" onClick={() => setShowIosHelp(false)} className="mono mt-4 text-[10px] tracking-[.12em] text-saffron uppercase underline">Close</button>
        </div>
      )}
    </>
  );
}
