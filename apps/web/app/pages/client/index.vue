<script setup lang="ts">
import type {
	BookingDetail,
	ExpertSummary,
} from "@repo/contracts/consultations";
import { Calendar, Clock, Users } from "lucide-vue-next";

definePageMeta({
	layout: "client",
	clientSearchPlaceholder: "Search dashboard...",
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["client"],
});

useSeoMeta({
	title: "Client Dashboard | Laxiriir Expert",
});

const auth = useAuthStore();
const consultationApi = useConsultationApi();
const bookings = ref<BookingDetail[]>([]);
const experts = ref<ExpertSummary[]>([]);
const loading = ref(true);
const errorMessage = ref("");

const upcomingBookings = computed(() =>
	bookings.value.filter((booking) => new Date(booking.startsAt) > new Date()),
);
const nextBookings = computed(() => upcomingBookings.value.slice(0, 3));
const stats = computed(() => [
	{ label: "Total sessions", value: bookings.value.length, icon: Calendar },
	{ label: "Upcoming", value: upcomingBookings.value.length, icon: Clock },
	{ label: "Available experts", value: experts.value.length, icon: Users },
]);

onMounted(async () => {
	await auth.ensureLoaded();

	try {
		const [bookingResponse, expertResponse] = await Promise.all([
			consultationApi.listBookings(),
			consultationApi.listExperts(),
		]);
		bookings.value = bookingResponse.bookings;
		experts.value = expertResponse.experts;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load your dashboard.";
	} finally {
		loading.value = false;
	}
});

function formatDate(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
	}).format(new Date(value));
}

function formatTime(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		hour: "numeric",
		minute: "2-digit",
	}).format(new Date(value));
}
</script>

<template>
	<div class="space-y-6 p-4 sm:p-6 lg:p-8">
		<div>
			<span class="home-kicker text-primary">Client dashboard</span>
			<h1 class="mt-1 font-display text-3xl font-bold tracking-tight">
				Welcome back, {{ auth.user?.displayName || "Client" }}
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Review your sessions and book time with an expert from one workspace.
			</p>
		</div>

		<p
			v-if="errorMessage"
			class="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
		>
			{{ errorMessage }}
		</p>

		<div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
			<div
				v-for="stat in stats"
				:key="stat.label"
				class="relative overflow-hidden rounded-xl border border-border bg-card p-6"
			>
				<component
					:is="stat.icon"
					class="absolute -bottom-3 -right-3 size-24 text-primary opacity-5"
				/>
				<p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
					{{ stat.label }}
				</p>
				<p class="mt-3 font-display text-3xl font-bold">{{ stat.value }}</p>
			</div>
		</div>

		<section class="rounded-xl border border-border bg-card p-5 sm:p-6">
			<div class="mb-5 flex items-center justify-between gap-4">
				<div>
					<h2 class="font-display text-lg font-semibold">Upcoming sessions</h2>
					<p class="text-sm text-muted-foreground">
						Your confirmed consultation schedule.
					</p>
				</div>
				<NuxtLink
					to="/client/sessions"
					class="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
				>
					View all
				</NuxtLink>
			</div>

			<div v-if="loading" class="py-10 text-center text-sm text-muted-foreground">
				Loading your schedule...
			</div>
			<div
				v-else-if="nextBookings.length === 0"
				class="rounded-xl bg-secondary p-8 text-center"
			>
				<p class="font-medium">No upcoming sessions yet.</p>
				<p class="mt-1 text-sm text-muted-foreground">
					Choose an available expert to create your first booking.
				</p>
				<NuxtLink
					to="/client/experts"
					class="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
				>
					Browse experts
				</NuxtLink>
			</div>
			<div v-else class="space-y-3">
				<article
					v-for="booking in nextBookings"
					:key="booking.id"
					class="flex flex-col justify-between gap-4 rounded-xl bg-secondary p-4 sm:flex-row sm:items-center"
				>
					<div class="flex items-center gap-4">
						<img
							:src="booking.expert.avatarUrl"
							:alt="booking.expert.displayName"
							class="size-12 rounded-xl object-cover ring-1 ring-border"
						/>
						<div>
							<h3 class="text-sm font-semibold">{{ booking.expert.displayName }}</h3>
							<p class="text-xs text-muted-foreground">{{ booking.expert.title }}</p>
						</div>
					</div>
					<div class="text-sm sm:text-right">
						<p class="font-medium">{{ formatDate(booking.startsAt) }}</p>
						<p class="text-xs text-muted-foreground">
							{{ formatTime(booking.startsAt) }}
						</p>
					</div>
				</article>
			</div>
		</section>
	</div>
</template>
