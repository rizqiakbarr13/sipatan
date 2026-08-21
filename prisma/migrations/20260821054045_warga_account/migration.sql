-- AlterTable
ALTER TABLE "Sanggahan" ADD COLUMN     "wargaId" TEXT;

-- CreateTable
CREATE TABLE "Warga" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nik" TEXT,
    "noHp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Warga_email_key" ON "Warga"("email");

-- CreateIndex
CREATE INDEX "Sanggahan_wargaId_idx" ON "Sanggahan"("wargaId");

-- AddForeignKey
ALTER TABLE "Sanggahan" ADD CONSTRAINT "Sanggahan_wargaId_fkey" FOREIGN KEY ("wargaId") REFERENCES "Warga"("id") ON DELETE SET NULL ON UPDATE CASCADE;
