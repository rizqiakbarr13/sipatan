-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "dokumenTerkaitId" TEXT,
ADD COLUMN     "linkDataNominatif" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_dokumenTerkaitId_fkey" FOREIGN KEY ("dokumenTerkaitId") REFERENCES "DokumenPublikasi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
