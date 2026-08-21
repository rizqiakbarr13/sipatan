function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Bangun teks CSV dari header + baris data (array of records). */
export function toCsv(headers: { key: string; label: string }[], rows: Record<string, unknown>[]): string {
  const lines = [headers.map((h) => escapeCsvValue(h.label)).join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvValue(row[h.key])).join(","));
  }
  return lines.join("\r\n");
}
