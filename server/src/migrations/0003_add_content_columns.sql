-- Markdown content for resources imported from PDFs (client-side conversion —
-- the PDF itself is never uploaded or stored on the server).
ALTER TABLE "notes" ADD COLUMN IF NOT EXISTS "content" TEXT;
ALTER TABLE "question_banks" ADD COLUMN IF NOT EXISTS "content" TEXT;
