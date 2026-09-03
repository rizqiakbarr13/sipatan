"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyTicket({ tiket }: { tiket: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(tiket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-5 py-3 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70"
      aria-label="Salin nomor tiket"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
      ) : (
        <Copy className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
      )}
      <span className="font-mono text-lg font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">
        {tiket}
      </span>
      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
        {copied ? "Tersalin!" : "Salin"}
      </span>
    </button>
  );
}
