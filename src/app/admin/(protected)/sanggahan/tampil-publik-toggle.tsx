"use client";

import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { toggleTampilPublik } from "./actions";

export function TampilPublikToggle({ id, checked }: { id: string; checked: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <ToggleSwitch checked={checked} onToggle={(next) => toggleTampilPublik(id, next)} label="Tampilkan di publik" />
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Tampilkan sanggahan &amp; tanggapan ini di halaman dokumen publik (data pribadi disamarkan)
      </span>
    </div>
  );
}
