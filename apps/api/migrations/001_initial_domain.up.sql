CREATE TABLE IF NOT EXISTS account_profiles (
    auth_user_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    primary_role TEXT NOT NULL,
    expert_status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experts (
    id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    bio TEXT NOT NULL,
    hourly_rate_cents INTEGER NOT NULL CHECK (hourly_rate_cents >= 0),
    avatar_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS availability_slots (
    id BIGSERIAL PRIMARY KEY,
    expert_id TEXT NOT NULL REFERENCES experts(id) ON DELETE CASCADE,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    booked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT availability_slot_time_order CHECK (ends_at > starts_at),
    CONSTRAINT availability_slot_unique_time UNIQUE (expert_id, starts_at)
);

CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    client_user_id TEXT NOT NULL,
    expert_id TEXT NOT NULL REFERENCES experts(id),
    availability_slot_id BIGINT NOT NULL UNIQUE REFERENCES availability_slots(id),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT booking_time_order CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS availability_slots_expert_start_idx
    ON availability_slots (expert_id, starts_at);

CREATE INDEX IF NOT EXISTS bookings_client_start_idx
    ON bookings (client_user_id, starts_at);
