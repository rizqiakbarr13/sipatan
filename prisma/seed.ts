import "dotenv/config";
import { PrismaClient, KategoriDokumen, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { getMasaSanggahRange } from "../src/lib/date-utils";
import { validateNominatifRow, isBlankTemplateRow } from "../src/lib/nominatif-csv";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedProject() {
  const nomorPeng = "10/Peng-10.27/VII/2026";
  const existing = await prisma.project.findFirst({ where: { nomorPeng } });
  if (existing) return existing;

  const tanggalPeng = new Date("2026-07-31T00:00:00.000Z");
  const { mulai, selesai } = getMasaSanggahRange(tanggalPeng);

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
      masaSanggahMulai: mulai,
      masaSanggahSelesai: selesai,
      deskripsi:
        "Pengadaan tanah untuk kepentingan umum dalam rangka pembangunan pelebaran Simpang Parung Bingung dan ruas jalan terkait di Kecamatan Pancoran Mas & Sawangan, Kota Depok, Jawa Barat, sesuai Daftar Nominatif Nomor 10/Peng-10.27/VII/2026 tanggal 31 Juli 2026.",
    },
  });
}

async function seedProjectDua() {
  const nomorPeng = "22/Peng-10.27/VIII/2026";
  const existing = await prisma.project.findFirst({ where: { nomorPeng } });
  if (existing) return existing;

  const tanggalPeng = new Date("2026-08-14T00:00:00.000Z");
  const { mulai, selesai } = getMasaSanggahRange(tanggalPeng);

  return prisma.project.create({
    data: {
      namaProyek: "Pembangunan Jalan Lingkar Cinere–Cimanggis",
      nomorPeng,
      tanggalPeng,
      kelurahan: "Meruyung",
      kecamatan: "Limo",
      kota: "Kota Depok",
      provinsi: "Jawa Barat",
      masaSanggahMulai: mulai,
      masaSanggahSelesai: selesai,
      deskripsi:
        "Pengadaan tanah untuk kepentingan umum dalam rangka pembangunan Jalan Lingkar Cinere–Cimanggis di Kecamatan Limo, Kota Depok, Jawa Barat, sesuai Daftar Nominatif Nomor 22/Peng-10.27/VIII/2026 tanggal 14 Agustus 2026.",
    },
  });
}

