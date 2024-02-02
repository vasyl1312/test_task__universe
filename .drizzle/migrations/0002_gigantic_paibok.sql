CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" varchar(40) NOT NULL,
	"created_at" varchar
);

CREATE UNIQUE INDEX IF NOT EXISTS "emailIdx" ON "user" ("email");