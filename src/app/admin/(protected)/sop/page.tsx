import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SopRowActions } from "./row-actions";

export const dynamic = "force-dynamic";

export default async function AdminSopPage() {
  const list = await prisma.sOPDoc.findMany({ orderBy: { urutan: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Kelola SOP</h1>
          <p className="text-sm text-zinc-500">Tahapan proses pengadaan tanah.</p>
        </div>
        <Link href="/admin/sop/baru" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" /> Tambah
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Urutan</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Publish</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {list.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 text-zinc-600">{s.urutan}</td>
                <td className="px-4 py-3 font-medium text-zinc-900">{s.judul}</td>
                <td className="px-4 py-3 text-zinc-500">{s.slug}</td>
                <td className="px-4 py-3">
                  <SopRowActions id={s.id} published={s.published} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/sop/${s.id}`} className="text-emerald-700 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
