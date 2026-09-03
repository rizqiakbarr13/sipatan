"use client";

import { useState, useTransition } from "react";
import { KeyRound, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { resetPasswordWarga, deleteWargaAccount } from "./actions";

export function WargaRowActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  function handleReset() {
    startTransition(async () => {
      const result = await resetPasswordWarga(id);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setNewPassword(result.password);
        toast.success("Password berhasil direset");
      }
      setConfirmResetOpen(false);
    });
  }

  if (newPassword) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-zinc-500 dark:text-zinc-400">Password baru:</span>
        <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          {newPassword}
        </code>
        <button
          type="button"
          onClick={() => setNewPassword(null)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          aria-label="Tutup"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => setConfirmResetOpen(true)}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-60 dark:text-amber-400 dark:hover:bg-amber-950"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <KeyRound className="h-3.5 w-3.5" />}
        Reset Password
      </button>
      <ConfirmDialog
        open={confirmResetOpen}
        onOpenChange={setConfirmResetOpen}
        title="Reset password akun ini?"
        description="Password baru akan dibuat otomatis dan menggantikan password lama."
        confirmLabel="Ya, Reset"
        pending={pending}
        onConfirm={handleReset}
      />
      <ConfirmDeleteButton
        onDelete={() => deleteWargaAccount(id)}
        confirmText="Hapus akun warga ini? Sanggahan yang pernah diajukan akan tetap ada namun menjadi anonim."
      />
    </div>
  );
}
