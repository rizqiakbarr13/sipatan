import { ImportCsvClient } from "./import-csv-client";

export default function ImportNominatifPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-zinc-900">Import Data Nominatif (CSV)</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Upload file CSV untuk membuat atau memperbarui data bidang secara massal. Data akan
        divalidasi dan ditampilkan sebagai preview sebelum disimpan.
      </p>
      <ImportCsvClient />
    </div>
  );
}
