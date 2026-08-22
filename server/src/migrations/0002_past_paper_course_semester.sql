-- Past papers gain explicit course/semester linkage so uploads can be filed
-- under "Bachelor > BSc.CSIT > Semester 3 > C Programming" style hierarchies.
ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "courseSlug" VARCHAR(255);
ALTER TABLE "past_papers" ADD COLUMN IF NOT EXISTS "semester" INTEGER;

CREATE INDEX IF NOT EXISTS "ix_past_papers_course_semester"
  ON "past_papers" ("courseSlug", "semester");
