DO $migration$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'availability_slot_time_order'
			AND conrelid = 'availability_slots'::regclass
	) THEN
		ALTER TABLE "availability_slots" ADD CONSTRAINT "availability_slot_time_order" CHECK ("availability_slots"."ends_at" > "availability_slots"."starts_at");
	END IF;
END
$migration$;--> statement-breakpoint
DO $migration$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'booking_time_order'
			AND conrelid = 'bookings'::regclass
	) THEN
		ALTER TABLE "bookings" ADD CONSTRAINT "booking_time_order" CHECK ("bookings"."ends_at" > "bookings"."starts_at");
	END IF;
END
$migration$;--> statement-breakpoint
DO $migration$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'experts_hourly_rate_cents_check'
			AND conrelid = 'experts'::regclass
	) THEN
		ALTER TABLE "experts" ADD CONSTRAINT "experts_hourly_rate_cents_check" CHECK ("experts"."hourly_rate_cents" >= 0);
	END IF;
END
$migration$;
