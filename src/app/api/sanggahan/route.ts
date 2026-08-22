import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanggahanFormSchema } from "@/lib/validation/sanggahan";
import { generateNomorTiket } from "@/lib/nomor-tiket";
import { getWargaSession } from "@/lib/warga-session";
import { sendEmail, sanggahanKonfirmasiEmail } from "@/lib/email";
import {
  getStorageDriver,
  MAX_UPLOAD_SIZE_BYTES,
  ALLOWED_UPLOAD_TYPES,
} from "@/lib/storage";

// Rate limit sederhana in-memory per IP (cukup untuk single-instance; untuk
// deployment multi-instance gunakan solusi eksternal seperti Upstash Ratelimit.
const submissionLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Terlalu banyak pengajuan dari alamat ini. Silakan coba lagi nanti." },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const raw = {
    nama: formData.get("nama")?.toString() ?? "",
    nik: formData.get("nik")?.toString() ?? "",
    alasHak: formData.get("alasHak")?.toString() || undefined,
    noDanom: formData.get("noDanom")?.toString() || undefined,
    noPetaBidang: formData.get("noPetaBidang")?.toString() || undefined,
    noNis: formData.get("noNis")?.toString() || undefined,
    bidangId: formData.get("bidangId")?.toString() || undefined,
    dokumenId: formData.get("dokumenId")?.toString() || undefined,
    pengumumanId: formData.get("pengumumanId")?.toString() || undefined,
    kontakEmail: formData.get("kontakEmail")?.toString() || undefined,
    kontakHp: formData.get("kontakHp")?.toString() || undefined,
    isiSanggahan: formData.get("isiSanggahan")?.toString() ?? "",
    pernyataanBenar: formData.get("pernyataanBenar")?.toString() === "true",
  };

  const parsed = sanggahanFormSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Data tidak valid" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  let dokumen = null;
  if (data.dokumenId) {
    dokumen = await prisma.dokumenPublikasi.findUnique({ where: { id: data.dokumenId } });
    if (!dokumen) {
      return NextResponse.json({ error: "Dokumen terkait tidak ditemukan" }, { status: 400 });
    }
    if (!dokumen.sanggahanDibuka) {
      return NextResponse.json(
        { error: "Kanal sanggahan untuk dokumen ini sedang ditutup" },
        { status: 403 }
      );
    }
  }

  if (data.pengumumanId) {
    const pengumuman = await prisma.pengumuman.findUnique({ where: { id: data.pengumumanId } });
    if (!pengumuman) {
      return NextResponse.json({ error: "Pengumuman terkait tidak ditemukan" }, { status: 400 });
    }
    if (!pengumuman.sanggahanDibuka) {
      return NextResponse.json(
        { error: "Kanal sanggahan untuk pengumuman ini sedang ditutup" },
        { status: 403 }
      );
    }
  }

  if (data.bidangId) {
    const bidang = await prisma.bidang.findUnique({ where: { id: data.bidangId } });
    if (!bidang) {
      return NextResponse.json({ error: "Bidang terkait tidak ditemukan" }, { status: 400 });
    }
  }

  let lampiranUrl: string | undefined;
  const lampiran = formData.get("lampiran");
  if (lampiran instanceof File && lampiran.size > 0) {
    if (!ALLOWED_UPLOAD_TYPES.includes(lampiran.type)) {
      return NextResponse.json(
        { error: "Format lampiran harus PDF, JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }
    if (lampiran.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json({ error: "Ukuran lampiran melebihi batas maksimal" }, { status: 400 });
    }
    const buffer = Buffer.from(await lampiran.arrayBuffer());
    const saved = await getStorageDriver().save({
      buffer,
      filename: lampiran.name,
      contentType: lampiran.type,
      folder: "sanggahan",
    });
    lampiranUrl = saved.url;
  }

  const nomorTiket = await generateNomorTiket();

  const anonim = formData.get("anonim")?.toString() === "true";
  const wargaSession = anonim ? null : await getWargaSession();

  const sanggahan = await prisma.sanggahan.create({
    data: {
      nomorTiket,
      bidangId: data.bidangId || null,
      dokumenId: data.dokumenId || null,
      pengumumanId: data.pengumumanId || null,
      wargaId: wargaSession?.id || null,
      nama: data.nama,
      nik: data.nik,
      alasHak: data.alasHak,
      noDanom: data.noDanom,
      noPetaBidang: data.noPetaBidang,
      noNis: data.noNis,
      kontakEmail: data.kontakEmail || null,
      kontakHp: data.kontakHp || null,
      isiSanggahan: data.isiSanggahan,
      lampiranUrl,
      riwayat: {
        create: {
          statusLama: null,
          statusBaru: "DITERIMA",
          catatan: "Sanggahan diterima melalui formulir online.",
        },
      },
    },
  });

  if (data.kontakEmail) {
    const { subject, html } = sanggahanKonfirmasiEmail(sanggahan.nomorTiket);
    await sendEmail({ to: data.kontakEmail, subject, html });
  }

  return NextResponse.json({ nomorTiket: sanggahan.nomorTiket }, { status: 201 });
}
