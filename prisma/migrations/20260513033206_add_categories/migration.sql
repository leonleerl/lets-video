/*
  Warnings:

  - Added the required column `categoryId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverVideoId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_createdById_idx" ON "categories"("createdById");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "videos_categoryId_idx" ON "videos"("categoryId");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
