ALTER TABLE "experts" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "experts" ALTER COLUMN "updated_at" SET DEFAULT now();
