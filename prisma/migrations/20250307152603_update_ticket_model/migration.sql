-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "cc" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "files" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "priority" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
