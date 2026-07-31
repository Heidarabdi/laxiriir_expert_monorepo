<script setup lang="ts">
import type { BookingDetail } from "@repo/platform/consultations";
import { Calendar, Clock } from "lucide-vue-next";

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

const filteredBookings = computed(() => {
	const now = new Date();
	if (activeFilter.value === "upcoming") {
		return bookings.value.filter((booking) => new Date(booking.startsAt) > now);
	}
	if (activeFilter.value === "past") {
		return bookings.value.filter((booking) => new Date(booking.endsAt) <= now);
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
					Every confirmed booking saved to your account.
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

				<div class="space-y-1 text-sm sm:text-right">
					<p class="flex items-center gap-2 font-medium sm:justify-end">
						<Calendar class="size-4 text-primary" />
						{{ formatDate(booking.startsAt) }}
					</p>
					<p class="flex items-center gap-2 text-muted-foreground sm:justify-end">
						<Clock class="size-4" />
						{{ formatTimeRange(booking.startsAt, booking.endsAt) }}
					</p>
				</div>
			</article>
		</div>
	</div>
</template>
