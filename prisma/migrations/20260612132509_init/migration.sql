-- CreateEnum
CREATE TYPE "ServedStyle" AS ENUM ('HOT', 'ICED', 'BOTH');

-- CreateEnum
CREATE TYPE "SelectionSource" AS ENUM ('SELF_SELECTED', 'BARISTA_RECOMMENDED', 'CAFE_FEATURED', 'TASTING_FLIGHT', 'SUBSCRIPTION_SET', 'FRIEND_RECOMMENDED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('NOT_PLANNED', 'STORY_ONLY', 'MAIN_POST_CANDIDATE', 'DRAFTING', 'SCHEDULED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "PhotoReadiness" AS ENUM ('NO_PHOTOS', 'CARD_ONLY', 'CUP_PHOTO_AVAILABLE', 'ROOM_PHOTO_AVAILABLE', 'FULL_CAROUSEL_READY');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('CURRENT_CUP', 'OLD_BEAN_CARD', 'MEMORY_TRIP', 'MENU_ENTRY', 'STORY_NOTE');

-- CreateEnum
CREATE TYPE "Confidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('BEAN_CARD', 'CUP', 'ROOM', 'POST_DRAFT', 'STORY_DRAFT', 'OTHER');

-- CreateEnum
CREATE TYPE "ThemeCategory" AS ENUM ('SENSORY', 'EXPERIENCE', 'PERSONAL_ARCHIVE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ThemeSource" AS ENUM ('MANUAL', 'AI');

-- CreateEnum
CREATE TYPE "DraftType" AS ENUM ('CAPTION', 'HAIKU', 'ROOM_NOTE', 'TEASER', 'STORYBOARD', 'WHAT_LINGERED');

-- CreateEnum
CREATE TYPE "DraftSource" AS ENUM ('MANUAL', 'AI');

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "entryNumber" INTEGER,
    "beanName" TEXT,
    "drinkLabel" TEXT,
    "title" TEXT,
    "cafeName" TEXT,
    "roasterName" TEXT,
    "dateTried" TIMESTAMP(3),
    "city" TEXT,
    "countryWhereDrank" TEXT,
    "originCountry" TEXT,
    "originRegion" TEXT,
    "producer" TEXT,
    "farm" TEXT,
    "varietal" TEXT,
    "process" TEXT,
    "tastingNotesRaw" TEXT,
    "servedStyle" "ServedStyle",
    "personalTastingNote" TEXT,
    "whatLingered" TEXT,
    "roomNote" TEXT,
    "selectionSource" "SelectionSource",
    "selectedBy" TEXT,
    "curationNote" TEXT,
    "memoryNote" TEXT,
    "memoryTrip" BOOLEAN NOT NULL DEFAULT false,
    "turningPoint" BOOLEAN NOT NULL DEFAULT false,
    "quietFavorite" BOOLEAN NOT NULL DEFAULT false,
    "wouldRevisit" BOOLEAN NOT NULL DEFAULT false,
    "postStatus" "PostStatus" NOT NULL DEFAULT 'NOT_PLANNED',
    "photoReadiness" "PhotoReadiness" NOT NULL DEFAULT 'NO_PHOTOS',
    "sourceType" "SourceType" NOT NULL DEFAULT 'CURRENT_CUP',
    "confidence" "Confidence" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "extractedText" TEXT,
    "aiDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ThemeCategory" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryTheme" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "themeId" TEXT NOT NULL,
    "source" "ThemeSource" NOT NULL DEFAULT 'MANUAL',
    "confidence" DOUBLE PRECISION,

    CONSTRAINT "EntryTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentDraft" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "type" "DraftType" NOT NULL,
    "content" TEXT NOT NULL,
    "modelSource" "DraftSource" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentDraft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entry_entryNumber_key" ON "Entry"("entryNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EntryTheme_entryId_themeId_key" ON "EntryTheme"("entryId", "themeId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryTheme" ADD CONSTRAINT "EntryTheme_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryTheme" ADD CONSTRAINT "EntryTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentDraft" ADD CONSTRAINT "ContentDraft_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
