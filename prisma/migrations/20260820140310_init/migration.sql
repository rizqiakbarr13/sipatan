-- CreateEnum
CREATE TYPE "SanggahanStatus" AS ENUM ('DITERIMA', 'DIVERIFIKASI', 'DITINDAKLANJUTI', 'DITERIMA_SAH', 'DITOLAK', 'SELESAI');

-- CreateEnum
CREATE TYPE "KategoriDokumen" AS ENUM ('DAFTAR_NOMINATIF', 'PENGUMUMAN', 'PETA_BIDANG', 'SK_PENETAPAN_LOKASI', 'SOP', 'BERITA_ACARA', 'LAINNYA');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "namaProyek" TEXT NOT NULL,
    "nomorPeng" TEXT NOT NULL,
    "tanggalPeng" TIMESTAMP(3) NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kota" TEXT NOT NULL,
    "provinsi" TEXT NOT NULL,
    "masaSanggahMulai" TIMESTAMP(3),
    "masaSanggahSelesai" TIMESTAMP(3),
    "deskripsi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bidang" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "noUrut" INTEGER NOT NULL,
    "noPetaBidang" TEXT,
    "namaPemilik" TEXT NOT NULL,
    "tanggalLahir" TEXT,
    "pekerjaan" TEXT,
    "alamat" TEXT,
    "nik" TEXT,
    "nib" TEXT,
    "rtRw" TEXT,
    "danomNo" TEXT,
    "luasSesuaiAlasHak" DOUBLE PRECISION,
    "luasHasilUkur" DOUBLE PRECISION,
    "nisTerkena" TEXT,
    "luasKena" DOUBLE PRECISION,
    "nisSisa" TEXT,
    "luasSisa" DOUBLE PRECISION,
    "suratTandaBukti" TEXT,
    "bangunanRingkas" TEXT,
    "tanamanRingkas" TEXT,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BangunanItem" (
    "id" TEXT NOT NULL,
    "bidangId" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION,
    "satuan" TEXT,

    CONSTRAINT "BangunanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TanamanItem" (
    "id" TEXT NOT NULL,
    "bidangId" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "kecil" INTEGER,
    "sedang" INTEGER,
    "besar" INTEGER,
    "jumlah" INTEGER,

    CONSTRAINT "TanamanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sanggahan" (
    "id" TEXT NOT NULL,
    "nomorTiket" TEXT NOT NULL,
    "bidangId" TEXT,
    "dokumenId" TEXT,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "alasHak" TEXT,
    "noDanom" TEXT,
    "noPetaBidang" TEXT,
    "noNis" TEXT,
    "kontakEmail" TEXT,
    "kontakHp" TEXT,
    "isiSanggahan" TEXT NOT NULL,
    "lampiranUrl" TEXT,
    "status" "SanggahanStatus" NOT NULL DEFAULT 'DITERIMA',
    "catatanAdmin" TEXT,
    "tampilPublik" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sanggahan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanggahanLog" (
    "id" TEXT NOT NULL,
    "sanggahanId" TEXT NOT NULL,
    "statusLama" TEXT,
    "statusBaru" TEXT NOT NULL,
    "catatan" TEXT,
    "olehAdmin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SanggahanLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOPDoc" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "fileUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SOPDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengumuman" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "lampiranUrl" TEXT,
    "tanggalTerbit" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengumuman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DokumenPublikasi" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "kategori" "KategoriDokumen" NOT NULL DEFAULT 'DAFTAR_NOMINATIF',
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "nomorSurat" TEXT,
    "tanggalDokumen" TIMESTAMP(3),
    "tanggalUpload" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sanggahanDibuka" BOOLEAN NOT NULL DEFAULT true,
    "jumlahUnduhan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DokumenPublikasi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bidang_projectId_noUrut_key" ON "Bidang"("projectId", "noUrut");

-- CreateIndex
CREATE UNIQUE INDEX "Sanggahan_nomorTiket_key" ON "Sanggahan"("nomorTiket");

-- CreateIndex
CREATE INDEX "Sanggahan_bidangId_idx" ON "Sanggahan"("bidangId");

-- CreateIndex
CREATE INDEX "Sanggahan_dokumenId_idx" ON "Sanggahan"("dokumenId");

-- CreateIndex
CREATE INDEX "Sanggahan_status_idx" ON "Sanggahan"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SOPDoc_slug_key" ON "SOPDoc"("slug");

-- CreateIndex
CREATE INDEX "DokumenPublikasi_kategori_idx" ON "DokumenPublikasi"("kategori");

-- CreateIndex
CREATE INDEX "DokumenPublikasi_published_idx" ON "DokumenPublikasi"("published");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Bidang" ADD CONSTRAINT "Bidang_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BangunanItem" ADD CONSTRAINT "BangunanItem_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TanamanItem" ADD CONSTRAINT "TanamanItem_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanggahan" ADD CONSTRAINT "Sanggahan_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sanggahan" ADD CONSTRAINT "Sanggahan_dokumenId_fkey" FOREIGN KEY ("dokumenId") REFERENCES "DokumenPublikasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanggahanLog" ADD CONSTRAINT "SanggahanLog_sanggahanId_fkey" FOREIGN KEY ("sanggahanId") REFERENCES "Sanggahan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumenPublikasi" ADD CONSTRAINT "DokumenPublikasi_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
