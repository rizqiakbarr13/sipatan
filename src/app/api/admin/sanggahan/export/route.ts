import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { toCsv } from "@/lib/csv-export";
import { SANGGAHAN_STATUS_LABEL } from "@/lib/labels";
import type { Prisma, SanggahanStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const status = params.get("status");
  const q = params.get("q");

  const where: Prisma.SanggahanWhereInput = {};
  if (status && status in SANGGAHAN_STATUS_LABEL) where.status = status as SanggahanStatus;
  if (q) {
    where.OR = [
      { nama: { contains: q, mode: "insensitive" } },
      { nomorTiket: { contains: q, mode: "insensitive" } },
    ];
  }

  const list = await prisma.sanggahan.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      bidang: { select: { noUrut: true, namaPemilik: true } },
      dokumen: { select: { judul: true } },
    },
  });

  const csv = toCsv(
    [
      { key: "nomorTiket", label: "Nomor Tiket" },
      { key: "nama", label: "Nama" },
      { key: "nik", label: "NIK" },
      { key: "kontakEmail", label: "Email" },
      { key: "kontakHp", label: "No. HP" },
      { key: "bidang", label: "Bidang Terkait" },
      { key: "dokumen", label: "Dokumen Terkait" },
      { key: "status", label: "Status" },
      { key: "isiSanggahan", label: "Isi Sanggahan" },
      { key: "catatanAdmin", label: "Catatan Admin" },
      { key: "tanggal", label: "Tanggal" },
    ],
    list.map((s) => ({
      nomorTiket: s.nomorTiket,
      nama: s.nama,
      nik: s.nik,
      kontakEmail: s.kontakEmail ?? "",
      kontakHp: s.kontakHp ?? "",
      bidang: s.bidang ? `No. ${s.bidang.noUrut} - ${s.bidang.namaPemilik}` : "",
      dokumen: s.dokumen?.judul ?? "",
      status: SANGGAHAN_STATUS_LABEL[s.status] ?? s.status,
      isiSanggahan: s.isiSanggahan,
      catatanAdmin: s.catatanAdmin ?? "",
      tanggal: s.createdAt.toISOString(),
    }))
  );

  return new NextResponse("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rekap-sanggahan.csv"`,
    },
  });
}
