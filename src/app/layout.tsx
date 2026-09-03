import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/lib/i18n/client";
import { getDictionary } from "@/lib/i18n/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-heading-sora",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "SIPATAN — Sistem Informasi Pengadaan Tanah",
    template: "%s — SIPATAN",
  },
  description:
    "SIPATAN adalah portal resmi publikasi pengadaan tanah untuk kepentingan umum: dokumen publikasi, data nominatif, SOP, dan kanal sanggahan masyarakat.",
  openGraph: {
    title: "SIPATAN — Sistem Informasi Pengadaan Tanah",
    description:
      "Dokumen publikasi resmi, data nominatif, SOP, dan kanal sanggahan pengadaan tanah untuk kepentingan umum.",
    locale: "id_ID",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale, dict } = await getDictionary();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider locale={locale} dict={dict}>
            {children}
          </LocaleProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
