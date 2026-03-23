<template>
  <aside id="booking-panel" class="lg:col-span-4 space-y-8">
    <!-- Quick Info Card -->
    <div class="bg-card/60 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-border/50 sticky top-32">
      <h3 class="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-8">Quick Intelligence</h3>
      <div class="space-y-10">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">payments</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Session Price</p>
            <p class="text-2xl font-bold font-display">${{ selectedOffer?.price ?? startingPrice }} <span class="text-sm font-normal text-muted-foreground">/ selected session</span></p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">language</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Languages</p>
            <p class="text-lg font-medium">{{ expert.languages.join(', ') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">bolt</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Response Time</p>
            <p class="text-lg font-medium">{{ expert.responseTime }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">verified_user</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Verification</p>
            <p class="text-lg font-medium text-foreground">Identity &amp; Credentials Verified</p>
          </div>
        </div>
      </div>

      <div class="mt-10">
        <p class="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-4">Session format</p>
        <div class="space-y-3">
          <button
            v-for="offer in sessionOffers"
            :key="offer.id"
            :class="[
              'w-full rounded-2xl border px-4 py-4 text-left transition-all',
              selectedOfferId === offer.id
                ? 'border-primary bg-primary/10'
                : 'border-border/50 bg-secondary/70 hover:border-primary/40',
            ]"
            type="button"
            @click="emit('update:selectedOfferId', offer.id)"
          >
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="font-bold text-foreground">{{ offer.label }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ offer.description }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-foreground">${{ offer.price }}</p>
                <p class="text-xs text-muted-foreground">{{ offer.durationMinutes }} min</p>
              </div>
            </div>
          </button>
        </div>
      </div>
      
      <div class="mt-10 rounded-2xl border border-border/50 bg-secondary/60 p-5">
        <p class="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Booking summary</p>
        <div class="mt-4 space-y-3 text-sm">
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted-foreground">Session</span>
            <span class="font-semibold text-foreground">{{ selectedOffer?.label ?? "Select a session" }}</span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted-foreground">Time</span>
            <span class="font-semibold text-foreground">
              {{ selectedDay && selectedSlot ? `${selectedDay.dateLabel} · ${selectedSlot.timeLabel}` : "Select a slot" }}
            </span>
          </div>
          <div class="flex items-center justify-between gap-4">
            <span class="text-muted-foreground">Total</span>
            <span class="font-semibold text-foreground">${{ selectedOffer?.price ?? startingPrice }}</span>
          </div>
        </div>
      </div>

      <div class="mt-8 space-y-4">
        <button
          :class="[
            'w-full rounded-xl py-4 font-extrabold transition-all',
            canBook
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10 hover:brightness-110'
              : 'bg-muted text-muted-foreground',
          ]"
          :disabled="!canBook"
          type="button"
          @click="emit('confirmBooking')"
        >
          {{ bookingConfirmed ? "Booking Confirmed" : "Confirm Booking" }}
        </button>
        <button class="w-full bg-transparent border border-border/80 text-foreground font-bold py-4 rounded-xl hover:bg-white/5 transition-all">Schedule Discovery Call</button>
      </div>
      <div class="mt-8 rounded-lg bg-secondary/70 p-4 text-center">
        <p class="text-[10px] text-muted-foreground uppercase tracking-widest">Next available slot</p>
        <p class="text-sm font-bold text-primary">{{ expert.nextSlot }}</p>
      </div>

      <div
        v-if="bookingConfirmed && selectedOffer && selectedSlot && selectedDay"
        class="mt-6 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-4"
      >
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Confirmed</p>
        <p class="mt-2 text-sm font-semibold text-foreground">
          {{ selectedOffer.label }} booked for {{ selectedDay.dateLabel }} at {{ selectedSlot.timeLabel }}.
        </p>
      </div>
    </div>
    
    <!-- Trusted Badge -->
    <div class="p-6 rounded-2xl bg-secondary border border-border/30 text-center">
      <span class="material-symbols-outlined text-chart-3 mb-3 text-4xl">shield_person</span>
      <p class="text-xs text-muted-foreground px-4">All sessions are end-to-end encrypted and HIPAA compliant.</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type {
  BookingDay,
  BookingSlot,
  ExpertProfile,
  SessionOffer,
} from '~/types/experts'
import { getStartingPrice } from '~/data/experts'

const emit = defineEmits<{
  (e: "confirmBooking"): void
  (e: "update:selectedOfferId", value: string): void
}>()

const props = defineProps<{
  bookingConfirmed: boolean
  canBook: boolean
  expert: ExpertProfile
  selectedDay: BookingDay | null
  selectedOffer: SessionOffer | null
  selectedOfferId: string
  selectedSlot: BookingSlot | null
  sessionOffers: SessionOffer[]
}>()

const startingPrice = getStartingPrice(props.expert)
</script>
