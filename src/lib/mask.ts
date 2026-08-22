/** Mask NIK untuk tampilan publik: sisakan 4 digit awal & 4 digit akhir. */
export function maskNik(nik: string | null | undefined): string {
  if (!nik) return "-";
  const digits = nik.trim();
  if (digits.length <= 8) return "●".repeat(digits.length);
  const depan = digits.slice(0, 4);
  const belakang = digits.slice(-4);
  const tengah = "●".repeat(digits.length - 8);
  return `${depan}${tengah}${belakang}`;
}

/** Mask data pribadi bebas-teks (pekerjaan, alamat, dst.) untuk tampilan publik: sisakan beberapa huruf awal, sisanya ditutup bullet dengan panjang tetap (tidak membocorkan panjang asli). */
export function maskSebagian(value: string | null | undefined, visible = 2): string {
  if (!value) return "-";
  const trimmed = value.trim();
  if (trimmed.length === 0) return "-";
  return `${trimmed.slice(0, visible)}${"●".repeat(6)}`;
}

/** Mask tanggal lahir: pertahankan format/pemisah, tutup semua digit dengan bullet. */
export function maskTanggalLahir(value: string | null | undefined): string {
  if (!value) return "-";
  return value.replace(/[0-9]/g, "●");
}

/** Inisial nama untuk tampilan publik sanggahan yang ditandai transparan. */
export function initialName(nama: string): string {
  return nama
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join(".")
    .concat(".");
}
