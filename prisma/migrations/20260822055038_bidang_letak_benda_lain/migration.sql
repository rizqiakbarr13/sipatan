-- AlterTable
ALTER TABLE "Bidang" ADD COLUMN     "letakKecamatan" TEXT,
ADD COLUMN     "letakKelurahan" TEXT;

-- CreateTable
CREATE TABLE "BendaLainItem" (
    "id" TEXT NOT NULL,
    "bidangId" TEXT NOT NULL,
    "jenis" TEXT NOT NULL,
    "jumlah" DOUBLE PRECISION,

    CONSTRAINT "BendaLainItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BendaLainItem" ADD CONSTRAINT "BendaLainItem_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
