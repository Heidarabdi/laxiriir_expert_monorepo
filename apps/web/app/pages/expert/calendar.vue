<script setup lang="ts">
import type { AvailabilitySlot } from "@repo/contracts/consultations";
import { CalendarDays, Clock3, Pencil, Plus, Trash2, X } from "lucide-vue-next";

definePageMeta({
	layout: false,
	middleware: [
		"auth-required",
		"verified-required",
		"role-required",
		"expert-approved-required",
	],
	roles: ["expert"],
});

useSeoMeta({
	title: "Availability | Laxiriir Expert",
});

const auth = useAuthStore();
const consultationApi = useConsultationApi();
const slots = ref<AvailabilitySlot[]>([]);
const startsAt = ref("");
const endsAt = ref("");
const editingSlotId = ref<number | null>(null);
const loading = ref(true);
const saving = ref(false);
const errorMessage = ref("");

function toLocalInput(value: Date | string) {
	const date = new Date(value);
	return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
		.toISOString()
		.slice(0, 16);
}

function resetForm() {
	const nextHour = new Date();
	nextHour.setMinutes(0, 0, 0);
	nextHour.setHours(nextHour.getHours() + 1);
	startsAt.value = toLocalInput(nextHour);
	endsAt.value = toLocalInput(new Date(nextHour.getTime() + 60 * 60 * 1000));
	editingSlotId.value = null;
}

async function loadSlots() {
	loading.value = true;
	errorMessage.value = "";
	try {
		slots.value = (await consultationApi.listOwnAvailability()).slots;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to load availability.";
	} finally {
		loading.value = false;
	}
}

async function saveSlot() {
	if (!startsAt.value || !endsAt.value) return;
	saving.value = true;
	errorMessage.value = "";
	const input = {
		endsAt: new Date(endsAt.value).toISOString(),
		startsAt: new Date(startsAt.value).toISOString(),
	};

	try {
		if (editingSlotId.value === null) {
			await consultationApi.createAvailability(input);
		} else {
			await consultationApi.updateAvailability(editingSlotId.value, input);
		}
		resetForm();
		await loadSlots();
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to save availability.";
	} finally {
		saving.value = false;
	}
}

function editSlot(slot: AvailabilitySlot) {
	editingSlotId.value = slot.id;
	startsAt.value = toLocalInput(slot.startsAt);
	endsAt.value = toLocalInput(slot.endsAt);
	window.scrollTo({ behavior: "smooth", top: 0 });
}

async function deleteSlot(slot: AvailabilitySlot) {
	if (slot.booked || !window.confirm("Delete this availability slot?")) return;
	errorMessage.value = "";
	try {
		await consultationApi.deleteAvailability(slot.id);
		if (editingSlotId.value === slot.id) resetForm();
		await loadSlots();
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to delete availability.";
	}
}

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

onMounted(async () => {
	await auth.ensureLoaded();
	resetForm();
	await loadSlots();
});
</script>

<template>
	<main class="min-h-screen bg-background text-foreground">
		<header class="border-b border-border bg-card">
			<div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
				<NuxtLink to="/expert" class="font-display text-lg font-bold">
					Laxiriir Expert
				</NuxtLink>
				<div class="text-right">
					<p class="text-sm font-semibold">{{ auth.user?.displayName }}</p>
					<p class="text-xs text-muted-foreground">Availability workspace</p>
				</div>
			</div>
		</header>

		<div class="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[360px_1fr]">
			<section class="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-6">
				<div class="flex items-center gap-3">
					<div class="rounded-xl bg-primary/10 p-2 text-primary">
						<Plus v-if="editingSlotId === null" class="size-5" />
						<Pencil v-else class="size-5" />
					</div>
					<div>
						<h1 class="font-display text-xl font-bold">
							{{ editingSlotId === null ? "Add availability" : "Edit availability" }}
						</h1>
						<p class="text-sm text-muted-foreground">Times use your local timezone.</p>
					</div>
				</div>

				<form class="mt-6 space-y-4" @submit.prevent="saveSlot">
					<label class="block space-y-2 text-sm font-medium">
						<span>Starts</span>
						<input
							v-model="startsAt"
							type="datetime-local"
							required
							class="w-full rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
					</label>
					<label class="block space-y-2 text-sm font-medium">
						<span>Ends</span>
						<input
							v-model="endsAt"
							type="datetime-local"
							required
							class="w-full rounded-xl border border-input bg-background px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
						/>
					</label>
					<div class="flex gap-2">
						<button
							type="submit"
							:disabled="saving"
							class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
						>
							{{ saving ? "Saving..." : editingSlotId === null ? "Add slot" : "Save changes" }}
						</button>
						<button
							v-if="editingSlotId !== null"
							type="button"
							class="rounded-xl border border-border p-2.5 text-muted-foreground hover:text-foreground"
							aria-label="Cancel editing"
							@click="resetForm"
						>
							<X class="size-5" />
						</button>
					</div>
				</form>
			</section>

			<section class="rounded-2xl border border-border bg-card p-6">
				<div class="flex items-center justify-between gap-4">
					<div>
						<h2 class="font-display text-xl font-bold">Your upcoming slots</h2>
						<p class="text-sm text-muted-foreground">Clients see every open slot listed here.</p>
					</div>
					<CalendarDays class="size-6 text-primary" />
				</div>

				<p
					v-if="errorMessage"
					class="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
				>
					{{ errorMessage }}
				</p>

				<div v-if="loading" class="py-12 text-center text-sm text-muted-foreground">
					Loading availability...
				</div>
				<div
					v-else-if="slots.length === 0"
					class="mt-6 rounded-2xl border border-dashed border-border bg-secondary/50 px-6 py-12 text-center"
				>
					<Clock3 class="mx-auto size-8 text-muted-foreground" />
					<p class="mt-3 font-semibold">No upcoming availability</p>
					<p class="mt-1 text-sm text-muted-foreground">Add your first slot to start accepting bookings.</p>
				</div>
				<div v-else class="mt-6 space-y-3">
					<article
						v-for="slot in slots"
						:key="slot.id"
						class="flex flex-col justify-between gap-4 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
					>
						<div>
							<div class="flex items-center gap-2">
								<p class="font-semibold">{{ formatDate(slot.startsAt) }}</p>
								<span
									v-if="slot.booked"
									class="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold uppercase text-primary"
								>
									Booked
								</span>
							</div>
							<p class="mt-1 text-sm text-muted-foreground">
								{{ formatTime(slot.startsAt) }}–{{ formatTime(slot.endsAt) }}
							</p>
						</div>
						<div class="flex gap-2">
							<button
								type="button"
								:disabled="slot.booked"
								class="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
								aria-label="Edit slot"
								@click="editSlot(slot)"
							>
								<Pencil class="size-4" />
							</button>
							<button
								type="button"
								:disabled="slot.booked"
								class="rounded-lg border border-destructive/30 p-2 text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
								aria-label="Delete slot"
								@click="deleteSlot(slot)"
							>
								<Trash2 class="size-4" />
							</button>
						</div>
					</article>
				</div>
			</section>
		</div>
	</main>
</template>
