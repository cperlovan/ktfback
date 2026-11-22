-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "category" DROP DEFAULT;

-- CreateTable
CREATE TABLE "encuestas" (
    "id" TEXT NOT NULL,
    "nombreEntidad" TEXT NOT NULL,
    "tipoEntidad" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "encuestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preguntas" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "obligatoria" BOOLEAN NOT NULL DEFAULT true,
    "opciones" TEXT,
    "encuestaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "encuestas" ADD CONSTRAINT "encuestas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preguntas" ADD CONSTRAINT "preguntas_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "encuestas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
