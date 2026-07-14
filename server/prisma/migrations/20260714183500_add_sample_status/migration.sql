-- CreateEnum
CREATE TYPE "SampleStatus" AS ENUM ('NONE', 'PENDING', 'IN_PRODUCTION', 'DISPATCHED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "RetailOrder" ADD COLUMN "sampleStatus" "SampleStatus" NOT NULL DEFAULT 'NONE';
