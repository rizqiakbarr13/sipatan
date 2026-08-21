import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getWargaSession } from "@/lib/warga-session";

export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const warga = await getWargaSession();

  return (
    <>
      <SiteHeader warga={warga} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
