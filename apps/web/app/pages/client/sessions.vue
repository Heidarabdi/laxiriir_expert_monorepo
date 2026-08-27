<script setup lang="ts">
import type {
	AvailabilitySlot,
	BookingDetail,
} from "@repo/contracts/consultations";
import { Calendar, Clock, RefreshCw, X } from "lucide-vue-next";

definePageMeta({
	layout: "client",
	clientSearchPlaceholder: "Search sessions...",
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["client"],
});

useSeoMeta({
	title: "My Sessions | Laxiriir Expert",
});

const consultationApi = useConsultationApi();
const bookings = ref<BookingDetail[]>([]);
const loading = ref(true);
const errorMessage = ref("");
const activeFilter = ref<"all" | "upcoming" | "past">("all");
const actionBookingId = ref<string | null>(null);
const reschedulingBookingId = ref<string | null>(null);
const replacementSlots = ref<AvailabilitySlot[]>([]);
const loadingReplacementSlots = ref(false);

const filteredBookings = computed(() => {
	const now = new Date();
	if (activeFilter.value === "upcoming") {
		return bookings.value.filter(
			(booking) =>
				booking.status === "confirmed" && new Date(booking.startsAt) > now,
		);
	}
	if (activeFilter.value === "past") {
		return bookings.value.filter(
			(booking) =>
				booking.status === "cancelled" || new Date(booking.endsAt) <= now,
		);
	}
	return bookings.value;
});

onMounted(async () => {
	try {
		const response = await consultationApi.listBookings();
		bookings.value = response.bookings;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load your sessions.";
	} finally {
		loading.value = false;
	}
});

function formatDate(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "full",
	}).format(new Date(value));
}

function formatTimeRange(start: string, end: string) {
	const formatter = new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
	});
	return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
}

function canChangeBooking(booking: BookingDetail) {
	return (
		booking.status === "confirmed" &&
		new Date(booking.startsAt).getTime() - Date.now() >= 24 * 60 * 60 * 1000
	);
}

function replaceBooking(updated: BookingDetail) {
	bookings.value = bookings.value.map((booking) =>
		booking.id === updated.id ? updated : booking,
	);
}

async function cancelBooking(booking: BookingDetail) {
	if (
		!window.confirm(
			"Cancel this session? The time will become available again.",
		)
	) {
		return;
	}
	actionBookingId.value = booking.id;
	errorMessage.value = "";
	try {
		const response = await consultationApi.cancelBooking(booking.id);
		replaceBooking(response.booking);
		if (reschedulingBookingId.value === booking.id) {
			reschedulingBookingId.value = null;
			replacementSlots.value = [];
		}
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to cancel this session.";
	} finally {
		actionBookingId.value = null;
	}
}

async function openReschedule(booking: BookingDetail) {
	if (reschedulingBookingId.value === booking.id) {
		reschedulingBookingId.value = null;
		replacementSlots.value = [];
		return;
	}
	reschedulingBookingId.value = booking.id;
	const requestBookingId = booking.id;
	replacementSlots.value = [];
	loadingReplacementSlots.value = true;
	errorMessage.value = "";
	try {
		const response = await consultationApi.listAvailability(booking.expert.id);
		if (reschedulingBookingId.value === requestBookingId) {
			replacementSlots.value = response.slots.filter(
				(slot) =>
					new Date(slot.startsAt).getTime() - Date.now() >= 24 * 60 * 60 * 1000,
			);
		}
	} catch (error) {
		if (reschedulingBookingId.value === requestBookingId) {
			errorMessage.value =
				error instanceof Error
					? error.message
					: "Unable to load replacement times.";
		}
	} finally {
		if (reschedulingBookingId.value === requestBookingId) {
			loadingReplacementSlots.value = false;
		}
	}
}

async function rescheduleBooking(
	booking: BookingDetail,
	slot: AvailabilitySlot,
) {
	actionBookingId.value = booking.id;
	errorMessage.value = "";
	try {
		const response = await consultationApi.rescheduleBooking(booking.id, {
			availabilitySlotId: slot.id,
		});
		replaceBooking(response.booking);
		reschedulingBookingId.value = null;
		replacementSlots.value = [];
	} catch (error) {
		errorMessage.value =
			error instanceof Error
				? error.message
				: "Unable to reschedule this session.";
	} finally {
		actionBookingId.value = null;
	}
}
</script>

