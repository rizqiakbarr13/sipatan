import Link from "next/link";
import { CheckCircle2, Copy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Sanggahan Terkirim",
};

export default async function SanggahanSuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ tiket?: string }>;
}) {
  const { tiket } = await searchParams;
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{dict.sanggahanSukses.title}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{dict.sanggahanSukses.desc}</p>

      {tiket && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-5 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
          <Copy className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
          <span className="font-mono text-lg font-semibold tracking-wide text-emerald-800 dark:text-emerald-300">
            {tiket}
          </span>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/sanggahan/lacak" className={cn(buttonVariants({ size: "lg" }))}>
          {dict.sanggahanSukses.lacakStatus}
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          {dict.sanggahanSukses.kembaliBeranda}
        </Link>
      </div>
    </div>
  );
}
