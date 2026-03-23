<template>
	<div
		class="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground flex flex-col"
	>
		<main class="grow pt-12 pb-24 md:pt-16">
			<div class="mx-auto w-full max-w-7xl px-6 md:px-8">
				<section class="rounded-[2rem] border border-border/50 bg-card/65 px-6 py-8 backdrop-blur-xl md:px-8 md:py-10">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div class="max-w-3xl">
							<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
								Client workspace
							</p>
							<h1 class="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
								My bookings
							</h1>
							<p class="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
								Track upcoming sessions, revisit cancelled bookings, and jump back into
								the expert directory when you need another consultation.
							</p>
						</div>

						<div class="flex flex-wrap gap-3">
							<NuxtLink
								class="rounded-full border border-border/60 px-5 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-secondary"
								to="/experts"
							>
								Browse more experts
							</NuxtLink>
						</div>
					</div>

					<div class="mt-8 grid gap-4 md:grid-cols-3">
						<div class="rounded-2xl border border-border/50 bg-secondary/70 p-5">
							<p class="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
								Upcoming
							</p>
							<p class="mt-3 font-display text-3xl font-bold">{{ upcomingBookings.length }}</p>
							<p class="mt-2 text-sm text-muted-foreground">
								Confirmed sessions still ahead on the calendar.
							</p>
						</div>
						<div class="rounded-2xl border border-border/50 bg-secondary/70 p-5">
							<p class="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
								This week
							</p>
							<p class="mt-3 font-display text-3xl font-bold">{{ bookingsThisWeek }}</p>
							<p class="mt-2 text-sm text-muted-foreground">
								Sessions booked in the next seven days.
							</p>
						</div>
						<div class="rounded-2xl border border-border/50 bg-secondary/70 p-5">
							<p class="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
								Booked value
							</p>
							<p class="mt-3 font-display text-3xl font-bold">${{ upcomingValue }}</p>
							<p class="mt-2 text-sm text-muted-foreground">
								Projected spend across upcoming consultations.
							</p>
						</div>
					</div>
				</section>

				<section v-if="nextBooking" class="mt-8 rounded-[2rem] border border-primary/20 bg-primary/10 px-6 py-6 md:px-8">
					<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div>
							<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
								Next session
							</p>
							<h2 class="mt-4 font-display text-3xl font-bold">
								{{ nextBooking.offerLabel }} with {{ nextBooking.expertName }}
							</h2>
							<p class="mt-3 text-sm text-muted-foreground">
								{{ nextBooking.dateLabel }} at {{ nextBooking.timeLabel }} ·
								{{ nextBooking.durationMinutes }} minutes · ${{ nextBooking.price }}
							</p>
						</div>

						<div class="flex flex-wrap gap-3">
							<NuxtLink
								:to="{ path: `/experts/${nextBooking.expertId}`, hash: '#booking-panel' }"
								class="rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
							>
								Reschedule
							</NuxtLink>
							<button
								class="rounded-full border border-border/60 px-5 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-secondary"
								type="button"
								@click="cancelBooking(nextBooking.id)"
							>
								Cancel booking
							</button>
						</div>
					</div>
				</section>

				<section v-if="allBookings.length === 0" class="mt-8 rounded-[2rem] border border-dashed border-border/60 bg-card/50 px-6 py-14 text-center">
					<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground">
						No bookings yet
					</p>
					<h2 class="mt-4 font-display text-3xl font-bold">Start with the expert directory.</h2>
					<p class="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
						Your confirmed sessions will show up here once you select a slot and finish a booking.
					</p>
					<NuxtLink
						class="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110"
						to="/experts"
					>
						Explore experts
					</NuxtLink>
				</section>

				<section v-else class="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
					<div class="space-y-6">
						<div class="rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-xl md:p-8">
							<div class="flex items-center justify-between gap-4">
								<div>
									<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
										Upcoming schedule
									</p>
									<h2 class="mt-3 font-display text-3xl font-bold">
										Confirmed sessions
									</h2>
								</div>
								<p class="text-sm text-muted-foreground">{{ upcomingBookings.length }} active</p>
							</div>

							<div class="mt-6 space-y-4">
								<article
									v-for="booking in upcomingBookings"
									:id="`booking-${booking.id}`"
									:key="booking.id"
									class="rounded-[1.6rem] border border-border/50 bg-secondary/70 p-5"
								>
									<div class="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
										<div class="flex items-start gap-4">
											<img
												:alt="booking.expertName"
												:src="booking.expertImage"
												class="h-16 w-16 rounded-2xl object-cover"
											/>
											<div>
												<p class="font-display text-2xl font-bold">{{ booking.expertName }}</p>
												<p class="mt-1 text-sm text-muted-foreground">{{ booking.expertTitle }}</p>
												<div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
													<span class="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
														{{ booking.offerLabel }}
													</span>
													<span class="rounded-full border border-border/50 px-3 py-1 text-muted-foreground">
														{{ booking.durationMinutes }} min
													</span>
													<span class="rounded-full border border-border/50 px-3 py-1 text-muted-foreground">
														Booked {{ formatBookedAt(booking.bookedAt) }}
													</span>
												</div>
											</div>
										</div>

										<div class="rounded-2xl border border-border/50 bg-card/60 px-4 py-3 text-sm">
											<p class="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
												Session time
											</p>
											<p class="mt-2 font-semibold">{{ booking.dateLabel }}</p>
											<p class="mt-1 text-muted-foreground">{{ booking.timeLabel }}</p>
											<p class="mt-3 font-semibold text-primary">${{ booking.price }}</p>
										</div>
									</div>

									<div class="mt-5 flex flex-wrap gap-3">
										<NuxtLink
											:to="{ path: `/experts/${booking.expertId}`, hash: '#booking-panel' }"
											class="rounded-full border border-border/60 px-4 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-card"
										>
											Reschedule
										</NuxtLink>
										<button
											class="rounded-full border border-border/60 px-4 py-2 text-sm font-semibold transition hover:border-primary/40 hover:bg-card"
											type="button"
											@click="cancelBooking(booking.id)"
										>
											Cancel
										</button>
									</div>
								</article>
							</div>
						</div>
					</div>

					<div class="space-y-6">
						<div class="rounded-[2rem] border border-border/50 bg-card/60 p-6 backdrop-blur-xl md:p-8">
							<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
								Booking history
							</p>
							<h2 class="mt-3 font-display text-3xl font-bold">
								Cancelled and past
							</h2>

							<div class="mt-6 space-y-4">
								<div
									v-for="booking in historyBookings"
									:key="booking.id"
									class="rounded-[1.4rem] border border-border/50 bg-secondary/70 p-4"
								>
									<div class="flex items-start justify-between gap-4">
										<div>
											<p class="font-semibold">{{ booking.expertName }}</p>
											<p class="mt-1 text-sm text-muted-foreground">
												{{ booking.offerLabel }} · {{ booking.dateLabel }} · {{ booking.timeLabel }}
											</p>
										</div>
										<span
											:class="[
												'rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em]',
												booking.status === 'cancelled'
													? 'border border-border/50 bg-card text-muted-foreground'
													: 'border border-primary/20 bg-primary/10 text-primary',
											]"
										>
											{{ booking.status }}
										</span>
									</div>
									<NuxtLink
										:to="{ path: `/experts/${booking.expertId}`, hash: '#booking-panel' }"
										class="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
									>
										Book this expert again
									</NuxtLink>
								</div>

								<p v-if="historyBookings.length === 0" class="rounded-2xl border border-dashed border-border/60 px-5 py-6 text-sm text-muted-foreground">
									No past or cancelled sessions yet.
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>

		<FooterComponent />
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FooterComponent from "~/components/landing/FooterComponent.vue";
import { useBookings } from "~/composables/useBookings";

