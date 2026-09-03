"use client";

import { useRef, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import {
  addBangunanItem,
  deleteBangunanItem,
  addTanamanItem,
  deleteTanamanItem,
  addBendaLainItem,
  deleteBendaLainItem,
} from "./actions";
import type { BangunanItem, TanamanItem, BendaLainItem } from "@prisma/client";

const SATUAN_OPTIONS = ["m²", "m¹", "unit"] as const;

export function BangunanManager({ bidangId, items }: { bidangId: string; items: BangunanItem[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase text-zinc-400 dark:text-zinc-500">
          <tr>
            <th className="pb-2">Jenis</th>
            <th className="pb-2">Jumlah</th>
            <th className="pb-2">Satuan</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-2">{item.jenis}</td>
              <td className="py-2">{item.jumlah ?? "-"}</td>
              <td className="py-2">{item.satuan ?? "-"}</td>
              <td className="py-2 text-right">
                <ConfirmDeleteButton
                  onDelete={() => deleteBangunanItem(item.id, bidangId)}
                  confirmText="Hapus item bangunan ini?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            const result = await addBangunanItem(bidangId, formData);
            if (result?.error) toast.error(result.error);
            else {
              toast.success("Data disimpan");
              formRef.current?.reset();
            }
          })
        }
        className="mt-3 flex flex-wrap items-end gap-2"
      >
        <Input name="jenis" placeholder="Jenis bangunan" className="w-40" required />
        <Input name="jumlah" type="number" step="0.01" placeholder="Jumlah" className="w-28" />
        <select
          name="satuan"
          defaultValue=""
          className="flex h-10 w-24 rounded-md border border-zinc-300 bg-white px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        >
          <option value="">Satuan</option>
          {SATUAN_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </form>
    </div>
  );
}

export function TanamanManager({ bidangId, items }: { bidangId: string; items: TanamanItem[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase text-zinc-400 dark:text-zinc-500">
          <tr>
            <th className="pb-2">Jenis</th>
            <th className="pb-2">Kecil</th>
            <th className="pb-2">Sedang</th>
            <th className="pb-2">Besar</th>
            <th className="pb-2">Jumlah</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-2">{item.jenis}</td>
              <td className="py-2">{item.kecil ?? "-"}</td>
              <td className="py-2">{item.sedang ?? "-"}</td>
              <td className="py-2">{item.besar ?? "-"}</td>
              <td className="py-2">{item.jumlah ?? "-"}</td>
              <td className="py-2 text-right">
                <ConfirmDeleteButton
                  onDelete={() => deleteTanamanItem(item.id, bidangId)}
                  confirmText="Hapus item tanaman ini?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            const result = await addTanamanItem(bidangId, formData);
            if (result?.error) toast.error(result.error);
            else {
              toast.success("Data disimpan");
              formRef.current?.reset();
            }
          })
        }
        className="mt-3 flex flex-wrap items-end gap-2"
      >
        <Input name="jenis" placeholder="Jenis tanaman" className="w-32" required />
        <Input name="kecil" type="number" placeholder="Kecil" className="w-20" />
        <Input name="sedang" type="number" placeholder="Sedang" className="w-20" />
        <Input name="besar" type="number" placeholder="Besar" className="w-20" />
        <Input name="jumlah" type="number" placeholder="Jumlah" className="w-20" />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </form>
    </div>
  );
}

export function BendaLainManager({ bidangId, items }: { bidangId: string; items: BendaLainItem[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase text-zinc-400 dark:text-zinc-500">
          <tr>
            <th className="pb-2">Jenis</th>
            <th className="pb-2">Jumlah</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-2">{item.jenis}</td>
              <td className="py-2">{item.jumlah ?? "-"}</td>
              <td className="py-2 text-right">
                <ConfirmDeleteButton
                  onDelete={() => deleteBendaLainItem(item.id, bidangId)}
                  confirmText="Hapus item ini?"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            const result = await addBendaLainItem(bidangId, formData);
            if (result?.error) toast.error(result.error);
            else {
              toast.success("Data disimpan");
              formRef.current?.reset();
            }
          })
        }
        className="mt-3 flex flex-wrap items-end gap-2"
      >
        <Input name="jenis" placeholder="Jenis benda" className="w-40" required />
        <Input name="jumlah" type="number" step="0.01" placeholder="Jumlah" className="w-28" />
        <Button type="submit" size="sm" variant="outline" disabled={pending}>
          <Plus className="h-4 w-4" /> Tambah
        </Button>
      </form>
    </div>
  );
}
