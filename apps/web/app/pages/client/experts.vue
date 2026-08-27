<script setup lang="ts">
import type {
	AvailabilitySlot,
	ExpertSummary,
} from "@repo/contracts/consultations";
import { CalendarDays, Star } from "lucide-vue-next";

definePageMeta({
	layout: "client",
	clientSearchPlaceholder: "Search experts...",
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["client"],
});

useSeoMeta({
	title: "Experts | Laxiriir Expert",
});

const consultationApi = useConsultationApi();
const experts = ref<ExpertSummary[]>([]);
const slots = ref<AvailabilitySlot[]>([]);
const activeFilter = ref("All");
const selectedExpert = ref<ExpertSummary | null>(null);
const loading = ref(true);
const loadingSlots = ref(false);
const bookingSlotID = ref<number | null>(null);
const errorMessage = ref("");

const filters = computed(() => [
	"All",
	...new Set(experts.value.map((expert) => expert.category)),
]);
const filteredExperts = computed(() => {
	if (activeFilter.value === "All") {
		return experts.value;
	}
	return experts.value.filter(
		(expert) => expert.category === activeFilter.value,
	);
});

onMounted(async () => {
	try {
		const response = await consultationApi.listExperts();
		experts.value = response.experts;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load experts.";
	} finally {
		loading.value = false;
	}
});

async function chooseExpert(expert: ExpertSummary) {
	selectedExpert.value = expert;
	slots.value = [];
	errorMessage.value = "";
	loadingSlots.value = true;

	try {
		const response = await consultationApi.listAvailability(expert.id);
		slots.value = response.slots;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load availability.";
	} finally {
		loadingSlots.value = false;
	}
}

async function bookSlot(slot: AvailabilitySlot) {
	bookingSlotID.value = slot.id;
	errorMessage.value = "";

	try {
		await consultationApi.createBooking({ availabilitySlotId: slot.id });
		await navigateTo("/client/sessions");
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to create the booking.";
		await chooseExpert(selectedExpert.value as ExpertSummary);
	} finally {
		bookingSlotID.value = null;
	}
}

function formatPrice(cents: number) {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(cents / 100);
}

function formatSlot(value: string) {
	return new Intl.DateTimeFormat(undefined, {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(value));
}
</script>

<template>
	<div class="space-y-6 p-4 sm:p-6 lg:p-8">
		<div>
			<span class="home-kicker text-primary">Expert directory</span>
			<h1 class="mt-1 font-display text-3xl font-bold tracking-tight">
				Find your next expert
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Review persisted expert profiles and reserve a real open time slot.
			</p>
		</div>

		<p
			v-if="errorMessage"
			class="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
		>
			{{ errorMessage }}
		</p>

		<div class="flex flex-wrap gap-2">
			<button
				v-for="filter in filters"
				:key="filter"
				type="button"
				class="rounded-full px-4 py-2 text-xs font-semibold transition"
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
			Loading experts...
		</div>
		<div v-else class="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
			<article
				v-for="expert in filteredExperts"
				:key="expert.id"
				class="flex flex-col rounded-xl border border-border bg-card p-6"
			>
				<div class="flex items-start gap-4">
					<img
						:src="expert.avatarUrl"
						:alt="expert.displayName"
						class="size-16 rounded-xl object-cover ring-1 ring-border"
					/>
					<div class="min-w-0">
						<h2 class="truncate font-display text-lg font-semibold">
							{{ expert.displayName }}
						</h2>
						<p class="text-sm text-primary">{{ expert.title }}</p>
						<div class="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
							<Star class="size-3 fill-primary text-primary" />
							<span>New verified expert</span>
						</div>
					</div>
				</div>

				<p class="my-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
					{{ expert.bio }}
				</p>

				<div class="mt-auto flex items-center justify-between border-t border-border pt-4">
					<div>
						<p class="text-lg font-bold text-primary">
							{{ formatPrice(expert.hourlyRateCents) }}
						</p>
						<p class="text-[10px] text-muted-foreground">per session</p>
					</div>
					<button
						type="button"
						class="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition hover:brightness-110"
						@click="chooseExpert(expert)"
					>
						View times
					</button>
				</div>
			</article>
		</div>

		<section
			v-if="selectedExpert"
			class="rounded-xl border border-primary/30 bg-card p-5 sm:p-6"
		>
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-primary">
						Available times
					</p>
					<h2 class="mt-1 font-display text-xl font-semibold">
						{{ selectedExpert.displayName }}
					</h2>
				</div>
				<CalendarDays class="size-6 text-primary" />
			</div>

			<p v-if="loadingSlots" class="mt-6 text-sm text-muted-foreground">
				Loading availability...
			</p>
			<p v-else-if="slots.length === 0" class="mt-6 text-sm text-muted-foreground">
				No open slots are currently available.
			</p>
			<div v-else class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				<button
					v-for="slot in slots"
					:key="slot.id"
					type="button"
					class="rounded-xl border border-border bg-secondary px-4 py-3 text-left text-sm transition hover:border-primary hover:bg-primary/5"
					:disabled="bookingSlotID !== null"
					@click="bookSlot(slot)"
				>
					<span class="block font-medium">{{ formatSlot(slot.startsAt) }}</span>
					<span class="mt-1 block text-xs text-muted-foreground">
						{{ bookingSlotID === slot.id ? "Booking..." : "Reserve this session" }}
					</span>
				</button>
			</div>
		</section>
	</div>
</template>
