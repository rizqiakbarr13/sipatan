-- CreateTable
CREATE TABLE "SanggahanLampiran" (
    "id" TEXT NOT NULL,
    "sanggahanId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SanggahanLampiran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanggahanBuktiTambahan" (
    "id" TEXT NOT NULL,
    "sanggahanId" TEXT NOT NULL,
    "jenisBukti" TEXT NOT NULL,
    "keterangan" TEXT,
    "urutan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SanggahanBuktiTambahan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SanggahanLampiran_sanggahanId_idx" ON "SanggahanLampiran"("sanggahanId");

-- CreateIndex
CREATE INDEX "SanggahanBuktiTambahan_sanggahanId_idx" ON "SanggahanBuktiTambahan"("sanggahanId");

-- AddForeignKey
ALTER TABLE "SanggahanLampiran" ADD CONSTRAINT "SanggahanLampiran_sanggahanId_fkey" FOREIGN KEY ("sanggahanId") REFERENCES "Sanggahan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SanggahanBuktiTambahan" ADD CONSTRAINT "SanggahanBuktiTambahan_sanggahanId_fkey" FOREIGN KEY ("sanggahanId") REFERENCES "Sanggahan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
