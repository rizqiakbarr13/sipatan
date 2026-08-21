import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { NominatifTable } from "@/components/nominatif/nominatif-table";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Data Nominatif",
};

function jenisAlasHak(suratTandaBukti: string | null): string {
  if (!suratTandaBukti) return "Lainnya";
  const s = suratTandaBukti.toUpperCase();
  if (s.includes("SHM")) return "SHM";
  if (s.includes("SHGB")) return "SHGB";
  if (s.includes("SHP")) return "SHP";
  return "Lainnya";
}

export default async function DataNominatifPage() {
  const bidangList = await prisma.bidang.findMany({
    orderBy: { noUrut: "asc" },
    select: {
      id: true,
      noUrut: true,
      namaPemilik: true,
      nik: true,
      nib: true,
      rtRw: true,
      luasSesuaiAlasHak: true,
      luasHasilUkur: true,
      luasKena: true,
      luasSisa: true,
      suratTandaBukti: true,
      keterangan: true,
    },
  });

  const totalLuasKena = bidangList.reduce((sum, b) => sum + (b.luasKena ?? 0), 0);
  const jenisCounts = bidangList.reduce<Record<string, number>>((acc, b) => {
    const jenis = jenisAlasHak(b.suratTandaBukti);
    acc[jenis] = (acc[jenis] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Data Nominatif"
        description="Daftar bidang tanah, bangunan, dan tanaman yang terkena dampak pengadaan tanah."
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-zinc-500">Total Bidang</p>
              <p className="mt-1 text-2xl font-bold text-zinc-900">{bidangList.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs uppercase text-zinc-500">Total Luas Terkena</p>
              <p className="mt-1 text-2xl font-bold text-amber-700">
                {totalLuasKena.toLocaleString("id-ID")} m²
              </p>
            </CardContent>
          </Card>
          {["SHM", "SHGB"].map((jenis) => (
            <Card key={jenis}>
              <CardContent className="p-4">
                <p className="text-xs uppercase text-zinc-500">{jenis}</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900">
                  {jenisCounts[jenis] ?? 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <NominatifTable data={bidangList} />
      </div>
    </div>
  );
}
