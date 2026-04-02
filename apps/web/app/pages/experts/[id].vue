<template>
  <div class="bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-32 pb-24 max-w-7xl mx-auto px-6 md:px-8 w-full">
      <ProfileHeader :expert="expertData" />

      <div
        v-if="bookingConfirmed && selectedDay && selectedOffer && selectedSlot"
        class="mb-12 rounded-3xl border border-primary/30 bg-primary/10 px-6 py-5"
      >
        <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Booking request captured</p>
        <h2 class="mt-3 font-display text-2xl font-bold text-foreground">
          {{ selectedOffer.label }} with {{ expertData.name }} is ready.
        </h2>
        <p class="mt-2 text-sm text-muted-foreground">
          {{ selectedDay.dateLabel }} at {{ selectedSlot.timeLabel }} · ${{ selectedOffer.price }} ·
          {{ selectedOffer.durationMinutes }} minutes
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div class="lg:col-span-8 space-y-12 lg:space-y-20">
          <ProfileAbout :expert="expertData" />
          <ProfileAvailability
            :availability-month="expertData.availabilityMonth"
            :booking-days="expertData.bookingDays"
            :selected-day-id="selectedDayId"
            :selected-slot-id="selectedSlotId"
            @update:selected-day-id="selectedDayId = $event"
            @update:selected-slot-id="selectedSlotId = $event"
          />
          <ProfileExperience :experience="expertData.experience" />
          <ProfileReviews :reviews="expertData.reviews" />
        </div>

        <ProfileSidebar
          :booking-confirmed="bookingConfirmed"
          :can-book="canBook"
          :expert="expertData"
          :selected-day="selectedDay"
          :selected-offer="selectedOffer"
          :selected-offer-id="selectedOfferId"
          :selected-slot="selectedSlot"
          :session-offers="expertData.sessionOffers"
          @confirm-booking="confirmBooking"
          @update:selected-offer-id="selectedOfferId = $event"
        />
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getExpertById } from '~/data/experts'
import ProfileAbout from '~/components/experts/ProfileAbout.vue'
import ProfileAvailability from '~/components/experts/ProfileAvailability.vue'
import ProfileExperience from '~/components/experts/ProfileExperience.vue'
import ProfileHeader from '~/components/experts/ProfileHeader.vue'
import ProfileReviews from '~/components/experts/ProfileReviews.vue'
import ProfileSidebar from '~/components/experts/ProfileSidebar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'
import NavBar from '~/components/landing/NavBar.vue'
import { useBookings } from '~/composables/useBookings'

definePageMeta({
  layout: false,
})

const route = useRoute()
const expertId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
const expertData = expertId ? getExpertById(expertId) : undefined
const { bookSession } = useBookings()

if (!expertData) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Expert not found',
  })
}

useHead({
  title: `${expertData.name} | Expert Profile`,
})

const selectedDayId = ref(
  expertData.bookingDays.find((day) => day.slots.some((slot) => slot.available))?.id ??
    expertData.bookingDays[0]?.id ??
    '',
)
const selectedSlotId = ref('')
const selectedOfferId = ref(expertData.sessionOffers[0]?.id ?? '')
const bookingConfirmed = ref(false)

const selectedDay = computed(
  () => expertData.bookingDays.find((day) => day.id === selectedDayId.value) ?? null,
)
const selectedSlot = computed(
  () => selectedDay.value?.slots.find((slot) => slot.id === selectedSlotId.value) ?? null,
)
const selectedOffer = computed(
  () => expertData.sessionOffers.find((offer) => offer.id === selectedOfferId.value) ?? null,
)
const canBook = computed(() => Boolean(selectedSlot.value && selectedOffer.value))

watch(
  selectedDay,
  (day) => {
    if (!day) {
      selectedSlotId.value = ''
      return
    }

    const currentSlotStillValid = day.slots.some(
      (slot) => slot.id === selectedSlotId.value && slot.available,
    )

    if (!currentSlotStillValid) {
      selectedSlotId.value = day.slots.find((slot) => slot.available)?.id ?? ''
    }
  },
  { immediate: true },
)

async function confirmBooking() {
  if (!canBook.value || !expertData || !selectedDay.value || !selectedSlot.value || !selectedOffer.value) {
    return
  }

  const booking = bookSession({
    day: selectedDay.value,
    expert: expertData,
    offer: selectedOffer.value,
    slot: selectedSlot.value,
  })

  bookingConfirmed.value = true
  await navigateTo("/client")
}
</script>
