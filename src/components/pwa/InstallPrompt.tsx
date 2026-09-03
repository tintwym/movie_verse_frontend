"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("mv_pwa_dismissed");
    if (dismissed === "1") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !deferred) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0c0c18]/95 p-4 shadow-2xl backdrop-blur-md lg:bottom-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-300">
          <Download className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-white">Install MovieVerse</p>
          <p className="mt-1 text-sm text-zinc-400">
            Add to your home screen for faster access.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-400"
              onClick={async () => {
                await deferred.prompt();
                setVisible(false);
                setDeferred(null);
              }}
            >
              Install
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-400 hover:text-white"
              onClick={() => {
                localStorage.setItem("mv_pwa_dismissed", "1");
                setVisible(false);
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
