import Link from "next/link";
import { CheckCircle2, FileDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n/server";
import { CopyTicket } from "@/components/sanggahan/copy-ticket";

export const metadata = {
  title: "Sanggahan Terkirim",
};

export default async function SanggahanSuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ tiket?: string; nik?: string }>;
}) {
  const { tiket, nik } = await searchParams;
  const { dict } = await getDictionary();

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{dict.sanggahanSukses.title}</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{dict.sanggahanSukses.desc}</p>

      {tiket && <CopyTicket tiket={tiket} />}

      {tiket && nik && (
        <a
          href={`/api/sanggahan/pdf?tiket=${encodeURIComponent(tiket)}&nik=${encodeURIComponent(nik)}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
        >
          <FileDown className="h-4 w-4" /> {dict.sanggahanSukses.unduhBukti}
        </a>
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
