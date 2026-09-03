"use client";

import { useState, useTransition } from "react";
import Papa from "papaparse";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, TriangleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  validateNominatifRow,
  isBlankTemplateRow,
  type NominatifRow,
} from "@/lib/nominatif-csv";
import { importNominatifRows } from "../actions";

interface RowPreview {
  line: number;
  ok: boolean;
  data?: NominatifRow;
  errors?: string[];
}

export function ImportCsvClient({ projects }: { projects: { id: string; namaProyek: string }[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<RowPreview[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setError(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (parsed) => {
        const preview: RowPreview[] = [];
        parsed.data.forEach((raw, i) => {
          if (isBlankTemplateRow(raw)) return;
          const result = validateNominatifRow(raw, i + 2);
          if (result.ok) {
            preview.push({ line: result.line, ok: true, data: result.data });
          } else {
            preview.push({ line: result.line, ok: false, errors: result.errors });
          }
        });
        setRows(preview);
      },
    });
  }

  function handleCommit() {
    if (!rows || !projectId) return;
    const validRows = rows.filter((r) => r.ok).map((r) => r.data!);
    startTransition(async () => {
      const res = await importNominatifRows(validRows, projectId);
      if (res.error) {
        setError(res.error);
        return;
      }
      setResult({ created: res.created ?? 0, updated: res.updated ?? 0 });
      router.refresh();
    });
  }

  const validCount = rows?.filter((r) => r.ok).length ?? 0;
  const invalidCount = rows?.filter((r) => !r.ok).length ?? 0;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="max-w-sm space-y-1.5">
        <label htmlFor="projectId" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Proyek tujuan import
        </label>
        <select
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:bg-zinc-900 dark:border-zinc-700"
        >
          <option value="" disabled>Pilih proyek…</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.namaProyek}</option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border-2 border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
        <UploadCloud className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Pilih file CSV sesuai template{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-800">data/nominatif.csv</code>
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFile}
          className="mx-auto mt-3 block text-sm file:mr-4 file:rounded-md file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
        />
        {fileName && <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">File: {fileName}</p>}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {result && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          Import selesai: {result.created} bidang baru dibuat, {result.updated} bidang diperbarui.
        </div>
      )}

      {rows && rows.length > 0 && !result && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-emerald-700">{validCount} baris valid</span>
              {invalidCount > 0 && (
                <span className="ml-2 font-medium text-red-600">{invalidCount} baris bermasalah</span>
              )}
            </p>
            <Button onClick={handleCommit} disabled={pending || validCount === 0 || !projectId}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Konfirmasi Import ({validCount} baris)
            </Button>
          </div>

          <div className="max-h-96 overflow-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-zinc-50 text-left uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
                <tr>
                  <th className="px-3 py-2">Baris</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">No. Urut</th>
                  <th className="px-3 py-2">Nama Pemilik</th>
                  <th className="px-3 py-2">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {rows.map((r) => (
                  <tr key={r.line} className={r.ok ? "" : "bg-red-50"}>
                    <td className="px-3 py-2">{r.line}</td>
                    <td className="px-3 py-2">
                      {r.ok ? (
                        <span className="text-emerald-700">Valid</span>
                      ) : (
                        <span className="text-red-600">Error</span>
                      )}
                    </td>
                    <td className="px-3 py-2">{r.data?.noUrut ?? "-"}</td>
                    <td className="px-3 py-2">{r.data?.namaPemilik ?? "-"}</td>
                    <td className="px-3 py-2 text-red-600">{r.errors?.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
