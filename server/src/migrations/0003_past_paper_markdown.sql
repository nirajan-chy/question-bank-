-- Markdown-based past questions: content_type distinguishes PDF records
-- (default, unchanged) from Markdown records whose body lives on disk at
-- content_path (served statically, never stored in PostgreSQL).
ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "contentType" VARCHAR(16)
  NOT NULL DEFAULT 'pdf';
ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "contentPath" VARCHAR(512);

CREATE INDEX IF NOT EXISTS "ix_past_papers_content_type"
  ON "past_papers" ("contentType");