<template>
	<div class="space-y-6 p-4 sm:p-6 lg:p-8">
		<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
			<div>
				<span class="home-kicker text-primary">Consultations</span>
				<h1 class="mt-1 font-display text-3xl font-bold tracking-tight">
					My sessions
				</h1>
				<p class="mt-1 text-sm text-muted-foreground">
					Review, reschedule, or cancel your saved sessions.
				</p>
			</div>
			<NuxtLink
				to="/client/experts"
				class="inline-flex justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
			>
				Book a session
			</NuxtLink>
		</div>

		<p
			v-if="errorMessage"
			class="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
		>
			{{ errorMessage }}
		</p>

		<div class="flex gap-2">
			<button
				v-for="filter in ['all', 'upcoming', 'past'] as const"
				:key="filter"
				type="button"
				class="rounded-full px-4 py-2 text-xs font-semibold capitalize transition"
				:class="
					activeFilter === filter
						? 'bg-primary text-primary-foreground'
						: 'bg-secondary text-muted-foreground hover:text-foreground'
				"
				@click="activeFilter = filter"
			>
				{{ filter }}
			</button>
		</div>

		<div v-if="loading" class="py-16 text-center text-sm text-muted-foreground">
			Loading sessions...
		</div>
		<div
			v-else-if="filteredBookings.length === 0"
			class="rounded-xl border border-dashed border-border bg-card p-12 text-center"
		>
			<Calendar class="mx-auto size-8 text-primary" />
			<h2 class="mt-4 font-display text-lg font-semibold">No sessions found</h2>
			<p class="mt-1 text-sm text-muted-foreground">
				Book an available expert and the session will appear here.
			</p>
		</div>
		<div v-else class="space-y-4">
			<article
				v-for="booking in filteredBookings"
				:key="booking.id"
				class="flex flex-col justify-between gap-5 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
			>
				<div class="flex items-center gap-4">
					<img
						:src="booking.expert.avatarUrl"
						:alt="booking.expert.displayName"
						class="size-14 rounded-xl object-cover ring-1 ring-border"
					/>
					<div>
						<h2 class="font-display text-lg font-semibold">
							{{ booking.expert.displayName }}
						</h2>
						<p class="text-sm text-primary">{{ booking.expert.title }}</p>
						<p class="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
							{{ booking.status }}
						</p>
					</div>
				</div>

				<div class="space-y-3 text-sm sm:min-w-72 sm:text-right">
					<p class="flex items-center gap-2 font-medium sm:justify-end">
						<Calendar class="size-4 text-primary" />
						{{ formatDate(booking.startsAt) }}
					</p>
					<p class="flex items-center gap-2 text-muted-foreground sm:justify-end">
						<Clock class="size-4" />
						{{ formatTimeRange(booking.startsAt, booking.endsAt) }}
					</p>

					<div
						v-if="canChangeBooking(booking)"
						class="flex flex-wrap gap-2 sm:justify-end"
					>
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:border-primary hover:text-primary disabled:opacity-50"
							:disabled="actionBookingId === booking.id"
							@click="openReschedule(booking)"
						>
							<RefreshCw class="size-3.5" />
							{{ reschedulingBookingId === booking.id ? "Close times" : "Reschedule" }}
						</button>
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
							:disabled="actionBookingId === booking.id"
							@click="cancelBooking(booking)"
						>
							<X class="size-3.5" />
							{{ actionBookingId === booking.id ? "Updating..." : "Cancel" }}
						</button>
					</div>

					<div
						v-if="reschedulingBookingId === booking.id"
						class="rounded-lg border border-border bg-secondary/50 p-3 text-left"
					>
						<p class="text-xs font-semibold">Choose a new time</p>
						<p v-if="loadingReplacementSlots" class="mt-2 text-xs text-muted-foreground">
							Loading open times...
						</p>
						<p v-else-if="replacementSlots.length === 0" class="mt-2 text-xs text-muted-foreground">
							No replacement times are available at least 24 hours ahead.
						</p>
						<div v-else class="mt-2 grid gap-2">
							<button
								v-for="slot in replacementSlots"
								:key="slot.id"
								type="button"
								class="rounded-md border border-border bg-background px-3 py-2 text-left text-xs transition hover:border-primary hover:text-primary disabled:opacity-50"
								:disabled="actionBookingId === booking.id"
								@click="rescheduleBooking(booking, slot)"
							>
								{{ formatDate(slot.startsAt) }} ·
								{{ formatTimeRange(slot.startsAt, slot.endsAt) }}
							</button>
						</div>
					</div>
				</div>
			</article>
		</div>
	</div>
</template>