definePageMeta({
	layout: false,
});

useSeoMeta({
	description: "Track upcoming and past consultations, manage local booking state, and jump back into the expert directory.",
	title: "My Bookings | Laxiriir Expert",
});

const { bookings, cancelBooking } = useBookings();

const allBookings = computed(() =>
	[...(bookings.value ?? [])].sort(
		(a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
	),
);

const upcomingBookings = computed(() =>
	allBookings.value.filter(
		(booking) =>
			booking.status === "confirmed" &&
			new Date(booking.startsAt).getTime() >= Date.now(),
	),
);

const historyBookings = computed(() =>
	allBookings.value.filter(
		(booking) =>
			booking.status === "cancelled" ||
			new Date(booking.startsAt).getTime() < Date.now(),
	),
);

const nextBooking = computed(() => upcomingBookings.value[0] ?? null);

const bookingsThisWeek = computed(() => {
	const now = Date.now();
	const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;

	return upcomingBookings.value.filter((booking) => {
		const startsAt = new Date(booking.startsAt).getTime();
		return startsAt >= now && startsAt <= weekFromNow;
	}).length;
});

const upcomingValue = computed(() =>
	upcomingBookings.value.reduce((total, booking) => total + booking.price, 0),
);

function formatBookedAt(value: string) {
	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(new Date(value));
}
</script>
