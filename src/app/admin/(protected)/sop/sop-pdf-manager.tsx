"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, ExternalLink, FileUp, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { uploadSopPdf, setActiveSopPdf, deleteSopPdf } from "./actions";

type ActionState = { error?: string; success?: boolean };

export interface SopPdfRow {
  id: string;
  judul: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  published: boolean;
  tanggalUpload: string;
}

export function SopPdfManager({ items }: { items: SopPdfRow[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(uploadSopPdf, {});
  const [fileName, setFileName] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busy, startTransition] = useTransition();

  const aktif = items.find((i) => i.published);

  function handleSetActive(id: string) {
    startTransition(async () => {
      const result = await setActiveSopPdf(id);
      if (result.error) toast.error(result.error);
      else toast.success("PDF SOP aktif diperbarui");
    });
  }

  function handleDelete() {
    if (!confirmId) return;
    const id = confirmId;
    startTransition(async () => {
      try {
        const result = await deleteSopPdf(id);
        if (result.error) toast.error(result.error);
        else toast.success("Versi PDF SOP dihapus");
      } catch {
        toast.error("Gagal menghapus PDF SOP");
      } finally {
        setConfirmId(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Unggah PDF SOP</h2>
        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
          PDF yang diunggah otomatis menjadi versi aktif dan menggantikan tampilan di halaman SOP publik.
          Versi lama tetap tersimpan dan bisa diaktifkan kembali kapan saja.
        </p>

        {state.error && (
          <p className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">{state.error}</p>
        )}

        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="judul">Judul</Label>
            <Input
              id="judul"
              name="judul"
              defaultValue="SK Penetapan SOP Bidang Pertanahan"
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="file">File PDF</Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="application/pdf"
              required
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              className="h-auto py-2"
            />
            {fileName && <p className="text-xs text-zinc-500 dark:text-zinc-400">Dipilih: {fileName}</p>}
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
              Unggah & Aktifkan
            </Button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          {aktif ? (
            <span>
              Versi aktif saat ini: <strong className="text-zinc-900 dark:text-zinc-100">{aktif.fileName}</strong>
            </span>
          ) : (
            <span>Belum ada PDF SOP yang aktif. Halaman publik akan menampilkan pesan &ldquo;belum tersedia&rdquo;.</span>
          )}
        </div>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                  {item.judul}
                  {item.published && (
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> Aktif
                    </Badge>
                  )}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {item.fileName} · diunggah {item.tanggalUpload}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                >
                  <ExternalLink className="h-4 w-4" /> Lihat
                </a>
                {!item.published && (
                  <Button variant="outline" size="sm" disabled={busy} onClick={() => handleSetActive(item.id)}>
                    Jadikan aktif
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmId(item.id)}
                  aria-label="Hapus versi ini"
                  className="inline-flex items-center rounded-md px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">Belum ada PDF SOP yang diunggah.</li>
          )}
        </ul>
      </section>

      <ConfirmDialog
        open={confirmId !== null}
        onOpenChange={(open) => !open && setConfirmId(null)}
        title="Hapus versi PDF SOP ini?"
        description="Berkas ini akan dihapus permanen dari daftar. Tindakan ini tidak bisa dibatalkan."
        confirmLabel="Ya, Hapus"
        destructive
        pending={busy}
        onConfirm={handleDelete}
      />
    </div>
  );
}
