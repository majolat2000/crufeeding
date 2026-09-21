-- Crawford Feeding Schema for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/eutikaqjhskiugkjxpvb/sql/new

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('super_admin', 'bursar', 'hostel_admin', 'student', 'vendor');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "matricNo" TEXT,
    "fullname" TEXT,
    "role" "Role" NOT NULL DEFAULT 'student',
    "level" TEXT,
    "isVisitor" BOOLEAN NOT NULL DEFAULT false,
    "mealBreakfast" BOOLEAN NOT NULL DEFAULT false,
    "mealLunch" BOOLEAN NOT NULL DEFAULT false,
    "mealDinner" BOOLEAN NOT NULL DEFAULT false,
    "hostel" TEXT,
    "pin" TEXT,
    "biometricEnabled" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hostel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "occupants" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cap" DECIMAL(12,2) NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlobalConfig" (
    "id" TEXT NOT NULL,
    "breakfastRate" DECIMAL(12,2) NOT NULL DEFAULT 1500,
    "lunchRate" DECIMAL(12,2) NOT NULL DEFAULT 2000,
    "dinnerRate" DECIMAL(12,2) NOT NULL DEFAULT 1500,
    "allThreeRate" DECIMAL(12,2) NOT NULL DEFAULT 5000,
    "feedingAmount" DECIMAL(12,2),
    "session" TEXT DEFAULT '2025/2026',
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GlobalConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "vendorName" TEXT,
    "type" TEXT NOT NULL,
    "gross" DECIMAL(12,2) NOT NULL,
    "levy" DECIMAL(12,2) DEFAULT 0,
    "vendorPayout" DECIMAL(12,2) NOT NULL,
    "balanceAfter" DECIMAL(12,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "reference" TEXT,
    "hostel" TEXT,
    "level" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT,
    "hostel" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DECIMAL(12,2) NOT NULL,
    "category" TEXT NOT NULL,
    "pictureUrl" TEXT,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "qrCode" TEXT,
    "shortCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_matricNo_key" ON "User"("matricNo");
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");
CREATE UNIQUE INDEX "Restaurant_name_key" ON "Restaurant"("name");
CREATE UNIQUE INDEX "Hostel_name_key" ON "Hostel"("name");
CREATE UNIQUE INDEX "Level_name_key" ON "Level"("name");
CREATE INDEX "Transaction_studentId_idx" ON "Transaction"("studentId");
CREATE INDEX "Transaction_vendorId_idx" ON "Transaction"("vendorId");
CREATE INDEX "Transaction_createdAt_idx" ON "Transaction"("createdAt");
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");
CREATE INDEX "FoodItem_vendorId_idx" ON "FoodItem"("vendorId");
CREATE INDEX "OtpCode_email_purpose_idx" ON "OtpCode"("email", "purpose");
CREATE INDEX "PaymentOrder_studentId_idx" ON "PaymentOrder"("studentId");
CREATE INDEX "PaymentOrder_shortCode_idx" ON "PaymentOrder"("shortCode");
CREATE INDEX "PaymentOrder_status_idx" ON "PaymentOrder"("status");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
