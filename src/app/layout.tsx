import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { LocaleProvider } from "@/lib/i18n/client";
import { getDictionary } from "@/lib/i18n/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Pengadaan Tanah Pelebaran Simpang Parung Bingung — Kota Depok",
    template: "%s — Pengadaan Tanah Simpang Parung Bingung",
  },
  description:
    "Website resmi publikasi pengadaan tanah untuk kepentingan umum pembangunan pelebaran Simpang Parung Bingung, Kota Depok: dokumen publikasi, data nominatif, SOP, dan kanal sanggahan masyarakat.",
  openGraph: {
    title: "Pengadaan Tanah Pelebaran Simpang Parung Bingung — Kota Depok",
    description:
      "Dokumen publikasi resmi, data nominatif, SOP, dan kanal sanggahan pengadaan tanah untuk kepentingan umum di Kota Depok.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocaleProvider locale={locale} dict={dict}>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
