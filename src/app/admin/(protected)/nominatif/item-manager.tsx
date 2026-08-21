"use client";

import { useRef, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addBangunanItem,
  deleteBangunanItem,
  addTanamanItem,
  deleteTanamanItem,
} from "./actions";
import type { BangunanItem, TanamanItem } from "@prisma/client";

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
                <button
                  type="button"
                  onClick={() => startTransition(() => deleteBangunanItem(item.id, bidangId))}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            await addBangunanItem(bidangId, formData);
            formRef.current?.reset();
          })
        }
        className="mt-3 flex flex-wrap items-end gap-2"
      >
        <Input name="jenis" placeholder="Jenis bangunan" className="w-40" required />
        <Input name="jumlah" type="number" step="0.01" placeholder="Jumlah" className="w-28" />
        <Input name="satuan" placeholder="Satuan" className="w-24" />
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
                <button
                  type="button"
                  onClick={() => startTransition(() => deleteTanamanItem(item.id, bidangId))}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        ref={formRef}
        action={(formData) =>
          startTransition(async () => {
            await addTanamanItem(bidangId, formData);
            formRef.current?.reset();
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
