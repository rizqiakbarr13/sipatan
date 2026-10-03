"use client";

import { useRouter } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteSanggahan } from "../actions";

export function SanggahanDeleteButton({ id, nomorTiket }: { id: string; nomorTiket: string }) {
  const router = useRouter();

  return (
    <ConfirmDeleteButton
      onDelete={() => deleteSanggahan(id)}
      confirmText={`Sanggahan ${nomorTiket} beserta seluruh lampiran, bukti tambahan, dan riwayat statusnya akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.`}
      onSuccess={() => {
        router.push("/admin/sanggahan");
        router.refresh();
      }}
    />
  );
}
