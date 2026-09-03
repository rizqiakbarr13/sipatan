import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900/50">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.16) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl dark:bg-amber-500/10" />
      <div className="relative mx-auto max-w-6xl px-4 py-8">
        {backHref && (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" /> {backLabel}
          </Link>
        )}
        <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        )}
      </div>
    </div>
  );
}
