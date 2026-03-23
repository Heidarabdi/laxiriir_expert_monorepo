import type {
	BookingDay,
	BookingRecord,
	BookingSlot,
	ExpertProfile,
	SessionOffer,
} from "~/types/experts";

interface BookSessionInput {
	day: BookingDay;
	expert: ExpertProfile;
	offer: SessionOffer;
	slot: BookingSlot;
}

export function useBookings() {
	const bookings = useCookie<BookingRecord[]>("lx-bookings", {
		default: () => [],
		sameSite: "lax",
	});

	function bookSession({ day, expert, offer, slot }: BookSessionInput) {
		const current = bookings.value ?? [];
		const booking: BookingRecord = {
			bookedAt: new Date().toISOString(),
			dateLabel: day.dateLabel,
			dayLabel: day.dayLabel,
			durationMinutes: offer.durationMinutes,
			expertId: expert.id,
			expertImage: expert.image,
			expertName: expert.name,
			expertTitle: expert.title,
			id: crypto.randomUUID(),
			offerId: offer.id,
			offerLabel: offer.label,
			price: offer.price,
			slotId: slot.id,
			startsAt: slot.startsAt,
			status: "confirmed",
			timeLabel: slot.timeLabel,
		};

		const existingIndex = current.findIndex(
			(item) =>
				item.expertId === booking.expertId &&
				item.offerId === booking.offerId &&
				item.slotId === booking.slotId &&
				item.status === "confirmed",
		);

		if (existingIndex >= 0) {
			bookings.value = current.map((item, index) =>
				index === existingIndex ? booking : item,
			);
			return booking;
		}

		bookings.value = [booking, ...current];
		return booking;
	}

	function cancelBooking(bookingId: string) {
		bookings.value = (bookings.value ?? []).map((booking) =>
			booking.id === bookingId ? { ...booking, status: "cancelled" } : booking,
		);
	}

	return {
		bookSession,
		bookings,
		cancelBooking,
	};
}
