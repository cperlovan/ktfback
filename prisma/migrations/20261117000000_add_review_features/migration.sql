-- Add category, thumbsUp, thumbsDown, and isApproved fields to Review model

-- AddCategory
ALTER TABLE "reviews" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'SERVICE';

-- AddThumbsUp
ALTER TABLE "reviews" ADD COLUMN     "thumbsUp" INTEGER NOT NULL DEFAULT 0;

-- AddThumbsDown
ALTER TABLE "reviews" ADD COLUMN     "thumbsDown" INTEGER NOT NULL DEFAULT 0;

-- AddIsApproved
ALTER TABLE "reviews" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false;