async function seedBidangProjectDua(projectId: string) {
  const rows = [
    { noUrut: 1, namaPemilik: "Suherman Wijaya", nik: "3276010101800001", suratTandaBukti: "SHM No. 2211", luasSesuaiAlasHak: 210, luasHasilUkur: 208, luasKena: 95, luasSisa: 113 },
    { noUrut: 2, namaPemilik: "Ratna Kusumawati", nik: "3276010203810002", suratTandaBukti: "SHM No. 2212", luasSesuaiAlasHak: 180, luasHasilUkur: 179, luasKena: 60, luasSisa: 119 },
    { noUrut: 3, namaPemilik: "Bambang Setiawan", nik: "3276010304820003", suratTandaBukti: "SHGB No. 445", luasSesuaiAlasHak: 320, luasHasilUkur: 318, luasKena: 150, luasSisa: 168 },
    { noUrut: 4, namaPemilik: "Dewi Anggraini", nik: "3276010405830004", suratTandaBukti: "SHM No. 2214", luasSesuaiAlasHak: 145, luasHasilUkur: 145, luasKena: 70, luasSisa: 75 },
    { noUrut: 5, namaPemilik: "Agus Purnomo", nik: "3276010506840005", suratTandaBukti: "SHGB No. 446", luasSesuaiAlasHak: 260, luasHasilUkur: 255, luasKena: 110, luasSisa: 145 },
    { noUrut: 6, namaPemilik: "Siti Marlina", nik: "3276010607850006", suratTandaBukti: "SHM No. 2216", luasSesuaiAlasHak: 190, luasHasilUkur: 190, luasKena: 85, luasSisa: 105 },
    { noUrut: 7, namaPemilik: "Hendra Gunawan", nik: "3276010708860007", suratTandaBukti: "SHP No. 88", luasSesuaiAlasHak: 400, luasHasilUkur: 396, luasKena: 200, luasSisa: 196 },
  ];

  for (const row of rows) {
    const already = await prisma.bidang.findUnique({
      where: { projectId_noUrut: { projectId, noUrut: row.noUrut } },
    });
    if (already) continue;

    await prisma.bidang.create({
      data: {
        projectId,
        noUrut: row.noUrut,
        namaPemilik: row.namaPemilik,
        nik: row.nik,
        pekerjaan: "Wiraswasta",
        alamat: `Jl. Cinere Raya No. ${row.noUrut}, Kel. Meruyung, Kec. Limo, Kota Depok`,
        letakKelurahan: "Meruyung",
        letakKecamatan: "Limo",
        suratTandaBukti: row.suratTandaBukti,
        luasSesuaiAlasHak: row.luasSesuaiAlasHak,
        luasHasilUkur: row.luasHasilUkur,
        luasKena: row.luasKena,
        luasSisa: row.luasSisa,
      },
    });
  }
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
        letakKelurahan: data.letakKelurahan,
        letakKecamatan: data.letakKecamatan,
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
        "Daftar nominatif pihak yang berhak dan luasan tanah, bangunan, serta tanaman yang terkena pengadaan tanah untuk pelebaran Simpang Parung Bingung. NIK, tempat/tanggal lahir, pekerjaan, dan alamat pemilik ditutup sebagian sebelum dipublikasikan.",
      kategori: KategoriDokumen.DAFTAR_NOMINATIF,
      fileUrl: "/dokumen-resmi/daftar-nominatif-10-peng-10-27-vii-2026-masked.pdf",
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
    {
      judul: "Formulir Sanggahan Data Nominatif (Cetak/Manual)",
      deskripsi:
        "Formulir sanggahan resmi untuk diisi dan diserahkan secara manual/cetak bagi masyarakat yang tidak mengajukan sanggahan secara daring.",
      kategori: KategoriDokumen.LAINNYA,
      fileUrl: "/dokumen-resmi/formulir-sanggahan-cetak.pdf",
      fileName: "Formulir-Sanggahan-Data-Nominatif.pdf",
      fileType: "application/pdf",
      nomorSurat: "10/Peng-10.27/VII/2026-FORM",
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

async function seedDokumenPublikasiDua(projectId: string) {
  const items = [
    {
      judul: "Daftar Nominatif Nomor 22/Peng-10.27/VIII/2026",
      deskripsi:
        "Daftar nominatif pihak yang berhak dan luasan tanah yang terkena pengadaan tanah untuk Jalan Lingkar Cinere–Cimanggis.",
      kategori: KategoriDokumen.DAFTAR_NOMINATIF,
      fileUrl: "/dokumen-contoh/pengumuman-contoh.pdf",
      fileName: "Daftar-Nominatif-22-Peng-10.27-VIII-2026.pdf",
      fileType: "application/pdf",
      nomorSurat: "22/Peng-10.27/VIII/2026",
      tanggalDokumen: new Date("2026-08-14T00:00:00.000Z"),
    },
    {
      judul: "Pengumuman Masa Sanggah Jalan Lingkar Cinere–Cimanggis",
      deskripsi: "Pengumuman resmi jadwal dan tata cara pengajuan sanggahan atas data nominatif proyek ini.",
      kategori: KategoriDokumen.PENGUMUMAN,
      fileUrl: "/dokumen-contoh/pengumuman-contoh.pdf",
      fileName: "Pengumuman-Masa-Sanggah-Cinere-Cimanggis.pdf",
      fileType: "application/pdf",
      nomorSurat: "22/Peng-10.27/VIII/2026",
      tanggalDokumen: new Date("2026-08-14T00:00:00.000Z"),
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

async function seedPengumumanDua(projectId: string) {
  const daftarNominatif = await prisma.dokumenPublikasi.findFirst({
    where: { kategori: KategoriDokumen.DAFTAR_NOMINATIF, nomorSurat: "22/Peng-10.27/VIII/2026" },
  });

  const items = [
    {
      judul: "Pengumuman Data Nominatif Jalan Lingkar Cinere–Cimanggis",
      konten:
        "Panitia Pengadaan Tanah Kota Depok mengumumkan Daftar Nominatif Nomor 22/Peng-10.27/VIII/2026 tanggal 14 Agustus 2026 untuk kegiatan pengadaan tanah bagi pembangunan Jalan Lingkar Cinere–Cimanggis. Masyarakat yang berkepentingan dapat memeriksa data pada halaman Data Nominatif dan mengajukan sanggahan dalam masa sanggah yang ditentukan.",
      tanggalTerbit: new Date("2026-08-14T00:00:00.000Z"),
      sanggahanDibuka: true,
      dokumenTerkaitId: daftarNominatif?.id,
      linkDataNominatif: true,
    },
    {
      judul: "Jadwal Konsultasi Publik Jalan Lingkar Cinere–Cimanggis",
      konten:
        "Panitia mengundang pihak yang berhak untuk menghadiri konsultasi publik terkait rencana pembangunan Jalan Lingkar Cinere–Cimanggis di Kantor Kelurahan Meruyung sesuai jadwal yang akan diinformasikan lebih lanjut.",
      tanggalTerbit: new Date("2026-08-19T00:00:00.000Z"),
      sanggahanDibuka: false,
    },
  ];

  for (const item of items) {
    const existing = await prisma.pengumuman.findFirst({ where: { judul: item.judul } });
    if (existing) continue;
    await prisma.pengumuman.create({ data: { ...item, projectId, published: true } });
  }
}

async function seedPengumuman(projectId: string) {
  const daftarNominatif = await prisma.dokumenPublikasi.findFirst({
    where: { kategori: KategoriDokumen.DAFTAR_NOMINATIF, nomorSurat: "10/Peng-10.27/VII/2026" },
  });

  const items = [
    {
      judul: "Pengumuman Data Nominatif Pengadaan Tanah Simpang Parung Bingung",
      konten:
        "Panitia Pengadaan Tanah Kota Depok mengumumkan Daftar Nominatif Nomor 10/Peng-10.27/VII/2026 tanggal 31 Juli 2026 untuk kegiatan pengadaan tanah bagi pembangunan pelebaran Simpang Parung Bingung. Masyarakat yang berkepentingan dapat memeriksa data pada halaman Data Nominatif dan mengajukan sanggahan dalam masa sanggah yang ditentukan.",
      tanggalTerbit: new Date("2026-07-31T00:00:00.000Z"),
      sanggahanDibuka: false,
      dokumenTerkaitId: daftarNominatif?.id,
      linkDataNominatif: true,
    },
    {
      judul: "Hasil Penilaian Appraisal Independen",
      konten:
        "Panitia mengumumkan hasil penilaian besaran ganti kerugian oleh Kantor Jasa Penilai Publik (Appraisal) independen untuk seluruh bidang tanah, bangunan, dan tanaman yang terkena dampak. Hasil penilaian menjadi dasar musyawarah penetapan bentuk ganti kerugian bersama pihak yang berhak.",
      tanggalTerbit: new Date("2026-08-05T00:00:00.000Z"),
      lampiranUrl: "/dokumen-contoh/pengumuman-contoh.pdf",
      sanggahanDibuka: false,
    },
    {
      judul: "Jadwal Pembayaran Ganti Kerugian Tahap I",
      konten:
        "Pembayaran ganti kerugian tahap I akan dilaksanakan mulai minggu ketiga Agustus 2026 bagi pihak yang berhak yang telah menandatangani berita acara kesepakatan bentuk ganti kerugian. Pembayaran dilakukan melalui rekening bank yang telah didaftarkan pada saat musyawarah.",
      tanggalTerbit: new Date("2026-08-10T00:00:00.000Z"),
      sanggahanDibuka: false,
    },
    {
      judul: "Undangan Musyawarah Penetapan Bentuk Ganti Kerugian",
      konten:
        "Panitia mengundang seluruh pihak yang berhak sebagaimana tercantum dalam Daftar Nominatif untuk menghadiri musyawarah penetapan bentuk ganti kerugian. Musyawarah dilaksanakan di Kantor Kelurahan Rangkapan Jaya Baru sesuai jadwal yang akan diinformasikan melalui surat undangan resmi.",
      tanggalTerbit: new Date("2026-08-18T00:00:00.000Z"),
      sanggahanDibuka: false,
    },
    {
      judul: "Perpanjangan Kanal Sanggahan Data Nominatif",
      konten:
        "Menindaklanjuti masukan masyarakat, Panitia membuka kembali kanal sanggahan atas Daftar Nominatif Nomor 10/Peng-10.27/VII/2026. Masyarakat yang datanya belum sesuai dapat mengajukan sanggahan langsung melalui pengumuman ini, data bidang terkait, atau dokumen Daftar Nominatif.",
      tanggalTerbit: new Date("2026-08-20T00:00:00.000Z"),
      sanggahanDibuka: true,
      dokumenTerkaitId: daftarNominatif?.id,
      linkDataNominatif: true,
    },
  ];

  for (const item of items) {
    const existing = await prisma.pengumuman.findFirst({ where: { judul: item.judul } });
    if (existing) {
      // Backfill projectId untuk baris lama yang dibuat sebelum kolom ini ada.
      if (!existing.projectId) {
        await prisma.pengumuman.update({ where: { id: existing.id }, data: { projectId } });
      }
      continue;
    }
    await prisma.pengumuman.create({ data: { ...item, projectId, published: true } });
  }
}

async function seedGaleriFoto() {
  const items = [
    { judul: "Pengukuran Bidang Tanah Terdampak", fileUrl: "/galeri-contoh/01-pengukuran.jpg" },
    { judul: "Sosialisasi kepada Warga Terdampak", fileUrl: "/galeri-contoh/02-sosialisasi.jpg" },
    { judul: "Musyawarah Penetapan Bentuk Ganti Kerugian", fileUrl: "/galeri-contoh/03-musyawarah.jpg" },
    { judul: "Verifikasi Berkas Kepemilikan Tanah", fileUrl: "/galeri-contoh/04-verifikasi.jpg" },
    { judul: "Penyerahan Dokumen Pengumuman", fileUrl: "/galeri-contoh/05-penyerahan.jpg" },
    { judul: "Rapat Koordinasi Tim Pelaksana", fileUrl: "/galeri-contoh/06-rapat.jpg" },
  ];

  for (const item of items) {
    const existing = await prisma.galeriFoto.findFirst({ where: { judul: item.judul } });
    if (existing) continue;

    let fileSize: number | undefined;
    try {
      fileSize = fs.statSync(path.join(process.cwd(), "public", item.fileUrl)).size;
    } catch {
      fileSize = undefined;
    }

    await prisma.galeriFoto.create({
      data: {
        judul: item.judul,
        fileUrl: item.fileUrl,
        fileName: item.fileUrl.split("/").pop() ?? item.fileUrl,
        fileType: "image/jpeg",
        fileSize,
        published: true,
      },
    });
  }
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
  const projectDua = await seedProjectDua();
  await seedBidangProjectDua(projectDua.id);
  await seedSop();
  await seedDokumenPublikasi(project.id);
  await seedDokumenPublikasiDua(projectDua.id);
  await seedPengumuman(project.id);
  await seedPengumumanDua(projectDua.id);
  await seedGaleriFoto();
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
