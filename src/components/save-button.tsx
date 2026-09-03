"use client";

import { useState, type RefObject } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function SaveButton({
  formRef,
  pending,
  mode = "create",
  label = "Simpan",
  confirmTitle = "Simpan perubahan?",
  confirmDescription = "Apakah Anda yakin ingin menyimpan perubahan ini?",
}: {
  formRef: RefObject<HTMLFormElement | null>;
  pending: boolean;
  mode?: "create" | "edit";
  label?: string;
  confirmTitle?: string;
  confirmDescription?: string;
}) {
  const [open, setOpen] = useState(false);

  if (mode === "create") {
    return (
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </Button>
    );
  }

  return (
    <>
      <Button type="button" disabled={pending} onClick={() => setOpen(true)}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={confirmTitle}
        description={confirmDescription}
        confirmLabel="Ya, Simpan"
        onConfirm={() => {
          setOpen(false);
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
