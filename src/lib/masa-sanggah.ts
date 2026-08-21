/** Tambahkan N hari kerja (Senin-Jumat) ke sebuah tanggal. */
export function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

export type StatusMasaSanggah =
  | { status: "belum_diatur" }
  | { status: "berjalan"; sisaHari: number; selesai: Date }
  | { status: "berakhir"; selesai: Date };

export function getStatusMasaSanggah(
  mulai: Date | null | undefined,
  selesai: Date | null | undefined,
  now: Date = new Date()
): StatusMasaSanggah {
  if (!selesai) return { status: "belum_diatur" };
  const end = new Date(selesai);
  end.setHours(23, 59, 59, 999);
  if (now.getTime() > end.getTime()) {
    return { status: "berakhir", selesai: end };
  }
  const msPerDay = 24 * 60 * 60 * 1000;
  const sisaHari = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / msPerDay));
  return { status: "berjalan", sisaHari, selesai: end };
}

export function isMasaSanggahBerjalan(
  mulai: Date | null | undefined,
  selesai: Date | null | undefined,
  now: Date = new Date()
): boolean {
  const status = getStatusMasaSanggah(mulai, selesai, now);
  return status.status === "berjalan";
}
