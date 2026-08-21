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

/** Inisial nama untuk tampilan publik sanggahan yang ditandai transparan. */
export function initialName(nama: string): string {
  return nama
    .trim()
    .split(/\s+/)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join(".")
    .concat(".");
}
