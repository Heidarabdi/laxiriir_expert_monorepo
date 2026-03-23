<template>
  <section>
    <div class="flex justify-between items-end mb-8">
      <h2 class="text-xs uppercase tracking-[0.3em] text-primary font-bold">Session Availability</h2>
      <span class="text-muted-foreground text-sm">{{ availabilityMonth }}</span>
    </div>
    
    <div class="bg-card p-8 rounded-xl border border-border/50">
      <div class="grid gap-4 md:grid-cols-3">
        <button
          v-for="day in bookingDays"
          :key="day.id"
          :class="[
            'rounded-2xl border p-5 text-left transition-all',
            selectedDayId === day.id
              ? 'border-primary bg-primary/10'
              : 'border-border/60 bg-secondary hover:border-primary/40',
          ]"
          type="button"
          @click="emit('update:selectedDayId', day.id)"
        >
          <p class="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
            {{ day.dayLabel }}
          </p>
          <p class="mt-3 text-lg font-bold text-foreground">{{ day.dateLabel }}</p>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ day.slots.filter((slot) => slot.available).length }} open slots
          </p>
        </button>
      </div>
      
      <div class="mt-8">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground">
              Available slots
            </p>
            <p class="mt-2 text-lg font-bold text-foreground">
              {{ selectedDay?.dateLabel ?? "Select a day" }}
            </p>
          </div>
          <p class="text-sm text-muted-foreground">
            {{ availableSlots.length }} slot{{ availableSlots.length === 1 ? "" : "s" }}
          </p>
        </div>

        <div v-if="availableSlots.length > 0" class="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          <button
            v-for="slot in availableSlots"
            :key="slot.id"
            :class="[
              'shrink-0 rounded-full px-6 py-3 text-sm font-bold transition-all',
              selectedSlotId === slot.id
                ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgb(var(--primary-rgb)_/_0.18)]'
                : 'bg-secondary border border-border/60 hover:border-primary',
            ]"
            type="button"
            @click="emit('update:selectedSlotId', slot.id)"
          >
            {{ slot.timeLabel }}
          </button>
        </div>

        <p v-else class="mt-6 rounded-2xl border border-border/50 bg-secondary px-5 py-4 text-sm text-muted-foreground">
          No bookable slots are open for the selected day yet. Try another day.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BookingDay } from '~/types/experts'

const props = defineProps<{
  availabilityMonth: string
  bookingDays: BookingDay[]
  selectedDayId: string
  selectedSlotId: string
}>()

const emit = defineEmits<{
  (e: "update:selectedDayId", value: string): void
  (e: "update:selectedSlotId", value: string): void
}>()

const selectedDay = computed(
  () => props.bookingDays.find((day) => day.id === props.selectedDayId) ?? props.bookingDays[0],
)

const availableSlots = computed(
  () => selectedDay.value?.slots.filter((slot) => slot.available) ?? [],
)
</script>
