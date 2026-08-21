"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function ConfirmDeleteButton({
  onDelete,
  confirmText = "Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.",
}: {
  onDelete: () => Promise<void>;
  confirmText?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-zinc-600">{confirmText}</span>
        <button
          type="button"
          className="rounded bg-red-600 px-2 py-1 font-medium text-white hover:bg-red-700"
          disabled={pending}
          onClick={() => startTransition(async () => {
            await onDelete();
            setConfirming(false);
          })}
        >
          {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Hapus"}
        </button>
        <button
          type="button"
          className="rounded border px-2 py-1 font-medium text-zinc-600 hover:bg-zinc-50"
          onClick={() => setConfirming(false)}
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
