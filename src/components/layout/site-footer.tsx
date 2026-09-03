"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, HelpCircle, X as XIcon } from "lucide-react";
import { useLocale } from "@/lib/i18n/client";
import { KONTAK } from "@/lib/contact";
import { cn } from "@/lib/utils";

function ColumnTitle({ children, dot }: { children: React.ReactNode; dot: string }) {
  return (
    <p className="flex items-center gap-2 text-sm font-heading font-semibold text-zinc-900 dark:text-zinc-100">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {children}
    </p>
  );
}

function FacebookGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.362H7.332v3.209h2.747v8.195h3.318z" />
    </svg>
  );
}

function InstagramGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function YoutubeGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a2.999 2.999 0 0 0-2.112-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.386.505A2.999 2.999 0 0 0 .502 6.186 31.26 31.26 0 0 0 0 12a31.26 31.26 0 0 0 .502 5.814 2.999 2.999 0 0 0 2.112 2.136c1.881.505 9.386.505 9.386.505s7.505 0 9.386-.505a2.999 2.999 0 0 0 2.112-2.136A31.26 31.26 0 0 0 24 12a31.26 31.26 0 0 0-.502-5.814zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
    </svg>
  );
}

const SOSIAL_MEDIA = [
  { label: "Facebook", href: "#", Icon: FacebookGlyph },
  { label: "Instagram", href: "#", Icon: InstagramGlyph },
  { label: "YouTube", href: "#", Icon: YoutubeGlyph },
  { label: "X", href: "#", Icon: XIcon },
];

export function SiteFooter() {
  const { dict } = useLocale();

  return (
    <footer className="mt-16 border-t bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="h-1 bg-gradient-to-r from-amber-500 via-teal-500 to-emerald-600" />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/sipatan-logo.png" alt="SIPATAN" width={140} height={140} className="h-14 w-auto object-contain" />
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{dict.footer.alamat}</p>
          <div className="mt-4 flex items-center gap-2">
            {SOSIAL_MEDIA.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <ColumnTitle dot="bg-blue-500">{dict.footer.tautanTitle}</ColumnTitle>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link className="hover:text-blue-700 hover:underline dark:hover:text-blue-400" href="/dokumen">{dict.nav.dokumen}</Link></li>
            <li><Link className="hover:text-blue-700 hover:underline dark:hover:text-blue-400" href="/data-nominatif">{dict.nav.nominatif}</Link></li>
            <li><Link className="hover:text-blue-700 hover:underline dark:hover:text-blue-400" href="/sop">{dict.footer.sopPengadaan}</Link></li>
            <li><Link className="hover:text-blue-700 hover:underline dark:hover:text-blue-400" href="/pengumuman">{dict.nav.pengumuman}</Link></li>
          </ul>
        </div>

        <div>
          <ColumnTitle dot="bg-amber-500">{dict.footer.sanggahanTitle}</ColumnTitle>
          <ul className="mt-3 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
            <li><Link className="hover:text-amber-700 hover:underline dark:hover:text-amber-400" href="/sanggahan/baru">{dict.nav.ajukanSanggahan}</Link></li>
            <li><Link className="hover:text-amber-700 hover:underline dark:hover:text-amber-400" href="/sanggahan/lacak">{dict.footer.lacakStatus}</Link></li>
            <li><Link className="hover:text-amber-700 hover:underline dark:hover:text-amber-400" href="/sanggahan/formulir">{dict.footer.unduhFormulir}</Link></li>
          </ul>
        </div>

        <div>
          <ColumnTitle dot="bg-purple-500">{dict.footer.bantuanTitle}</ColumnTitle>
          <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>
              <Link href="/faq" className="flex items-center gap-2 hover:text-purple-700 hover:underline dark:hover:text-purple-400">
                <HelpCircle className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                {dict.footer.faqLink}
              </Link>
            </li>
            <li>
              <Link href="/hubungi-kami" className="flex items-start gap-2 hover:text-purple-700 hover:underline dark:hover:text-purple-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
                <span>{KONTAK.alamat}</span>
              </Link>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
              <a href={`mailto:${KONTAK.email}`} className="hover:text-purple-700 hover:underline dark:hover:text-purple-400">
                {KONTAK.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400" />
              <span>{KONTAK.telepon}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t px-4 py-4 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        © {new Date().getFullYear()} {dict.footer.hakCipta}
      </div>
    </footer>
  );
}
