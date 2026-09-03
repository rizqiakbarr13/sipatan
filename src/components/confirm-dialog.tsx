"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  destructive = false,
  pending = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="max-w-sm gap-0 p-0">
        <div className="p-5">
          <DialogTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</DialogTitle>
          {description && (
            <DialogDescription className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </DialogDescription>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={onConfirm}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white transition disabled:opacity-60",
                destructive ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
