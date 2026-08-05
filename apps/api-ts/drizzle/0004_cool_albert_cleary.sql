ALTER TABLE "experts" ADD COLUMN "active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
UPDATE "experts" AS expert
SET "active" = false
FROM "user" AS identity
WHERE identity."id" = expert."id"
	AND identity."expert_status" IN ('rejected', 'suspended');
