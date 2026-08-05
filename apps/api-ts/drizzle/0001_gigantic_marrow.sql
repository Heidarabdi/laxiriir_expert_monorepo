CREATE TABLE IF NOT EXISTS "availability_slots" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"expert_id" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"booked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"client_user_id" text NOT NULL,
	"expert_id" text NOT NULL,
	"availability_slot_id" integer NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_availability_slot_id_unique" UNIQUE("availability_slot_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experts" (
	"id" text PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"bio" text NOT NULL,
	"hourly_rate_cents" integer NOT NULL,
	"avatar_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "expert_status" text DEFAULT 'not_applicable' NOT NULL;--> statement-breakpoint
DO $migration$
BEGIN
	IF to_regclass('public.account_profiles') IS NULL THEN
		RETURN;
	END IF;

	IF EXISTS (
		SELECT 1
		FROM account_profiles
		WHERE primary_role NOT IN ('admin', 'client', 'expert')
			OR expert_status NOT IN ('approved', 'not_applicable', 'pending_review', 'rejected', 'suspended')
	) THEN
		RAISE EXCEPTION 'invalid legacy role or expert status';
	END IF;

	IF EXISTS (
		SELECT lower(email)
		FROM account_profiles
		GROUP BY lower(email)
		HAVING count(*) > 1
	) THEN
		RAISE EXCEPTION 'duplicate normalized legacy email';
	END IF;

	IF EXISTS (
		SELECT 1
		FROM account_profiles AS profile
		JOIN "user" AS auth_user ON auth_user.id = profile.auth_user_id
		WHERE lower(auth_user.email) <> lower(profile.email)
	) THEN
		RAISE EXCEPTION 'legacy identity conflicts with Better Auth user';
	END IF;

	INSERT INTO "user" (
		id,
		name,
		email,
		email_verified,
		created_at,
		updated_at,
		role,
		expert_status
	)
	SELECT
		profile.auth_user_id,
		profile.display_name,
		lower(profile.email),
		false,
		profile.created_at AT TIME ZONE 'UTC',
		profile.updated_at AT TIME ZONE 'UTC',
		profile.primary_role,
		profile.expert_status
	FROM account_profiles AS profile
	WHERE NOT EXISTS (
		SELECT 1
		FROM "user" AS auth_user
		WHERE lower(auth_user.email) = lower(profile.email)
	);

	UPDATE "user" AS auth_user
	SET
		name = profile.display_name,
		role = profile.primary_role,
		expert_status = profile.expert_status
	FROM account_profiles AS profile
	WHERE lower(auth_user.email) = lower(profile.email);

	UPDATE bookings AS booking
	SET client_user_id = auth_user.id
	FROM account_profiles AS profile
	JOIN "user" AS auth_user ON lower(auth_user.email) = lower(profile.email)
	WHERE booking.client_user_id = profile.auth_user_id
		AND booking.client_user_id <> auth_user.id;
END
$migration$;--> statement-breakpoint
ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slots_expert_id_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."experts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_expert_id_experts_id_fk" FOREIGN KEY ("expert_id") REFERENCES "public"."experts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_availability_slot_id_availability_slots_id_fk" FOREIGN KEY ("availability_slot_id") REFERENCES "public"."availability_slots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "availability_slots_expert_start_idx" ON "availability_slots" USING btree ("expert_id","starts_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "availability_slot_unique_time" ON "availability_slots" USING btree ("expert_id","starts_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bookings_client_start_idx" ON "bookings" USING btree ("client_user_id","starts_at");
