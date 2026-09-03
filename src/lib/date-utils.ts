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

/** Tambahkan N hari kalender (termasuk akhir pekan) ke sebuah tanggal. */
export function addCalendarDays(start: Date, days: number): Date {
  const result = new Date(start);
  result.setDate(result.getDate() + days);
  return result;
}

export const MASA_SANGGAH_HARI_KALENDER = 14;

/** Rentang masa sanggah: 14 hari kalender sejak tanggal pengumuman diterbitkan. */
export function getMasaSanggahRange(tanggalPeng: Date): { mulai: Date; selesai: Date } {
  return {
    mulai: tanggalPeng,
    selesai: addCalendarDays(tanggalPeng, MASA_SANGGAH_HARI_KALENDER),
  };
}

/** Apakah masa sanggah suatu proyek masih terbuka (belum lewat 14 hari kalender sejak pengumuman). */
export function isMasaSanggahTerbuka(masaSanggahSelesai: Date | null | undefined): boolean {
  if (!masaSanggahSelesai) return true;
  return Date.now() <= masaSanggahSelesai.getTime();
}

export const TARGET_TANGGAPAN_MIN_HARI_KERJA = 3;
export const TARGET_TANGGAPAN_MAX_HARI_KERJA = 4;

/** Target tanggapan admin atas sanggahan: 3-4 hari kerja sejak diajukan. */
export function getTargetTanggapan(createdAt: Date): { min: Date; max: Date } {
  return {
    min: addBusinessDays(createdAt, TARGET_TANGGAPAN_MIN_HARI_KERJA),
    max: addBusinessDays(createdAt, TARGET_TANGGAPAN_MAX_HARI_KERJA),
  };
}
