"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function ConfirmDeleteButton({
  onDelete,
  confirmText = "Tindakan ini tidak bisa dibatalkan.",
  successMessage = "Data telah dihapus",
}: {
  onDelete: () => Promise<void | { error?: string } | undefined>;
  confirmText?: string;
  successMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Hapus"
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Apakah yakin ingin dihapus?"
        description={confirmText}
        confirmLabel="Ya, Hapus"
        destructive
        pending={pending}
        onConfirm={() => {
          startTransition(async () => {
            try {
              const result = await onDelete();
              if (result && "error" in result && result.error) {
                toast.error(result.error);
              } else {
                toast.success(successMessage);
              }
            } catch {
              toast.error("Terjadi kesalahan, gagal menghapus data");
            } finally {
              setOpen(false);
            }
          });
        }}
      />
    </>
  );
}
