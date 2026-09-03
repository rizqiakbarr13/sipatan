export const KATEGORI_DOKUMEN_LABEL: Record<string, string> = {
  DAFTAR_NOMINATIF: "Daftar Nominatif",
  PENGUMUMAN: "Pengumuman",
  PETA_BIDANG: "Peta Bidang",
  SK_PENETAPAN_LOKASI: "SK Penetapan Lokasi",
  SOP: "SOP",
  BERITA_ACARA: "Berita Acara",
  LAINNYA: "Lainnya",
};

export const SANGGAHAN_STATUS_LABEL: Record<string, string> = {
  DITERIMA: "Diterima",
  DIVERIFIKASI: "Diverifikasi",
  DITINDAKLANJUTI: "Ditindaklanjuti",
  DITERIMA_SAH: "Diterima / Sah",
  DITOLAK: "Ditolak",
  SELESAI: "Selesai",
};

export const SANGGAHAN_STATUS_BADGE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "warning" | "destructive" | "success"
> = {
  DITERIMA: "secondary",
  DIVERIFIKASI: "warning",
  DITINDAKLANJUTI: "warning",
  DITERIMA_SAH: "success",
  DITOLAK: "destructive",
  SELESAI: "default",
};

export const SANGGAHAN_STATUS_URUTAN = [
  "DITERIMA",
  "DIVERIFIKASI",
  "DITINDAKLANJUTI",
  "DITERIMA_SAH",
  "DITOLAK",
  "SELESAI",
] as const;

export function formatTanggalIndonesia(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function formatTanggalWaktuIndonesia(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const tanggal = d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const waktu = d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  return `${tanggal}, ${waktu} WIB`;
}

export function formatUkuranFile(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
