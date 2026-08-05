ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_availability_slot_id_unique";--> statement-breakpoint
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_availability_slot_id_key";
