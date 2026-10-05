/** Normalisasi nama untuk perbandingan: huruf kecil, tanpa tanda baca, spasi tunggal. */
export function normalizeNama(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalisasi NIK: hanya digit. */
export function normalizeNik(value: string | null | undefined): string {
  return (value ?? "").replace(/\D/g, "");
}

export interface HasilCocokIdentitas {
  /** Apakah bidang punya data pemilik untuk dicocokkan. */
  adaData: boolean;
  namaCocok: boolean | null;
  /** null jika NIK di data bidang kosong (tidak bisa dicocokkan). */
  nikCocok: boolean | null;
  /** Benar jika ada data dan salah satu yang bisa dicocokkan tidak sesuai. */
  tidakSesuai: boolean;
}

/**
 * Cocokkan nama & NIK pengaju dengan data pemilik di bidang. Jika sanggahan
 * tidak terkait bidang, tidak ada yang bisa dicocokkan (adaData = false).
 */
export function cocokkanIdentitas(
  pengaju: { nama: string; nik: string },
  pemilik: { namaPemilik: string; nik: string | null } | null
): HasilCocokIdentitas {
  if (!pemilik) return { adaData: false, namaCocok: null, nikCocok: null, tidakSesuai: false };

  const namaCocok = normalizeNama(pengaju.nama) === normalizeNama(pemilik.namaPemilik);
  const nikPemilik = normalizeNik(pemilik.nik);
  const nikCocok = nikPemilik ? normalizeNik(pengaju.nik) === nikPemilik : null;

  return {
    adaData: true,
    namaCocok,
    nikCocok,
    tidakSesuai: !namaCocok || nikCocok === false,
  };
}
