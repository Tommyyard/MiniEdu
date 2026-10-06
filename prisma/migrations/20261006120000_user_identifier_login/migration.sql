BEGIN;

-- Keep legacy email values, but make email optional for new users.
ALTER TABLE "User" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "User" ADD COLUMN "identifier" TEXT;

-- Linked accounts inherit their existing school identifiers.
UPDATE "User" AS u
SET "identifier" = t."nip"
FROM "Teacher" AS t
WHERE u."role" = 'TEACHER' AND u."teacherId" = t."id";

UPDATE "User" AS u
SET "identifier" = s."nis"
FROM "Student" AS s
WHERE u."role" = 'STUDENT' AND u."studentId" = s."id";

-- A collision between existing NIP/NIS values fails this migration without deleting data.
-- Existing ADMIN accounts remain NULL until an operator chooses a username.
CREATE UNIQUE INDEX "User_identifier_key" ON "User"("identifier");

-- Enforce an identifier for new/updated accounts while legacy NULL rows await manual repair.
ALTER TABLE "User" ADD CONSTRAINT "User_identifier_present" CHECK ("identifier" IS NOT NULL AND BTRIM("identifier") <> '') NOT VALID;

COMMIT;
