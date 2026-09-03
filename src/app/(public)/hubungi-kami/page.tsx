import Link from "next/link";
import { Clock, HelpCircle, Mail, MapPin, Phone } from "lucide-react";
import { getDictionary } from "@/lib/i18n/server";
import { PageHeader } from "@/components/layout/page-header";
import { KONTAK } from "@/lib/contact";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Hubungi Kami",
};

export default async function HubungiKamiPage() {
  const { dict } = await getDictionary();

  return (
    <div>
      <PageHeader title={dict.kontak.title} description={dict.kontak.desc} />

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950/30">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase text-blue-700/70 dark:text-blue-300/70">{dict.kontak.alamatLabel}</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{KONTAK.alamat}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50 p-5 dark:border-purple-900 dark:bg-purple-950/30">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase text-purple-700/70 dark:text-purple-300/70">{dict.kontak.emailLabel}</p>
              <a href={`mailto:${KONTAK.email}`} className="mt-1 block text-sm text-zinc-700 hover:underline dark:text-zinc-300">
                {KONTAK.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase text-amber-700/70 dark:text-amber-300/70">{dict.kontak.teleponLabel}</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{KONTAK.telepon}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-5 dark:border-rose-900 dark:bg-rose-950/30">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium uppercase text-rose-700/70 dark:text-rose-300/70">{dict.kontak.jamLabel}</p>
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{KONTAK.jamLayanan}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <iframe
            title="Peta Lokasi Balai Kota Depok"
            src="https://maps.google.com/maps?q=Balai%20Kota%20Depok&t=&z=16&ie=UTF8&output=embed"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950/40 sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <HelpCircle className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-emerald-900 dark:text-emerald-200">{dict.faq.title}</p>
              <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-300">{dict.faq.desc}</p>
            </div>
          </div>
          <Link href="/faq" className={cn(buttonVariants(), "shrink-0")}>
            {dict.home.faqTeaserLink}
          </Link>
        </div>
      </div>
    </div>
  );
}
