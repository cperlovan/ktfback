/*
  Warnings:

- A unique constraint covering the columns `[entityId]` on the table `entities` will be added. If there are existing duplicate values, this will fail.
- Added the required column `entityId` to the `entities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable (poblado seguro para filas existentes antes de exigir NOT NULL y UNIQUE)
ALTER TABLE "entities" ADD COLUMN IF NOT EXISTS "entityId" TEXT;
UPDATE "entities" SET "entityId" = 'ENT-' || "id" WHERE "entityId" IS NULL;
ALTER TABLE "entities" ALTER COLUMN "entityId" SET NOT NULL;

-- CreateTable
CREATE TABLE "respuestas_encuestas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "encuestaId" TEXT NOT NULL,
    "preguntaId" TEXT,
    "respuesta" TEXT NOT NULL,
    "tipoRespuesta" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "respuestas_encuestas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entities_entityId_key" ON "entities"("entityId");

-- AddForeignKey
ALTER TABLE "respuestas_encuestas" ADD CONSTRAINT "respuestas_encuestas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_encuestas" ADD CONSTRAINT "respuestas_encuestas_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "encuestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;