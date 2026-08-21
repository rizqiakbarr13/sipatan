"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/client";
import { setLocale } from "@/lib/i18n/actions";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = locale === "id" ? "en" : "id";
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      className={cn(
        "inline-flex h-10 items-center gap-1.5 rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800",
        className
      )}
    >
      <Languages className="h-4 w-4" />
      {locale.toUpperCase()}
    </button>
  );
}
