/*
  Warnings:

  - You are about to drop the column `entityId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_entityId_fkey";

-- Delete existing review data (table has 1 row, will be recreated with locationId)
DELETE FROM "reviews";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "entityId",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;