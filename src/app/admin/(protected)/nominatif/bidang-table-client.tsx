"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { BidangRowActions } from "./row-actions";
import { deleteBidangBulk, deleteBidangByProject } from "./actions";

export interface BidangRow {
  id: string;
  noUrut: number;
  namaPemilik: string;
  projectNama: string;
  nib: string | null;
  luasKena: number | null;
  suratTandaBukti: string | null;
}

export function BidangTableClient({
  items,
  activeProjectId,
  activeProjectNama,
}: {
  items: BidangRow[];
  activeProjectId?: string;
  activeProjectNama?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [confirmProject, setConfirmProject] = useState(false);
  const [pending, startTransition] = useTransition();

  const allSelected = items.length > 0 && items.every((item) => selected.has(item.id));

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  function toggleAll() {
    setSelected((prev) => {
      if (allSelected) return new Set();
      const next = new Set(prev);
      items.forEach((item) => next.add(item.id));
      return next;
    });
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleBulkDelete() {
    startTransition(async () => {
      try {
        const result = await deleteBidangBulk(selectedIds);
        if (result.error) toast.error(result.error);
        else {
          toast.success(`${result.count ?? 0} data berhasil dihapus`);
          setSelected(new Set());
        }
      } catch {
        toast.error("Terjadi kesalahan, gagal menghapus data");
      } finally {
        setConfirmBulk(false);
      }
    });
  }

  function handleDeleteProject() {
    if (!activeProjectId) return;
    startTransition(async () => {
      try {
        const result = await deleteBidangByProject(activeProjectId);
        if (result.error) toast.error(result.error);
        else {
          toast.success(`${result.count ?? 0} data pada proyek ini berhasil dihapus`);
          setSelected(new Set());
        }
      } catch {
        toast.error("Terjadi kesalahan, gagal menghapus data");
      } finally {
        setConfirmProject(false);
      }
    });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmBulk(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" /> Hapus Terpilih ({selectedIds.length})
            </button>
          )}
        </div>
        {activeProjectId && items.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmProject(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/40"
          >
            <Trash2 className="h-4 w-4" /> Hapus Semua Data Proyek Ini
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:bg-zinc-900 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:text-zinc-400 dark:bg-zinc-950">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Pilih semua"
                  className="h-4 w-4 rounded border-zinc-300 text-emerald-700 dark:border-zinc-700"
                />
              </th>
              <th className="px-4 py-3">No.</th>
              <th className="px-4 py-3">Nama Pemilik</th>
              <th className="px-4 py-3">Proyek</th>
              <th className="px-4 py-3">NIB</th>
              <th className="px-4 py-3">Luas Terkena</th>
              <th className="px-4 py-3">Surat Tanda Bukti</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((b) => (
              <tr key={b.id} className={selected.has(b.id) ? "bg-emerald-50/50 dark:bg-emerald-950/20" : undefined}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(b.id)}
                    onChange={() => toggleOne(b.id)}
                    aria-label={`Pilih ${b.namaPemilik}`}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-700 dark:border-zinc-700"
                  />
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.noUrut}</td>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{b.namaPemilik}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.projectNama}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.nib || "-"}</td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {b.luasKena ? `${b.luasKena.toLocaleString("id-ID")} m²` : "-"}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{b.suratTandaBukti || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/nominatif/${b.id}`} className="text-emerald-700 hover:underline">
                      Edit
                    </Link>
                    <BidangRowActions id={b.id} />
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  Belum ada data. Tambah manual atau import dari CSV/PDF.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={confirmBulk}
        onOpenChange={setConfirmBulk}
        title={`Hapus ${selectedIds.length} data terpilih?`}
        description="Data bidang (beserta rincian bangunan, tanaman, dan benda lain terkait) akan dihapus permanen. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Ya, Hapus"
        destructive
        pending={pending}
        onConfirm={handleBulkDelete}
      />
      <ConfirmDialog
        open={confirmProject}
        onOpenChange={setConfirmProject}
        title="Hapus semua data pada proyek ini?"
        description={`Seluruh data bidang pada proyek "${activeProjectNama ?? ""}" (beserta rincian bangunan, tanaman, dan benda lain terkait) akan dihapus permanen, termasuk yang berada di halaman lain. Tindakan ini tidak bisa dibatalkan.`}
        confirmLabel="Ya, Hapus Semua"
        destructive
        pending={pending}
        onConfirm={handleDeleteProject}
      />
      {pending && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <Loader2 className="h-3 w-3 animate-spin" /> Memproses...
        </p>
      )}
    </div>
  );
}
