import Link from "next/link";
import { HelpCircle, MessageSquareWarning, Search, ShieldCheck, Table2 } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "FAQ",
};

const ICONS = [MessageSquareWarning, HelpCircle, Search, ShieldCheck, HelpCircle];
const COLORS = [
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
];

export default async function FaqPage() {
  const { dict } = await getDictionary();

  return (
    <div>
      <PageHeader title={dict.faq.title} description={dict.faq.desc} />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="space-y-4">
          {dict.faq.items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <details
                key={item.q}
                className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm open:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <summary className="flex cursor-pointer list-none items-center gap-3 font-medium text-zinc-900 marker:content-none dark:text-zinc-100">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", COLORS[i % COLORS.length])}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">{item.q}</span>
                  <span className="shrink-0 text-lg text-zinc-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pl-12 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.a}</p>
              </details>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40 sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-200">{dict.kontak.title}</p>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">{dict.kontak.desc}</p>
          </div>
          <Link href="/hubungi-kami" className={cn(buttonVariants(), "shrink-0")}>
            {dict.home.kontakTeaserLink}
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Link
            href="/sanggahan/baru"
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-800 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <MessageSquareWarning className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> {dict.nav.ajukanSanggahan}
          </Link>
          <Link
            href="/data-nominatif"
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-800 transition hover:border-amber-300 hover:bg-amber-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Table2 className="h-4 w-4 text-amber-700 dark:text-amber-400" /> {dict.nav.nominatif}
          </Link>
        </div>
      </div>
    </div>
  );
}
