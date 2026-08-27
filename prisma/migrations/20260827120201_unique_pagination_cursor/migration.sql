/*
  Warnings:

  - A unique constraint covering the columns `[createdAt,id]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Document_createdAt_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Document_createdAt_id_key" ON "Document"("createdAt", "id");
