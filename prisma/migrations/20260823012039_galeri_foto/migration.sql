-- CreateTable
CREATE TABLE "GaleriFoto" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GaleriFoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GaleriFoto_published_idx" ON "GaleriFoto"("published");
