import { prisma } from "@/lib/prisma";

/** Buat nomor tiket unik berformat SGH-{tahun}-{urutan 4 digit}. */
export async function generateNomorTiket(now: Date = new Date()): Promise<string> {
  const tahun = now.getFullYear();
  const prefix = `SGH-${tahun}-`;

  const terakhir = await prisma.sanggahan.findFirst({
    where: { nomorTiket: { startsWith: prefix } },
    orderBy: { nomorTiket: "desc" },
    select: { nomorTiket: true },
  });

  let urutan = 1;
  if (terakhir) {
    const bagianUrutan = Number(terakhir.nomorTiket.slice(prefix.length));
    if (!Number.isNaN(bagianUrutan)) urutan = bagianUrutan + 1;
  }

  return `${prefix}${String(urutan).padStart(4, "0")}`;
}
