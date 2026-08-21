"use client";

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { deleteBidang } from "./actions";

export function BidangRowActions({ id }: { id: string }) {
  return <ConfirmDeleteButton onDelete={() => deleteBidang(id)} />;
}
