"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPenuh, maskAngka } from "@/lib/mask";
import { toCsv } from "@/lib/csv-export";
import { useLocale } from "@/lib/i18n/client";

export interface NominatifRow {
  id: string;
  projectId: string;
  noUrut: number;
  namaPemilik: string;
  nik: string | null;
  nib: string | null;
  rtRw: string | null;
  luasSesuaiAlasHak: number | null;
  luasHasilUkur: number | null;
  luasKena: number | null;
  luasSisa: number | null;
  suratTandaBukti: string | null;
  keterangan: string | null;
}

function jenisAlasHak(suratTandaBukti: string | null): string {
  if (!suratTandaBukti) return "Lainnya";
  const s = suratTandaBukti.toUpperCase();
  if (s.includes("SHM")) return "SHM";
  if (s.includes("SHGB")) return "SHGB";
  if (s.includes("SHP")) return "SHP";
  return "Lainnya";
}

const columnHelper = createColumnHelper<NominatifRow>();

export function NominatifTable({ data }: { data: NominatifRow[] }) {
  const { dict } = useLocale();
  const [globalFilter, setGlobalFilter] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "noUrut", desc: false }]);

  const filteredByJenis = useMemo(() => {
    if (!jenisFilter) return data;
    return data.filter((r) => jenisAlasHak(r.suratTandaBukti) === jenisFilter);
  }, [data, jenisFilter]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("noUrut", {
        header: "No.",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("namaPemilik", {
        header: "Nama Pemilik",
        cell: (info) => (
          <Link
            href={`/data-nominatif/${info.row.original.noUrut}?p=${info.row.original.projectId}`}
            className="font-medium text-emerald-700 hover:underline"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor("nib", {
        header: "NIB",
        cell: (info) => maskAngka(info.getValue()),
      }),
      columnHelper.accessor("rtRw", {
        header: "RT/RW",
        cell: (info) => maskPenuh(info.getValue()),
      }),
      columnHelper.accessor("luasSesuaiAlasHak", {
        header: "Luas Alas Hak (m²)",
        cell: (info) => info.getValue()?.toLocaleString("id-ID") ?? "-",
      }),
      columnHelper.accessor("luasHasilUkur", {
        header: "Luas Hasil Ukur (m²)",
        cell: (info) => info.getValue()?.toLocaleString("id-ID") ?? "-",
      }),
      columnHelper.accessor("luasKena", {
        header: "Luas Terkena (m²)",
        cell: (info) => (
          <span className="font-medium text-amber-700">
            {info.getValue()?.toLocaleString("id-ID") ?? "-"}
          </span>
        ),
      }),
      columnHelper.accessor("luasSisa", {
        header: "Luas Sisa (m²)",
        cell: (info) => info.getValue()?.toLocaleString("id-ID") ?? "-",
      }),
      columnHelper.accessor("suratTandaBukti", {
        header: "Surat Tanda Bukti",
        cell: (info) => maskAngka(info.getValue()),
      }),
      columnHelper.accessor("keterangan", {
        header: "Keterangan",
        cell: (info) => (
          <span className="line-clamp-1 max-w-[200px]" title={info.getValue() ?? ""}>
            {info.getValue() || "-"}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredByJenis,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: (row, _columnId, value) => {
      const q = String(value).toLowerCase();
      const r = row.original;
      return (
        r.namaPemilik.toLowerCase().includes(q) ||
        (r.nib ?? "").toLowerCase().includes(q) ||
        String(r.noUrut).includes(q)
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  function handleExportCsv() {
    const rows = table.getFilteredRowModel().rows.map((r) => ({
      noUrut: r.original.noUrut,
      namaPemilik: r.original.namaPemilik,
      nik: maskPenuh(r.original.nik),
      nib: maskAngka(r.original.nib),
      rtRw: maskPenuh(r.original.rtRw),
      luasSesuaiAlasHak: r.original.luasSesuaiAlasHak ?? "",
      luasHasilUkur: r.original.luasHasilUkur ?? "",
      luasKena: r.original.luasKena ?? "",
      luasSisa: r.original.luasSisa ?? "",
      suratTandaBukti: maskAngka(r.original.suratTandaBukti),
      keterangan: r.original.keterangan ?? "",
    }));
    const csv = toCsv(
      [
        { key: "noUrut", label: "No. Urut" },
        { key: "namaPemilik", label: "Nama Pemilik" },
        { key: "nik", label: "NIK" },
        { key: "nib", label: "NIB" },
        { key: "rtRw", label: "RT/RW" },
        { key: "luasSesuaiAlasHak", label: "Luas Sesuai Alas Hak (m2)" },
        { key: "luasHasilUkur", label: "Luas Hasil Ukur (m2)" },
        { key: "luasKena", label: "Luas Terkena (m2)" },
        { key: "luasSisa", label: "Luas Sisa (m2)" },
        { key: "suratTandaBukti", label: "Surat Tanda Bukti" },
        { key: "keterangan", label: "Keterangan" },
      ],
      rows
    );
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data-nominatif.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={dict.nominatifTable.cariPlaceholder}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="">{dict.nominatifTable.semuaAlasHak}</option>
            <option value="SHM">SHM</option>
            <option value="SHGB">SHGB</option>
            <option value="SHP">SHP</option>
            <option value="Lainnya">Lainnya</option>
          </select>
          <Button variant="outline" onClick={handleExportCsv}>
            <Download className="h-4 w-4" /> {dict.nominatifTable.exportCsv}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="whitespace-nowrap px-3 py-2.5">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="flex items-center gap-1 hover:text-zinc-800 dark:hover:text-zinc-200"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-3 py-2.5 text-zinc-700 dark:text-zinc-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  {dict.nominatifTable.tidakAdaData}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          {dict.nominatifTable.menampilkan} {table.getRowModel().rows.length} {dict.nominatifTable.dari}{" "}
          {filteredByJenis.length} {dict.nominatifTable.bidang}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            {dict.nominatifTable.halaman} {table.getState().pagination.pageIndex + 1}{" "}
            {dict.nominatifTable.dari} {Math.max(1, table.getPageCount())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
