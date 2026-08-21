import { NextRequest, NextResponse } from "next/server";
import { getActiveProject } from "@/lib/project";
import { renderFormulirSanggahanPdf } from "@/lib/pdf/formulir-sanggahan";

export async function GET(request: NextRequest) {
  const project = await getActiveProject();
  const params = request.nextUrl.searchParams;

  const buffer = await renderFormulirSanggahanPdf({
    namaProyek: project?.namaProyek ?? "Pengadaan Tanah untuk Kepentingan Umum",
    nomorPeng: project?.nomorPeng ?? "-",
    prefill: {
      nama: params.get("nama") ?? undefined,
      nik: params.get("nik") ?? undefined,
      alasHak: params.get("alasHak") ?? undefined,
      noDanom: params.get("noDanom") ?? undefined,
      noPetaBidang: params.get("noPetaBidang") ?? undefined,
      noNis: params.get("noNis") ?? undefined,
      isiSanggahan: params.get("isiSanggahan") ?? undefined,
      nomorTiket: params.get("nomorTiket") ?? undefined,
    },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="Formulir-Sanggahan.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
