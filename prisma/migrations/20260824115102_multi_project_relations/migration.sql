-- AlterTable
ALTER TABLE "Pengumuman" ADD COLUMN     "projectId" TEXT;

-- AlterTable (nullable first so existing rows can be backfilled before NOT NULL)
ALTER TABLE "Sanggahan" ADD COLUMN     "projectId" TEXT;

-- Backfill: derive projectId from the related bidang/dokumen where possible,
-- otherwise fall back to the oldest (first-created) project.
UPDATE "Sanggahan" s
SET "projectId" = COALESCE(
  (SELECT b."projectId" FROM "Bidang" b WHERE b.id = s."bidangId"),
  (SELECT d."projectId" FROM "DokumenPublikasi" d WHERE d.id = s."dokumenId"),
  (SELECT p.id FROM "Project" p ORDER BY p."createdAt" ASC LIMIT 1)
)
WHERE s."projectId" IS NULL;

-- AlterTable
ALTER TABLE "Sanggahan" ALTER COLUMN "projectId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Pengumuman_projectId_idx" ON "Pengumuman"("projectId");

-- CreateIndex
CREATE INDEX "Sanggahan_projectId_idx" ON "Sanggahan"("projectId");

-- AddForeignKey
ALTER TABLE "Sanggahan" ADD CONSTRAINT "Sanggahan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengumuman" ADD CONSTRAINT "Pengumuman_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
