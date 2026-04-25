-- CreateTable
CREATE TABLE "Diff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortId" TEXT NOT NULL,
    "label" TEXT,
    "leftContent" TEXT NOT NULL,
    "rightContent" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "commentsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "diffId" TEXT NOT NULL,
    "lineNumber" INTEGER,
    "side" TEXT,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Anonymous',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_diffId_fkey" FOREIGN KEY ("diffId") REFERENCES "Diff" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Diff_shortId_key" ON "Diff"("shortId");
