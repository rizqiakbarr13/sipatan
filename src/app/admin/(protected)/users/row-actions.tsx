"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteUser } from "./actions";

export function UserRowActions({ id }: { id: string }) {
  return <ConfirmDeleteButton onDelete={() => deleteUser(id)} confirmText="Akun user ini tidak akan bisa login lagi." />;
}
