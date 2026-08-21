import "dotenv/config";
import { PrismaClient, KategoriDokumen, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { addBusinessDays } from "../src/lib/masa-sanggah";
import { validateNominatifRow, isBlankTemplateRow } from "../src/lib/nominatif-csv";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const MASA_SANGGAH_HARI_KERJA = 14;

async function seedProject() {
  const nomorPeng = "10/Peng-10.27/VII/2026";
  const existing = await prisma.project.findFirst({ where: { nomorPeng } });
  if (existing) return existing;

  const tanggalPeng = new Date("2026-07-31T00:00:00.000Z");
  const masaSanggahSelesai = addBusinessDays(tanggalPeng, MASA_SANGGAH_HARI_KERJA);

  return prisma.project.create({
    data: {
      namaProyek:
        "Pelebaran Simpang Parung Bingung, Jalan Raya Sawangan, Jalan Raya Muchtar, Jalan Meruyung Raya",
      nomorPeng,
      tanggalPeng,
      kelurahan: "Rangkapan Jaya Baru",
      kecamatan: "Pancoran Mas & Sawangan",
      kota: "Kota Depok",
      provinsi: "Jawa Barat",
      masaSanggahMulai: tanggalPeng,
      masaSanggahSelesai,
      deskripsi:
        "Pengadaan tanah untuk kepentingan umum dalam rangka pembangunan pelebaran Simpang Parung Bingung dan ruas jalan terkait di Kecamatan Pancoran Mas & Sawangan, Kota Depok, Jawa Barat, sesuai Daftar Nominatif Nomor 10/Peng-10.27/VII/2026 tanggal 31 Juli 2026.",
    },
  });
}

async function seedBidangDariCsv(projectId: string) {
  const csvPath = path.join(process.cwd(), "data", "nominatif.csv");
  const csvContent = fs.readFileSync(csvPath, "utf8");
  const parsed = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  let dibuat = 0;
  for (let i = 0; i < parsed.data.length; i++) {
    const raw = parsed.data[i];
    if (isBlankTemplateRow(raw)) continue;

    const result = validateNominatifRow(raw, i + 2);
    if (!result.ok) {
      console.warn(`Baris CSV #${result.line} dilewati:`, result.errors.join("; "));
      continue;
    }

    const { data } = result;
    const already = await prisma.bidang.findUnique({
      where: { projectId_noUrut: { projectId, noUrut: data.noUrut } },
    });
    if (already) continue;

    await prisma.bidang.create({
      data: {
        projectId,
        noUrut: data.noUrut,
        noPetaBidang: data.noPetaBidang,
        namaPemilik: data.namaPemilik,
        tanggalLahir: data.tanggalLahir,
        pekerjaan: data.pekerjaan,
        alamat: data.alamat,
        nik: data.nik,
        nib: data.nib,
        rtRw: data.rtRw,
        danomNo: data.danomNo,
        luasSesuaiAlasHak: data.luasSesuaiAlasHak,
        luasHasilUkur: data.luasHasilUkur,
        nisTerkena: data.nisTerkena,
        luasKena: data.luasKena,
        nisSisa: data.nisSisa,
        luasSisa: data.luasSisa,
        suratTandaBukti: data.suratTandaBukti,
        bangunanRingkas: data.bangunanRingkas,
        tanamanRingkas: data.tanamanRingkas,
        keterangan: data.keterangan,
      },
    });
    dibuat++;
  }
  console.log(`Bidang dibuat dari CSV: ${dibuat}`);
}

async function seedRincianAsetContoh(projectId: string) {
  // Tambahkan rincian bangunan & tanaman terstruktur untuk beberapa bidang contoh
  // (selain ringkasan teks bangunanRingkas/tanamanRingkas dari CSV).
  const rincian: Record<
    number,
    { bangunan?: { jenis: string; jumlah: number; satuan: string }[]; tanaman?: { jenis: string; kecil?: number; sedang?: number; besar?: number; jumlah?: number }[] }
  > = {
    2: {
      bangunan: [
        { jenis: "Bangunan Permanen", jumlah: 20, satuan: "m2" },
        { jenis: "Pagar Tembok", jumlah: 8, satuan: "M1" },
      ],
      tanaman: [{ jenis: "Mangga", sedang: 1, jumlah: 1 }],
    },
    3: {
      bangunan: [{ jenis: "Bangunan Permanen", jumlah: 45, satuan: "m2" }],
      tanaman: [
        { jenis: "Rambutan", besar: 1, jumlah: 1 },
        { jenis: "Mangga", kecil: 2, jumlah: 2 },
      ],
    },
    8: {
      bangunan: [
        { jenis: "Bangunan Permanen Ruko 2 Lantai", jumlah: 200, satuan: "m2" },
        { jenis: "Pagar Tembok", jumlah: 25, satuan: "M1" },
      ],
    },
  };

  for (const [noUrutStr, item] of Object.entries(rincian)) {
    const noUrut = Number(noUrutStr);
    const bidang = await prisma.bidang.findUnique({
      where: { projectId_noUrut: { projectId, noUrut } },
    });
    if (!bidang) continue;

    const sudahAda = await prisma.bangunanItem.findFirst({ where: { bidangId: bidang.id } });
    if (sudahAda) continue;

    if (item.bangunan) {
      await prisma.bangunanItem.createMany({
        data: item.bangunan.map((b) => ({ ...b, bidangId: bidang.id })),
      });
    }
    if (item.tanaman) {
      await prisma.tanamanItem.createMany({
        data: item.tanaman.map((t) => ({ ...t, bidangId: bidang.id })),
      });
    }
  }
}

async function seedSop() {
  const tahapan = [
    {
      urutan: 1,
      judul: "Perencanaan Pengadaan Tanah",
      slug: "perencanaan",
      konten:
        "Instansi yang memerlukan tanah menyusun dokumen perencanaan pengadaan tanah berdasarkan studi kelayakan, yang memuat maksud dan tujuan, letak dan luas tanah, gambaran umum status tanah, perkiraan jangka waktu, perkiraan nilai tanah, dan rencana penganggaran.",
    },
    {
      urutan: 2,
      judul: "Penetapan Lokasi",
      slug: "penetapan-lokasi",
      konten:
        "Berdasarkan dokumen perencanaan, dilakukan konsultasi publik dengan pihak yang berhak dan masyarakat terdampak, dilanjutkan dengan penerbitan Surat Keputusan (SK) Penetapan Lokasi pembangunan.",
    },
    {
      urutan: 3,
      judul: "Pengumuman Data Nominatif",
      slug: "pengumuman-data-nominatif",
      konten:
        "Panitia pengadaan tanah mengumumkan daftar nominatif berisi data pihak yang berhak dan luasan tanah, bangunan, dan tanaman yang terkena dampak pembangunan, agar dapat diketahui dan diperiksa kebenarannya oleh masyarakat.",
    },
    {
      urutan: 4,
      judul: "Masa Sanggah",
      slug: "masa-sanggah",
      konten:
        "Masyarakat/pihak yang berhak diberi kesempatan mengajukan sanggahan atas data nominatif dalam jangka waktu 14 (empat belas) hari kerja sejak tanggal pengumuman, melalui kanal resmi yang disediakan.",
    },
    {
      urutan: 5,
      judul: "Verifikasi Sanggahan",
      slug: "verifikasi-sanggahan",
      konten:
        "Setiap sanggahan yang masuk diverifikasi oleh panitia dan/atau instansi terkait untuk memastikan kesesuaian data, kemudian ditindaklanjuti dengan koreksi data bila terbukti benar.",
    },
    {
      urutan: 6,
      judul: "Penetapan Hasil Inventarisasi",
      slug: "penetapan-hasil-inventarisasi",
      konten:
        "Setelah masa sanggah berakhir dan seluruh sanggahan diproses, panitia menetapkan hasil inventarisasi dan identifikasi sebagai dasar penilaian ganti kerugian.",
    },
    {
      urutan: 7,
      judul: "Musyawarah Penetapan Ganti Kerugian",
      slug: "musyawarah-ganti-rugi",
      konten:
        "Panitia melaksanakan musyawarah bersama pihak yang berhak untuk menetapkan bentuk dan besaran ganti kerugian berdasarkan hasil penilaian oleh penilai independen.",
    },
    {
      urutan: 8,
      judul: "Pemberian Ganti Kerugian",
      slug: "pemberian-ganti-kerugian",
      konten:
        "Ganti kerugian diberikan langsung kepada pihak yang berhak sesuai bentuk yang disepakati (uang, tanah pengganti, permukiman kembali, kepemilikan saham, atau bentuk lain).",
    },
    {
      urutan: 9,
      judul: "Pelepasan Hak dan Penyerahan Tanah",
      slug: "pelepasan-hak",
      konten:
        "Setelah ganti kerugian diberikan, pihak yang berhak melepaskan hak atas tanahnya dan tanah diserahkan kepada instansi yang memerlukan untuk selanjutnya digunakan sesuai rencana pembangunan.",
    },
  ];

  for (const t of tahapan) {
    await prisma.sOPDoc.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
  }
}

async function seedDokumenPublikasi(projectId: string) {
  const items = [
    {
      judul: "Daftar Nominatif Nomor 10/Peng-10.27/VII/2026",
      deskripsi:
        "Daftar nominatif pihak yang berhak dan luasan tanah, bangunan, serta tanaman yang terkena pengadaan tanah untuk pelebaran Simpang Parung Bingung.",
      kategori: KategoriDokumen.DAFTAR_NOMINATIF,
      fileUrl: "/dokumen-contoh/daftar-nominatif-contoh.pdf",
      fileName: "Daftar-Nominatif-10-Peng-10.27-VII-2026.pdf",
      fileType: "application/pdf",
      nomorSurat: "10/Peng-10.27/VII/2026",
      tanggalDokumen: new Date("2026-07-31T00:00:00.000Z"),
    },
    {
      judul: "Pengumuman Masa Sanggah Data Nominatif",
      deskripsi:
        "Pengumuman resmi mengenai jadwal dan tata cara pengajuan sanggahan atas data nominatif kepada masyarakat terdampak.",
      kategori: KategoriDokumen.PENGUMUMAN,
      fileUrl: "/dokumen-contoh/pengumuman-contoh.pdf",
      fileName: "Pengumuman-Masa-Sanggah.pdf",
      fileType: "application/pdf",
      nomorSurat: "10/Peng-10.27/VII/2026",
      tanggalDokumen: new Date("2026-07-31T00:00:00.000Z"),
    },
  ];

  for (const item of items) {
    const existing = await prisma.dokumenPublikasi.findFirst({
      where: { nomorSurat: item.nomorSurat, kategori: item.kategori },
    });
    if (existing) continue;

    let fileSize: number | undefined;
    try {
      const stat = fs.statSync(path.join(process.cwd(), "public", item.fileUrl));
      fileSize = stat.size;
    } catch {
      fileSize = undefined;
    }

    await prisma.dokumenPublikasi.create({
      data: { ...item, fileSize, projectId, sanggahanDibuka: true },
    });
  }
}

async function seedPengumuman() {
  const existing = await prisma.pengumuman.findFirst({
    where: { judul: "Pengumuman Data Nominatif Pengadaan Tanah Simpang Parung Bingung" },
  });
  if (existing) return;

  await prisma.pengumuman.create({
    data: {
      judul: "Pengumuman Data Nominatif Pengadaan Tanah Simpang Parung Bingung",
      konten:
        "Panitia Pengadaan Tanah Kota Depok mengumumkan Daftar Nominatif Nomor 10/Peng-10.27/VII/2026 tanggal 31 Juli 2026 untuk kegiatan pengadaan tanah bagi pembangunan pelebaran Simpang Parung Bingung. Masyarakat yang berkepentingan dapat memeriksa data pada halaman Data Nominatif dan mengajukan sanggahan dalam masa sanggah yang ditentukan.",
      tanggalTerbit: new Date("2026-07-31T00:00:00.000Z"),
      published: true,
    },
  });
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@dinas-pertanahan.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "GantiPassword123!";
  const nama = process.env.SEED_ADMIN_NAME || "Administrator";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return;

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { nama, email, password: hashed, role: Role.SUPER_ADMIN },
  });
  console.log(`Admin default dibuat: ${email}`);
}

async function main() {
  const project = await seedProject();
  await seedBidangDariCsv(project.id);
  await seedRincianAsetContoh(project.id);
  await seedSop();
  await seedDokumenPublikasi(project.id);
  await seedPengumuman();
  await seedAdmin();
  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
