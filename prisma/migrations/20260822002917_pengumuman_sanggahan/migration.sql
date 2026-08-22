-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "sanggahanDibuka" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Sanggahan" ADD COLUMN     "pengumumanId" TEXT;

-- CreateIndex
CREATE INDEX "Sanggahan_pengumumanId_idx" ON "Sanggahan"("pengumumanId");

-- AddForeignKey
ALTER TABLE "Sanggahan" ADD CONSTRAINT "Sanggahan_pengumumanId_fkey" FOREIGN KEY ("pengumumanId") REFERENCES "Pengumuman"("id") ON DELETE SET NULL ON UPDATE CASCADE;
